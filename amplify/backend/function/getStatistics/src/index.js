const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableName = 'Application-cw7beg2perdtnl7onnneec4jfa-staging';
const universityTableName = 'University-cw7beg2perdtnl7onnneec4jfa-staging';
const programChoiceTableName = 'ProgramChoice-cw7beg2perdtnl7onnneec4jfa-staging';

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const batchValue = parseInt(event.queryStringParameters?.batch) || 2024;

    try {
        const statistics = await getStatistics(batchValue);
        return {
            statusCode: 200,
            body: JSON.stringify({
                statistics
            })
        };
    } catch (error) {
        console.error('Error getting statistics', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error getting statistics' })
        };
    }
};

async function getStatistics(batchValue) {
    const params = {
        TableName: 'Statistics-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            id: batchValue
        }
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item;
}





