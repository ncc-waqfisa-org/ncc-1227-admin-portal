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
    const exceptionUniversities = await getExceptionUniversities();
    const extendedUniversities = await getExtendedUniversities();
    const batchDetails = await getBatchDetails(batchValue);

    console.log('Universities:', exceptionUniversities);
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        const applications = await getApplications('Application-cw7beg2perdtnl7onnneec4jfa-staging', batchValue, exceptionUniversities, batchDetails);
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

async function getApplications(tableName, batchValue, exceptionUniversities, extendedUniversities, batchDetails) {
    // const programs = await getPrograms();
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

    // Remove the NOT_COMPLETED application unless the university is an exception]

    console.log('Universities:', exceptionUniversities);

    allApplications = allApplications.filter(application => {
        // Filter out rejected applications
        if (application.status === 'REJECTED') {
            return false;
        }
        // Filter out not completed applications unless they are from exception or extended universities
        if (application.status === 'NOT_COMPLETED') {
            // return exceptionUniversities.some(university => university.id === application.universityID)
            //     || extendedUniversities.some(university => university.id === application.universityID);
            if(exceptionUniversities.some(university => university.id === application.universityID)){
                return true;
            }
            if(extendedUniversities.some(university => university.id === application.universityID)){
               // check if today is before the extended deadline
                const today = new Date();
                const chosenUniversity = extendedUniversities.find(university => university.id === application.universityID);
                // TODO: deadline is in days, convert it to a date
                let deadline = new Date(batchDetails.updateApplicationEndDate);
                deadline.setDate(deadline.getDate() + chosenUniversity.extensionDuration);
                return today <= deadline;
            }

        }
        // Keep all other applications
        return true;
    });


    return allApplications;
}


function convertToCsv(applications) {
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

async function getExceptionUniversities() {

    const params = {
        TableName: 'University-cw7beg2perdtnl7onnneec4jfa-staging',
        IndexName: 'byException',
        KeyConditionExpression: '#isException = :exceptionValue',
        ExpressionAttributeNames: {
            '#isException': 'isException'
        },
        ExpressionAttributeValues: {
            ':exceptionValue': 1
        }
    };

    let allUniversities = [];

    do {
        const universities = await dynamoDB.query(params).promise();
        allUniversities = allUniversities.concat(universities.Items);
        params.ExclusiveStartKey = universities.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return allUniversities;
}

async function getExtendedUniversities() {

    const params = {
        TableName: 'University-cw7beg2perdtnl7onnneec4jfa-staging',
        IndexName: 'byExtended',
        KeyConditionExpression: '#isExtended = :extendedValue',
        ExpressionAttributeNames: {
            '#isExtended': 'isExtended'
        },
        ExpressionAttributeValues: {
            ':extendedValue': 1
        }
    };

    let allUniversities = [];


    do {
        const universities = await dynamoDB.query(params).promise();
        allUniversities = allUniversities.concat(universities.Items);
        params.ExclusiveStartKey = universities.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return allUniversities;
}

async function getBatchDetails(batch) {
    const params = {
        TableName: 'Batch-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            batch: batch
        }
    };

    const batchDetails = await dynamoDB.get(params).promise();
    return batchDetails.Item;
}

// async function getPrograms() {
//     const params = {
//         TableName: 'Program-cw7beg2perdtnl7onnneec4jfa-staging',
//     };
//
//     let allPrograms = [];
//
//     do {
//         const programs = await dynamoDB.scan(params).promise();
//         allPrograms = allPrograms.concat(programs.Items);
//         params.ExclusiveStartKey = programs.LastEvaluatedKey;
//     } while (params.ExclusiveStartKey);
//
//     return allPrograms;
// }
//

