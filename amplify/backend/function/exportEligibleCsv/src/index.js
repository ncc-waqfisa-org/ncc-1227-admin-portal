/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


exports.handler = async (event) => {
    const batchValue = parseInt(event.queryStringParameters?.batch) || new Date().getFullYear();
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        const applications = await getApplications('Application-cw7beg2perdtnl7onnneec4jfa-staging', batchValue);
        const csv = convertToCsv(applications);
        const url = await uploadToS3(csv);
        return {
            statusCode: 200,
            body: JSON.stringify({url})
        };
    }
    catch (error) {
        console.error('Error exporting applications', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error exporting applications' })
        };
    }
};

async function getApplications(tableName, batchValue) {
    const params = {
        TableName: tableName,
        IndexName: 'byNationalityCategory',
        KeyConditionExpression: '#batch = :batchValue AND nationalityCategory = :nationalityCategory',
        ExpressionAttributeNames: {
            '#batch': 'batch'
        },
        ExpressionAttributeValues: {
            ':batchValue': batchValue,
            ':nationalityCategory': 'BAHRAINI'
        },

    };

    let allApplications = [];

    do {
        const applications = await dynamoDB.query(params).promise();
        allApplications = allApplications.concat(applications.Items);

        // Check if there are more items to fetch
        params.ExclusiveStartKey = applications.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return allApplications;
}


function convertToCsv(applications, students) {
    let csv = 'StudentCPR,GPA,verifiedGPA\n';
    applications.forEach(application => {
        csv += `=""${application.studentCPR}"",${application.gpa},PLEASE VERIFY\n`;
    });
    return csv;
}

async function uploadToS3(csv) {
    const params = {
        Bucket: 'amplify-ncc-staging-65406-deployment',
        Key: 'applications.csv',
        Body: csv
    };
    await s3.upload(params).promise();
    // return the URL of the uploaded file
    return s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: params.Key});
}