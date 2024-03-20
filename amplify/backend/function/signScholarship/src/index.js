const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const { PDFDocument } = require('pdf-lib');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const link = event.queryStringParameters?.link;
    const studentSignature = event.queryStringParameters?.studentSignature;
    const guardianSignature = event.queryStringParameters?.guardianSignature;
    const signedPdf = await signPDF(link, studentSignature, guardianSignature);
    const signedPdfUrl = await uploadToS3(signedPdf);

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

async function signPDF(
    link,
    studentSignature,
    guardianSignature
) {
    // Get the pdf buffer
    const pdfBufferUint8Array = await fetchPdfAsUint8Array(link);
    // Load the pdf
    const pdfDoc = await PDFDocument.load(pdfBufferUint8Array);

    // Load the signatures
    const signatureImage = await pdfDoc.embedPng(studentSignature);
    const secondSignatureImage = await pdfDoc.embedPng(guardianSignature);

    // Get the last page
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    // Adjust these values based on the desired signature size and position
    const signatureWidth = 100;
    const signatureHeight = 50;
    const xPosition = 70; // Position from the left of the page
    const yPosition = 30; // Position from the bottom of the page

    // Put the first signature
    lastPage.drawImage(signatureImage, {
        x: xPosition,
        y: yPosition,
        width: signatureWidth,
        height: signatureHeight,
    });

    // Put the second signature
    lastPage.drawImage(secondSignatureImage, {
        x: xPosition,
        y: yPosition + 90,
        width: signatureWidth,
        height: signatureHeight,
    });

    // Get the pdf as Uint8Array
    const signedPdfBytes = await pdfDoc.save();

    // Save the signed PDF
    const blob = new Blob([signedPdfBytes], { type: "application/pdf" });

    return blob;
}

async function uploadToS3(pdf) {
    const params = {
        Bucket: 'scholarship',
        Key: 'signed-scholarship.pdf',
        Body: pdf,
    };

    await s3.upload(params).promise();
    // return the URL of the uploaded file
    return s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: params.Key});
}


