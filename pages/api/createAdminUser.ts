// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { API } from "aws-amplify";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { ISignUpForm } from "../../components/sign-up-form-component";
import {
  CreateAdminMutation,
  CreateAdminMutationVariables,
  DeleteAdminMutation,
  DeleteAdminMutationVariables,
} from "../../src/API";
import aws from "../../src/aws-exports";
import { createAdmin, deleteAdmin } from "../../src/graphql/mutations";
import { GraphQLResult } from "@aws-amplify/api-graphql";

type Data = {
  createdUser: AWS.CognitoIdentityServiceProvider.UserType | undefined;
  error?: any;
};

AWS.config.update({
  accessKeyId: process.env.CONFIG_ACCESS_KEY_ID,
  secretAccessKey: process.env.CONFIG_SECRET_ACCESS_KEY,
  region: aws.aws_project_region,
});

const aws_cognito = new AWS.CognitoIdentityServiceProvider();

async function addAdminToDB(
  cpr: string,
  fullName: string,
  email: string
): Promise<CreateAdminMutation | undefined> {
  let queryInput: CreateAdminMutationVariables = {
    input: {
      cpr: cpr,
      fullName: fullName,
      email: email,
      _version: undefined,
    },
  };

  let res = (await API.graphql({
    query: createAdmin,
    variables: queryInput,
  })) as GraphQLResult<CreateAdminMutation>;

  return res.data;
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
    let signUpValues: ISignUpForm = JSON.parse(req.body);
    const cognitoParams: AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest =
      {
        UserPoolId: aws.aws_user_pools_id,
        UserAttributes: [
          {
            Name: "email",
            Value: signUpValues.email,
          },
        ],
        Username: signUpValues.cpr,
      };

    const signUpCommand = aws_cognito.adminCreateUser(cognitoParams);

    try {
      return await addAdminToDB(
        signUpValues.cpr,
        signUpValues.fullName,
        signUpValues.email
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
