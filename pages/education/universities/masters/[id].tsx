import { useRouter } from "next/router";
import React from "react";
import { Toaster } from "react-hot-toast";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { BahrainUniversities, MasterUniversities } from "../../../../src/API";
import {
  getBahrainiUniversityById,
  getMasterUniversityByID,
} from "../../../../src/CustomAPI";
import { PageComponent } from "../../../../components/page-component";
import UniversityFormComponent from "../../../../components/university-form-component";
import MasterUniversityFormComponent from "../../../../components/universities/master-university-form-component";

interface Props {
  universityType: "bahrainiUni" | "masterUni";
  university: MasterUniversities | BahrainUniversities | null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id, type } = ctx.query;
  const { locale } = ctx;

  const university = id
    ? type === "masterUni"
      ? await getMasterUniversityByID(`${id}`)
      : await getBahrainiUniversityById(`${id}`)
    : null;

  return {
    props: {
      university: university,
      universityType: type,
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

export default function UniversityInfo({ universityType, university }: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation("education");

  return (
    <div>
      <PageComponent title={"UniversityInfo"}>
        <Toaster />

        <div className="mb-8 ">
          <div className="text-2xl font-semibold ">{`${t("universityTitle")}: ${
            locale == "ar"
              ? university?.universityNameAr ?? "-"
              : university?.universityName
          }`}</div>
        </div>

        <MasterUniversityFormComponent
          type={universityType}
          university={university}
        />
      </PageComponent>
    </div>
  );
}
