const AWS = require('aws-sdk');
const {ConfidentialClientApplication} = require("@azure/msal-node");

const clientSecret = process.env.AZURE_APP_SECRET;
const clientId = process.env.AZURE_APP_ID;

const tenantId = process.env.AZURE_TENANT_ID;

const aadEndpoint =
    process.env.AAD_ENDPOINT || "https://login.microsoftonline.com";
const graphEndpoint =
    process.env.GRAPH_ENDPOINT || "https://graph.microsoft.com";

const nodeAuth = {
    clientId: clientId,
    clientSecret: clientSecret,
    authority: `${aadEndpoint}/${tenantId}`,
};

const msalConfig = {
    auth: nodeAuth,
};

const tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const logo =
        "https://res.cloudinary.com/dedap3cb9/image/upload/v1688627927/logos/nccEmailLogo_mjrwyk.png";
    const email = event.body;
    const cca = new ConfidentialClientApplication(msalConfig);
    const tokenInfo = await cca.acquireTokenByClientCredential(tokenRequest);
    const headers = new Headers();
    const bearer = `Bearer ${tokenInfo?.accessToken}`;
    headers.append("Authorization", bearer);
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
        message: {
            subject: "Waqf Isa Application Submission",
            body: {
                contentType: "HTML",
                content: `
                <img src="${logo}" alt="NCC Logo" style="width: 100px; height: 100px;"/>
                <p>Thank you for submitting your application to NCC. We will review your application and get back to you shortly.</p>
                `,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: email,
                    },
                },
            ],
        },
        saveToSentItems: "false",
    });

    const options = {
        method: "POST",
        headers,
        body,
    };

    const response = await fetch(`${graphEndpoint}/v1.0/me/sendMail`, options);

    return {
        statusCode: response.status,
        body: JSON.stringify({ message: "Email sent" }),
    };



};
