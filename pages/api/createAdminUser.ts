import type { NextApiRequest, NextApiResponse } from "next";
import { ISignUpForm } from "../../components/sign-up-form-component";
import {
  AdminRole,
  CreateAdminMutation,
  CreateAdminMutationVariables,
  DeleteAdminMutation,
  DeleteAdminMutationVariables,
} from "../../src/API";
import { createAdmin, deleteAdmin } from "../../src/graphql/mutations";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Amplify } from "aws-amplify";
import {
  AdminCreateUserRequest,
  AdminCreateUserResponse,
  CognitoIdentityProvider,
} from "@aws-sdk/client-cognito-identity-provider";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import awsExports from "../../src/aws-exports";
require("dotenv").config({ path: ".env" });

const credentials: AwsCredentialIdentity = {
  accessKeyId: process.env.CONFIG_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.CONFIG_SECRET_ACCESS_KEY ?? "",
};

Amplify.configure({ ...awsExports, ssr: true });

const aws_cognito = new CognitoIdentityProvider({
  credentials: credentials,
  region: process.env.NCC_AWS_REGION,
});

type Data = {
  createdUser: AdminCreateUserResponse["User"] | undefined;
  error?: any;
};

/**
 * This is an async function that adds an admin to a database and returns a promise with the result of
 * the mutation.
 * @param {string} cpr - The CPR (Central Person Register) is a unique identification number assigned
 * to individuals in Denmark. It is used for various administrative purposes, such as healthcare,
 * taxation, and social security. In this function, it is used as a parameter to identify the admin
 * being added to the database.
 * @param {string} fullName - The full name of the admin being added to the database.
 * @param {string} email - The email parameter is a string that represents the email address of the
 * admin being added to the database.
 * @param {AdminRole | null | undefined} role - The `role` parameter is of type `AdminRole | null |
 * undefined`. It represents the role of the admin being added to the database. `AdminRole` is an enum
 * that defines the possible roles an admin can have, such as `SUPER_ADMIN`, `ADMIN`, or
 * `READ_ONLY_ADMIN
 * @returns a Promise that resolves to a CreateAdminMutation or undefined.
 */
async function addAdminToDB(
  cpr: string,
  fullName: string,
  email: string,
  role: AdminRole | null | undefined
): Promise<CreateAdminMutation | undefined> {
  let queryInput: CreateAdminMutationVariables = {
    input: {
      cpr: cpr,
      fullName: fullName,
      email: email,
      role: role,
      _version: undefined,
    },
  };
  let res = (await Amplify.API.graphql({
    query: createAdmin,
    variables: queryInput,
  })) as GraphQLResult<CreateAdminMutation>;
  return res.data;
}
/**
 * This is an async function that deletes an admin from a database using GraphQL.
 * @param {string} cpr - The "cpr" parameter is likely an abbreviation for "Central Person Register",
 * which is a unique identification number assigned to individuals in Denmark. In this context, it is
 * likely being used as a unique identifier for an admin user in a database.
 * @param {number} version - The `version` parameter is a number that represents the version of the
 * data that is being deleted. This is used to ensure that the correct version of the data is being
 * deleted and to prevent conflicts with other changes that may have been made to the data since it was
 * last retrieved.
 * @returns a boolean value that indicates whether the deletion of an admin from a database was
 * successful or not.
 */
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
  let res = (await Amplify.API.graphql({
    query: deleteAdmin,
    variables: queryInput,
  })) as GraphQLResult<DeleteAdminMutation>;
  return res.data?.deleteAdmin != null;
}

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */
/**
 * This is an async function that handles a POST request to create a new user in AWS Cognito and add
 * their information to a database.
 * @param {NextApiRequest} req - `req` is an object that represents the incoming HTTP request in a
 * Next.js API route. It contains information such as the HTTP method, headers, and body of the
 * request.
 * @param res - `res` is an object of type `NextApiResponse<Data>`. It is the response object that will
 * be sent back to the client. It contains methods to set the status code, headers, and body of the
 * response. The `Data` type is a generic type that represents the type of data
 * @returns a response to the client based on the outcome of a POST request. If the request is
 * successful, it returns a JSON object with the created user's information and a status code of 200.
 * If there is an error, it returns a JSON object with an error message and a status code of 500.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    let signUpValues: ISignUpForm = req.body as ISignUpForm;

    const cognitoParams: AdminCreateUserRequest = {
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
    try {
      return await addAdminToDB(
        signUpValues.cpr,
        signUpValues.fullName,
        signUpValues.email,
        signUpValues.role
      )
        .then(async (createdDbAdmin) => {
          return await signUpCommand
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
