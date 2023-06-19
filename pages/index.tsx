import { useRouter } from "next/router";

import MiniGraphInfo, {
  GraphColor,
} from "../components/graphs/mini-graph-info";
import { LargeBarGraphInfo } from "../components/graphs/large-bar-graph-info";

import { PageComponent } from "../components/page-component";
import PrimaryButton from "../components/primary-button";
import { useStudent } from "../context/StudentContext";
import { Status } from "../src/API";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import _ from "lodash";
import { CSVLink } from "react-csv";

import {
  getMeGpaSummary,
  getMeWeeklySummary,
  giveMeApplicationsThisMonth,
  giveMeTopProgram,
  giveMeTopUniversities,
} from "../src/Helpers";
import { LargeDonutGraphInfo } from "../components/graphs/large-donut-graph-info";
import { GetStaticProps } from "next";
import { BatchSelectorComponent } from "../components/batch-selector-component";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "common",
        "pageTitles",
        "signIn",
        "errors",
      ])),
    },
  };
};

const Home = () => {
  const { push } = useRouter();
  const { applications, batch, updateBatch } = useStudent();
  const { t } = useTranslation("common");
  const { t: application } = useTranslation("applications");

  let sortedApplications = applications?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let applicationThisMonthGraph =
    giveMeApplicationsThisMonth(sortedApplications);

  let pendingApprovalGraph = sortedApplications?.filter(
    (element) =>
      element.status === Status.ELIGIBLE || element.status === Status.REVIEW
    // || element.status === Status.NOT_COMPLETED
  );

  let listOfPrograms = sortedApplications
    ? sortedApplications
        ?.map((app) => app.programs?.items)
        .map((p) => p?.map((pc) => pc?.program))
        .flat()
    : [];

  let topUniversitiesGraph = giveMeTopUniversities(listOfPrograms, 4);
  let topProgramsGraph = giveMeTopProgram(listOfPrograms, 4);
  let gpaSummaryGraph = getMeGpaSummary(sortedApplications);
  let weeklySummaryGraph = getMeWeeklySummary(sortedApplications);

  return (
    <PageComponent title={"Home"}>
      <div className="flex flex-col justify-between gap-4 mb-14">
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
            <BatchSelectorComponent
              batch={batch}
              updateBatch={updateBatch}
            ></BatchSelectorComponent>
            <PrimaryButton
              name={t("allApplicationsButton")}
              buttonClick={() => push("/applications")}
            ></PrimaryButton>

            <CSVLink
              filename={`${batch}-Applications-Summary-${new Date().toISOString()}.csv`}
              data={
                sortedApplications
                  ? [
                      ...sortedApplications.map((app, index) => {
                        let sortedProgramChoices = app.programs?.items?.sort(
                          (a, b) =>
                            (a?.choiceOrder ?? 0) - (b?.choiceOrder ?? 0)
                        );

                        return {
                          row: index + 1,
                          applicationId: app.id,
                          gpa: app.gpa,
                          status: app.status,
                          studentCPR: app.studentCPR,
                          dateTime: app.dateTime,
                          primaryProgramID:
                            sortedProgramChoices?.[0]?.program?.id,
                          primaryProgram: `${sortedProgramChoices?.[0]?.program?.name}-${sortedProgramChoices?.[0]?.program?.university?.name}`,
                          secondaryProgramID:
                            sortedProgramChoices?.[1]?.program?.id,
                          secondaryProgram: `${sortedProgramChoices?.[1]?.program?.name}-${sortedProgramChoices?.[1]?.program?.university?.name}`,
                        };
                      }),
                    ]
                  : []
              }
              className="text-xs hover:!text-white btn btn-primary btn-sm btn-outline"
            >
              {t("exportCSV")}
            </CSVLink>
          </div>
        </div>

        {/* mini graphs */}
        <div className="grid justify-between grid-cols-1 gap-8 mb-8 md:grid-cols-2 xl:grid-cols-3 min-h-fit">
          <MiniGraphInfo
            color={GraphColor.YELLOW}
            title={t("totalApplications")}
            graphNum={applications?.length ?? 0}
            graph={{
              labels: gpaSummaryGraph
                ? [...gpaSummaryGraph.map((perMonth) => perMonth.monthName)]
                : [],
              datasets: [
                {
                  data: gpaSummaryGraph
                    ? [...gpaSummaryGraph.map((perMonth) => perMonth.meanGpa)]
                    : [],
                },
              ],
            }}
          ></MiniGraphInfo>
          <MiniGraphInfo
            color={GraphColor.RED}
            title={t("applicationsThisMonth")}
            graphNum={applicationThisMonthGraph?.length ?? 0}
            graph={{
              labels: applicationThisMonthGraph
                ? [
                    ...applicationThisMonthGraph.map(
                      (app) => `${new Date(app.createdAt).getDate()}`
                    ),
                  ]
                : [],
              datasets: [
                {
                  data: applicationThisMonthGraph
                    ? [
                        ...applicationThisMonthGraph.map((app) =>
                          new Date(app.createdAt).getDate()
                        ),
                      ]
                    : [],
                },
              ],
            }}
          ></MiniGraphInfo>
          <MiniGraphInfo
            color={GraphColor.GREEN}
            title={t("pendingApplications")}
            graphNum={pendingApprovalGraph?.length ?? 0}
            graph={{
              labels: pendingApprovalGraph
                ? [...pendingApprovalGraph.map((app) => `${app.status}`)]
                : [],
              datasets: [
                {
                  data: pendingApprovalGraph
                    ? [...pendingApprovalGraph.map((app) => app.gpa ?? 0)]
                    : [],
                },
              ],
            }}
          ></MiniGraphInfo>
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
              title={t("weeklySummary")}
              barLabel={"Applications"}
              subBarLabel={"Applications last 7 days"}
              labels={weeklySummaryGraph.map((perDay) => perDay.dayName)}
              data={weeklySummaryGraph.map((perDay) => perDay.count)}
            >
              <CSVLink
                filename={`Weekly-Summary-${new Date().toISOString()}.csv`}
                data={
                  weeklySummaryGraph
                    ? [
                        ...weeklySummaryGraph.map((perDay) => {
                          return {
                            dayOfWeek: perDay.dayName,
                            numberOfApplications: perDay.count,
                          };
                        }),
                      ]
                    : []
                }
                className="text-xs text-white btn btn-primary btn-sm"
              >
                {t("exportCSV")}
              </CSVLink>
            </LargeBarGraphInfo>
            <LargeDonutGraphInfo
              title={t("topUniversities")}
              labels={topUniversitiesGraph.map((p) => p.name)}
              data={topUniversitiesGraph.map((p) => p.count)}
            >
              <CSVLink
                filename={`Top-Universities-${new Date().toISOString()}.csv`}
                data={
                  topUniversitiesGraph
                    ? [
                        ...topUniversitiesGraph.map((p) => {
                          return {
                            university: p.name,
                            numberOfApplications: p.count,
                          };
                        }),
                      ]
                    : []
                }
                className="text-xs text-white btn btn-primary btn-sm"
              >
                {t("exportCSV")}
              </CSVLink>
            </LargeDonutGraphInfo>
            <LargeBarGraphInfo
              title={t("gpaSummary")}
              barLabel={"GPA"}
              subBarLabel={"Mean of the applications"}
              min={85}
              max={100}
              labels={gpaSummaryGraph.map((perMonth) => perMonth.monthName)}
              data={gpaSummaryGraph.map((perMonth) => perMonth.meanGpa)}
            >
              <CSVLink
                filename={`GPA-Summary-${new Date().toISOString()}.csv`}
                data={
                  gpaSummaryGraph
                    ? [
                        ...gpaSummaryGraph.map((perMonth) => {
                          return {
                            month: perMonth.monthName,
                            meanGpa: perMonth.meanGpa,
                          };
                        }),
                      ]
                    : []
                }
                className="text-xs text-white btn btn-primary btn-sm"
              >
                {t("exportCSV")}
              </CSVLink>
            </LargeBarGraphInfo>
            <LargeDonutGraphInfo
              title={t("topProgram")}
              labels={topProgramsGraph.map((p) => p.name)}
              data={topProgramsGraph.map((p) => p.count)}
            >
              <CSVLink
                filename={`Top-Programs-${new Date().toISOString()}.csv`}
                data={
                  topProgramsGraph
                    ? [
                        ...topProgramsGraph.map((p) => {
                          return {
                            program: p.name,
                            numberOfApplications: p.count,
                          };
                        }),
                      ]
                    : []
                }
                className="text-xs text-white btn btn-primary btn-sm"
              >
                {t("exportCSV")}
              </CSVLink>
            </LargeDonutGraphInfo>
          </div>
        </div>
      </div>
    </PageComponent>
  );
};

export default Home;
