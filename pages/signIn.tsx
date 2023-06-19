import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { PageComponent } from "../components/page-component";
import SignInFormComponent from "../components/sign-in-form-component";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "signIn",
        "pageTitles",
        "errors",
      ])),
    },
  };
};

const SignInPage = () => {
  // const { t } = useTranslation("signIn");

  return (
    <PageComponent title={"Sign In"}>
      <Toaster />
      <SignInFormComponent></SignInFormComponent>
    </PageComponent>
  );
};

export default SignInPage;
