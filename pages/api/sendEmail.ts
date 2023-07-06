import type { NextApiRequest, NextApiResponse } from "next";
import { Status } from "../../src/API";
import NextCors from "nextjs-cors";
import {
  Configuration,
  NodeAuthOptions,
  ConfidentialClientApplication,
} from "@azure/msal-node";

import {
  nccApprovedEmailTemplate,
  nccRejectedEmailTemplate,
} from "../../src/ncc-email-templates";

export interface ISendEmail {
  status: Status.APPROVED | Status.REJECTED | undefined;
  email: string | undefined;
  studentName: string | undefined;
  id: string;
}

// * Use These Azure App credentials for localhost:3000
// const clientSecret = process.env.AZURE_APP_SECRET_LOCAL;
// const clientId = process.env.AZURE_APP_ID_LOCAL;

const clientSecret = process.env.AZURE_APP_SECRET;
const clientId = process.env.AZURE_APP_ID;

const tenantId = process.env.AZURE_TENANT_ID;

const aadEndpoint =
  process.env.AAD_ENDPOINT || "https://login.microsoftonline.com";
const graphEndpoint =
  process.env.GRAPH_ENDPOINT || "https://graph.microsoft.com";

const nodeAuth: NodeAuthOptions = {
  clientId: clientId ?? "",
  clientSecret,
  authority: aadEndpoint + "/" + tenantId,
};

const msalConfig: Configuration = {
  auth: nodeAuth,
};

const tokenRequest = {
  scopes: [graphEndpoint + "/.default"],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const logo =
    "https://res.cloudinary.com/dedap3cb9/image/upload/v1688627927/logos/nccEmailLogo_mjrwyk.png";

  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "https://admin.waqfisa.bh",
    optionsSuccessStatus: 200,
  });

  const cca = new ConfidentialClientApplication(msalConfig);
  const tokenInfo = await cca.acquireTokenByClientCredential(tokenRequest);

  let data = JSON.parse(req.body);
  console.log(data);

  try {
    if (data === null || data === undefined) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to send an email to the given user. Please try again later.",
      });
    }

    if (data !== null) {
      if (data.status === undefined) {
        return res
          .status(500)
          .json({ success: false, message: "Application status is unknown." });
      }
      const headers = new Headers();
      const bearer = `Bearer ${tokenInfo?.accessToken}`;

      headers.append("Authorization", bearer);
      headers.append("Content-Type", "application/json");

      if (data.status === Status.REJECTED) {
        const mail = {
          subject: "A decision was made with your application",
          from: {
            emailAddress: {
              address: process.env.OUTLOOK_USERNAME,
            },
          },
          toRecipients: [
            {
              emailAddress: {
                address: data.email,
              },
            },
          ],
          body: {
            contentType: "html",
            content: nccRejectedEmailTemplate(logo, data.studentName),
          },
        };

        const options = {
          method: "POST",
          headers,
          body: JSON.stringify({ message: mail, saveToSentItems: false }),
        };

        await fetch(
          graphEndpoint +
            `/v1.0/users/${process.env.OUTLOOK_USERNAME}/sendMail`,
          options
        )
          .then((sendResponse) => {
            if (sendResponse.status === 200) {
              res.status(200).json({ success: true });
            } else {
              res.status(500).json({ success: false, message: sendResponse });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
          });
      }

      if (data.status === Status.APPROVED) {
        const mail = {
          subject: "A decision was made with your application",
          from: {
            emailAddress: {
              address: process.env.OUTLOOK_USERNAME,
            },
          },
          toRecipients: [
            {
              emailAddress: {
                address: data.email,
              },
            },
          ],
          body: {
            contentType: "html",
            content: nccApprovedEmailTemplate(logo, data.studentName),
          },
        };

        const options = {
          method: "POST",
          headers,
          body: JSON.stringify({ message: mail, saveToSentItems: false }),
        };

        await fetch(
          graphEndpoint +
            `/v1.0/users/${process.env.OUTLOOK_USERNAME}/sendMail`,
          options
        )
          .then((sendResponse) => {
            if (sendResponse.status === 200) {
              res.status(200).json({ success: true });
            } else {
              res.status(500).json({ success: false, message: sendResponse });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
          });
      }
    } else {
      res.status(500).json({
        success: false,
        message:
          "Failed to send an email to the given user. Please try again later.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: (err as any).toString() });
  }
}
