import { useRouter } from "next/router";
import React from "react";
import { Toaster } from "react-hot-toast";
import { PageComponent } from "../../../components/page-component";
import { GetServerSideProps } from "next";
import { getUniversityByID } from "../../../src/CustomAPI";
import { University } from "../../../src/API";
import UniversityFormComponent from "../../../components/university-form-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

interface Props {
  getUni: University | undefined;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  const getUni = await getUniversityByID(`${id}`);
  return {
    props: {
      getUni,
      ...(await serverSideTranslations(locale ?? "en", [
        "education",
        "pageTitles",
        "signIn",
        "errors",
      ])),
    },
  };
};

export default function UniversityInfo({ getUni }: Props) {
  const router = useRouter();

  const { id } = router.query;
  const { t } = useTranslation("education");

  return (
    <div>
      <PageComponent title={"UniversityInfo"}>
        <Toaster />
        <div className="mb-8 ">
          <div className="text-2xl font-semibold ">{t("universityTitle")}</div>
          <div className="text-base font-medium text-gray-500 ">ID - {id}</div>
        </div>

        <UniversityFormComponent university={getUni}></UniversityFormComponent>
      </PageComponent>
    </div>
  );
}
