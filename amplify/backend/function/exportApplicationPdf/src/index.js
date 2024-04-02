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
    const applicationId = event.queryStringParameters?.applicationId;
    if (!applicationId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing applicationId' })
        };
    }
    try {
        const application = await getApplication(applicationId);
        const program = await getProgram(application.programId);
        const university = await getUniversity(program.universityId);
        const parent = await getParentInfo(application.parentId);
        const pdfData = await generatePdf(application, program, university, parent);
        const pdfUrl = await uploadToS3(pdfData);
        return {
            statusCode: 200,
            body: JSON.stringify({ url: pdfUrl })
        };
    }
    catch (error) {
        console.error('Error exporting application', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error exporting application' })
        };
    }
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

async function generatePdf(application, program, university, parent) {
    // Generate PDF
    const doc = new pdfKit();
    const pdfBuffer = [];
    doc.on('data', chunk => {
        pdfBuffer.push(chunk);
    });
    doc.on('end', () => {
        return Buffer.concat(pdfBuffer);
    });
    doc.text(`Application Details`, { align: 'center', fontSize: 26 });
    doc.text(`Application ID: ${application.id}`);
    doc.text(`Student Details:`, { fontSize: 20 , fontWeight: 'bold'});
    doc.text(`Name: ${application.studentName}`);
    doc.text(`CPR: ${application.studentCPR}`);
    doc.text(`Nationality: ${application.nationalityCategory}`);
    doc.text(`GPA : ${application.gpa}`);
    doc.text(`Verified GPA: ${application.verifiedGPA}`);

    doc.text(`Parents Details:`, { fontSize: 20 , fontWeight: 'bold'});
    doc.text(`Father Name: ${parent.fatherFullName}`);
    doc.text(`Father CPR: ${parent.fatherCPR}`);

    doc.text(`Mother Name: ${parent.motherFullName}`);
    doc.text(`Mother CPR: ${parent.motherCPR}`);
    doc.text(`Family Income: ${application.familyIncome}`);


    doc.text(`Program Details:`, { fontSize: 20 , fontWeight: 'bold'});
    doc.text(`Name: ${program.name}`);
    doc.text(`University: ${university.name}`);

    return await uploadToS3(pdfBuffer);
}


async function uploadToS3(pdfData) {
    const params = {
        Bucket: 'exported-applications',
        Key: 'application.pdf',
        Body: pdfData,
        ContentType: 'application/pdf'
    };
    const result = await s3.upload(params).promise();
    return s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: params.Key});
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

async function getParentInfo(parentId) {
    const params = {
        TableName: 'ParentInfo-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            id: parentId
        }
    };
    const parent = await dynamoDB.get(params).promise();
    return parent.Item;
}

