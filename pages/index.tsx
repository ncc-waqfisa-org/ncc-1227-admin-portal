import { useRouter } from "next/router";

import { LargeBarGraphInfo } from "../components/graphs/large-bar-graph-info";

import { PageComponent } from "../components/page-component";
import PrimaryButton from "../components/primary-button";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import _ from "lodash";
import { CSVLink } from "react-csv";

import { LargeDonutGraphInfo } from "../components/graphs/large-donut-graph-info";
import { GetStaticProps } from "next";
import { BatchSelector } from "../components/batch/BatchSelector";
import { useAuth } from "../hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useBatchContext } from "../context/BatchContext";
import { getMastersStatistics, getStatistics } from "../src/CustomAPI";
import { DownloadFileFromUrl } from "../components/download-file-from-url";
import { MoreStatistics } from "../components/MoreStatistics";
import { useAppContext } from "../context/AppContext";
import { MoreMasterStatistics } from "../components/MoreMasterStatistics";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "common",
        "applications",
        "pageTitles",
        "signIn",
        "errors",
      ])),
    },
  };
};

const Home = () => {
  const { push, locale } = useRouter();
  const { t } = useTranslation("common");
  const { token } = useAuth();
  const { batch } = useBatchContext();
  const { type } = useAppContext();

  const { data: statistics, isPending } = useQuery({
    queryKey: ["statistics", batch, token, locale],
    queryFn: () =>
      getStatistics({ batch: batch, token: token, locale: locale }),
  });

  const { data: mastersStatistics, isPending: isMasterStatisticsPending } =
    useQuery({
      queryKey: ["mastersStatistics", batch, token, locale],
      queryFn: () =>
        getMastersStatistics({ batch: batch, token: token, locale: locale }),
    });

  return (
    <PageComponent title={"Home"}>
      {type === "bachelor" && (
        <div className="flex flex-col justify-between gap-4 mb-14">
          {/* Header */}
          <div className="flex flex-wrap justify-between ">
            <div className="flex flex-col ">
              <div className="mb-5 ">
                <div>
                  <h1 className="text-3xl font-semibold ">
                    {batch} {t("dashboardTitle")}
                  </h1>
                </div>
                <div className="text-base font-medium text-gray-500 ">
                  {t("dashboardSubtitle")}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-4 my-4">
              <BatchSelector />
              <PrimaryButton
                name={t("allApplicationsButton")}
                buttonClick={() => push("/applications")}
              ></PrimaryButton>

              <DownloadFileFromUrl
                fileName={`${batch} Applications`}
                url={`${process.env.NEXT_PUBLIC_LAMBDA_EXPORT_CSV_STATISTICS}?batch=${batch}`}
                // url={`https://z7pe3akpcz6bazr3djdk4yo7e40yqevt.lambda-url.us-east-1.on.aws/?batch=${batch}`}
              >
                {/* */}
                {t("exportCSV")}
              </DownloadFileFromUrl>
            </div>
          </div>
          {/* mini graphs */}
          <div className="grid justify-between grid-cols-1 gap-8 mb-8 md:grid-cols-2 xl:grid-cols-3 min-h-fit">
            {/* Total applications */}
            <div className={`w-full rounded-xl p-7 ${"bg-anzac-50"} `}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600 ">
                  {t("totalApplications")}
                </div>
                {isPending ? (
                  <div className="flex items-center justify-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between w-full p-4">
                    <div className="w-8 text-2xl ">
                      {statistics?.totalApplications ?? 0}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`w-full rounded-xl p-7 ${"bg-goblin-50"} `}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600 ">
                  {t("approvedApplications")}
                </div>
                {isPending ? (
                  <div className="flex items-center justify-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between w-full p-4">
                    <div className="w-8 text-2xl ">
                      {statistics?.totalApplicationsPerStatus.APPROVED ?? 0}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-full rounded-xl p-7 ${"bg-pomegranate-50"} `}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600 ">
                  {t("pendingApplications")}
                </div>
                {isPending ? (
                  <div className="flex items-center justify-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between w-full p-4">
                    <div className="w-8 text-2xl ">
                      {statistics?.totalApplicationsPerStatus.REVIEW ?? 0}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* reports and graphs */}
          <div>
            {/* title and sub buttons */}
            <div className="flex justify-between mb-5 ">
              <div className="flex flex-col ">
                <div className="text-3xl font-semibold ">
                  {t("reportsAndGraphsTitle")}
                </div>
                <div className="text-base font-medium text-gray-500 ">
                  {t("reportsAndGraphsSubtitle")}
                </div>
              </div>
            </div>
            {/* large graphs */}
            <div className="grid items-center justify-center w-full h-full grid-cols-2 gap-x-8 gap-y-10 [grid-auto-rows:1fr]">
              <LargeBarGraphInfo
                loading={isPending}
                title={t("scoresSummary")}
                barLabel={"Applications"}
                subBarLabel={"Accumulated scores"}
                labels={
                  statistics?.scoreHistogram
                    ? Object.keys(statistics.scoreHistogram)
                    : []
                }
                data={
                  statistics?.scoreHistogram
                    ? Object.values(statistics.scoreHistogram)
                    : []
                }
              >
                <CSVLink
                  filename={`Score Histogram ${batch}.csv`}
                  data={
                    statistics?.scoreHistogram
                      ? [
                          ...Object.keys(statistics.scoreHistogram).map(
                            (sh, i) => {
                              return {
                                Score: sh,
                                Applications: Object.values(
                                  statistics.scoreHistogram
                                )[i],
                              };
                            }
                          ),
                        ]
                      : [{ score: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeBarGraphInfo>
              <LargeDonutGraphInfo
                loading={isPending}
                title={t("topUniversities")}
                labels={
                  statistics?.topUniversities
                    ? Object.keys(statistics.topUniversities)
                    : []
                }
                data={
                  statistics?.topUniversities
                    ? Object.values(statistics.topUniversities)
                    : []
                }
              >
                <CSVLink
                  filename={`Top Universities ${batch}.csv`}
                  data={
                    statistics?.topUniversities
                      ? [
                          ...Object.keys(statistics.topUniversities).map(
                            (sh, i) => {
                              return {
                                University: sh,
                                Applications: Object.values(
                                  statistics.topUniversities
                                )[i],
                              };
                            }
                          ),
                        ]
                      : [{ university: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeDonutGraphInfo>

              <LargeBarGraphInfo
                loading={isPending}
                title={t("gpaSummary")}
                barLabel={"Applications"}
                subBarLabel={"gpa"}
                labels={
                  statistics?.gpaHistogram
                    ? Object.keys(statistics.gpaHistogram)
                    : []
                }
                data={
                  statistics?.gpaHistogram
                    ? Object.values(statistics.gpaHistogram)
                    : []
                }
              >
                <CSVLink
                  filename={`GPA Histogram ${batch}.csv`}
                  data={
                    statistics?.gpaHistogram
                      ? [
                          ...Object.keys(statistics.gpaHistogram).map(
                            (sh, i) => {
                              return {
                                GPA: sh,
                                Applications: Object.values(
                                  statistics.gpaHistogram
                                )[i],
                              };
                            }
                          ),
                        ]
                      : [{ gpa: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeBarGraphInfo>
              <LargeDonutGraphInfo
                loading={isPending}
                title={t("applicationStatus")}
                labels={
                  statistics?.totalApplicationsPerStatus
                    ? Object.keys(statistics.totalApplicationsPerStatus)
                    : []
                }
                data={
                  statistics?.totalApplicationsPerStatus
                    ? Object.values(statistics.totalApplicationsPerStatus).map(
                        (v) => v ?? 0
                      )
                    : []
                }
              >
                <CSVLink
                  filename={`Applications Status ${batch}.csv`}
                  data={
                    statistics?.totalApplicationsPerStatus
                      ? [
                          ...Object.keys(
                            statistics.totalApplicationsPerStatus
                          ).map((sh, i) => {
                            return {
                              GPA: sh,
                              Applications:
                                Object.values(
                                  statistics.totalApplicationsPerStatus
                                )[i] ?? 0,
                            };
                          }),
                        ]
                      : [{ gpa: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeDonutGraphInfo>
              {statistics?.participatingUniversities && (
                <div className="flex flex-col justify-between w-full p-4 border rounded-xl bg-nccGray-50 col-span-2">
                  <div className="">{t("participatingUniversities")}</div>
                  <div className=" py-2">
                    <ul className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-muted-foreground">
                      {statistics?.participatingUniversities.map(
                        (uni, index) => {
                          return (
                            <li key={index} className="py-1">
                              {uni}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* more statistics */}
          <div className="pt-6">
            {statistics && <MoreStatistics statistics={statistics} />}
          </div>
        </div>
      )}
      {type === "masters" && (
        <div className="flex flex-col justify-between gap-4 mb-14">
          {/* Header */}
          <div className="flex flex-wrap justify-between ">
            <div className="flex flex-col ">
              <div className="mb-5 ">
                <div>
                  <h1 className="text-3xl font-semibold ">
                    {batch} {t("mDashboardTitle")}
                  </h1>
                </div>
                <div className="text-base font-medium text-gray-500 ">
                  {t("dashboardSubtitle")}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-4 my-4">
              <BatchSelector />
              <PrimaryButton
                name={t("allApplicationsButton")}
                buttonClick={() => push("/applications?type=masters")}
              ></PrimaryButton>

              <DownloadFileFromUrl
                fileName={`${batch} Applications`}
                url={`${process.env.NEXT_PUBLIC_LAMBDA_EXPORT_MASTER_CSV_STATISTICS}?batch=${batch}`}
                // url={`https://z7pe3akpcz6bazr3djdk4yo7e40yqevt.lambda-url.us-east-1.on.aws/?batch=${batch}`}
              >
                {/* */}
                {t("exportCSV")}
              </DownloadFileFromUrl>
            </div>
          </div>
          {/* mini graphs */}
          <div className="grid justify-between grid-cols-1 gap-8 mb-8 md:grid-cols-2 xl:grid-cols-3 min-h-fit">
            {/* Total applications */}
            <div className={`w-full rounded-xl p-7 ${"bg-anzac-50"} `}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600 ">
                  {t("totalApplications")}
                </div>
                {isMasterStatisticsPending ? (
                  <div className="flex items-center justify-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between w-full p-4">
                    <div className="w-8 text-2xl ">
                      {mastersStatistics?.totalApplications ?? 0}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`w-full rounded-xl p-7 ${"bg-goblin-50"} `}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600 ">
                  {t("approvedApplications")}
                </div>
                {isMasterStatisticsPending ? (
                  <div className="flex items-center justify-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between w-full p-4">
                    <div className="w-8 text-2xl ">
                      {mastersStatistics?.totalApplicationsPerStatus.APPROVED ??
                        0}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-full rounded-xl p-7 ${"bg-pomegranate-50"} `}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600 ">
                  {t("pendingApplications")}
                </div>
                {isMasterStatisticsPending ? (
                  <div className="flex items-center justify-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between w-full p-4">
                    <div className="w-8 text-2xl ">
                      {mastersStatistics?.totalApplicationsPerStatus.REVIEW ??
                        0}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* reports and graphs */}
          <div>
            {/* title and sub buttons */}
            <div className="flex justify-between mb-5 ">
              <div className="flex flex-col ">
                <div className="text-3xl font-semibold ">
                  {t("reportsAndGraphsTitle")}
                </div>
                <div className="text-base font-medium text-gray-500 ">
                  {t("reportsAndGraphsSubtitle")}
                </div>
              </div>
            </div>
            {/* large graphs */}
            <div className="grid items-center justify-center w-full h-full grid-cols-2 gap-x-8 gap-y-10 [grid-auto-rows:1fr]">
              <LargeBarGraphInfo
                loading={isMasterStatisticsPending}
                title={t("scoresSummary")}
                barLabel={"Applications"}
                subBarLabel={"Accumulated scores"}
                labels={
                  mastersStatistics?.scoreHistogram
                    ? Object.keys(mastersStatistics.scoreHistogram)
                    : []
                }
                data={
                  mastersStatistics?.scoreHistogram
                    ? Object.values(mastersStatistics.scoreHistogram)
                    : []
                }
              >
                <CSVLink
                  filename={`Score Histogram ${batch}.csv`}
                  data={
                    mastersStatistics?.scoreHistogram
                      ? [
                          ...Object.keys(mastersStatistics.scoreHistogram).map(
                            (sh, i) => {
                              return {
                                Score: sh,
                                Applications: Object.values(
                                  mastersStatistics.scoreHistogram
                                )[i],
                              };
                            }
                          ),
                        ]
                      : [{ score: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeBarGraphInfo>
              <LargeDonutGraphInfo
                loading={isMasterStatisticsPending}
                title={t("topUniversities")}
                labels={
                  mastersStatistics?.topUniversities
                    ? Object.keys(mastersStatistics.topUniversities)
                    : []
                }
                data={
                  mastersStatistics?.topUniversities
                    ? Object.values(mastersStatistics.topUniversities)
                    : []
                }
              >
                <CSVLink
                  filename={`Top Universities ${batch}.csv`}
                  data={
                    mastersStatistics?.topUniversities
                      ? [
                          ...Object.keys(mastersStatistics.topUniversities).map(
                            (sh, i) => {
                              return {
                                University: sh,
                                Applications: Object.values(
                                  mastersStatistics.topUniversities
                                )[i],
                              };
                            }
                          ),
                        ]
                      : [{ university: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeDonutGraphInfo>

              <LargeBarGraphInfo
                loading={isMasterStatisticsPending}
                title={t("gpaSummary")}
                barLabel={"Applications"}
                subBarLabel={"gpa"}
                labels={
                  mastersStatistics?.gpaHistogram
                    ? Object.keys(mastersStatistics.gpaHistogram)
                    : []
                }
                data={
                  mastersStatistics?.gpaHistogram
                    ? Object.values(mastersStatistics.gpaHistogram)
                    : []
                }
              >
                <CSVLink
                  filename={`GPA Histogram ${batch}.csv`}
                  data={
                    mastersStatistics?.gpaHistogram
                      ? [
                          ...Object.keys(mastersStatistics.gpaHistogram).map(
                            (sh, i) => {
                              return {
                                GPA: sh,
                                Applications: Object.values(
                                  mastersStatistics.gpaHistogram
                                )[i],
                              };
                            }
                          ),
                        ]
                      : [{ gpa: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeBarGraphInfo>
              <LargeDonutGraphInfo
                loading={isMasterStatisticsPending}
                title={t("applicationStatus")}
                labels={
                  mastersStatistics?.totalApplicationsPerStatus
                    ? Object.keys(mastersStatistics.totalApplicationsPerStatus)
                    : []
                }
                data={
                  mastersStatistics?.totalApplicationsPerStatus
                    ? Object.values(
                        mastersStatistics.totalApplicationsPerStatus
                      ).map((v) => v ?? 0)
                    : []
                }
              >
                <CSVLink
                  filename={`Applications Status ${batch}.csv`}
                  data={
                    mastersStatistics?.totalApplicationsPerStatus
                      ? [
                          ...Object.keys(
                            mastersStatistics.totalApplicationsPerStatus
                          ).map((sh, i) => {
                            return {
                              GPA: sh,
                              Applications:
                                Object.values(
                                  mastersStatistics.totalApplicationsPerStatus
                                )[i] ?? 0,
                            };
                          }),
                        ]
                      : [{ gpa: "none", applications: 0 }]
                  }
                  className="text-xs text-white btn btn-primary btn-sm"
                >
                  {t("exportCSV")}
                </CSVLink>
              </LargeDonutGraphInfo>
              <div className="flex flex-col justify-between w-full p-4 border rounded-xl bg-nccGray-50 col-span-2">
                <div className="">{t("participatingUniversities")}</div>
                <div className=" py-2">
                  <ul className=" grid grid-cols-2 text-muted-foreground">
                    {mastersStatistics?.participatingUniversities.map(
                      (uni, index) => {
                        return (
                          <li key={index} className="py-1">
                            {uni}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* more mastersStatistics */}
          <div className="pt-6">
            {mastersStatistics && (
              <MoreMasterStatistics statistics={mastersStatistics} />
            )}
          </div>
        </div>
      )}
    </PageComponent>
  );
};

export default Home;
