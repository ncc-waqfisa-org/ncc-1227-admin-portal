import { Amplify, API, Auth, Storage } from "aws-amplify";
import { Auth as atAuth } from "@aws-amplify/auth";
import atAPIG from "@aws-amplify/api-graphql";
import config from "../src/aws-exports";

const awsConfig = {
  ...config,
  ssr: true,
  aws_cognito_identity_pool_id:
    process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  aws_user_files_s3_bucket: process.env.NEXT_PUBLIC_AWS_USER_FILES_S3_BUCKET,
};

export const initializeAwsConfig = () => {
  Amplify.configure(awsConfig);
  Auth.configure(awsConfig);
  API.configure(awsConfig);
  Storage.configure(awsConfig);
  atAuth.configure(awsConfig);
  atAPIG.configure(awsConfig);
};
