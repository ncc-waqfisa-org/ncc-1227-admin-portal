const AWS = require("aws-sdk");

const { UserPoolId: USER_POOL_ID, StudentTable: STUDENT_TABLE } = {
  UserPoolId: "us-east-1_79xE8d6FS",
  StudentTable: "Student-q4lah3ddkjdd3dwtif26jdkx6e-masterdev",
};

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  try {
    // Validate event and headers
    if (!event || !event.headers || !event.headers.authorization) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bad Request",
          message: "Authorization header is missing",
        }),
      };
    }

    // Extract token from Authorization header
    const token = event.headers.authorization.slice(7);
    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bad Request",
          message: "Invalid or missing token in Authorization header",
        }),
      };
    }

    // Validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bad Request",
          message: "Request body is missing",
        }),
      };
    }

    let otp;
    try {
      // Parse and validate OTP from the request body
      const body = JSON.parse(event.body);
      otp = body.otp;
      if (!otp) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Bad Request",
            message: "OTP is missing in the request body",
          }),
        };
      }
    } catch (parseError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bad Request",
          message: "Invalid JSON in request body",
        }),
      };
    }

    // Get the older version of cognito
    const cognitoUser = await cognito.getUser({ AccessToken: token }).promise();
    const username = cognitoUser.Username;

    // Verify the OTP
    const verifyParams = {
      AccessToken: token,
      AttributeName: "email",
      Code: otp,
    };

    await cognito.verifyUserAttribute(verifyParams).promise();

    // Get the new email from Cognito
    const emailAttr = cognitoUser.UserAttributes.find(
      (attr) => attr.Name === "email"
    );
    const newEmail = emailAttr.Value;

    console.log(`The new email from cognito (unverified one) ${newEmail}`);

    // pass to dynmodb
    await updateStudentEmail(username, newEmail);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email verified successfully",
        email: newEmail,
      }),
    };
  } catch (error) {
    console.error("Error verifying email:", error);

    if (error.code === "CodeMismatchException") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Bad Request",
          message: "Invalid OTP code",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};

async function updateStudentEmail(cpr, newEmail) {
  const params = {
    TableName: STUDENT_TABLE,
    Key: { cpr },
    UpdateExpression: "SET email = :e, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":e": newEmail,
      ":updatedAt": new Date().toISOString(),
    },
  };

  try {
    return await dynamoDB.update(params).promise();
  } catch (error) {
    console.error(`Update error: ${error.message}`);
    throw error; // Re-throw to maintain promise rejection
  }
}
