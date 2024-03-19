/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const {now} = require("lodash");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableName = 'Application-cw7beg2perdtnl7onnneec4jfa-staging';
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    try {
        const batchValue = now().getFullYear();

        const scoreHistogram = await getScoreHistograms(tableName);
        const applicationsPerYearChart = await getApplicationsPerYearChart(tableName, batchValue);
        const statusPieChart = await getStatusPieChart(tableName, batchValue);
        const gpaHistogramChart = await getGpaHistogram(tableName, batchValue);
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            //  headers: {
            //      "Access-Control-Allow-Origin": "*",
            //      "Access-Control-Allow-Headers": "*"
            //  },
            body: JSON.stringify('Hello from Lambda!'),
        };
    } catch (error) {
        console.error('Error getting statistics', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error getting statistics' })
        };

    }
};


async function getScoreHistograms(tableName, batchValue) {

    let histogramJson = {};
    let lastEvaluatedKey = null;
    const scoreParams = {
        TableName: tableName,
        ProjectionExpression: 'score',
        FilterExpression: '#batch = :batchValue score BETWEEN :minScore AND :maxScore',
        ExpressionAttributeNames: {
            '#batch': 'batch'
        },
        ExpressionAttributeValues: {
            ':batchValue': batchValue,
            ':minScore': 70,
            ':maxScore': 100,
        }
    };
    do {
        if (lastEvaluatedKey) {
            scoreParams.ExclusiveStartKey = lastEvaluatedKey;
        }

        const scoreResult = await dynamoDB.scan(scoreParams).promise();

        scoreResult.Items.forEach(item => {
            const score = item.score;
            let bucket = Math.floor(score / 5) * 5;
            const key = `${bucket}-${bucket + 5}`;
            histogramJson[key] = (histogramJson[key] || 0) + 1;
        });

        lastEvaluatedKey = scoreResult.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return histogramJson;
}

async function getGpaHistogram(tableName, batchValue) {
    const params = {
        TableName: tableName,
        ProjectionExpression: 'gpa',
        FilterExpression: '#batch = :batchValue AND gpa BETWEEN :minGpa AND :maxGpa',
        ExpressionAttributeNames: {
            '#batch': 'batch'
        },
        ExpressionAttributeValues: {
            ':batchValue': batchValue,
            ':minGpa': 80,
            ':maxGpa': 100
        }
    };

    const result = await dynamoDB.scan(params).promise();
    // Implement histogram logic, the step size is 5
    const histogramJson = result.Items.reduce((acc, item) => {
        const gpa = item.gpa;
        let bucket = Math.floor(gpa / 5) * 5;

        if(bucket===100) {
            bucket = 95;
        }
        const key = `${bucket}-${bucket + 5}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return histogramJson;
}

async function getApplicationsPerYearChart(batchValue, tableName) {
    const applicationsPerYearParams = {
        TableName: tableName,
        ProjectionExpression: '#batch',
        ExpressionAttributeNames: {
            '#batch': 'batch'
        }
    };

    const applicationsPerYearResult = await dynamoDB.scan(applicationsPerYearParams).promise();
    return applicationsPerYearResult.Items.reduce((acc, item) => {
        const batch = item.batch;
        acc[batch] = (acc[batch] || 0) + 1;
        return acc;
    }, {});
}

async function getStatusPieChart(tableName, batchValue) {
    const statusParams = {
        TableName: tableName,
        ProjectionExpression: '#status',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#batch': 'batch'
        },
        FilterExpression: '#batch = :batchValue',
        ExpressionAttributeValues: {
            ':batchValue': batchValue
        },
    };

    const statusResult = await dynamoDB.scan(statusParams).promise();
    return statusResult.Items.reduce((acc, item) => {
        const status = item.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
}
