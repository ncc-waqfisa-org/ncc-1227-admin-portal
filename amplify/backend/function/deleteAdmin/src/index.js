const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const token = event.headers?.authorization?.slice(7);
    const isSuperAdmin = await checkIsSuperAdmin(token);
    if (!isSuperAdmin) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden. You are not a super admin' })
        };
    }
    // validate body
    const body = JSON.parse(event.body);
    if (!body.username) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Username is required' })
        };
    }
    // check if the user to delete is not a super admin
    const isNotSuperAdmin = await checkToDeleteAdminIsNotSuperAdmin(body.username);
    if (!isNotSuperAdmin) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Cannot delete super admin' })
        };
    }
    // delete admin
    const result = await deleteAdmin(body.username);
    if (result) {
        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Admin deleted successfully'})
        };
    }
    else {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Error deleting admin'})
        };
    }


    console.log(`EVENT: ${JSON.stringify(event)}`);
};

async function checkIsSuperAdmin(token) {
    // get the username from the token using cognito
    try {
        const cognitoUser = await cognito.getUser({AccessToken: token}).promise();
        const username = cognitoUser.Username;

        const params = {
            TableName: 'Admin-cw7beg2perdtnl7onnneec4jfa-staging',
            Key: {
                cpr: username
            }
        };
        const {Item} = await dynamoDB.get(params).promise();
        return Item && Item.role == "SUPER_ADMIN";
    } catch (error) {
        console.error('Error checking if user is admin', error);
        return false;
    }
}

async function deleteAdmin(username) {
    const params = {
        TableName: 'Admin-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: username
        }
    };
    try {
        await dynamoDB.delete(params).promise();
        return true;
    }
    catch (error) {
        console.error('Error deleting admin', error);
        return false;
    }
}

async function checkToDeleteAdminIsNotSuperAdmin(username) {
    const params = {
        TableName: 'Admin-cw7beg2perdtnl7onnneec4jfa-staging',
        Key: {
            cpr: username
        }
    };
    try {
        const {Item} = await dynamoDB.get(params).promise();
        return Item && Item.role !== "SUPER_ADMIN";
    }
    catch (error) {
        console.error('Error checking if user is super admin', error);
        return false;
    }
}
