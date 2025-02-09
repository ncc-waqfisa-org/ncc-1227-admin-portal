const AWS = require("aws-sdk");

// Initialize AWS Services
const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * Resend OTP Handler
 *
 * This function resends the email verification OTP to users who have confirmed their sign-up
 * but have not yet verified their email. It uses the Cognito Access Token provided in the
 * Authorization header to fetch user details, checks the verification status, and resends the
 * OTP if necessary.
 *
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    // Step 1: Validate Event and Headers
    if (!event || !event.headers) {
      return createResponse(
        400,
        "Bad Request",
        "Missing headers in the request"
      );
    }

    const authHeader =
      event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return createResponse(
        400,
        "Bad Request",
        "Authorization header is missing"
      );
    }

    // Extract Token from Authorization Header
    const tokenPrefix = "Bearer ";
    if (!authHeader.startsWith(tokenPrefix)) {
      return createResponse(
        400,
        "Bad Request",
        "Invalid Authorization header format"
      );
    }

    const token = authHeader.slice(tokenPrefix.length).trim();
    if (!token) {
      return createResponse(
        400,
        "Bad Request",
        "Invalid or missing token in Authorization header"
      );
    }

    // Step 2: Retrieve User Information from Cognito
    let cognitoUser;
    try {
      const params = {
        AccessToken: token,
      };
      const response = await cognito.getUser(params).promise();
      cognitoUser = response;
    } catch (cognitoError) {
      console.error("Error fetching user from Cognito:", cognitoError);
      if (
        cognitoError.code === "NotAuthorizedException" ||
        cognitoError.code === "UserNotFoundException"
      ) {
        return createResponse(401, "Unauthorized", "Invalid or expired token");
      }
      throw cognitoError; // Propagate other errors
    }

    // Step 3: Check if User's Email is Verified
    const emailVerifiedAttr = cognitoUser.UserAttributes.find(
      (attr) => attr.Name === "email_verified"
    );

    if (emailVerifiedAttr && emailVerifiedAttr.Value === "true") {
      // Email is already verified; do not resend OTP
      return createResponse(400, "Bad Request", "Email is already verified");
    } else {
      // Email is not verified; resend email verification code
      try {
        const verificationParams = {
          AccessToken: token,
          AttributeName: "email",
        };
        await cognito
          .getUserAttributeVerificationCode(verificationParams)
          .promise();

        return createResponse(
          200,
          "OK",
          "Verification code resent successfully"
        );
      } catch (verificationError) {
        console.error(
          "Error resending email verification code:",
          verificationError
        );
        // Handle specific Cognito errors
        if (verificationError.code === "LimitExceededException") {
          return createResponse(
            429,
            "Too Many Requests",
            "Resend limit exceeded. Please try again later."
          );
        }
        throw verificationError; // Propagate other errors
      }
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return createResponse(500, "Internal Server Error", error.message);
  }
};

/**
 * Helper Function to Create HTTP Responses
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error type or status text
 * @param {string} message - Detailed message
 * @returns {object} - HTTP response object
 */
function createResponse(statusCode, error, message) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify({
      error,
      message,
    }),
  };
}
