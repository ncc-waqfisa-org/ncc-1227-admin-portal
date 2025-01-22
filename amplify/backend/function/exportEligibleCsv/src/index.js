/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const cognito = new AWS.CognitoIdentityServiceProvider();

const {
  ApplicationTable: APPLICATION_TABLE,
  UniversityTable: UNIVERSITY_TABLE,
  BatchTable: BATCH_TABLE,
  AdminTable: ADMIN_TABLE,
  S3Bucket: S3_BUCKET,
} = {
  ApplicationTable: "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  UniversityTable: "University-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  BatchTable: "Batch-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "amplify-ncc-masterdev-2e2e0-deployment",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event) => {
  const token = event.headers?.authorization?.slice(7);

  // Get the user from cognito to check the login status
  const isUserLoggedIn = await isLoggedIn(token);
  if (!isUserLoggedIn) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized. Please log in" }),
    };
  }

  // Check if the user is admin or not
  const isAdmin = await checkIsAdmin(token);
  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden. You are not an admin" }),
    };
  }

  // Get the batch paramerter from the query and to print the current batch
  const batchValue =
    parseInt(event.queryStringParameters?.batch) || new Date().getFullYear();
  const exceptionUniversities = await getExceptionUniversities();
  const extendedUniversities = await getExtendedUniversities();
  const batchDetails = await getBatchDetails(batchValue);

  console.log("Universities:", exceptionUniversities);
  console.log(`EVENT: ${JSON.stringify(event)}`);

  try {
    const applications = await getApplications(
      APPLICATION_TABLE,
      batchValue,
      exceptionUniversities,
      extendedUniversities,
      batchDetails
    );
    const csv = await convertToCsv(applications);
    const url = await uploadToS3(csv, batchValue);
    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.error("Error exporting applications", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error exporting applications" }),
    };
  }
};

async function getApplications(
  tableName,
  batchValue,
  exceptionUniversities,
  extendedUniversities,
  batchDetails
) {
  // const programs = await getPrograms();
  const params = {
    TableName: APPLICATION_TABLE,
    IndexName: "byNationalityCategory",
    KeyConditionExpression:
      "#batch = :batchValue AND nationalityCategory = :nationalityCategory",
    ExpressionAttributeNames: {
      "#batch": "batch",
    },
    ExpressionAttributeValues: {
      ":batchValue": batchValue,
      ":nationalityCategory": "BAHRAINI",
    },
  };

  let allApplications = [];

  do {
    const applications = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(applications.Items);

    // Check if there are more items to fetch
    params.ExclusiveStartKey = applications.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  // Remove the NOT_COMPLETED application unless the university is an exception]

  allApplications = allApplications.filter((application) => {
    // Filter out rejected applications
    if (
      application.status === "REJECTED" ||
      application.status === "WITHDRAWN"
    ) {
      return false;
    }
    return true;
  });

  return allApplications;
}

async function convertToCsv(applications) {
  let csv = "Student CPR,Verified GPA\n";
  for (const application of applications) {
    csv += `=""${application.studentCPR}"",${
      application.verifiedGPA ? application.verifiedGPA : "PLEASE VERIFY"
    }\n`;
  }
  return csv;
}

async function uploadToS3(csv, batchValue) {
  const params = {
    Bucket: S3_BUCKET,
    Key: "Eligible Students " + batchValue + ".csv",
    Body: csv,
  };
  await s3.upload(params).promise();
  // return the URL of the uploaded file
  return s3.getSignedUrl("getObject", {
    Bucket: params.Bucket,
    Key: params.Key,
  });
}

async function getExceptionUniversities() {
  const params = {
    TableName: UNIVERSITY_TABLE,
    IndexName: "byException",
    KeyConditionExpression: "#isException = :exceptionValue",
    ExpressionAttributeNames: {
      "#isException": "isException",
    },
    ExpressionAttributeValues: {
      ":exceptionValue": 1,
    },
  };

  let allUniversities = [];

  do {
    const universities = await dynamoDB.query(params).promise();
    allUniversities = allUniversities.concat(universities.Items);
    params.ExclusiveStartKey = universities.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  return allUniversities;
}

async function getExtendedUniversities() {
  const params = {
    TableName: UNIVERSITY_TABLE,
    IndexName: "byExtended",
    KeyConditionExpression: "#isExtended = :extendedValue",
    ExpressionAttributeNames: {
      "#isExtended": "isExtended",
    },
    ExpressionAttributeValues: {
      ":extendedValue": 1,
    },
  };

  let allUniversities = [];

  do {
    const universities = await dynamoDB.query(params).promise();
    allUniversities = allUniversities.concat(universities.Items);
    params.ExclusiveStartKey = universities.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);
  console.log("Extended Universities:", allUniversities);

  return allUniversities;
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

async function checkIsAdmin(token) {
  // get the username from the token using cognito
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
    console.error("Error checking if user is admin", error);
    return false;
  }
}

async function isLoggedIn(token) {
  try {
    await cognito.getUser({ AccessToken: token }).promise();
    return true;
  } catch (error) {
    console.error("Error checking if user is logged in", error);
    return false;
  }
}
