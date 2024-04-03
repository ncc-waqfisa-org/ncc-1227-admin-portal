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
        if (!application) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Application not found' })
            };
        }
        console.log('Application:', application);
        const program = application.programID ? await getProgram(application.programID) : null;
        console.log('Program:', program);
        const university = application.universityID ? await getUniversity(application.universityID) : null;
        console.log('University:', university);
        const student = await getStudent(application.studentCPR);

        const parent = await getParentInfo(student.parentInfoID);
        const pdfBuffer = await generatePdf(application, program, university, parent);
        const pdfUrl = await uploadToS3(pdfBuffer);
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
    const logoUrl = 'https://amplify-ncc-staging-65406-deployment.s3.amazonaws.com/waqfisa_logo.png';
    const imageBuffer = await fetchImage(logoUrl);

    // Generate PDF
    const doc = new pdfKit();
    // set the line height
    doc.lineGap(5);
    const pdfBuffer = [];
    doc.on('data', chunk => {
        pdfBuffer.push(chunk);
    });
    // Using a Promise to handle the asynchronous operation
    const pdfPromise = new Promise((resolve, reject) => {
        doc.on('end', () => {
            resolve(Buffer.concat(pdfBuffer));
        });
        doc.on('error', reject);
    });
    // Add logo, top center with margin top of 20

    doc.image(imageBuffer, 250, 0, { width: 170 }).moveDown(2);
    doc.font('Helvetica-Bold').fontSize(26).text('Application');
    doc.font('Helvetica').fontSize(14).text(`Application ID: ${application.id}`);
    doc.text("Status: " + application.status);
    // take a gap
    doc.text(' ');

    doc.font('Helvetica-Bold').fontSize(18).text('Student Details:');
    doc.font('Helvetica').fontSize(14).text(`Name: ${application.studentName}`, {rtl: true});
    doc.text(`CPR: ${application.studentCPR}`);
    doc.text(`Nationality: ${application.nationalityCategory}`);
    doc.text(`GPA : ${application.gpa}`);
    doc.text("Verified GPA:" + application.verifiedGPA ? application.verifiedGPA : "PLEASE VERIFY");
    doc.text(`School Name: ${application.schoolName}`);
    doc.text(`School Type: ${application.schoolType}`);
    // take a gap
    doc.text(' ');
    doc.font('Helvetica-Bold').fontSize(18).text('Parents Details:');
    doc.font('Helvetica').fontSize(14).text(`Father Name: ${parent.fatherFullName}`, {rtl: true});
    doc.text(`Father CPR: ${parent.fatherCPR}`);
    doc.text(`Mother Name: ${parent.motherFullName}`, {features: ['rtla']});
    doc.font('fonts/noto.tff').text(`Mother Name: ${parent.motherFullName}`, {features: ['rtla']});

    console.log('Mother Name:', parent.motherFullName);

    doc.text(`Mother CPR: ${parent.motherCPR}`);
    doc.text(`Family Income: ${application.familyIncome}`);
    // take a gap
    doc.text(' ');

    doc.font('Helvetica-Bold').fontSize(18).text('Program Details:');
    if(program) {
        doc.font('Helvetica').fontSize(14).text(`Name: ${program.name}`).fontSize(14);
        doc.fontSize(14).text(`University: ${university.name}`);
    }
    else {
        doc.font('Helvetica').fontSize(14).text('N/A');
    }
    doc.end();

    // Wait for the PDF generation to finish and return the result
    return await pdfPromise;
}

async function uploadToS3(pdfData) {
    const params = {
        Bucket: 'amplify-ncc-staging-65406-deployment',
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

async function getStudent(studentCPR) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: studentCPR
        }
    };
    const student = await dynamoDB.get(params).promise();
    return student.Item;
}

async function fetchImage(url) {
    const response = await fetch(url);
    return response.arrayBuffer();
}

