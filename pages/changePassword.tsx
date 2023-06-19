import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { Toaster } from "react-hot-toast";
import ChangePasswordFormComponent from "../components/change-password-form-component";

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

const ChangePassword = () => {
  return (
    <div className=" h-screen flex justify-center items-center">
      <Toaster />
      <ChangePasswordFormComponent></ChangePasswordFormComponent>
    </div>
  );
};

export default ChangePassword;
