import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { Toaster } from "react-hot-toast";
import ResetPasswordFormComponent from "../components/reset-password-form-component";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "pageTitles",
        "signIn",
        "changePassword",
      ])),
    },
  };
};

const ResetPassword = () => {
  return (
    <div className=" h-screen flex justify-center items-center">
      <Toaster />
      <ResetPasswordFormComponent></ResetPasswordFormComponent>
    </div>
  );
};

export default ResetPassword;
