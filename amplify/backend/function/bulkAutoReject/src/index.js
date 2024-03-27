const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const  today = new Date();
    const batchValue = today.getFullYear();
    const batchDetails = await getBatchDetails(batchValue);
    if (!batchDetails) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Batch not found' })
        };
    }
    const applications = await getApplications(batchValue);



    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify({ message: 'Applications updated' })
    };
};


async function getApplications(batch) {
    const params = {
        TableName: 'Application-cw7beg2perdtnl7onnneec4jfa-staging',
        IndexName: 'byProcessed',
        KeyConditionExpression: '#batch = :batchValue AND processed = :processedValue',
        ScanIndexForward: false,
        ExpressionAttributeNames: {
            '#batch': 'batch' // Using ExpressionAttributeNames to alias the reserved keyword 'batch'
        },
        ExpressionAttributeValues: {
            ':batchValue': batch,
            ':processedValue': 0,
        }
    };

    let allApplications = [];

    do {
        const applications = await dynamoDB.query(params).promise();
        allApplications = allApplications.concat(applications.Items);
        params.ExclusiveStartKey = applications.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return allApplications;
}

async function bulkUpdateApplications(batchValue, applications){
    const updatePromises = applications.map(async application => {
        const student = await getStudent(application.studentCPR);
        const params = {
            TableName: 'Application-cw7beg2perdtnl7onnneec4jfa-staging',
            Key: {
                id: application.id
            },
            UpdateExpression: 'set processed = :processedValue',
            ExpressionAttributeValues: {
                ':processedValue': 1
            }
        };
        const isNonBahraini = student.nationalityCategory === 'NON_BAHRAINI';
        const isNotCompleted = application.status === 'NOT_COMPLETED';

        if (isNonBahraini || isNotCompleted) {
            params.UpdateExpression += ', status = :statusValue';
            params.ExpressionAttributeValues[':statusValue'] = 'REJECTED';
        }

        return dynamoDB.update(params).promise();
    });
    return Promise.all(updatePromises);
    }

async function getStudent(cpr) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: cpr
        }
    };

    const student = await dynamoDB.get(params).promise();
    return student.Item;
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


