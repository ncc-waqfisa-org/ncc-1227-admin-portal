import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import SignUpFormComponent from "../../components/sign-up-form-component";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "users",
        "pageTitles",
        "signIn",
        "errors",
      ])),
    },
  };
};

const AddUsers = () => {
  const { t } = useTranslation("users");
  return (
    <div>
      <Toaster />
      <SignUpFormComponent></SignUpFormComponent>
    </div>
  );
};

export default AddUsers;
