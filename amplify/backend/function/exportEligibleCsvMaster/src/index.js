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

  // Get the token from Authorization header (Bearer <token>)
  const token = event.headers?.authorization?.slice(7);

  // Check user logged in
  const isUserLoggedIn = await isLoggedIn(token);
  if (!isUserLoggedIn) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized. Please log in." }),
    };
  }

  // Check if user is Admin
  const isAdmin = await checkIsAdmin(token);
  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden. You are not an admin." }),
    };
  }

  try {
    // Query string ?batch=...
    const batchValue =
      parseInt(event.queryStringParameters?.batch) || new Date().getFullYear();

    // Get applications that match index conditions
    const applications = await getMasterApplications(batchValue);

    // Convert to CSV
    const csv = await convertToCsv(applications);

    // Upload the CSV to S3
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

/**
 * Fetch applications from DynamoDB using the GSI 'byMasterNationalityCategory'.
 * Then we filter out certain statuses and keep only those with age <= 30.
 */
async function getMasterApplications(batchValue) {
  const params = {
    TableName: APPLICATION_TABLE,
    IndexName: "byMasterNationalityCategory",
    KeyConditionExpression:
      "#batch = :batchValue AND nationalityCategory = :nationalityCategory",
    ExpressionAttributeNames: {
      "#batch": "batch",
    },
    ExpressionAttributeValues: {
      ":batchValue": batchValue,
      ":nationalityCategory": "BAHRAINI", // or your desired value
    },
  };

  let allApplications = [];
  do {
    const result = await dynamoDB.query(params).promise();
    allApplications = allApplications.concat(result.Items);
    params.ExclusiveStartKey = result.LastEvaluatedKey;
  } while (params.ExclusiveStartKey);

  // Filter out REJECTED, WITHDRAWN, NOT_COMPLETED statuses
  const statusFiltered = allApplications.filter(
    (app) => !["REJECTED", "WITHDRAWN", "NOT_COMPLETED"].includes(app.status)
  );

  // Fetch student for each application (to check DOB and age)
  const applicationsWithStudents = await Promise.all(
    statusFiltered.map(async (app) => {
      const student = await getStudent(app.studentCPR);
      return { app, student };
    })
  );

  // Keep only those <= age 30 (or whatever age logic you need)
  const ageFiltered = applicationsWithStudents
    .filter(({ student }) => {
      if (!student?.dob) return false;
      const age = calculateAge(student.dob);
      return age <= 30;
    })
    .map(({ app }) => app);

  return ageFiltered;
}

/**
 * Fetch the student item from the Student table.
 */
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

/**
 * Calculate a student's age (from 'YYYY-MM-DD' DOB format).
 */
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

/**
 * Convert the application data into CSV format.
 */
async function convertToCsv(applications) {
  // Customize CSV headers and fields as needed
  let csv = "Student CPR,Verified GPA\n";
  for (const app of applications) {
    csv += `="${app.studentCPR}",${app.verifiedGPA || "PLEASE VERIFY"}\n`;
  }
  return csv;
}

/**
 * Upload CSV to S3 and return a signed URL for download.
 */
async function uploadToS3(csv, batchValue) {
  const params = {
    Bucket: S3_BUCKET,
    Key: `Master Eligible Students ${batchValue}.csv`,
    Body: csv,
    ContentType: "text/csv",
  };

  await s3.upload(params).promise();
  return s3.getSignedUrl("getObject", {
    Bucket: S3_BUCKET,
    Key: params.Key,
    Expires: 60 * 60, // Link valid for 1 hour (adjust as needed)
  });
}

/**
 * Check if the current token belongs to an admin user in your Admin table.
 */
async function checkIsAdmin(token) {
  try {
    // getUser returns info about the Cognito user
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;

    const params = {
      TableName: ADMIN_TABLE,
      Key: { cpr: username },
    };

    const { Item } = await dynamoDB.get(params).promise();
    return !!Item;
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false;
  }
}

/**
 * Check if the user is logged in by verifying the token with getUser.
 */
async function isLoggedIn(token) {
  try {
    await cognito.getUser({ AccessToken: token }).promise();
    return true;
  } catch (error) {
    console.error("Error checking if user is logged in:", error);
    return false;
  }
}
