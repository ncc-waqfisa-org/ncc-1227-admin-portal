import React, { FC, useState } from "react";
import { PageComponent } from "../../components/page-component";
import {
  IlistAllAdminsLogsOutput,
  listAllAdminsLogs,
} from "../../src/CustomAPI";
import { toast, Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

interface Props {
  adminsLogsRes: IlistAllAdminsLogsOutput;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const res = await listAllAdminsLogs({
    nextPageToken: null,
    limit: 10,
  });

  return {
    props: {
      adminsLogsRes: res,
      ...(await serverSideTranslations(locale ?? "en", [
        "adminLog",
        "pageTitles",
        "signIn",
      ])),
    },
  };
};

const AdminLogs: FC<Props> = ({ adminsLogsRes }) => {
  const { t } = useTranslation("adminLog");
  const [adminsLogs, setAdminsLogs] = useState(adminsLogsRes.adminsLogs);
  const [nextToken, setNextToken] = useState(adminsLogsRes.nextToken);
  const [loading, setLoading] = useState<boolean>(false);

  async function getNextLogsBatch() {
    setLoading(true);
    await listAllAdminsLogs({
      nextPageToken: nextToken,
    })
      .then((res) => {
        setAdminsLogs((adminsLogs) => [...adminsLogs, ...res.adminsLogs]);
        setNextToken(res.nextToken);
        if (res.nextToken === null) {
          toast("You have reached the end of the logs");
        }
      })
      .catch(() => {
        toast("Error getting the logs");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <PageComponent title={"Admin Logs"}>
      <Toaster />
      <div className="mb-8 ">
        <div className="text-2xl font-semibold ">{t("adminLogTitle")}</div>
        <div className="text-base font-medium text-gray-500 ">
          {t("adminLogSubtitle")}
        </div>
      </div>
      {adminsLogs.length > 0 ? (
        <div className="h-full">
          <div className="w-full ">
            <table dir="ltr" className="table w-full">
              <thead className="border rounded-xl border-nccGray-100">
                <tr>
                  <th>{t("tableAdminLogName")}</th>
                  <th>{t("tableAdminLogCPR")}</th>
                  <th>{t("tableAdminLogDate")}</th>
                  <th>{t("tableAdminLogHistory")}</th>
                </tr>
              </thead>
              <tbody>
                {adminsLogs
                  .sort(
                    (a, b) =>
                      new Date(`${b.dateTime}`).getTime() -
                      new Date(`${a.dateTime}`).getTime()
                  )
                  .map((log) => (
                    <tr key={log.id}>
                      <td>{log.admin?.fullName}</td>
                      <td>{log.adminCPR}</td>
                      <td>{`${Intl.DateTimeFormat("en", {
                        timeStyle: "short",
                        dateStyle: "medium",
                      }).format(new Date(`${log.dateTime}`))}`}</td>
                      <td>{log.snapshot}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
          <div className="flex justify-center items-center w-full py-3 pb-8">
            {nextToken ? (
              <button
                className={`btn btn-ghost btn-sm mx-auto ${
                  loading && "loading"
                } `}
                disabled={loading}
                onClick={() => void getNextLogsBatch()}
                type="button"
              >
                {t("loadMoreLogs")}
              </button>
            ) : (
              <div className="text-sm text-base-content text-center mx-auto">
                {t("reachedTheEnd")}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 border border-nccGray-100 rounded-xl bg-nccGray-100">
          <div className="text-base font-medium ">{t("noData")}</div>
        </div>
      )}
    </PageComponent>
  );
};

export default AdminLogs;
