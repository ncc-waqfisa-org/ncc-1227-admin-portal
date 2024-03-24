const AWS = require('aws-sdk');
const csv = require('csv-parser');
const cognito = new AWS.CognitoIdentityServiceProvider();
const lambda = new AWS.Lambda();

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Application-cw7beg2perdtnl7onnneec4jfa-staging';


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const token = event.headers?.authorization?.slice(7);
    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized!' })
        };
    }

    const isAdmin = await checkIsAdmin(token);
    if (!isAdmin) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden. You are not an admin' })
        };
    }

    const csvData = event.body;
    if(!csvData){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required parameters, csv' })
        };
    }

    const batchValue = parseInt(event.queryStringParameters?.batch) || 2024;
    const dataStream = processCsv(csvData);
    await bulkUpdateApplications(tableName, batchValue, dataStream);

    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify('Hello from Lambda!'),
    };
};

async function bulkUpdateApplications(tableName, batchValue, dataStream){

    const updatePromises = dataStream.map(row => {
        const params = {
            TableName: tableName,
            Key: {
                id: row.id
            },
            UpdateExpression: 'SET #score = :gpa',
            ExpressionAttributeValues: {
                ':gpa': row.GPA
            },
            ExpressionAttributeNames: {
                '#score': 'score'
            }
        };
        return dynamoDB.update(params).promise();
    });
    return Promise.all(updatePromises);

}

function processCsv(csvData){
    const csvString = Buffer.from(csvData, 'base64').toString('utf-8');
    const dataStream = csvString
        .split('\n')
        .map(row => row.trim())
        .filter(row => row) // Remove empty rows
        .map(row => row.split(',')); // Assuming CSV data is comma-separated
    console.log(dataStream);
    return dataStream;

}

async function checkIsAdmin(token) {
    // get the username from the token using cognito
    try {
        const cognitoUser = await cognito.getUser({AccessToken: token}).promise();
        const username = cognitoUser.Username;

        const params = {
            TableName: 'Admin-cw7beg2perdtnl7onnneec4jfa-staging',
            Key: {
                cpr: username
            }
        };
        const {Item} = await dynamoDB.get(params).promise();
        return Item !== undefined;
    } catch (error) {
        console.error('Error checking if user is admin', error);
        return false;
    }
}

