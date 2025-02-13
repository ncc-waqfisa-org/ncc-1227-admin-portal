const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Initialize DynamoDB and Cognito clients
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

// Define table names for Application, Scholarship, and Admin (using your existing names)
const {
  ApplicationTable: APPLICATION_TABLE,
  ScholarshipTable: SCHOLARSHIP_TABLE,
  AdminTable: ADMIN_TABLE,
  StudentTable: STUDENT_TABLE,
} = {
  ApplicationTable: "Application-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  ScholarshipTable: "Scholarship-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

/**
 * Lambda handler for creating a scholarship.
 * this will create scholarship for bacholar
 * Expected JSON input:
 * {
 *   "applicationID": "app12345",
 *   "startDate": "2023-10-01",
 *   "scholarshipPeriod": 4,
 *   "numberOfSemesters": 8,
 *   "contract": "/contracts/contract-${application.id}-${Date.now()}.pdf"
 * }
 */
exports.handler = async (event) => {
  try {
    console.log("EVENT:", JSON.stringify(event));

    // Admin check: require an authorization token and verify that the user is an admin
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

    // Parse the request body
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const {
      applicationID,
      startDate,
      scholarshipPeriod,
      numberOfSemesters,
      contract,
    } = body;
    if (
      !applicationID ||
      !startDate ||
      !scholarshipPeriod ||
      !numberOfSemesters ||
      !contract
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required parameters" }),
      };
    }

    // Retrieve the application record from DynamoDB
    const application = await getApplicationByID(applicationID);
    if (!application) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Application not found" }),
      };
    }

    // Retrieve the student record using the student's CPR from the application
    const student = await getStudentByCPR(application.studentCPR);
    if (!student) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Student not found" }),
      };
    }

    // Build student's full name from the student record
    const studentFullName = [
      student.firstName,
      student.secondName,
      student.thirdName,
      student.lastName,
    ]
      .filter((name) => Boolean(name))
      .join(" ");

    // Build the scholarship record using details from the application, student record, and input payload
    const scholarship = {
      id: uuidv4(),
      applicationID: application.id,
      studentCPR: student.cpr,
      studentName: studentFullName,
      startDate,
      scholarshipPeriod,
      numberOfSemesters,
      unsignedContractDoc: contract,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      // Optionally include additional details from the application if needed
      programID: application.programID || null,
      universityID: application.universityID || null,
      updatedAt: new Date().toISOString(),
      _version: 1, // initial version
      _lastChangedAt: Date.now(), // AWSTimestamp (non-nullable)
    };

    await dynamoDB
      .put({
        TableName: SCHOLARSHIP_TABLE,
        Item: scholarship,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Scholarship created successfully",
        scholarship,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

/**
 * Checks if the user represented by the provided token is an admin.
 * @param {string} token - The access token from the request header.
 * @returns {Promise<boolean>}
 */
async function checkIsAdmin(token) {
  try {
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;
    const params = {
      TableName: ADMIN_TABLE,
      Key: { cpr: username },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Boolean(Item);
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

/**
 * Retrieves an application record by the provided applicationID.
 * @param {string} applicationID
 * @returns {Promise<Object|null>}
 */
async function getApplicationByID(applicationID) {
  const params = {
    TableName: APPLICATION_TABLE,
    Key: { id: applicationID },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}

/**
 * Retrieves a student record by the provided CPR.
 * @param {string} cpr
 * @returns {Promise<Object|null>}
 */
async function getStudentByCPR(cpr) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item || null;
}
