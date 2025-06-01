/* Amplify Params - DO NOT EDIT
  ENV
  REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const {
    ApplicationTable: APPLICATION_TABLE,
    StudentTable: STUDENT_TABLE,
    AttachmentTable: ATTACHMENT_TABLE,
    ProgramChoiceTable: PROGRAM_CHOICE_TABLE,
} = {
    ApplicationTable: "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
    StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
    AttachmentTable: "Attachment-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
    ProgramChoiceTable: "ProgramChoice-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Bad Request",
                message: "Request body is missing",
            }),
        };
    }

    // Parse batch from the request body
    const body = JSON.parse(event.body);
    const batchValue = body.batch;

    try {

        console.log("Fetching NOT_COMPLETED Appllications for batch", batchValue);
        const applications = await GET_APPLICATIONS(APPLICATION_TABLE, batchValue);
        console.log("Fetched Applications => " + applications.length);

        const studentCPRs = applications.map(app => app.studentCPR);
        const attachmentIds = applications.map(app => app.applicationAttachmentId);
        const applicationIds = applications.map(app => app.id);

        // console.log("Student CPRs:", studentCPRs);
        // console.log("Attachments IDs:", attachmentIds);

        console.log("Fetching Students");
        const students = await GET_STUDENTS(STUDENT_TABLE, studentCPRs);
        console.log("Fetched Students => " + students.length);


        console.log("Fetching Attachments");
        const attachments = await GET_ATTACHMENTS(ATTACHMENT_TABLE, attachmentIds);
        console.log("Fetched Attachments => " + attachments.length);

        console.log("Fetching Program Choices");
        const programChoices = await GET_PROGRAM_CHOICES(PROGRAM_CHOICE_TABLE, applicationIds);
        console.log("Fetched Program Choices => " + programChoices.length);

        // check for every application if in the student has cprDoc is not null
        for (const application of applications) {
            const student = students.find(s => s.cpr === application.studentCPR);
            const attachment = attachments.find(a => a.id === application.applicationAttachmentId);
            const programChoice = programChoices.find(pc => pc.applicationID === application.id);

            if (
                student
                && student.cprDoc
                && student.familyIncomeProofDocs
                && student.familyIncomeProofDocs.length >= 1
                && programChoice
                && programChoice.acceptanceLetterDoc
                && attachment
                && attachment.schoolCertificate
                && attachment.transcriptDoc
            ) {
                console.log(`Application ${application.id} needs to be updated to REVIEW`);
                await UPDATE_APPLICATION_STATUS(application.id, "REVIEW");
            } else {
                console.log(`Application ${application.id} is NOT_COMPLETED`);
            }
        }


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Applications Updated successfully",
                totalApplications: applications.length,
                totalStudents: students.length,
            }),
        };
    } catch (error) {
        console.error("Error Updating Statuses", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error Updating Statuses" }),
        };
    }
};

/**
 * Fetch applications of the current batch with status NOT_COMPLETE
 */
const GET_APPLICATIONS = async (tableName, batchValue) => {
    const params = {
        TableName: tableName,
        IndexName: "byBatch",
        KeyConditionExpression: "#batch = :batchValue AND #status = :statusValue",
        ExpressionAttributeNames: {
            "#batch": "batch",
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":batchValue": batchValue,
            ":statusValue": "NOT_COMPLETED",
        },
    };

    let allApplications = [];
    do {
        const data = await dynamoDB.query(params).promise();
        allApplications = allApplications.concat(data.Items);
        params.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return allApplications;
};

/**
 * Fetch student records based on batch and studentCPRs
 */
const GET_STUDENTS = async (tableName, studentCPRs) => {
    const allStudents = [];
    const BATCH_SIZE = 25;

    for (let i = 0; i < studentCPRs.length; i += BATCH_SIZE) {
        const batch = studentCPRs.slice(i, i + BATCH_SIZE);

        const keys = batch.map(cpr => ({
            cpr,
        }));

        const requestItems = {
            [tableName]: {
                Keys: keys,
            },
        };

        const result = await dynamoDB.batchGet({ RequestItems: requestItems }).promise();
        allStudents.push(...(result.Responses[tableName] || []));
    }

    return allStudents;
};

/**
 * Fetch attachments based on attachment IDs
 */
const GET_ATTACHMENTS = async (tableName, attachmentIds) => {
    const allAttachments = [];
    const BATCH_SIZE = 25;

    for (let i = 0; i < attachmentIds.length; i += BATCH_SIZE) {
        const batch = attachmentIds.slice(i, i + BATCH_SIZE);

        const keys = batch.map(id => ({ id }));

        const requestItems = {
            [tableName]: {
                Keys: keys,
            },
        };

        const result = await dynamoDB.batchGet({ RequestItems: requestItems }).promise();
        allAttachments.push(...(result.Responses[tableName] || []));
    }

    return allAttachments;
}

/**
 * Fetch Program Choices based on application IDs
 */
const GET_PROGRAM_CHOICES = async (tableName, applicationIds) => {
    const allProgramChoices = [];

    for (const id of applicationIds) {
        const params = {
            TableName: tableName,
            IndexName: "applicationID-index",
            KeyConditionExpression: "applicationID = :appId",
            ExpressionAttributeValues: {
                ":appId": id,
            },
        };

        const result = await dynamoDB.query(params).promise();
        allProgramChoices.push(...result.Items);
    }

    return allProgramChoices;
}

const UPDATE_APPLICATION_STATUS = async (applicationId, status) => {
    const params = {
        TableName: APPLICATION_TABLE,
        Key: { id: applicationId },
        UpdateExpression: "set #status = :statusValue",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":statusValue": status,
        },
    };

    try {
        await dynamoDB.update(params).promise();
        console.log(`Application ${applicationId} updated to ${status}`);
    } catch (error) {
        console.error(`Error updating application ${applicationId}:`, error);
    }
}