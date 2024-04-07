/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const pdfKit = require('pdfkit');

const arabicLocal = {
    "BAHRAINI": "بحريني",
    "NON_BAHRAINI": "غير بحريني",
    "PUBLIC": "حكومية",
    "PRIVATE": "خاصة",
    "LESS_THAN_1500" : "أقل من 1500",
    "MORE_THAN_1500" : "أكثر من 1500",
    "REJECTED": "مرفوض",
    "APPROVED": "مقبول",
    "NOT_COMPLETED": "غير مكتمل",
    "ELIGIBLE": "مؤهل",
    "AWAITING_VERIFICATION": "في انتظار التحقق",
};



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
    // Add logo, top right. With 170 width
    doc.image(imageBuffer, 390, 20, { width: 170 });
    // add a title on the top left
    doc.font('./fonts/Almarai-Bold.ttf').fontSize(20).text('Waqf Isa Application', 20, 20);
    // add a line under the title and logo
    doc.moveTo(20, 90).lineTo(600, 90).stroke();
    // add today's date under the line
    doc.font('./fonts/Almarai.ttf').fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, 20, 95);
    // take a gap
    doc.text(' ');
    // add a "to whom it may concern" text
    doc.font('./fonts/Almarai.ttf').fontSize(14).text('To Whom It May Concern', {align: 'center', underline: true});
    doc.text(' ');
    doc.font('./fonts/Almarai-Bold.ttf').fontSize(12).text('This is to certify that the following student has applied for the Waqf Isa scholarship program. The application details are as follows:');
    doc.font('./fonts/Almarai.ttf').fontSize(12).text(`ID: ${application.id}`);
    doc.text("Status: ", {continued: true});
    doc.text(application.status);
    doc.text("Batch: ", {continued: true});
    doc.text(application.batch);
    // take a gap
    doc.text(' ');

    doc.font('./fonts/Almarai-Bold.ttf').fontSize(14).text('Student Details:');
    doc.font('./fonts/Almarai.ttf').fontSize(12).text("Name: ", {continued: true});
    doc.text(application.studentName, {features: ['rtla']});
    doc.text("CPR: ", {continued: true});
    doc.text(application.studentCPR);
    doc.text("Nationality: ", {continued: true});
    doc.text(application.nationalityCategory);
    doc.text("GPA: ", {continued: true});
    doc.text(application.gpa + "%");
    doc.text("Verified GPA: " + application.verifiedGPA ? application.verifiedGPA : "Awaiting verification");
    doc.text("School Name: ", {continued: true});
    doc.text(application.schoolName, {features: ['rtla']});



    doc.text("School Type: ", {continued: true});
    doc.text(application.schoolType);
    // take a gap
    doc.text(' ');
    doc.font('./fonts/Almarai-Bold.ttf').fontSize(14).text('Parents Details:');
    doc.font('./fonts/Almarai.ttf').fontSize(12).text("Father Name: ", {continued: true});
    doc.text(parent.fatherFullName, {features: ['rtla']});
    doc.text("Father CPR: ", {continued: true});
    doc.text(parent.fatherCPR);
    doc.text("Mother Name: ", {continued: true});
    // align the text to the right
    doc.text(parent.motherFullName, {features: ['rtla']});

    doc.text("Mother CPR: ", {continued: true});
    doc.text(parent.motherCPR);
    doc.text("Guardian Name: ", {continued: true});
    doc.text(parent.guardianFullName, {features: ['rtla']});
    doc.text("Guardian CPR: ", {continued: true});
    doc.text(parent.guardianCPR);
    doc.text("Family Income: ", {continued: true});
    doc.text(parent.familyIncome);
    // take a gap
    doc.text(' ');

    doc.font('./fonts/Almarai-Bold.ttf').fontSize(14).text('Desired Program:');
    if(program) {
        doc.font('./fonts/Almarai.ttf').fontSize(12).text(`${program.name} - ${university.name}`);
    }
    else {
        doc.font('./fonts/Almarai.ttf').fontSize(12).text('N/A');
    }
    // add a footer with a line above it
    doc.moveTo(20, 690).lineTo(600, 690).stroke();
    doc.font('./fonts/Almarai.ttf').fontSize(8).text('This document is generated by Waqf Isa system. All rights reserved ' + new Date().getFullYear(), 20, 700);
    // Finalize PDF file
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

