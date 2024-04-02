/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const pdfKit = require('pdfkit');


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
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

async function getApplication(applicationId) {
    const params = {
        TableName: 'Application-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            id: applicationId
        }
    };
    const application = await dynamoDB.get(params).promise();
    return application.Item;
}

async function generatePdf(application, program, university) {
    // Generate PDF
    const doc = new pdfKit();
    const pdfBuffer = [];
    doc.on('data', chunk => {
        pdfBuffer.push(chunk);
    });
    doc.on('end', () => {
        const pdfData = Buffer.concat(pdfBuffer);
        return pdfData;
    });
    doc.text(`Application ID: ${application.id}`);
    doc.text(`Student Details:`);
    doc.text(`Name: ${application.studentName}`);
    doc.text(`CPR: ${application.studentCPR}`);
    doc.text(`Nationality: ${application.nationalityCategory}`);
    doc.text(`GPA : ${application.gpa}`);
    doc.text(`Verified GPA: ${application.verifiedGPA}`);
    doc.text(`Family Income: ${application.familyIncome}`);


    doc.text(`Program Details:`);
    doc.text(`Name: ${program.name}`);
    doc.text(`University: ${university.name}`);






}


async function uploadToS3(pdfData) {
    const params = {
        Bucket: 'exported-applications',
        Key: 'application.pdf',
        Body: pdfData,
        ContentType: 'application/pdf'
    };
    const result = await s3.upload(params).promise();
    return result.Location;
}

async function getProgram(programId) {
    const params = {
        TableName: 'Program-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            id: programId
        }
    };
    const program = await dynamoDB.get(params).promise();
    return program.Item;
}

async function getUniversity(universityId) {
    const params = {
        TableName: 'University-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            id: universityId
        }
    };
    const university = await dynamoDB.get(params).promise();
    return university.Item;
}

