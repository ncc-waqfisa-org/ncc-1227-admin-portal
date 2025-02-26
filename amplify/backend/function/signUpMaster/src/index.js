/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const uuid = require("uuid");

// Make sure to replace these values with your actual IDs/Table names
const {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
  StudentTable: STUDENT_TABLE,
  AdminTable: ADMIN_TABLE,
} = {
  UserPoolId: "us-east-1_ovqLD9Axf",
  ClientId: "1q8g817vj439ucaig2uon92q86",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
  AdminTable: "Admin-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`Event Boday Recived ${event.body}`);

  try {
    // Parse the request body. We expect a single JSON object with all fields at the top-level.
    const requestBody = JSON.parse(event.body);

    /*******************************************************
     * STEP 1: Basic validations: Ensure required fields exist
     *******************************************************/
    if (!requestBody?.cpr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "CPR is required" }),
      };
    }
    if (!requestBody?.password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Password is required" }),
      };
    }

    // NEW: Before processing, check if the provided CPR exists as an admin.
    const trimmedCpr = requestBody.cpr.trim();
    const adminExists = await checkIfCprIsAdmin(trimmedCpr);
    if (adminExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "This CPR belongs to an admin. Registration is not allowed.",
        }),
      };
    }

    /*******************************************************
     * STEP 2: Create a field map from incoming keys → GraphQL schema keys
     *******************************************************/
    const fieldMap = {
      cpr_doc: "cprDoc",
      first_name: "m_firstName",
      second_name: "m_secondName",
      last_name: "m_lastName",
      third_name: "m_thirdName", // Changed from m_thirdName to thirdName
      number_of_family_member: "m_numberOfFamilyMembers",
      graduation_year: "m_graduationYear",
      universityID: "m_universityID",
      old_program: "m_oldProgram",
      isEmployed: "m_isEmployeed",
      place_of_employment: "m_placeOfEmployment",
      income: "m_income",
      income_doc: "m_incomeDoc",
      guardian_cpr: "m_guardianCPR",
      guardian_full_name: "m_guardianFullName",
      guardian_cpr_doc: "m_guardianCPRDoc",
      nationality: "nationalityCategory",
      guardian_first_name: "m_guardianFirstName",
      guardian_second_name: "m_guardianSecondName",
      guardian_third_name: "m_guardianThirdName",
      guardian_last_name: "m_guardianLastName",
      guardian_email: "m_guardianEmail",
      guardian_address: "m_guardianAddress",
    };

    /*******************************************************
     * STEP 3: Transform incoming data into Student schema shape
     *******************************************************/
    const studentData = {
      // Fields that don't need renaming:
      cpr: trimmedCpr,
      email: requestBody.email?.trim() || null,
      phone: requestBody.phone?.trim() || null,
      gender: requestBody.gender,
      placeOfBirth: requestBody.place_of_birth?.trim() || null,
      nationality: requestBody.nationality?.trim() || null,
      address: requestBody.address?.trim() || null,
      dob: requestBody.dob?.trim() || null, // Added dob field
    };

    // Copy fields using the fieldMap
    Object.entries(fieldMap).forEach(([incomingKey, schemaKey]) => {
      if (requestBody[incomingKey] !== undefined) {
        const val = requestBody[incomingKey];
        studentData[schemaKey] = typeof val === "string" ? val.trim() : val;
      }
    });

    // Hardcode applicant type as "MASTER" in your data:
    studentData.m_applicantType = ["MASTER"];

    // Store password separately (not in camoDB)
    const password = requestBody.password?.trim();

    /*******************************************************
     * STEP 4: Validate the presence of required fields for Master students
     *******************************************************/
    const requiredFieldsForMaster = [
      "cpr",
      "m_firstName",
      "m_secondName",
      "m_lastName",
      "m_guardianCPR",
      "m_income",
      "m_incomeDoc",
    ];

    const missingFields = requiredFieldsForMaster.filter(
      (field) => !studentData[field] && studentData[field] !== false
    );

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Missing required field(s): ${missingFields.join(", ")}`,
        }),
      };
    }

    // For Cognito username, we will use CPR
    const username = studentData.cpr;

    /*******************************************************
     * STEP 5: Check if user already exists in Cognito
     *******************************************************/
    const existingUser = await getUserFromCognito(username);
    const userExists = !!existingUser;

    if (userExists) {
      // If user is verified in Cognito, disallow
      const emailVerifiedAttr = existingUser.UserAttributes.find(
        (attr) => attr.Name === "email_verified"
      );
      if (emailVerifiedAttr?.Value === "true") {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "User already exists" }),
        };
      } else {
        // If user is unverified, delete them from both Cognito & Dynamo to recreate
        await deleteUserFromCognito(username);
        await deleteUserFromDynamoDB(username);
      }
    }

    /*******************************************************
     * STEP 6: Insert the record into DynamoDB
     *******************************************************/
    const now = new Date();
    studentData._version = 1;
    studentData._lastChangedAt = now.getTime();
    studentData.createdAt = now.toISOString();
    studentData.updatedAt = now.toISOString();
    studentData.batch = now.getFullYear();

    await saveStudentToDynamoDB(studentData);

    /*******************************************************
     * STEP 7: Sign up user in Cognito with password & optional email
     *******************************************************/
    await signUpUserToCognito(username, studentData.email, password);

    /*******************************************************
     * STEP 8: Return success response
     *******************************************************/
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Master student created successfully" }),
    };
  } catch (error) {
    console.error("ERROR:", error);

    // Rollback if partial insertion happened
    try {
      const parsedBody = JSON.parse(event.body);
      if (parsedBody && parsedBody.cpr) {
        await rollback(parsedBody.cpr);
      }
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

/*******************************************************
 *                     HELPERS                         *
 *******************************************************/
/**
 * Checks Cognito for a user. Returns user if found, false if not found/404.
 */
async function getUserFromCognito(username) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };
  try {
    return await cognito.adminGetUser(params).promise();
  } catch (error) {
    // If user doesn't exist or is not found, Cognito throws an error
    // We can safely return false here
    return false;
  }
}

/**
 * Deletes user from Cognito
 */
async function deleteUserFromCognito(username) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };
  await cognito.adminDeleteUser(params).promise();
}

/**
 * Deletes user from DynamoDB by CPR
 */
async function deleteUserFromDynamoDB(username) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr: username },
  };
  await dynamoDB.delete(params).promise();
}

/**
 * Saves a student record to your DynamoDB table
 */
async function saveStudentToDynamoDB(studentData) {
  const params = {
    TableName: STUDENT_TABLE,
    Item: studentData,
  };
  await dynamoDB.put(params).promise();
}

/**
 * Signs up user in Cognito using provided username, email, and password
 */
async function signUpUserToCognito(username, email, password) {
  // Build user attributes array
  const userAttributes = [];
  if (email) {
    userAttributes.push({ Name: "email", Value: email });
  }

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: userAttributes,
  };
  await cognito.signUp(params).promise();
}

/**
 * Gets a user from DynamoDB by CPR
 */
async function getUserFromDynamoDB(username) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr: username },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item;
}

/**
 * Rollback logic: removes user from DynamoDB and Cognito if they exist
 */
async function rollback(username) {
  // Check if DynamoDB user exists
  const userExistsDynamoDB = await getUserFromDynamoDB(username);
  if (userExistsDynamoDB) {
    await dynamoDB
      .delete({
        TableName: STUDENT_TABLE,
        Key: { cpr: username },
      })
      .promise();
  }

  // Check if Cognito user exists
  const userExistsCognito = await getUserFromCognito(username);
  if (userExistsCognito) {
    await cognito
      .adminDeleteUser({
        UserPoolId: USER_POOL_ID,
        Username: username,
      })
      .promise();
  }
}

// NEW: Helper to check whether the provided CPR exists as an admin.
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
