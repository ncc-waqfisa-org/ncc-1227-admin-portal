import { GetServerSideProps, GetStaticProps } from "next";
import { PageComponent } from "../../components/page-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import StudentsPageComponent from "../../components/students-page-component";
import { FC } from "react";
import { listAllBahrainUniversities } from "../../src/CustomAPI";
import { BahrainUniversities } from "../../src/API";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const universities = await listAllBahrainUniversities();

  return {
    props: {
      universities,
      ...(await serverSideTranslations(locale ?? "en", [
        "applications",
        "applicationLog",
        "pageTitles",
        "signIn",
        "common",
        "errors",
        "account",
      ])),
    },
  };
};

const StudentsPage = ({
  universities,
}: {
  universities: BahrainUniversities[];
}) => {
  const { t: tPageTitles } = useTranslation("common");
  return (
    <PageComponent title={tPageTitles("Students")}>
      <StudentsPageComponent
        universities={universities}
      ></StudentsPageComponent>
    </PageComponent>
  );
};

export default StudentsPage;
