import React, { useState } from "react";
import { PageComponent } from "../../components/page-component";
import { BatchesTableHeaders } from "../../constants/table-headers";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/use-auth";
import { GetStaticProps } from "next";
import { useQuery } from "@tanstack/react-query";
import { listAllBatches, listAllMasterBatches } from "../../src/CustomAPI";
import dayjs from "dayjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import locale_ar from "dayjs/locale/ar";
import locale_en from "dayjs/locale/en";
import { useAppContext } from "../../context/AppContext";

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
  const { type } = useAppContext();

  const { locale, push } = useRouter();

  const { t: common } = useTranslation("common");
  const { t: tErrors } = useTranslation("errors");

  const { data: batches } = useQuery({
    queryKey: ["batches"],
    queryFn: () => listAllBatches({ limit: 99999 }),
  });
  const { data: masterBatches } = useQuery({
    queryKey: ["masterBatches"],
    queryFn: () => listAllMasterBatches({ limit: 99999 }),
  });

  return (
    <PageComponent title={"Batches"}>
      {/* header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="">
            <div className="text-2xl font-semibold ">
              {t(type === "masters" ? "MBatches" : "BBatches")}
            </div>
          </div>
          <Link
            href={type === "masters" ? "/batches/masters/new" : "/batches/new"}
            className="btn btn-sm"
          >
            <p>{t("createNewBatch")}</p>
          </Link>
        </div>
        {/* table */}
        <div>
          <div>
            <div className="w-full overflow-x-auto rounded-lg overflow-clip">
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
                  {type === "bachelor" &&
                    batches?.listBatches?.items
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
                            className={` hover:bg-anzac-50 cursor-pointer hover:text-anzac-500 ${
                              datum.batch === dayjs().year() && "  bg-blue-50"
                            }`}
                            onClick={() => push(`/batches/${datum.batch}`)}
                          >
                            <td
                              key={`${datum?.batch}-current`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${datum.batch}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-signUpStartDate`}
                              className="bg-transparent "
                            >
                              <p
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${dayjs(datum.signUpStartDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</p>
                            </td>
                            <td
                              key={`${datum.batch}-signUpEndDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer  text-nowrap`}
                              >{`${dayjs(datum.signUpEndDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-createApplicationStartDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer  text-nowrap`}
                              >{`${dayjs(datum.createApplicationStartDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-updateApplicationEndDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${dayjs(datum.updateApplicationEndDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-createApplicationEndDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${dayjs(datum.createApplicationEndDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                          </tr>
                        );
                      })}
                  {type === "masters" &&
                    masterBatches?.listMasterBatches?.items
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
                            className={` hover:bg-anzac-50 cursor-pointer hover:text-anzac-500 ${
                              datum.batch === dayjs().year() && "  bg-blue-50"
                            }`}
                            onClick={() =>
                              push(`/batches/masters/${datum.batch}`)
                            }
                          >
                            <td
                              key={`${datum?.batch}-current`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${datum.batch}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-signUpStartDate`}
                              className="bg-transparent "
                            >
                              <p
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${dayjs(datum.signUpStartDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</p>
                            </td>
                            <td
                              key={`${datum.batch}-signUpEndDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer  text-nowrap`}
                              >{`${dayjs(datum.signUpEndDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-createApplicationStartDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer  text-nowrap`}
                              >{`${dayjs(datum.createApplicationStartDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-updateApplicationEndDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${dayjs(datum.updateApplicationEndDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                            <td
                              key={`${datum.batch}-createApplicationEndDate`}
                              className="bg-transparent"
                            >
                              <div
                                className={`flex justify-between hover:cursor-pointer text-nowrap`}
                              >{`${dayjs(datum.createApplicationEndDate)
                                .locale(locale === "ar" ? locale_ar : locale_en)
                                .format("MMM D, YYYY")}`}</div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageComponent>
  );
};

export default BatchesPage;
