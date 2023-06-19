import { GetStaticProps } from "next";
import { PageComponent } from "../../components/page-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import StudentsPageComponent from "../../components/students-page-component";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "applications",
        "applicationLog",
        "pageTitles",
        "signIn",
        "common",
        "errors",
      ])),
    },
  };
};

const StudentsPage = () => {
  const { t: tPageTitles } = useTranslation("common");
  return (
    <PageComponent title={tPageTitles("Students")}>
      <StudentsPageComponent></StudentsPageComponent>
    </PageComponent>
  );
};

export default StudentsPage;
