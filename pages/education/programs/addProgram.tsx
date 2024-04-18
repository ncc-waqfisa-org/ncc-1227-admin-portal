import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { useTranslation } from "react-i18next";
import { PageComponent } from "../../../components/page-component";
import ProgramFormComponent from "../../../components/program-form-component";
import { useAuth } from "../../../hooks/use-auth";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
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

const AddProgram = () => {
  const { t } = useTranslation("education");
  const { t: tErrors } = useTranslation("errors");
  const { isSuperAdmin } = useAuth();
  return (
    <div>
      <PageComponent title={"AddProgram"}>
        {!isSuperAdmin && (
          <div>
            <p className="p-8 text-xl font-bold text-center text-error">
              {tErrors("accessDenied")}
            </p>
          </div>
        )}
        {isSuperAdmin && (
          <div>
            {/* title */}
            <div className="mb-8 ">
              <div className="text-2xl font-semibold ">
                {t("addProgramsButton")}
              </div>
              <div className="text-base font-medium text-gray-500 ">
                {t("addProgramSubtitle")}
              </div>
            </div>
            {/* fields */}
            <ProgramFormComponent
              programName={""}
              programArName={""}
              universityID={undefined}
              requirements={""}
              requirementsAr={""}
              isDeactivated={false}
              minimumGPA={0}
            ></ProgramFormComponent>
          </div>
        )}
      </PageComponent>
    </div>
  );
};

export default AddProgram;
