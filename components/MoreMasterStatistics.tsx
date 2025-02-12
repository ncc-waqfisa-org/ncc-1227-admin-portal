import React, { FC, useMemo } from "react";
import {
  TMastersStatistics,
  TMoreStatisticsIncomePerEmploymentStatus,
  TStatistics,
} from "../src/custom-types";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import EmploymentStatistics from "./statistics/EmploymentStatistics";

type TMoreStatistics = {
  statistics: TMastersStatistics;
};

export const MoreMasterStatistics: FC<TMoreStatistics> = ({ statistics }) => {
  const { t } = useTranslation("common");

  const uniApplications = useMemo(
    () =>
      Object.keys(statistics.totalApplicationsPerUniversity)
        .map((uni) => ({
          uni: uni,
          value: statistics.totalApplicationsPerUniversity[uni],
        }))
        .sort((a, b) => b.value - a.value),
    [statistics]
  );
  const statusApplications = useMemo(
    () =>
      Object.keys(statistics.totalApplicationsPerStatus)
        .map((status) => ({
          status: status,
          value: statistics.totalApplicationsPerStatus[status],
        }))
        .sort((a, b) => b.value - a.value),
    [statistics]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-center">
        <p className="text-3xl font-semibold">{t("moreStatistics")}</p>
        <div className="flex flex-wrap gap-10 w-fit">
          <div className="flex gap-2 items-center">
            <div className="bg-[#D8D4BA] w-5 aspect-square rounded-sm"></div>
            <p>{t("males")}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-[#D9D9D9] w-5 aspect-square rounded-sm"></div>
            <p>{t("females")}</p>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3"> */}
      <div className="space-y-4 columns-1 xl:columns-2">
        {/* School type */}

        {/* Masters Applicant Income */}
        {statistics.incomePerEmploymentStatus && (
          <EmploymentStatistics data={statistics.incomePerEmploymentStatus} />
        )}

        {/* Total Students */}

        {/* Total Applications */}
        {statistics.applicationPerGenderHistogram && (
          <Card className="break-inside-avoid-column">
            <CardHeader>
              <CardTitle>{t("totalApplications")}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 justify-between items-center">
              <div>
                <div className="text-4xl font-bold">
                  {statistics.applicationPerGenderHistogram?.total}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +{statistics.applicationPerGenderHistogram.todayTotal}{" "}
                  {t("today")}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-[#D8D4BA] p-2 rounded-lg">
                  <div className="text-2xl font-bold">
                    {statistics.applicationPerGenderHistogram?.male}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    +{statistics.applicationPerGenderHistogram.todayMale}{" "}
                    {t("today")}
                  </p>
                </div>
                <div className="bg-[#D9D9D9] p-2 rounded-lg">
                  <div className="text-2xl font-bold">
                    {statistics.applicationPerGenderHistogram?.female}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    +{statistics.applicationPerGenderHistogram.todayFemale}{" "}
                    {t("today")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Register Account Per Gender */}
        {statistics.registerAccountsPerGender && (
          <Card className="break-inside-avoid-column">
            <CardHeader>
              <CardTitle>{t("totalRegisteredAccounts")}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 justify-between items-center">
              <div>
                <div className="text-4xl font-bold">
                  {statistics.registerAccountsPerGender?.total}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +{statistics.registerAccountsPerGender.todayTotal ?? 0}{" "}
                  {t("today")}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-[#D8D4BA] p-2 rounded-lg">
                  <div className="text-2xl font-bold">
                    {statistics.registerAccountsPerGender?.male}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    +{statistics.registerAccountsPerGender.todayMale ?? 0}{" "}
                    {t("today")}
                  </p>
                </div>
                <div className="bg-[#D9D9D9] p-2 rounded-lg">
                  <div className="text-2xl font-bold">
                    {statistics.registerAccountsPerGender?.female}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    +{statistics.registerAccountsPerGender.todayFemale ?? 0}{" "}
                    {t("today")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total applications per status */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>{t("totalApplicationsPerStatus")}</CardTitle>
          </CardHeader>
          {/* totalApplicationsPerStatus */}
          <CardContent className="flex flex-col gap-2">
            {statusApplications.map((item, i) => (
              <div className="flex gap-2 items-baseline" key={i}>
                <p className="flex-1">{item.status}</p>
                <p className="">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Total applications per university */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>{t("totalApplicationsPerUniversity")}</CardTitle>
          </CardHeader>
          {/* totalApplicationsPerStatus */}
          <CardContent className="flex flex-col gap-2">
            {uniApplications
              .sort((a, b) => a.uni.localeCompare(b.uni))
              .map((item, i) => (
                <div className="flex gap-2 items-baseline" key={i}>
                  <p className="flex-1">{item.uni}</p>
                  <p className="">{item.value}</p>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Majors per gender histogram */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>{t("majorPerGenderHistogram")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-end">
            <div className="flex flex-col flex-1 gap-2 p-2 w-full text-center rounded-xl border">
              <div className="grid grid-cols-5 gap-2">
                <p className="text-start">{t("majorScience")}</p>
                <div className="flex col-span-4 gap-4 items-end w-full">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA] rounded-lg">
                    {statistics.majorsPerGenderHistogram.Science.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9] rounded-lg">
                    {statistics.majorsPerGenderHistogram.Science.female}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                <p className="text-destructive text-start">{t("today")}</p>
                <div className="flex col-span-4 gap-4 items-end w-full">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA]/50 rounded-lg">
                    {statistics.majorsPerGenderHistogram.Science.todayMale}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9]/50 rounded-lg">
                    {statistics.majorsPerGenderHistogram.Science.todayFemale}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-2 p-2 w-full text-center rounded-xl border">
              <div className="grid grid-cols-5 gap-2">
                <p className="text-start">{t("majorTechnology")}</p>
                <div className="flex col-span-4 gap-4 items-end w-full">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA] rounded-lg">
                    {statistics.majorsPerGenderHistogram.Technology.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9] rounded-lg">
                    {statistics.majorsPerGenderHistogram.Technology.female}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                <p className="text-destructive text-start">{t("today")}</p>
                <div className="flex col-span-4 gap-4 items-end w-full">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA]/50 rounded-lg">
                    {statistics.majorsPerGenderHistogram.Technology.todayMale}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9]/50 rounded-lg">
                    {statistics.majorsPerGenderHistogram.Technology.todayFemale}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-2 p-2 w-full text-center rounded-xl border">
              <div className="grid grid-cols-5 gap-2">
                <p className="text-start">{t("majorEngineering")}</p>
                <div className="flex col-span-4 gap-4 items-end w-full">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA] rounded-lg">
                    {statistics.majorsPerGenderHistogram.Engineering.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9] rounded-lg">
                    {statistics.majorsPerGenderHistogram.Engineering.female}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                <p className="text-destructive text-start">{t("today")}</p>
                <div className="flex col-span-4 gap-4 items-end w-full">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA]/50 rounded-lg">
                    {statistics.majorsPerGenderHistogram.Engineering.todayMale}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9]/50 rounded-lg">
                    {
                      statistics.majorsPerGenderHistogram.Engineering
                        .todayFemale
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
