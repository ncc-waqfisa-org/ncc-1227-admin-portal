import React, { useState } from "react";
import { PageComponent } from "../../components/page-component";
import { BatchesTableHeaders } from "../../constants/table-headers";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/use-auth";
import { GetStaticProps } from "next";
import { useQuery } from "@tanstack/react-query";
import { listAllBatches } from "../../src/CustomAPI";
import dayjs from "dayjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "batches",
        "pageTitles",
        "signIn",
        "common",
        "errors",
      ])),
    },
  };
};

const BatchesPage = () => {
  const { t } = useTranslation("batches");
  const { isSuperAdmin } = useAuth();

  const { locale, push } = useRouter();

  const { t: common } = useTranslation("common");
  const { t: tErrors } = useTranslation("errors");

  const { data: batches } = useQuery({
    queryKey: ["batches"],
    queryFn: () => listAllBatches({ limit: 99999 }),
  });

  return (
    <PageComponent title={"Batches"}>
      {/* header */}
      <div className="mb-8 ">
        <div className="text-2xl font-semibold ">{t("batches")}</div>
        <div className="text-base font-medium text-gray-500 ">
          {t("batchesSubtitle")}
        </div>
      </div>
      {/* table */}
      <div>
        <div dir="ltr">
          <div className="w-full overflow-x-auto">
            <table className="table w-full overflow-x-scroll table-auto">
              <thead className="">
                <tr>
                  {BatchesTableHeaders.map((title, index) => (
                    <th className=" bg-nccGray-100" key={index}>
                      {t(title)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batches?.listBatches?.items
                  ?.sort((a, b) => (b?.batch ?? 0) - (a?.batch ?? 0))
                  .map((datum, index: number) => {
                    if (!datum) {
                      return (
                        <tr key={index}>
                          <td>{tErrors("null")}</td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={index}
                        className={` hover:bg-anzac-50 hover:text-anzac-500 ${
                          datum.batch === dayjs().year() && "  bg-blue-50"
                        }`}
                        onClick={() => push(`batches/${datum.batch}`)}
                      >
                        <td
                          key={`${datum?.batch}-current`}
                          className="bg-transparent"
                        >
                          <div
                            className={`flex justify-between hover:cursor-pointer`}
                          >{`${datum.batch}`}</div>
                        </td>
                        <td
                          key={`${datum.batch}-signUpStartDate`}
                          className="bg-transparent"
                        >
                          <div
                            className={`flex justify-between hover:cursor-pointer `}
                          >{`${dayjs(datum.signUpStartDate).format(
                            "MMM D, YYYY"
                          )}`}</div>
                        </td>
                        <td
                          key={`${datum.batch}-signUpEndDate`}
                          className="bg-transparent"
                        >
                          <div
                            className={`flex justify-between hover:cursor-pointer  `}
                          >{`${dayjs(datum.signUpEndDate).format(
                            "MMM D, YYYY"
                          )}`}</div>
                        </td>
                        <td
                          key={`${datum.batch}-createApplicationStartDate`}
                          className="bg-transparent"
                        >
                          <div
                            className={`flex justify-between hover:cursor-pointer  `}
                          >{`${dayjs(datum.createApplicationStartDate).format(
                            "MMM D, YYYY"
                          )}`}</div>
                        </td>
                        <td
                          key={`${datum.batch}-updateApplicationEndDate`}
                          className="bg-transparent"
                        >
                          <div
                            className={`flex justify-between hover:cursor-pointer `}
                          >{`${dayjs(datum.updateApplicationEndDate).format(
                            "MMM D, YYYY"
                          )}`}</div>
                        </td>
                        <td
                          key={`${datum.batch}-createApplicationEndDate`}
                          className="bg-transparent"
                        >
                          <div
                            className={`flex justify-between hover:cursor-pointer `}
                          >{`${dayjs(datum.createApplicationEndDate).format(
                            "MMM D, YYYY"
                          )}`}</div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageComponent>
  );
};

export default BatchesPage;
