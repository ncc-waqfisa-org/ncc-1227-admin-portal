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
    const batchValue = parseInt(event.queryStringParameters?.batch) || 2024;
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
    let csv = 'id,StudentCPR,Name,Gender,Nationality,Specialization,Phone,email,Batch,Status,GPA,Score,SchoolName,SchoolType\n';
    applications.forEach(application => {
        const student = students.find(student => student.cpr === application.studentCPR);
        if(student) {
            csv += `${application.id},${application.studentCPR},"${student?.fullName}",${student?.gender},${student?.nationalityCategory},"${student?.specialization}",${student?.phone},${student?.email},${application.batch},${application.status},${application.gpa},${application.score},"${application.schoolName}",${application.schoolType}\n`;
        }
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