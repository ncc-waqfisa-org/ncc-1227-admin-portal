const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = "us-east-1_ovqLD9Axf";
const STUDENT_TABLE = "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";
const BACHELOR_APPS_TABLE = "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";
const MASTER_APPS_TABLE = "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";
const BACHELOR_LOGS_TABLE = "StudentLog-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";
const MASTER_LOGS_TABLE = "MasterLog-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";
const BACHELOR_SCHOLARSHIPS_TABLE = "Scholarship-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";
const MASTER_SCHOLARSHIPS_TABLE = "MasterScholarship-q4lah3ddkjdd3dwtif26jdkx6e-masterdev";

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const OLD_CPR_NUMBER = event.oldCprNumber;
    const NEW_CPR_NUMBER = event.newCprNumber;

    if (!OLD_CPR_NUMBER || !NEW_CPR_NUMBER) {
        console.error("Missing required parameters.");
        return;
    }

    const student = await getStudentWithOldCpr(OLD_CPR_NUMBER);
    if (!student) {
        console.error(`Student not found for CPR ${OLD_CPR_NUMBER}`);
        return;
    }

    try {
        console.log(`Starting correction for CPR: ${OLD_CPR_NUMBER} → ${NEW_CPR_NUMBER}`);
        await createCognitoUserWithNewCpr(student, NEW_CPR_NUMBER);
        await deleteCognitoUser(OLD_CPR_NUMBER);
        await updateStudentCprNumber(student, NEW_CPR_NUMBER);
        await updateStudentBachelorApplicationsWithNewCpr(OLD_CPR_NUMBER, NEW_CPR_NUMBER);
        await updateStudentMasterApplicationsWithNewCpr(OLD_CPR_NUMBER, NEW_CPR_NUMBER);
        await updateBachelorStudentLogsWithNewCpr(OLD_CPR_NUMBER, NEW_CPR_NUMBER);
        await updateMasterStudentLogsWithNewCpr(OLD_CPR_NUMBER, NEW_CPR_NUMBER);
        await updateBachelorStudentScholarshipsWithNewCpr(OLD_CPR_NUMBER, NEW_CPR_NUMBER);
        await updateMasterStudentScholarshipsWithNewCpr(OLD_CPR_NUMBER, NEW_CPR_NUMBER);
        console.log("Correction completed.");
    } catch (err) {
        console.error("Error during CPR correction:", err);
    }
};

// --- Helper Functions ---

async function getStudentWithOldCpr(oldCpr) {
    const result = await dynamoDB.get({
        TableName: STUDENT_TABLE,
        Key: { cpr: oldCpr },
    }).promise();
    return result.Item;
}

async function createCognitoUserWithNewCpr(student, newCpr) {
    console.log(`Creating Cognito user with new CPR: ${newCpr}`);

    const params = {
        UserPoolId: USER_POOL_ID,
        Username: newCpr,
        UserAttributes: [
            { Name: "email", Value: student.email },
            { Name: "email_verified", Value: "true" },
        ],
    };
    return cognito.adminCreateUser(params).promise();
}

async function deleteCognitoUser(oldCpr) {
    console.log(`Deleting Cognito user with old CPR: ${oldCpr}`);
    return cognito.adminDeleteUser({
        UserPoolId: USER_POOL_ID,
        Username: oldCpr,
    }).promise();
}

async function updateStudentCprNumber(student, newCpr) {
    console.log(`Updating student CPR from ${student.cpr} to ${newCpr}`);
    await dynamoDB.delete({
        TableName: STUDENT_TABLE,
        Key: { cpr: student.cpr },
    }).promise();

    await dynamoDB.put({
        TableName: STUDENT_TABLE,
        Item: { ...student, cpr: newCpr },
    }).promise();
}

async function updateRecordsInTable(tableName, oldCpr, newCpr, cprField = "studentCPR") {
    console.log(`Updating records in table ${tableName} from CPR ${oldCpr} to ${newCpr}`);

    const data = await dynamoDB.scan({
        TableName: tableName,
        FilterExpression: `#cpr = :oldCpr`,
        ExpressionAttributeNames: { "#cpr": cprField },
        ExpressionAttributeValues: { ":oldCpr": oldCpr },
    }).promise();

    if (!data.Items || data.Items.length === 0) {
        console.log(`No items found in ${tableName} for CPR ${oldCpr}`);
        return;
    }

    const writeRequests = data.Items.map(item => ({
        PutRequest: {
            Item: {
                ...item,
                [cprField]: newCpr,
            },
        },
    }));

    const chunks = [];
    while (writeRequests.length) chunks.push(writeRequests.splice(0, 25));

    console.log(`Batch writing ${chunks.length} chunks to table ${tableName}`);
    for (const batch of chunks) {
        await dynamoDB.batchWrite({
            RequestItems: { [tableName]: batch },
        }).promise();
    }
}

// --- Table-Specific Wrappers ---

const updateStudentBachelorApplicationsWithNewCpr = (oldCpr, newCpr) =>
    updateRecordsInTable(BACHELOR_APPS_TABLE, oldCpr, newCpr, "studentCPR");

const updateStudentMasterApplicationsWithNewCpr = (oldCpr, newCpr) =>
    updateRecordsInTable(MASTER_APPS_TABLE, oldCpr, newCpr, "studentCPR");

const updateBachelorStudentLogsWithNewCpr = (oldCpr, newCpr) =>
    updateRecordsInTable(BACHELOR_LOGS_TABLE, oldCpr, newCpr, "studentCPR");

const updateMasterStudentLogsWithNewCpr = (oldCpr, newCpr) =>
    updateRecordsInTable(MASTER_LOGS_TABLE, oldCpr, newCpr, "studentCPR");

const updateBachelorStudentScholarshipsWithNewCpr = (oldCpr, newCpr) =>
    updateRecordsInTable(BACHELOR_SCHOLARSHIPS_TABLE, oldCpr, newCpr, "studentCPR");

const updateMasterStudentScholarshipsWithNewCpr = (oldCpr, newCpr) =>
    updateRecordsInTable(MASTER_SCHOLARSHIPS_TABLE, oldCpr, newCpr, "studentCPR");
