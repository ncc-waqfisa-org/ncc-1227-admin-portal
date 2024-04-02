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
        const applicationId = await getApplication(student.studentCPR.S);
        console.log(applicationId);






    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error' + error),
        };
    }

};


async function updateApplication(applicationId, oldStudent, student) {
    // update studentName, nationalityCategory, familyIncome

const params = {
    TableName: 'Application-cw7beg2perdtnl7onnneec4jfa-staging',
    Key: {
        id: applicationId
    },
    UpdateExpression: '',
}

if (student.studentName.S !== oldStudent.studentName.S) {
    params.UpdateExpression += 'SET studentName = :studentName, ';
    params.ExpressionAttributeValues[':studentName'] = student.studentName;
}

if (student.nationalityCategory.S !== oldStudent.nationalityCategory.S) {
    params.UpdateExpression += 'SET nationalityCategory = :nationalityCategory, ';
    params.ExpressionAttributeValues[':nationalityCategory'] = student.nationalityCategory;
}

if (student.familyIncome.S !== oldStudent.familyIncome.S) {
    params.UpdateExpression += 'SET familyIncome = :familyIncome, ';
    params.ExpressionAttributeValues[':familyIncome'] = student.familyIncome;
}

if (params.UpdateExpression) {
    params.UpdateExpression = params.UpdateExpression.slice(0, -2);
    await dynamoDB.update(params).promise();
}


}

async function getApplication(studentCPR) {
    const params = {
        TableName: 'Application-cw7beg2perdtnl7onnneec4jfa-staging',
        IndexName: 'byStudentCPR',
        KeyConditionExpression: 'studentCPR = :studentCPR',
        ExpressionAttributeValues: {
            ':studentCPR': studentCPR
        }
    };
    const application = await dynamoDB.query(params).promise();
    return application.Items[0];
}