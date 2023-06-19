import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { PageComponent } from "../../components/page-component";
import { Toaster } from "react-hot-toast";
import { AdminLog, Application } from "../../src/API";
import { useRouter } from "next/router";
import PrimaryButton from "../../components/primary-button";
import ViewApplication from "../../components/application-view-component";
import { getAdminLogsByLogID } from "../../src/CustomAPI";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface Props {
  adminLog: AdminLog;
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  let adminLog = await getAdminLogsByLogID(`${id}`);
  return {
    props: {
      adminLog: adminLog,
      ...(await serverSideTranslations(locale ?? "en", [
        "adminLog",
        "pageTitles",
        "signIn",
        "applicationLog",
        "errors",
      ])),
    },
  };
};

export default function AdminLogHistoryInfo({ adminLog }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation("adminLog");
  const [snapshot, setSnapshot] = useState<Application | undefined>(undefined);

  useEffect(() => {
    if (adminLog.snapshot) {
      setSnapshot(JSON.parse(adminLog.snapshot) as Application);
    }

    return () => {};
  }, [adminLog.snapshot]);

  return (
    <PageComponent title={"AdminLogHistory"}>
      <Toaster />
      <div className="flex flex-col justify-between p-4 ">
        <div className="p-4 ">
          <div className="flex items-center justify-between mb-8 ">
            <div>
              <div className="text-2xl font-semibold ">
                {t("adminLogTitle")}
              </div>
              <div className="text-base font-medium text-gray-500 ">{id}</div>
            </div>
            <PrimaryButton
              name={t("backButton")}
              buttonClick={() => {
                router.back();
              }}
            ></PrimaryButton>
          </div>
          {/* body */}
          <div className="flex flex-col justify-between gap-4 ">
            <div>
              <div className="text-xl font-semibold ">
                {t("adminInformation")}
              </div>
              <div>{adminLog.admin?.fullName}</div>
              <div>{adminLog.admin?.email}</div>
              <div>{adminLog.admin?.cpr}</div>
            </div>
            <div className="">
              <div className="text-xl font-semibold ">
                {t("applicationDetails")}
              </div>
              {snapshot && (
                <ViewApplication
                  application={snapshot}
                  downloadLinks={{
                    schoolCertificate: snapshot.attachment?.schoolCertificate,
                    transcriptDoc: snapshot.attachment?.transcriptDoc,
                    signedContractDoc: snapshot.attachment?.signedContractDoc,
                  }}
                  readOnly={true}
                ></ViewApplication>
              )}
            </div>
            <div>
              <div className="text-xl font-semibold ">
                {t("reasonForChange")}
              </div>
              <div>{adminLog.reason}</div>
            </div>
            <div>
              <div className="text-xl font-semibold ">{t("updatedAt")}</div>
              <div>{`${Intl.DateTimeFormat("en", {
                timeStyle: "short",
                dateStyle: "medium",
              }).format(new Date(adminLog.updatedAt))}`}</div>
            </div>
          </div>
        </div>
      </div>
    </PageComponent>
  );
}
