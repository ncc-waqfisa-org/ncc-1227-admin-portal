const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const {
  MasterApplicationTable: MASTER_APPLICATION_TABLE,
  StudentTable: STUDENT_TABLE,
  MasterAppliedUniversitiesTable: MASTER_UNIVERSITY_TABLE,
  BatchTable: BATCH_TABLE,
  AdminLogTable: ADMIN_LOG_TABLE,
  AdminTable: ADMIN_TABLE,
} = {
  MasterApplicationTable:
    "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterAppliedUniversitiesTable:
    "MasterAppliedUniversities-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminLogTable: "AdminLog-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  BatchTable: "MasterBatch-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  if (!event.headers || !event.headers.authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Missing authorization token" }),
    };
  }

  const token = event.headers.authorization.slice(7);
  const isAdmin = await checkIsAdmin(token);
  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden: User is not an admin" }),
    };
  }

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

  await bulkUpdateApplications(
    batchValue,
    applications,
    universities,
    batchDetails
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Applications updated" }),
  };
};

async function checkIsAdmin(token) {
  try {
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;
    const params = {
      TableName: ADMIN_TABLE,
      Key: {
        cpr: username,
      },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item !== undefined;
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false;
  }
}

async function getApplications(batch) {
  const params = {
    TableName: MASTER_APPLICATION_TABLE,
    IndexName: "byMasterProcessed",
    KeyConditionExpression:
      "#batch = :batchValue AND #processed = :processedValue",
    ScanIndexForward: false,
    ExpressionAttributeNames: {
      "#batch": "batch",
      "#processed": "processed",
    },
    ExpressionAttributeValues: {
      ":batchValue": batch,
      ":processedValue": 0,
    },
  };

  let allApplications = [];
  do {
    const result = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(result.Items);
    params.ExclusiveStartKey = result.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allApplications;
}

async function bulkUpdateApplications(
  batchValue,
  applications,
  universities,
  batchDetails
) {
  const updatePromises = applications.map(async (application) => {
    const student = await getStudent(application.studentCPR);
    let isProcessed = 1;
    let status;
    let reason = "Processed by system";
    let snapshot = "";

    // Age check
    if (student?.dob) {
      const age = calculateAge(student.dob);
      if (age > 30) {
        status = "REJECTED";
        isProcessed = 1;
        reason = "Student is over 30 years old";
        snapshot = "Changed from " + application.status + " to " + status;
      }
    }

    // Nationality check
    if (!status && application.nationalityCategory === "NON_BAHRAINI") {
      status = "REJECTED";
      isProcessed = 1;
      reason = "Student is not Bahraini";
      snapshot = "Changed from " + application.status + " to " + status;
    }

    // TODO: ask muddaffar about whether we keep this or not.
    // GPA check (only 88 threshold)
    if (!status && application.verifiedGPA && application.verifiedGPA < 88) {
      status = "REJECTED";
      isProcessed = 1;
      reason = "GPA is less than 88";
      snapshot = "Changed from " + application.status + " to " + status;
    }

    // If no rejection criteria met, mark as eligible
    if (!status) {
      status = "ELIGIBLE";
      isProcessed = 1;
    }

    const params = {
      TableName: MASTER_APPLICATION_TABLE,
      Key: {
        id: application.id,
      },
      UpdateExpression: "SET #status = :status, #processed = :processed",
      ExpressionAttributeNames: {
        "#status": "status",
        "#processed": "processed",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":processed": isProcessed,
      },
    };

    if (reason) {
      params.UpdateExpression += ", #reason = :reason";
      params.ExpressionAttributeNames["#reason"] = "reason";
      params.ExpressionAttributeValues[":reason"] = reason;
    }

    await dynamoDB.update(params).promise();
    if (snapshot) {
      await createAdminLog(reason, snapshot, application.id);
    }
  });

  return Promise.all(updatePromises);
}

// Helper functions
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

async function getStudent(studentCPR) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: studentCPR,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function getUniversities() {
  const params = {
    TableName: MASTER_UNIVERSITY_TABLE,
  };
  const { Items } = await dynamoDB.scan(params).promise();
  return Items;
}

async function getBatchDetails(batchValue) {
  const params = {
    TableName: BATCH_TABLE,
    Key: {
      batch: batchValue,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

async function createAdminLog(reason, snapshot, applicationID) {
  const params = {
    TableName: ADMIN_LOG_TABLE,
    Item: {
      id: uuid.v4(),
      applicationID,
      adminCPR: "SYSTEM",
      dateTime: new Date().toISOString(),
      snapshot,
      reason,
    },
  };
  await dynamoDB.put(params).promise();
}
