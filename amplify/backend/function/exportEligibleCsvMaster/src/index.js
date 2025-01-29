const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const cognito = new AWS.CognitoIdentityServiceProvider();

const {
  ApplicationTable: APPLICATION_TABLE,
  AdminTable: ADMIN_TABLE,
  StudentTable: STUDENT_TABLE,
  S3Bucket: S3_BUCKET,
} = {
  ApplicationTable: "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  S3Bucket: "amplify-ncc-masterdev-2e2e0-deployment",
};
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

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

  try {
    const batchValue =
      parseInt(event.queryStringParameters?.batch) || new Date().getFullYear();
    const applications = await getMasterApplications(batchValue);
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

async function getMasterApplications(batchValue) {
  const params = {
    TableName: APPLICATION_TABLE,
    IndexName: "byMasterNationalityCategory",
    KeyConditionExpression: "#batch = :batchValue",
    ExpressionAttributeNames: { "#batch": "batch" },
    ExpressionAttributeValues: { ":batchValue": batchValue },
  };

  let allApplications = [];
  do {
    const result = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(result.Items);
    params.ExclusiveStartKey = result.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  // Filter by status first
  const statusFiltered = allApplications.filter(
    (app) => !["REJECTED", "WITHDRAWN", "NOT_COMPLETED"].includes(app.status)
  );

  // Fetch students and check age eligibility
  const applicationsWithStudents = await Promise.all(
    statusFiltered.map(async (app) => {
      const student = await getStudent(app.studentCPR);
      return { app, student };
    })
  );

  // Apply age filter
  const ageFiltered = applicationsWithStudents
    .filter(({ student }) => {
      if (!student?.dob) return false;
      const age = calculateAge(student.dob);
      return age <= 30;
    })
    .map(({ app }) => app);

  return ageFiltered;
}

async function getStudent(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr },
  };
  try {
    const data = await dynamoDB.get(params).promise();
    return data.Item;
  } catch (error) {
    console.error("Error fetching student:", error);
    return null;
  }
}

// Calculate age from dob string (assumes 'YYYY-MM-DD' format)
function calculateAge(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

async function convertToCsv(applications) {
  let csv = "Student CPR,Verified GPA\n";
  for (const app of applications) {
    csv += `=""${app.studentCPR}"",${app.verifiedGPA || "PLEASE VERIFY"}\n`;
  }
  return csv;
}

async function uploadToS3(csv, batchValue) {
  const params = {
    Bucket: S3_BUCKET,
    Key: `Master Eligible Students ${batchValue}.csv`,
    Body: csv,
  };
  await s3.upload(params).promise();
  return s3.getSignedUrl("getObject", params);
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
