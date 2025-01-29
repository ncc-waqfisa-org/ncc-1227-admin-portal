const AWS = require("aws-sdk");

const { UserPoolId: USER_POOL_ID, StudentTable: STUDENT_TABLE } = {
  UserPoolId: "us-east-1_79xE8d6FS",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event) => {
  console.log(event);

  try {
    const { username, newEmail } = JSON.parse(event.body);

    const validationError = validate(username, newEmail);
    if (validationError) {
      return validationError;
    }

    // Check if the user exists in DynamoDB
    const userExists = await getUserFromDynamoDB(username);
    if (!userExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bad Request",
          message: "User does not exist",
        }),
      };
    }

    const token = event.headers.authorization.slice(7);

    // Declare cognitoUser outside the try block
    let cognitoUser;

    // Use Cognito to validate the token
    try {
      cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
      console.log(cognitoUser);
      if (cognitoUser.Username !== username) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            error: "Forbidden",
            message: "You are not allowed to update this user",
          }),
        };
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
          message: "Invalid token",
        }),
      };
    }

    await updateUserEmailInCognito(username, newEmail);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email OTP sent successfully",
        newEmail: newEmail,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};

async function updateUserEmailInCognito(username, newEmail) {
  try {
    console.log("Try to update user with new email: ", username, newEmail);
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: "email",
          Value: newEmail,
        },
      ],
    };
    const response = await cognito.adminUpdateUserAttributes(params).promise();
    console.log("Update response:", response);
  } catch (error) {
    console.error("Detailed error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    console.error(error.message);
    throw error;
  }
}

async function getUserFromDynamoDB(username) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: {
      cpr: username,
    },
  };
  const { Item } = await dynamoDB.get(params).promise();
  return Item !== undefined;
}

function validate(username, newEmail) {
  if (!username || !newEmail) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Bad Request",
        message: "Missing required fields",
      }),
    };
  }

  // Simple email validation
  if (!newEmail.includes("@")) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Bad Request",
        message: "Invalid email",
      }),
    };
  }
}
