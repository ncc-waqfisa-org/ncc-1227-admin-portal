/* Amplify Params - DO NOT EDIT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const uuid = require("uuid");

const {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
  StudentTable: STUDENT_TABLE,
  ParentTable: PARENT_TABLE,
  AdminTable: ADMIN_TABLE,
} = {
  UserPoolId: "us-east-1_79xE8d6FS",
  ClientId: "55hv3u8tffa9qml7krg9n0cfuq",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  ParentTable: "ParentInfo-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`Received event: ${JSON.stringify(event)}`);
  try {
    const requestBody = JSON.parse(event.body);
    const studentData = requestBody.student?.input;
    const parentInfo = requestBody.parentInfo?.input;
    const username = studentData?.cpr;
    let email = studentData?.email;
    const password = requestBody.password;

    // Log the extracted data for debugging
    console.log(`studentData: ${JSON.stringify(studentData)}`);
    console.log(`parentInfo: ${JSON.stringify(parentInfo)}`);

    if (username) {
      const adminExists = await checkIfCprIsAdmin(username);
      if (adminExists) {
        return response(
          400,
          {
            message:
              "This CPR belongs to an admin. Registration is not allowed.",
          },
          "application/json"
        );
      }
    }

    if (!username || !email || !password) {
      return response(
        400,
        { message: "Missing required fields: cpr, email, or password." },
        "application/json"
      );
    }

    const user = await getUserFromCognito(username);
    console.log(`Cognito user: ${JSON.stringify(user)}`);
    const userExists = !!user;

    if (userExists) {
      const isEmailVerified =
        user.UserAttributes.find((attr) => attr.Name === "email_verified")
          ?.Value === "true";

      if (isEmailVerified) {
        return response(
          400,
          { message: "User already exists and email is verified." },
          "application/json"
        );
      } else {
        // Handle re-registration if email is not verified
        await handleReRegistration(username, studentData, parentInfo, password);
        return response(
          201,
          { message: "User re-registered successfully." },
          "application/json"
        );
      }
    }

    // New user registration
    if (!parentInfo) {
      // Ensure parentInfo is present
      return response(
        400,
        { message: "Missing parentInfo input." },
        "application/json"
      );
    }

    studentData.parentInfoID = await saveParentToDynamoDB(parentInfo);
    await saveStudentToDynamoDB(studentData, parentInfo);
    await signUpUserToCognito(username, email, password);

    return response(
      201,
      { message: "User created successfully." },
      "application/json"
    );
  } catch (error) {
    console.error(`Error during signup: ${error}`);
    const cpr = JSON.parse(event.body)?.student?.input?.cpr;
    if (cpr) {
      await rollback(cpr);
    }
    return response(
      500,
      { message: `Internal Server Error: ${error.message}` },
      "application/json"
    );
  }
};

// Default headers for CORS
const defaultHeaders = () => ({
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
});

// Helper to construct responses
const response = (statusCode, body, contentType = "application/json") => ({
  statusCode,
  headers: defaultHeaders(),
  isBase64Encoded: false,
  body: JSON.stringify(body),
});

// NEW: Helper to check whether the provided CPR belongs to an admin.
async function checkIfCprIsAdmin(cpr) {
  const params = {
    TableName: ADMIN_TABLE,
    Key: { cpr },
  };
  try {
    const { Item } = await dynamoDB.get(params).promise();
    return !!Item;
  } catch (err) {
    console.error("Error checking admin table for CPR:", err);
    return false;
  }
}

// Handle user re-registration
const handleReRegistration = async (
  username,
  studentData,
  parentInfo,
  password
) => {
  const oldStudent = await getUserFromDynamoDB(username);
  const oldParentID = oldStudent.parentInfoID;
  console.log(`Old Parent ID: ${oldParentID}`);

  // Delete old records
  await deleteUserFromCognito(username);
  console.log("Deleted user from Cognito.");
  await deleteUserFromDynamoDB(username);
  console.log("Deleted user from DynamoDB.");
  await deleteParentFromDynamoDB(oldParentID);
  console.log("Deleted parent from DynamoDB.");

  // Re-register the user
  await signUpUserToCognito(username, studentData.email, password);
  studentData.parentInfoID = await saveParentToDynamoDB(parentInfo);
  await saveStudentToDynamoDB(studentData, parentInfo);
};

// 1. Get Functions
async function getUserFromCognito(username) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };
  try {
    const user = await cognito.adminGetUser(params).promise();
    return user;
  } catch (error) {
    console.warn(`User not found in Cognito: ${username}`);
    return null;
  }
}

async function getUserFromDynamoDB(username) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: username,
    },
  };
  try {
    const { Item } = await dynamoDB.get(params).promise();
    console.log(`DynamoDB Item: ${JSON.stringify(Item)}`);
    return Item;
  } catch (error) {
    console.error(`Error fetching user from DynamoDB: ${error}`);
    throw error;
  }
}

async function getParentFromDynamoDB(parentID) {
  const params = {
    TableName: PARENT_TABLE,
    Key: {
      id: parentID,
    },
  };
  try {
    const { Item } = await dynamoDB.get(params).promise();
    return Item;
  } catch (error) {
    console.error(`Error fetching parent from DynamoDB: ${error}`);
    throw error;
  }
}

// 2. Delete Functions
async function deleteUserFromCognito(username) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };
  try {
    await cognito.adminDeleteUser(params).promise();
    console.log(`Deleted user from Cognito: ${username}`);
  } catch (error) {
    console.error(`Error deleting user from Cognito: ${error}`);
    throw error;
  }
}

async function deleteUserFromDynamoDB(username) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: username,
    },
  };
  try {
    await dynamoDB.delete(params).promise();
    console.log(`Deleted user from DynamoDB: ${username}`);
  } catch (error) {
    console.error(`Error deleting user from DynamoDB: ${error}`);
    throw error;
  }
}

async function deleteParentFromDynamoDB(parentID) {
  const params = {
    TableName: PARENT_TABLE,
    Key: {
      id: parentID,
    },
  };
  try {
    await dynamoDB.delete(params).promise();
    console.log(`Deleted parent from DynamoDB: ${parentID}`);
  } catch (error) {
    console.error(`Error deleting parent from DynamoDB: ${error}`);
    throw error;
  }
}

// 3. Save Functions
async function signUpUserToCognito(username, email, password) {
  console.log(`Signing up user to Cognito: ${username}, ${email}`);
  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };
  try {
    await cognito.signUp(params).promise();
    console.log(`User signed up to Cognito: ${username}`);
  } catch (error) {
    console.error(`Error signing up user to Cognito: ${error}`);
    throw error;
  }
}

async function saveStudentToDynamoDB(studentData, parentInfo) {
  // Accept parentInfo
  // Ensure all required fields are present
  const requiredFields = ["cpr", "firstName", "lastName", "email"];
  for (const field of requiredFields) {
    if (!studentData[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Assign additional fields
  studentData._version = 1;
  studentData._lastChangedAt = Date.now(); // Timestamp in milliseconds
  const currentTimestamp = new Date().toISOString();
  studentData.createdAt = currentTimestamp;
  studentData.updatedAt = currentTimestamp;
  studentData.m_applicantType = ["STUDENT"];
  studentData.batch = new Date().getFullYear();

  // Assign studentOrderAmongSiblings if provided
  if (parentInfo?.numberOfFamilyMembers !== undefined) {
    studentData.studentOrderAmongSiblings = parentInfo.numberOfFamilyMembers;
  }

  const params = {
    TableName: STUDENT_TABLE,
    Item: studentData,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`Saved student to DynamoDB: ${studentData.cpr}`);
  } catch (error) {
    console.error(`Error saving student to DynamoDB: ${error}`);
    throw error;
  }
}

async function saveParentToDynamoDB(parentInfo) {
  // Renamed to parentInfo
  // Generate a unique ID for the parent if not provided
  parentInfo.id = parentInfo.id || uuid.v4();
  parentInfo._version = 1;
  parentInfo._lastChangedAt = Date.now(); // Timestamp in milliseconds
  const currentTimestamp = new Date().toISOString();
  parentInfo.createdAt = currentTimestamp;
  parentInfo.updatedAt = currentTimestamp;

  const params = {
    TableName: PARENT_TABLE,
    Item: parentInfo,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`Saved parent to DynamoDB: ${parentInfo.id}`);
    return parentInfo.id;
  } catch (error) {
    console.error(`Error saving parent to DynamoDB: ${error}`);
    throw error;
  }
}

// 4. Rollback Function
async function rollback(username) {
  console.log(`Initiating rollback for user: ${username}`);
  try {
    // Delete the user from DynamoDB
    const userExistsDynamoDB = await getUserFromDynamoDB(username);
    if (userExistsDynamoDB) {
      await deleteUserFromDynamoDB(username);
      console.log(`Rolled back DynamoDB entry for: ${username}`);
    }

    // Delete the user from Cognito
    const userExistsCognito = await getUserFromCognito(username);
    if (userExistsCognito) {
      await deleteUserFromCognito(username);
      console.log(`Rolled back Cognito user: ${username}`);
    }
  } catch (error) {
    console.error(`Error during rollback for ${username}: ${error}`);
    // Depending on requirements, you might want to handle this differently
  }
}
