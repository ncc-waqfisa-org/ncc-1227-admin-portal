import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Toaster } from "react-hot-toast";
import SignUpFormComponent from "../../../components/sign-up-form-component";
import { GetServerSideProps } from "next";
import { Admin } from "../../../src/API";
import { useRouter } from "next/router";
import { getAdminByCPR } from "../../../src/CustomAPI";
import { FC } from "react";

interface Props {
  admin: Admin | undefined;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const { cpr } = query;

  const admin = await getAdminByCPR(cpr as string);

  const { locale } = ctx;
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "users",
        "pageTitles",
        "signIn",
        "common",
        "errors",
      ])),
      admin: admin,
    },
  };
};

const EditUsers: FC<Props> = ({ admin }) => {
  return (
    <div>
      <Toaster />
      <SignUpFormComponent admin={admin}></SignUpFormComponent>
    </div>
  );
};

export default EditUsers;
