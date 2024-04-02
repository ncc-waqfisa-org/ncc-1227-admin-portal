const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    try {
        // const requestBody = JSON.parse(event.body);
        const requestBody = event;
        console.log(requestBody);

        const student = requestBody.Records[0].dynamodb.NewImage;
        const oldStudent = requestBody.Records[0].dynamodb.OldImage;



    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error' + error),
        };
    }

};
