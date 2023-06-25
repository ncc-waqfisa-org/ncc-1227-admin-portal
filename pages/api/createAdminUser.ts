// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { API, graphqlOperation } from "aws-amplify";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

import {
  AdminRole,
  CreateAdminMutation,
  CreateAdminMutationVariables,
  DeleteAdminMutation,
  DeleteAdminMutationVariables,
} from "../../src/API";
import { createAdmin, deleteAdmin } from "../../src/graphql/mutations";
import { GraphQLResult } from "@aws-amplify/api-graphql";

require("dotenv").config({ path: ".env" });

type Data = {
  createdUser: AWS.CognitoIdentityServiceProvider.UserType | undefined;
  error?: any;
};

AWS.config.update({
  accessKeyId: process.env.CONFIG_ACCESS_KEY_ID,
  secretAccessKey: process.env.CONFIG_SECRET_ACCESS_KEY,
  region: process.env.NCC_AWS_REGION,
});

const aws_cognito = new AWS.CognitoIdentityServiceProvider();

async function addAdminToDB(
  cpr: string,
  fullName: string,
  email: string,
  role: string
) {
  const query = `
  mutation MyMutation {
    createAdmin(input: {cpr: "${cpr}", role: ${role}, fullName: "${fullName}", email: "${email}"}) {
      cpr
      fullName
      email
      role
      _deleted
      _version
    }
  }`;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  return res.data?.createAdmin;
}

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      let signUpValues = JSON.parse(req.body);
      const cognitoParams: AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest =
        {
          UserPoolId: process.env.NCC_AWS_USER_POOL ?? "",
          UserAttributes: [
            {
              Name: "email",
              Value: signUpValues.email,
            },
            {
              Name: "email_verified",
              Value: "True",
            },
          ],
          Username: signUpValues.cpr,
        };

      const signUpCommand = aws_cognito.adminCreateUser(cognitoParams);

      return await addAdminToDB(
        signUpValues.cpr,
        signUpValues.fullName,
        signUpValues.email,
        signUpValues.role
      )
        .then(async (createdDbAdmin) => {
          return await signUpCommand
            .promise()
            .then(async (createdUser) => {
              return res.status(200).json({ createdUser: createdUser.User });
            })
            .catch(async (err) => {
              await deleteAdminFromDB(
                signUpValues.cpr,
                createdDbAdmin?.createAdmin?._version ?? 1
              );
              return res
                .status(500)
                .json({ createdUser: undefined, error: err });
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ createdUser: undefined, error: err });
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ createdUser: undefined, error: err });
    }
  }
}
