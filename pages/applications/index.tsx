import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React from "react";
import { Toaster } from "react-hot-toast";
import { PageComponent } from "../../components/page-component";

import { InfiniteApplications } from "../../components/ui/applications/infinite-applications";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "applications",
        "pageTitles",
        "signIn",
        "applicationLog",
        "common",
        "errors",
      ])),
    },
  };
};

const Applications = () => {
  const { t } = useTranslation("applications");

  return (
    <PageComponent title={"Applications"}>
      <Toaster />
      <div className="flex flex-wrap items-center justify-between mb-8 ">
        <div className="flex flex-col items-start gap-3 ">
          <div className="">
            <div className="text-2xl font-semibold ">
              {t("applicationTitle")}
            </div>
          </div>
          <Link
            href="/applications/archive"
            className="btn btn-ghost btn-sm text-primary hover:bg-primary/30"
          >
            {t("archives")}
          </Link>
        </div>
      </div>

      <InfiniteApplications></InfiniteApplications>
    </PageComponent>
  );
};

export default Applications;
