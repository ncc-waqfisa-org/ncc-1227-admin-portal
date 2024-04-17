import React from "react";
import { PageComponent } from "../../components/page-component";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InfiniteScholarships } from "../../components/scholarships/infinite-scholarships";
import { BatchSelector } from "../../components/batch/BatchSelector";
import { useBatchContext } from "../../context/BatchContext";

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

  const { locale, push } = useRouter();

  const { t: common } = useTranslation("common");
  const { t: tErrors } = useTranslation("errors");
  const { batch } = useBatchContext();

  return (
    <PageComponent title={"Scholarships"}>
      {/* header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="">
            <div className="text-2xl font-semibold ">{t("scholarships")}</div>
            <div className="text-base font-medium text-gray-500 ">
              {`${t("scholarshipsSubtitle")} ${batch}`}
            </div>
          </div>
          <BatchSelector />
        </div>
        {/* table */}
        <InfiniteScholarships />
      </div>
    </PageComponent>
  );
};

export default ScholarshipsPage;
