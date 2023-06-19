import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PageComponent } from "../../../components/page-component";
import { AdminLog, Application } from "../../../src/API";
import { getApplicationData } from "../../../src/CustomAPI";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

interface Props {
  application: Application;
  applicationHistory: AdminLog[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  let application = await getApplicationData(`${id}`);
  let applicationHistory = application?.adminLogs?.items;

  return {
    props: {
      applicationHistory: applicationHistory,
      application: application,
      ...(await serverSideTranslations(locale ?? "en", [
        "pageTitles",
        "signIn",
        "applicationLog",
        "errors",
      ])),
    },
  };
};

export default function ApplicationLog({
  applicationHistory,
}: // application,
Props) {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation("applicationLog");

  // const [logHistory, setLogHistory] = useState<AdminLog | undefined>(undefined);
  // const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Table Data Pagination
  const elementPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableForward, setDisableForward] = useState(false);
  const [disableBackward, setDisableBackward] = useState(true);
  const [shownData, setShownData] = useState<AdminLog[]>([]);

  useEffect(() => {
    setNumberOfPages(
      Math.ceil((applicationHistory?.length ?? 0) / elementPerPage)
    );
    return () => {};
  }, [applicationHistory.length]);

  useEffect(() => {
    setDisableBackward(true);
    setDisableForward(true);

    if (currentPage > 1) {
      setDisableBackward(false);
    }

    if (currentPage < numberOfPages) {
      setDisableForward(false);
    }

    return () => {};
  }, [currentPage, numberOfPages]);

  useEffect(() => {
    function paginate() {
      setShownData(
        applicationHistory?.slice(
          (currentPage - 1) * elementPerPage,
          currentPage * elementPerPage
        )
      );
    }

    paginate();
    return () => {};
  }, [currentPage, applicationHistory]);

  function goNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function goPrevPage() {
    setCurrentPage(currentPage - 1);
  }
  // Table Data Pagination

  // function parseApplication(applicationSnapshot: string) {
  //   return JSON.parse(applicationSnapshot) as Application;
  // }

  return (
    <div>
      <PageComponent title={"ApplicationLog"}>
        <div>
          <div className="mb-8 ">
            <div className="text-2xl font-semibold ">
              {t("applicationLogTitle")}
            </div>
            <div className="text-base font-medium text-gray-500 ">
              {t("application")} ID: {id}
            </div>
          </div>

          {/* modal dialogue - adds university to db */}
          {/* <div className={` modal ${isSubmitted && "modal-open"}`}>
            <div className="relative max-w-3xl modal-box">
              <label
                onClick={() => setIsSubmitted(!isSubmitted)}
                className="absolute btn btn-sm btn-circle right-2 top-2"
              >
                ✕
              </label>
              <div className="p-4 mb-4 ">
                <div className="text-lg font-bold">
                  {t("applicationSnapshot")}
                </div>
                <div>
                  <div>
                    {logHistory && (
                      <ViewApplication
                        application={parseApplication(`${logHistory.snapshot}`)}
                        downloadLinks={{
                          cprDoc: application.attachment?.cprDoc,
                          acceptanceLetterDoc:
                            application.attachment?.acceptanceLetterDoc,
                          transcriptDoc: application.attachment?.transcriptDoc,
                          signedContractDoc:
                            application.attachment?.signedContractDoc,
                        }}
                        readOnly={true}
                      ></ViewApplication>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* application table */}
          {shownData.length > 0 ? (
            <div>
              <div dir="ltr" className="w-full h-screen overflow-x-auto">
                <table className="table w-full ">
                  <thead className="border  rounded-xl border-nccGray-100">
                    <tr>
                      <th>{t("name")}</th>
                      <th>{t("cpr")}</th>
                      <th>{t("logHistory")}</th>
                      <th>{t("reason")}</th>
                      <th>{t("date")}</th>
                      <th>{""}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownData
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((log) => (
                        <tr key={log.id}>
                          <td>{log.admin?.fullName}</td>
                          <td>{log.adminCPR}</td>
                          <td>{log.snapshot}</td>
                          <td>{log.reason}</td>
                          <td>{`${Intl.DateTimeFormat("en", {
                            timeStyle: "short",
                            dateStyle: "medium",
                          }).format(new Date(log.createdAt))}`}</td>
                          {/* <td>
                          <div className="flex justify-end ">
                            <button className="relative btn btn-ghost btn-xs group">
                              <HiDotsVertical />
                              <div className="absolute flex-col hidden p-1 bg-white rounded-lg shadow-lg  right-6 top-5 group-focus:flex min-w-min">
                                <div
                                  className="flex justify-start w-24 gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                                  onClick={async () => {
                                    await getAdminLogsByLogID(log.id).then(
                                      (value) => {
                                        setLogHistory(value);
                                        setIsSubmitted(true);
                                      }
                                    );
                                  }}
                                >
                                  <BsFillEyeFill />
                                  {t("view")}
                                </div>
                              </div>
                            </button>
                          </div>
                        </td> */}
                        </tr>
                      ))}
                  </tbody>
                  <tfoot></tfoot>
                </table>
                {/* fake pagination */}
                <div className="flex justify-center mt-8 ">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-accent text-anzac-500"
                      onClick={goPrevPage}
                      disabled={disableBackward}
                    >
                      «
                    </button>
                    <button
                      type="button"
                      disabled
                      className="btn hover:cursor-auto disabled:btn-accent"
                    >
                      {currentPage}
                    </button>
                    <button
                      type="button"
                      className="btn btn-accent text-anzac-500"
                      onClick={goNextPage}
                      disabled={disableForward}
                    >
                      »
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 border  border-nccGray-100 rounded-xl bg-nccGray-100">
              <div className="text-base font-medium ">{t("noData")}</div>
            </div>
          )}
        </div>
      </PageComponent>
    </div>
  );
}
