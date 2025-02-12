import React from "react";

import { useTranslation } from "react-i18next";
import { MoreMasterStatistics } from "./MoreMasterStatistics";
import { CSVLink } from "react-csv";
import { useRouter } from "next/router";
import { useBatchContext } from "../context/BatchContext";
import { useAuth } from "../hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMastersStatistics } from "../src/CustomAPI";
import { BatchSelector } from "./batch/BatchSelector";
import PrimaryButton from "./primary-button";
import { DownloadFileFromUrl } from "./download-file-from-url";
import { LargeBarGraphInfo } from "./graphs/large-bar-graph-info";
import { LargeDonutGraphInfo } from "./graphs/large-donut-graph-info";
import { LargeDualBarGraphInfo } from "./graphs/large-dual-bar-graph-info";
import { FiRefreshCw } from "react-icons/fi";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export const MasterStatistics = () => {
  const { batch } = useBatchContext();
  const { push, locale } = useRouter();
  const { t } = useTranslation("common");
  const { token } = useAuth();

  const queryClient = useQueryClient();

  const { data: mastersStatistics, isPending: isMasterStatisticsPending } =
    useQuery({
      queryKey: ["mastersStatistics", batch, token, locale],
      queryFn: () =>
        getMastersStatistics({ batch: batch, token: token, locale: locale }),
    });

  const { mutate: refreshMasterStatistics, isPending: isRefreshPending } =
    useMutation({
      mutationFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_LAMBDA_POST_REFRESH_MASTER_STATISTICS}`,
          {
            method: "POST",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        ),
      onSuccess: (res) => {
        if (res.ok) {
          queryClient.invalidateQueries({
            queryKey: ["mastersStatistics", batch, token, locale],
          });
          toast.success(t("statisticsRefreshedSuccessfully"));
        }
      },
      onError: () => {
        toast.error(t("failedToRefreshStatistics"));
      },
    });

  return (
    <div className="flex flex-col gap-4 justify-between mb-14">
      {/* Header */}
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-col">
          <div className="mb-5">
            <div>
              <h1 className="text-3xl font-semibold">
                {batch} {t("mDashboardTitle")}
              </h1>
            </div>
            <div className="text-base font-medium text-gray-500">
              {t("dashboardSubtitle")}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-end items-center my-4">
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
            {t("exportApplicationsCSV")}
          </DownloadFileFromUrl>
          <Button
            onClick={() => {
              refreshMasterStatistics();
            }}
            size={"icon"}
            variant={"outline"}
            disabled={isRefreshPending}
          >
            <FiRefreshCw className={isRefreshPending ? "animate-spin" : ""} />
          </Button>
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
            {isMasterStatisticsPending ? (
              <div className="flex justify-center items-center p-4 rounded-md animate-pulse bg-black/10">
                <p>{t("loading")}</p>
              </div>
            ) : (
              <div className="flex flex-col justify-between p-4 w-full">
                <div className="w-8 text-2xl">
                  {mastersStatistics?.totalApplications ?? 0}
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
            {isMasterStatisticsPending ? (
              <div className="flex justify-center items-center p-4 rounded-md animate-pulse bg-black/10">
                <p>{t("loading")}</p>
              </div>
            ) : (
              <div className="flex flex-col justify-between p-4 w-full">
                <div className="w-8 text-2xl">
                  {mastersStatistics?.totalApplicationsPerStatus.APPROVED ?? 0}
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
            {isMasterStatisticsPending ? (
              <div className="flex justify-center items-center p-4 rounded-md animate-pulse bg-black/10">
                <p>{t("loading")}</p>
              </div>
            ) : (
              <div className="flex flex-col justify-between p-4 w-full">
                <div className="w-8 text-2xl">
                  {mastersStatistics?.totalApplicationsPerStatus.REVIEW ?? 0}
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
        <div className="grid items-center justify-center w-full h-full grid-cols-2 gap-x-8 gap-y-10 auto-rows-[0fr]">
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

          <LargeDualBarGraphInfo
            loading={isMasterStatisticsPending}
            title={t("gpaSummary")}
            barLabel={t("females")}
            subBarLabel={""}
            labels={
              mastersStatistics?.gpaHistogram
                ? Object.keys(mastersStatistics.gpaHistogram)
                : []
            }
            data={
              mastersStatistics?.gpaHistogram
                ? Object.values(mastersStatistics.gpaHistogram).map((sh) => {
                    return sh.female ?? 0;
                  })
                : []
            }
            data2={
              mastersStatistics?.gpaHistogram
                ? Object.values(mastersStatistics.gpaHistogram).map((sh) => {
                    return sh.male ?? 0;
                  })
                : []
            }
            barLabel2={t("males")}
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
          </LargeDualBarGraphInfo>
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
          {mastersStatistics?.participatingUniversities && (
            <div className="flex flex-col col-span-2 justify-between p-4 w-full rounded-xl border bg-nccGray-50">
              <div className="">{t("participatingUniversities")}</div>
              <div className="py-2">
                <ul className="grid grid-cols-2 text-muted-foreground">
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
          )}
        </div>
      </div>

      {/* more mastersStatistics */}
      <div className="pt-6">
        {mastersStatistics && (
          <MoreMasterStatistics statistics={mastersStatistics} />
        )}
      </div>
    </div>
  );
};
