const AWS = require('aws-sdk');
const csv = require('csv-parser');
const cognito = new AWS.CognitoIdentityServiceProvider();
const lambda = new AWS.Lambda();

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Application-cw7beg2perdtnl7onnneec4jfa-staging';


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const token = event.headers?.authorization?.slice(7);
    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized!' })
        };
    }

    const isAdmin = await checkIsAdmin(token);
    if (!isAdmin) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden. You are not an admin' })
        };
    }

    const csvData = JSON.parse(event.body).csv;
    if(!csvData){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required parameters, csv' })
        };
    }

    const batchValue = parseInt(event.queryStringParameters?.batch) || 2024;
    const dataStream = processCsv(csvData);
    try {
        await bulkUpdateApplications(tableName, batchValue, dataStream);
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            //  headers: {
            //      "Access-Control-Allow-Origin": "*",
            //      "Access-Control-Allow-Headers": "*"
            //  },
            body: JSON.stringify({ message: 'Applications updated' })
        };
    } catch (error) {
        console.error('Error updating applications', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error updating applications' })
        };
    }


};

async function bulkUpdateApplications(tableName, batchValue, dataStream){

    const updatePromises = dataStream.map(async row => {
        // const student = await getStudent(row.cpr);
        // const bahrainiTypos = ["بحريني", "بحرين", "البحرين", "بحراني", "بحرينيه", "بحرينية", "بحرانية","بجريني", "بحرنية", "بحرينة", "بحرني","بحرنية", "بحريني الجنسية", "bahrian", "بحريني الجنسيه", "BAH","Bahraiani", "bahraini", "BAHRAIN", "BAHRAINI", "bahrani", "Bahrani", "Bahrainy" ,"Bahrini","Bahrain", "bahrain", "Bahraini","بحرانيه"];
        // const otherNationalities = ["Egyptian" ,"سورية", "سعودية" ,"مصري", "باكستانية","Iraqi", "كويتية", "عراقية"];
        // if (!student) {
        //     return Promise.resolve();
        // }
        const score = calculateScore(row.familyIncome, row.GPA, row.adminPoints);
        console.log('Score:', score);
        console.log('Row:', row);


        const params = {
            TableName: tableName,
            Key: {
                id: row.id
            },
            UpdateExpression: 'set verifiedGpa = :gpa, score = :score',
            ExpressionAttributeValues: {
                ':gpa': Number(row.GPA),
                // ':studentName': row.name,
                ':score': score,
                // ':nationalityCategory': otherNationalities.includes(student.nationality) ? 'NON_BAHRAINI' : 'BAHRAINI',
                // ':familyIncome': student.familyIncome
            },
        };
        if (row.id && row.GPA) {
            return dynamoDB.update(params).promise();
        } else {
            return Promise.resolve();
        }
    });
    return Promise.all(updatePromises);

}

function processCsv(csvData){
    let csvString = Buffer.from(csvData, 'base64').toString('utf-8');
    const rows = csvString.split(/\r?\n/).slice(1);


    const dataStream = rows.map(row => {
        const columns = row.split(',');
        return {
            id: columns[0],
            // name: // remove the quotes around the name
            //     columns[2]?.replace(/^"(.*)"$/, '$1'),
            cpr: columns[1],
            familyIncome: columns[2],
            adminPoints: columns[3],
            GPA: columns[10]
        };
    }).filter(row => row.id && row.GPA && !isNaN(row.GPA));
    // console.log('Data Stream:', dataStream);

    return dataStream;


}

async function checkIsAdmin(token) {
    // get the username from the token using cognito
    try {
        const cognitoUser = await cognito.getUser({AccessToken: token}).promise();
        const username = cognitoUser.Username;

        const params = {
            TableName: 'Admin-cw7beg2perdtnl7onnneec4jfa-staging',
            Key: {
                cpr: username
            }
        };
        const {Item} = await dynamoDB.get(params).promise();
        return Item !== undefined;
    } catch (error) {
        console.error('Error checking if user is admin', error);
        return false;
    }
}

function calculateScore(familyIncome, gpa, adminPoints= 0) {
    let score = gpa * 0.7 + adminPoints;
    if(familyIncome === "LESS_THAN_1500") {
        score += 10;
    }
    // convert to 2 decimal places
    return Math.round(score * 100) / 100;
}

async function getStudent(cpr) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: cpr
        }
    };
    const {Item} = await dynamoDB.get(params).promise();
    return Item;
}
