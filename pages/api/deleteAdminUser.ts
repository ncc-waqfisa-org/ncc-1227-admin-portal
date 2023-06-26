// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { API } from "aws-amplify";
import type { NextApiRequest, NextApiResponse } from "next";

import {
  DeleteAdminMutation,
  DeleteAdminMutationVariables,
} from "../../src/API";
import { deleteAdmin } from "../../src/graphql/mutations";
import { GraphQLResult } from "@aws-amplify/api-graphql";

// require("dotenv").config({ path: ".env" });

// AWS.config.update({
//   accessKeyId: process.env.CONFIG_ACCESS_KEY_ID,
//   secretAccessKey: process.env.CONFIG_SECRET_ACCESS_KEY,
//   region: process.env.NCC_AWS_REGION,
// });

// const aws_cognito = new AWS.CognitoIdentityServiceProvider();

async function deleteAdminFromDB(
  cpr: string,
  version: number
): Promise<boolean> {
  let queryInput: DeleteAdminMutationVariables = {
    input: {
      cpr: cpr,
      _version: version,
    },
  };

  let res = (await API.graphql({
    query: deleteAdmin,
    variables: queryInput,
  })) as GraphQLResult<DeleteAdminMutation>;

  return res.data?.deleteAdmin != null;
}

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */

interface RequestData {
  cpr: string;
  _version: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      let requestData: RequestData = JSON.parse(req.body) as RequestData;

      await deleteAdminFromDB(requestData.cpr, requestData._version)
        .then((value) => {
          if (value) {
            return res.status(200).json({ success: true });
          } else {
            return res.status(500).json({ success: false });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ success: false, error: error });
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, error: err });
    }
  }
}
