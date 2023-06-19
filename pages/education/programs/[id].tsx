import React from "react";
import { PageComponent } from "../../../components/page-component";
import { GetServerSideProps } from "next";
import { getProgramById } from "../../../src/CustomAPI";
import { Program } from "../../../src/API";
import { Toaster } from "react-hot-toast";
import ProgramFormComponent from "../../../components/program-form-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

interface Props {
  program: Program;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query; // your fetch function here
  const { locale } = ctx;

  let program = await getProgramById(`${id}`);

  return {
    props: {
      program: program,
      ...(await serverSideTranslations(locale ?? "en", [
        "education",
        "pageTitles",
        "signIn",
        "errors",
      ])),
    },
  };
};
export default function ProgramInfo({ program }: Props) {
  const { t } = useTranslation("education");

  return (
    <div>
      <PageComponent title={"ProgramInfo"}>
        <Toaster />
        <div className="mb-8 ">
          <div className="text-2xl font-semibold ">
            {t("programTitle")}: {program.name}
          </div>
          <div className="text-base font-medium text-gray-500 ">
            {t("programTitle")} ID: {program.id}
          </div>
        </div>
        <div>
          <ProgramFormComponent
            program={program}
            programName={program.name ?? ""}
            universityID={program.universityID}
            availability={program.availability ?? 0}
            requirements={program.requirements ?? ""}
            isDeactivated={program.isDeactivated ?? false}
          ></ProgramFormComponent>
        </div>
      </PageComponent>
    </div>
  );
}
