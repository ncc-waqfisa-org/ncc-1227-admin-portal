/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */


const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(event);

    let username = "";


    try {
        const requestBody = JSON.parse(event.body);
        const studentData = requestBody.student.input;
        const parentData = requestBody.parentInfo.input;
        username = studentData.cpr;
        const email = studentData.email;
        const password = requestBody.password;

        const userExists = await getUserFromDynamoDB(username);
        if (userExists) {
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
                "isBase64Encoded": false,
                "body": JSON.stringify(
                    {
                    "message": "User already exists",
                    },
                ),
            };
        }

        // Begin transaction
        await dynamoDB.transactWrite({
            TransactItems: [
                {
                    Put: {
                        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
                        Item: studentData,
                    },
                },
                {
                    Put: {
                        TableName: 'ParentInfo-cw7beg2perdtnl7onnneec4jfa-staging',
                        Item: parentData,
                    },
                },
            ],
        }).promise();

        // await saveStudentToDynamoDB(studentData);
        await signUpUserToCognito(username, email, password);
        // await saveParentToDynamoDB(parentData);
        return {
            "isBase64Encoded": false,
            "statusCode": 200,
            "body": JSON.stringify(
{
                    "message": "User created successfully",
                    },
            ),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
           "message": "User created successfully",



        };
    } catch (error) {
        console.error(error);
        // Rollback the transaction
        await rollback(username);
        return {
            "statusCode": 500,
            "body": JSON.stringify('Error' + error),
        };
    }
};

async function signUpUserToCognito(username, email, password) {
    console.log(username, email, password);
    const params = {
        ClientId: '41ci7tn8aleem14rrr5gs7tkbs',
        Username: username,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
        ],
    };
    await cognito.signUp(params).promise();
}


async function getUserFromDynamoDB(username) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: username,
        },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item !== undefined;
}

async function saveStudentToDynamoDB(StudentData) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Item: StudentData,
    };
    await dynamoDB.put(params).promise();
}

async function saveParentToDynamoDB(parentData) {
    const params = {
        TableName: 'ParentInfo-cw7beg2perdtnl7onnneec4jfa-staging',
        Item: parentData,
    };
    await dynamoDB.put(params).promise();
}

async function rollback(username) {
    // Perform rollback operations
    // Delete the user from DynamoDB
    await dynamoDB.delete({
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: username,
        },
    }).promise();

    // Delete the user from Cognito
    await cognito.adminDeleteUser({
        UserPoolId: 'us-east-1_ovqLD9Axf',
        Username: username,
    }).promise();
}




