// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { API } from "aws-amplify";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { ISignUpForm } from "../../components/sign-up-form-component";
import {
  CreateAdminMutation,
  CreateAdminMutationVariables,
  GetAdminQuery,
} from "../../src/API";
import aws from "../../src/aws-exports";

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

// async function getAdminUser(cpr: string): Promise<GetAdminQuery | undefined> {
//   const cognitoParams: AWS.CognitoIdentityServiceProvider.AdminGetUserRequest =
//     { Username: cpr, UserPoolId: aws.aws_user_pools_id };

// }

async function setAdminUserPassword(password: string, userName: string) {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    let signUpValues: ISignUpForm = JSON.parse(req.body);

    try {
    } catch (err) {
      console.log(err);
      return res.status(500).json({ createdUser: undefined, error: err });
    }
  }
}
