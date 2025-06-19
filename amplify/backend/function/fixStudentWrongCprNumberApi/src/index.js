const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = "us-east-1_ovqLD9Axf";
const ADMIN_TABLE = "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";
const STUDENT_TABLE = "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";

const MESSAGES = {
    en: {
        missingToken: "Missing authorization token",
        forbidden: "Forbidden: User is not an admin",
        missingParams: "Missing required parameters",
        oldCprNotFound: "Student not found.",
        newCprExists: "CPR number already exists",
        success: "Student CPR correction is being processed in the background.",
        failedToStart: "Failed to start CPR correction task.",
    },
    ar: {
        missingToken: "رمز المصادقة مفقود",
        forbidden: "ممنوع: المستخدم ليس مسؤولاً",
        missingParams: "المعلمات المطلوبة مفقودة",
        oldCprNotFound: "لم يتم العثور على الطالب.",
        newCprExists: "رقم CPR موجود بالفعل",
        success: "يتم الآن معالجة تصحيح رقم CPR للطالب في الخلفية.",
        failedToStart: "فشل في بدء مهمة تصحيح CPR.",
    },
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const OLD_CPR_NUMBER = body.oldCprNumber;
    const NEW_CPR_NUMBER = body.newCprNumber;
    const locale = body.locale && body.locale === 'ar' ? 'ar' : 'en';
    const T = MESSAGES[locale]; // localized messages

    if (!event.headers || !event.headers.authorization) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: T.missingToken }),
        };
    }

    const token = event.headers.authorization.slice(7);
    const isAdmin = await checkIsAdmin(token);
    if (!isAdmin) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: T.forbidden }),
        };
    }

    if (!OLD_CPR_NUMBER || !NEW_CPR_NUMBER) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: T.missingParams }),
        };
    }

    const oldUserExists = await userExistsInCognito(OLD_CPR_NUMBER);
    if (!oldUserExists) {
        console.error(`No Cognito user found with OLD CPR: ${OLD_CPR_NUMBER}`);
        return {
            statusCode: 404,
            body: JSON.stringify({ message: T.oldCprNotFound }),
        };
    }

    const newUserExists = await userExistsInCognito(NEW_CPR_NUMBER);
    if (newUserExists) {
        console.error(`Cognito user with NEW CPR already exists: ${NEW_CPR_NUMBER}`);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: T.newCprExists }),
        };
    }

    const student = await getStudentWithOldCpr(OLD_CPR_NUMBER);
    if (!student) {
        console.error("Student not found.");
        return {
            statusCode: 404,
            body: JSON.stringify({ message: T.oldCprNotFound }),
        };
    }

    try {
        // Fire off the background Lambda
        await lambda.invoke({
            FunctionName: "fixStudentWrongCprNumber-masterdev",
            InvocationType: "Event", // async
            Payload: JSON.stringify({
                oldCprNumber: OLD_CPR_NUMBER,
                newCprNumber: NEW_CPR_NUMBER,
            }),
        }).promise();

        return {
            statusCode: 202,
            body: JSON.stringify({ message: T.success }),
        };
    } catch (err) {
        console.error("Error invoking worker Lambda:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: T.failedToStart }),
        };
    }
};

/**
 * Checks if the user represented by the provided token is an admin.
 * @param {string} token - The access token from the request header.
 * @returns {Promise<boolean>}
 */
async function checkIsAdmin(token) {
    try {
        const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
        const username = cognitoUser.Username;
        const params = {
            TableName: ADMIN_TABLE,
            Key: { cpr: username },
        };
        const { Item } = await dynamoDB.get(params).promise();
        return Boolean(Item);
    } catch (error) {
        console.error("Error checking admin:", error);
        return false;
    }
}

/**
 * Check if the user exists in Cognito by username/CPR number.
 * @param {string} username 
 * @returns {Promise<boolean>}
 */
async function userExistsInCognito(username) {
    console.log(`Checking if Cognito user exists for username/CPR: ${username}`);
    try {
        await cognito.adminGetUser({
            UserPoolId: USER_POOL_ID,
            Username: username,
        }).promise();
        return true;
    } catch (err) {
        if (err.code === "UserNotFoundException") {
            return false;
        }
        throw err; // unexpected error
    }
}

/**
 * Gets the student record from DynamoDB using the old CPR number.
 * @param {string} oldCpr 
 * @returns 
 */
async function getStudentWithOldCpr(oldCpr) {
    const result = await dynamoDB.get({
        TableName: STUDENT_TABLE,
        Key: { cpr: oldCpr },
    }).promise();
    return result.Item;
}