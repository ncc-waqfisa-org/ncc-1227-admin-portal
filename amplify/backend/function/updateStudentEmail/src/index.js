
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


exports.handler = async (event) => {
    console.log(event);

    try {
        const {username, newEmail} = JSON.parse(event.body);

        if(!username || !newEmail) {
            return {
                statusCode: 400,
                body: JSON.stringify('Missing parameters'),
            };
        }

        // simple email validation
        if (!newEmail.includes('@')) {
            return {
                statusCode: 400,
                body: JSON.stringify('Invalid email'),
            };
        }

        // Check if the user exists in DynamoDB
        const userExists = await getUserFromDynamoDB(username);
        if (!userExists) {
            return {
                statusCode: 400,
                body: JSON.stringify('User does not exist.'),
            };
        }

        let token = event.headers.authorization;
        console.log(token);
        // detach the "Bearer " prefix from the token
        token = event.headers.authorization.slice(7);

        // Use cognito to validate the token
        try {
            const cognitoUser = await cognito.getUser({AccessToken: token}).promise();
            console.log(cognitoUser);
            if (cognitoUser.Username !== username) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({
                        error: 'Forbidden',
                        message: 'You are not allowed to update this user'
                    }),
                };
            }
        }
        catch (error) {
            console.error(error);
            return {
                statusCode: 401,
                body: JSON.stringify('Unauthorized'),
            };
        }



            // Update the user's email in Cognito user pool
        await updateUserEmailInCognito(username, newEmail);
        await updateStudentEmail(username, newEmail);


        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            //  headers: {
            //      "Access-Control-Allow-Origin": "*",
            //      "Access-Control-Allow-Headers": "*"
            //  },
            body: JSON.stringify({
                message: 'Email updated successfully',
            }),
        };
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: error.message
            }),
            }
        };
};

async function updateUserEmailInCognito(username, newEmail) {
    const params = {
        UserPoolId: 'us-east-1_ovqLD9Axf',
        Username: username,
        UserAttributes: [
            {
                Name: 'email',
                Value: newEmail,
            },
        ],
    };
    await cognito.adminUpdateUserAttributes(params).promise();
}

async function getUserFromDynamoDB(username) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: username,
        },
    };
    const { Item } = await dynamoDB.get(params).promise();
    return Item !== undefined;
}

async function updateStudentEmail(username, newEmail) {
    const params = {
        TableName: 'Student-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: username,
        },
        UpdateExpression: 'set email = :e',
        ExpressionAttributeValues: {
            ':e': newEmail,
        }
    };
    return dynamoDB.update(params).promise();
}
