const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
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


async function getStudent(cpr) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: cpr
        }
    };

    const student = await dynamoDB.get(params).promise();
    const result = {
        email: student.Item.email,
        name: student.Item.name,
        language: student.Item.preferredLanguage
    }
    return result;
}

async function getAttachment(attachmentId) {
    const params = {
        TableName: 'Attachment-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            id: attachmentId
        }
    };

    const attachment = await dynamoDB.get(params).promise();
    return attachment.Item;
}

async function getProgramChoice(applicationId) {
    const indexName = 'applicationID-index';
    const params = {
        TableName: 'ProgramChoice-cw7beg2perdtnl7onnneec4jfa-staging',
        IndexName: indexName,
        KeyConditionExpression: 'applicationID = :applicationID',
        ExpressionAttributeValues: {
            ':applicationID': applicationId
        }
    };

    const programChoice = await dynamoDB.query(params).promise();
    return programChoice.Items[0];
}