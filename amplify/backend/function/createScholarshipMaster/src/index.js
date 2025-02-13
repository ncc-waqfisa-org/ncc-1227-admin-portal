const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Initialize DynamoDB and Cognito clients
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

// Define table names for MasterApplication, MasterScholarship, Admin, and Student
const {
  MasterApplicationTable: MASTER_APPLICATION_TABLE,
  MasterScholarshipTable: MASTER_SCHOLARSHIP_TABLE,
  AdminTable: ADMIN_TABLE,
  StudentTable: STUDENT_TABLE,
} = {
  MasterApplicationTable:
    "MasterApplication-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  MasterScholarshipTable:
    "MasterScholarship-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

/**
 * Lambda handler for creating a master scholarship.
 *
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

    // ADMIN CHECK: require an authorization token and verify that the user is an admin
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

    // Parse the request body and validate required fields
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

    // Retrieve the master application record from DynamoDB
    const masterApplication = await getMasterApplicationByID(applicationID);
    if (!masterApplication) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Master application not found" }),
      };
    }

    // Retrieve the student record using the master application's studentCPR
    const student = await getStudentByCPR(masterApplication.studentCPR);
    if (!student) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Student not found" }),
      };
    }

    // Build the student's full name using master-specific fields from the student record
    const studentFullName = [
      student.m_firstName,
      student.m_secondName,
      student.m_thirdName,
      student.m_lastName,
    ]
      .filter((name) => Boolean(name))
      .join(" ");

    // Build the master scholarship record using details from the master application, student, and input payload
    const scholarship = {
      id: uuidv4(),
      applicationID: masterApplication.id,
      studentCPR: student.cpr,
      // Optionally, you might want to log or use the master student name:
      // studentName: studentFullName,
      unsignedContractDoc: contract,
      startDate,
      scholarshipPeriod,
      numberOfSemesters,
      status: "PENDING",
      batch: masterApplication.batch || 0,
      isConfirmed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _version: 1, // initial version
      _lastChangedAt: Date.now(), // AWSTimestamp (non-nullable)
    };
    // small add
    await dynamoDB
      .put({
        TableName: MASTER_SCHOLARSHIP_TABLE,
        Item: scholarship,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Master scholarship created successfully",
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
 * Retrieves a master application record by the provided applicationID.
 * @param {string} applicationID
 * @returns {Promise<Object|null>}
 */
async function getMasterApplicationByID(applicationID) {
  const params = {
    TableName: MASTER_APPLICATION_TABLE,
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
