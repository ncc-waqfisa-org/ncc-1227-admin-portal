const AWS = require("aws-sdk");
const uuid = require("uuid");

// Initialize Cognito and DynamoDB clients
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Define table names using constants
const {
  ApplicationTable: APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  UniversityTable: UNIVERSITY_TABLE,
  ProgramTable: PROGRAM_TABLE,
  BatchTable: BATCH_TABLE,
  AdminLogTable: ADMIN_LOG_TABLE,
  AdminTable: ADMIN_TABLE,
} = {
  ApplicationTable: "Application-cw7beg2perdtnl7onnneec4jfa-staging",
  StudentTable: "Student-cw7beg2perdtnl7onnneec4jfa-staging",
  UniversityTable: "University-cw7beg2perdtnl7onnneec4jfa-staging",
  ProgramTable: "Program-cw7beg2perdtnl7onnneec4jfa-staging",
  BatchTable: "Batch-cw7beg2perdtnl7onnneec4jfa-staging",
  AdminLogTable: "AdminLog-cw7beg2perdtnl7onnneec4jfa-staging",
  AdminTable: "Admin-cw7beg2perdtnl7onnneec4jfa-staging",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // --- ADMIN CHECK ---
  if (!event.headers || !event.headers.authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Missing authorization token" }),
    };
  }
  // Extract token (assuming a format like "Bearer <token>")
  const token = event.headers.authorization.slice(7);
  const isAdmin = await checkIsAdmin(token);
  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden: User is not an admin" }),
    };
  }
  // --- END ADMIN CHECK ---

  const today = new Date();
  const batchValue = today.getFullYear();
  const batchDetails = await getBatchDetails(batchValue);
  console.log("batchDetails", batchDetails);
  if (!batchDetails) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Batch not found" }),
    };
  }
  const updateApplicationEndDate = new Date(
    batchDetails.updateApplicationEndDate
  );

  if (today < updateApplicationEndDate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "Batch update period has not finished yet. Skipping auto reject",
      }),
    };
  }

  const applications = await getApplications(batchValue);
  const universities = await getUniversities();
  const programs = await getPrograms();
  console.log("universities", universities);
  const extendedUniversities = universities.filter(
    (university) => university.isExtended
  );
  const exceptionUniversities = universities.filter(
    (university) => university.isException
  );
  await bulkUpdateApplications(
    batchValue,
    applications,
    extendedUniversities,
    exceptionUniversities,
    universities,
    programs,
    batchDetails
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Applications updated" }),
  };
};

async function checkIsAdmin(token) {
  try {
    // Retrieve user info from Cognito
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;
    // Look up the admin record in the Admin table using the username (assumed to be the key "cpr")
    const params = {
      TableName: ADMIN_TABLE,
      Key: {
        cpr: username,
      },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item !== undefined;
  } catch (error) {
    console.error("Error checking if user is admin", error);
    return false;
  }
}

async function getApplications(batch) {
  const params = {
    TableName: APPLICATION_TABLE,
    IndexName: "byProcessed",
    KeyConditionExpression:
      "#batch = :batchValue AND #processed = :processedValue",
    ScanIndexForward: false,
    ExpressionAttributeNames: {
      "#batch": "batch", // Alias for reserved word "batch"
      "#processed": "processed",
    },
    ExpressionAttributeValues: {
      ":batchValue": batch,
      ":processedValue": 0,
    },
  };

  let allApplications = [];
  do {
    const applications = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(applications.Items);
    params.ExclusiveStartKey = applications.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allApplications;
}

async function bulkUpdateApplications(
  batchValue,
  applications,
  extendedUniversities,
  exceptionUniversities,
  universities,
  programs,
  batchDetails
) {
  const updatePromises = applications.map(async (application) => {
    let isProcessed = 1;
    // Build initial update parameters
    const params = {
      TableName: APPLICATION_TABLE,
      Key: {
        id: application.id,
      },
      UpdateExpression: "set #processed = :processedValue",
      ExpressionAttributeValues: {
        ":processedValue": isProcessed,
      },
      ExpressionAttributeNames: {},
    };

    const program = programs.find(
      (program) => program.id === application.programID
    );
    const minimumGPA = (program && program.minimumGPA) || 82;
    // const universityId = application.universityID; // if needed for further logic
    const isNonBahraini = application.nationalityCategory === "NON_BAHRAINI";
    const isEligible = application.verifiedGPA
      ? application.verifiedGPA >= minimumGPA
      : false;
    // const isGpaVerified = !!application.verifiedGPA; // if needed for further logic

    console.log("isEligible", isEligible);
    console.log("Program minimum GPA:", minimumGPA);
    console.log("Application verified GPA:", application.verifiedGPA);

    let status;
    let reason = "Processed by system";
    let snapshot = "";

    if (isNonBahraini) {
      status = "REJECTED";
      isProcessed = 1;
      reason = "Student is not Bahraini";
      snapshot = "Changed from " + application.status + " to " + status;
    } else if (application.verifiedGPA && application.verifiedGPA < 82) {
      status = "REJECTED";
      isProcessed = 1;
      reason = "GPA is less than 82";
      snapshot = "Changed from " + application.status + " to " + status;
    } else if (isEligible) {
      status = "ELIGIBLE";
      isProcessed = 1;
    } else if (!isEligible && application.verifiedGPA) {
      status = "REJECTED";
      isProcessed = 1;
      reason = "GPA is less than program minimum GPA";
      snapshot = "Changed from " + application.status + " to " + status;
    } else {
      isProcessed = 0;
    }

    // Build the update expression dynamically
    params.UpdateExpression = "set #processed = :processedValue, ";
    if (status) {
      params.UpdateExpression += "#status = :status";
    } else {
      // Remove the trailing comma if no status update is required
      params.UpdateExpression = params.UpdateExpression.slice(0, -2);
    }

    console.log("UpdateExpression:", params.UpdateExpression);

    params.ExpressionAttributeValues[":status"] = status;
    params.ExpressionAttributeValues[":processedValue"] = isProcessed;
    params.ExpressionAttributeNames["#status"] = "status";
    params.ExpressionAttributeNames["#processed"] = "processed";

    await dynamoDB.update(params).promise();
    await createAdminLog(reason, snapshot, application.id);
  });
  return Promise.all(updatePromises);
}

async function getStudent(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: cpr,
    },
  };

  const student = await dynamoDB.get(params).promise();
  return student.Item;
}

async function getBatchDetails(batch) {
  const params = {
    TableName: BATCH_TABLE,
    Key: {
      batch: batch,
    },
  };

  const batchDetails = await dynamoDB.get(params).promise();
  return batchDetails.Item;
}

async function getUniversity(universityId) {
  const params = {
    TableName: UNIVERSITY_TABLE,
    Key: {
      id: universityId,
    },
  };

  const university = await dynamoDB.get(params).promise();
  return university.Item;
}

async function getUniversities() {
  const params = {
    TableName: UNIVERSITY_TABLE,
  };

  let allUniversities = [];
  do {
    const universities = await dynamoDB.scan(params).promise();
    allUniversities = allUniversities.concat(universities.Items);
    params.ExclusiveStartKey = universities.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allUniversities;
}

async function getPrograms() {
  const params = {
    TableName: PROGRAM_TABLE,
  };

  let allPrograms = [];
  do {
    const programs = await dynamoDB.scan(params).promise();
    allPrograms = allPrograms.concat(programs.Items);
    params.ExclusiveStartKey = programs.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allPrograms;
}

async function createAdminLog(reason, snapshot, applicationId) {
  const id = uuid.v4();
  const params = {
    TableName: ADMIN_LOG_TABLE,
    Item: {
      id: id,
      __typename: "AdminLog",
      _version: 1,
      reason: reason,
      snapshot: snapshot,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dateTime: new Date().toISOString(),
      applicationID: applicationId,
      applicationAdminLogsId: applicationId,
      adminCPR: "999999999",
      _lastChangedAt: new Date().getTime(),
    },
  };

  await dynamoDB.put(params).promise();
}
