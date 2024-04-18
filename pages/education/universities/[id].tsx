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
  university: University | null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  const university = id ? await getUniversityByID(`${id}`) : null;

  return {
    props: {
      university: university,
      ...(await serverSideTranslations(locale ?? "en", [
        "education",
        "pageTitles",
        "signIn",
        "errors",
        "common",
      ])),
    },
  };
};

export default function UniversityInfo({ university }: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation("education");

  return (
    <div>
      <PageComponent title={"UniversityInfo"}>
        <Toaster />
        <div className="mb-8 ">
          <div className="text-2xl font-semibold ">{`${t("universityTitle")}: ${
            locale == "ar" ? university?.nameAr ?? "-" : university?.name
          }`}</div>
        </div>

        <UniversityFormComponent
          university={university}
        ></UniversityFormComponent>
      </PageComponent>
    </div>
  );
}
