import React from "react";
import { PageComponent } from "../../../components/page-component";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InfiniteMastersScholarships } from "../../../components/scholarships/infinite-masters-scholarships";
import { BatchSelector } from "../../../components/batch/BatchSelector";
import { useBatchContext } from "../../../context/BatchContext";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "scholarships",
        "pageTitles",
        "signIn",
        "common",
        "errors",
      ])),
    },
  };
};

const ScholarshipsPage = () => {
  const { t } = useTranslation("scholarships");

  const { batch } = useBatchContext();

  return (
    <PageComponent title={"MScholarships"}>
      {/* header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="">
            <div className="text-2xl font-semibold ">
              {t("masterScholarships")}
            </div>
            <div className="text-base font-medium text-gray-500 ">
              {`${t("masterScholarshipsSubtitle")} ${batch}`}
            </div>
          </div>
          <BatchSelector />
        </div>
        {/* table */}
        <InfiniteMastersScholarships />
      </div>
    </PageComponent>
  );
};

export default ScholarshipsPage;
