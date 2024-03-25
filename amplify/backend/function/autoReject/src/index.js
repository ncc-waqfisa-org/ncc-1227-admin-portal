const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    try {
        // const requestBody = JSON.parse(event.body);
        const requestBody = event;
        console.log(requestBody);

        const application = requestBody.Records[0].dynamodb.NewImage;
        const oldApplication = requestBody.Records[0].dynamodb.OldImage;
        console.log(application);
        console.log(requestBody.Records[0].dynamodb);

        const applicationId = application.applicationId.S;
        const studentCPR = application.studentCPR.S;

        const reason = 'We are sorry to inform you that your application has been rejected';
        const studentName = 'Student';



        const studentEmail = await getStudentEmail(studentCPR);

        await updateApplicationStatus(applicationId, 'REJECTED');
        await sendEmail(studentEmail, studentName, reason);


        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            //  headers: {
            //      "Access-Control-Allow-Origin": "*",
            //      "Access-Control-Allow-Headers": "*"
            //  },
            body: JSON.stringify('Application rejected successfully'),
        };
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error' + error),
        };
    }
};


async function updateApplicationStatus(applicationId, status) {
    const params = {
        TableName: 'Applications-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            applicationId: applicationId
        },
        UpdateExpression: 'set status = :s',
        ExpressionAttributeValues: {
            ':s': status
        }
    };
    return dynamoDB.update(params).promise();
}

async function sendEmail(studentEmail, studentName, reason) {
    const params = {
        Destination: {
            ToAddresses: [
                studentEmail
            ]
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: `Dear ${studentName},\n\nWe regret to inform you that your application has been rejected due to the following reason: ${reason}\n\nSincerely,\n\nThe Admissions Team`
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Application Rejection"
            }
        },
        Source: "admissions@gmail.com"
    };
    return ses.sendEmail(params).promise();
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

async function getStudentEmail(studentId) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: studentId,
        },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item.email;
}

