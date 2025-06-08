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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBatchContext } from "../context/BatchContext";
import { getStatistics } from "../src/CustomAPI";
import { MoreStatistics } from "../components/MoreStatistics";
import { useAppContext } from "../context/AppContext";
import { MasterStatistics } from "../components/MasterStatistics";
import { FiRefreshCw } from "react-icons/fi";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import locale_ar from "dayjs/locale/ar";
import locale_en from "dayjs/locale/en";
import { CSVDownoloadDialog } from "../components/application/ExportApplicationsSheet/CSVDownoloadDialog";

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
  const queryClient = useQueryClient();

  const { data: statistics, isPending } = useQuery({
    queryKey: ["statistics", batch, token, locale],
    queryFn: () =>
      getStatistics({ batch: batch, token: token, locale: locale }),
  });

  const { mutate: refreshStatistics, isPending: isRefreshPending } =
    useMutation({
      mutationFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_BACHELOR_STATISTICS_ENDPOINT}`, {
          method: "PUT",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
      onSuccess: (res) => {
        if (res.ok) {
          queryClient.invalidateQueries({
            queryKey: ["statistics", batch, token, locale],
          });
          toast.success(t("statisticsRefreshedSuccessfully"));
        }
      },
      onError: () => {
        toast.error(t("failedToRefreshStatistics"));
      },
    });

  return (
    <PageComponent title={"Home"}>
      {type === "bachelor" && (
        <div className="flex flex-col gap-4 justify-between mb-14">
          {/* Header */}
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col">
              <div className="mb-5">
                <div>
                  <h1 className="text-3xl font-semibold">
                    {batch} {t("dashboardTitle")}
                  </h1>
                </div>
                <div className="text-base font-medium text-gray-500">
                  {t("dashboardSubtitle")}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex flex-wrap gap-4 justify-end items-center my-4">
                <BatchSelector />
                <PrimaryButton
                  name={t("allApplicationsButton")}
                  buttonClick={() => push("/applications")}
                ></PrimaryButton>

                <CSVDownoloadDialog />

                <Button
                  onClick={() => {
                    refreshStatistics();
                  }}
                  size={"icon"}
                  variant={"outline"}
                  disabled={isRefreshPending}
                >
                  <FiRefreshCw
                    className={isRefreshPending ? "animate-spin" : ""}
                  />
                </Button>
              </div>
              <p className="text-sm text-gray-400 text-end">
                {t("lastUpdated")}
                {dayjs(statistics?.updatedAt)
                  .locale(locale == "ar" ? locale_ar : locale_en)
                  .format("MMMM D, YYYY h:mm A")}
              </p>
            </div>
          </div>
          {/* mini graphs */}
          <div className="grid grid-cols-1 gap-8 justify-between mb-8 md:grid-cols-2 xl:grid-cols-3 min-h-fit">
            {/* Total applications */}
            <div className={`p-7 w-full rounded-xl ${"bg-anzac-50"}`}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600">
                  {t("totalApplications")}
                </div>
                {isPending ? (
                  <div className="flex justify-center items-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between p-4 w-full">
                    <div className="w-8 text-2xl">
                      {statistics?.totalApplications ?? 0}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-7 w-full rounded-xl ${"bg-goblin-50"}`}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600">
                  {t("approvedApplications")}
                </div>
                {isPending ? (
                  <div className="flex justify-center items-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between p-4 w-full">
                    <div className="w-8 text-2xl">
                      {statistics?.totalApplicationsPerStatus.APPROVED ?? 0}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`p-7 w-full rounded-xl ${"bg-pomegranate-50"}`}>
              <div className="flex flex-col w-full">
                <div className="text-xs font-semibold text-gray-600">
                  {t("pendingApplications")}
                </div>
                {isPending ? (
                  <div className="flex justify-center items-center p-4 rounded-md animate-pulse bg-black/10">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between p-4 w-full">
                    <div className="w-8 text-2xl">
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
            <div className="flex justify-between mb-5">
              <div className="flex flex-col">
                <div className="text-3xl font-semibold">
                  {t("reportsAndGraphsTitle")}
                </div>
                <div className="text-base font-medium text-gray-500">
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
                <div className="flex flex-col col-span-2 justify-between p-4 w-full rounded-xl border bg-nccGray-50">
                  <div className="">{t("participatingUniversities")}</div>
                  <div className="py-2">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-muted-foreground">
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
      {type === "masters" && <MasterStatistics />}
    </PageComponent>
  );
};

export default Home;
