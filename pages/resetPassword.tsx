import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { Toaster } from "react-hot-toast";
import ResetPasswordFormComponent from "../components/reset-password-form-component";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "pageTitles",
        "signIn",
        "changePassword",
        "errors",
        "common",
      ])),
    },
  };
};

const ResetPassword = () => {
  const { push } = useRouter();
  const { t } = useTranslation("pageTitles");
  function goBack() {
    push("/");
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <Toaster />
      <ResetPasswordFormComponent></ResetPasswordFormComponent>

      <button className="btn btn-ghost absolute top-4 left-4" onClick={goBack}>
        {t("Back")}
      </button>
    </div>
  );
};

export default ResetPassword;
