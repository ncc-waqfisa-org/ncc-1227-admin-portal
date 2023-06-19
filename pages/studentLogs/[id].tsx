import React, { useEffect, useState } from "react";
import { PageComponent } from "../../components/page-component";
import { listAllStudentLogsOfApplication } from "../../src/CustomAPI";
import { StudentLog } from "../../src/API";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "pageTitles",
        "signIn",
        "studentLog",
      ])),
    },
  };
};

const StudentLogs = () => {
  const [studentLogs, setStudentLogs] = useState<StudentLog[]>([]);

  const { push, query } = useRouter();
  const { id } = query;
  const { t } = useTranslation("studentLog");

  useEffect(() => {
    getStudentLogsList();

    async function getStudentLogsList() {
      let res = await listAllStudentLogsOfApplication(`${id}`);
      if (res) {
        setStudentLogs(res);
      }
      return res;
    }

    return () => {};
  }, [id]);

  return (
    <PageComponent title={"Student Logs"}>
      <Toaster />
      <div className="mb-8 ">
        <div className="text-2xl font-semibold ">{t("studentLogHistory")}</div>
        <div className="text-base font-medium text-gray-500">
          {t("studentLogHistorySubtitle")}
        </div>
      </div>
      <table dir="ltr" className="table w-full ">
        <thead className="border rounded-xl border-nccGray-100">
          <tr>
            <th>{t("reason")}</th>
            <th>{t("date")}</th>
            <th>{t("history")}</th>
          </tr>
        </thead>
        <tbody>
          {studentLogs
            .sort(
              (a, b) =>
                new Date(`${b.dateTime}`).getTime() -
                new Date(`${a.dateTime}`).getTime()
            )
            .map((log) => (
              <tr key={log.id}>
                <td>{log.reason}</td>

                <td>{`${Intl.DateTimeFormat("en", {
                  timeStyle: "short",
                  dateStyle: "medium",
                }).format(new Date(`${log.dateTime}`))}`}</td>
                <td>
                  <Link
                    className=" link link-primary"
                    href={`/studentLogs/view/${log.id}`}
                  >
                    {t("view")}
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </PageComponent>
  );
};

export default StudentLogs;
