import React, { FC, useMemo } from "react";
import { TStatistics } from "../src/custom-types";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type TMoreStatistics = {
  statistics: TStatistics;
};

export const MoreStatistics: FC<TMoreStatistics> = ({ statistics }) => {
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
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-3xl font-semibold ">{t("moreStatistics")}</p>
        <div className="flex flex-wrap gap-10 w-fit">
          <div className="flex items-center gap-2">
            <div className="bg-[#D8D4BA] w-5 aspect-square rounded-sm"></div>
            <p>Males</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#D9D9D9] w-5 aspect-square rounded-sm"></div>
            <p>Females</p>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3 "> */}
      <div className="space-y-4 columns-1 xl:columns-2 2xl:columns-3">
        {/* School type */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>School Type</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-end gap-4">
            <div className="flex flex-col flex-1 w-full gap-2 p-2 text-center border rounded-xl">
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-start">Public</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA] rounded-lg">
                    {statistics.schoolType.public.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9] rounded-lg">
                    {statistics.schoolType.public.female}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-destructive text-start">Today</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA]/50 rounded-lg">
                    {statistics.schoolType.publicToday.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9]/50 rounded-lg">
                    {statistics.schoolType.publicToday.female}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 w-full gap-2 p-2 text-center border rounded-xl">
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-start">Private</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA] rounded-lg">
                    {statistics.schoolType.private.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9] rounded-lg">
                    {statistics.schoolType.private.female}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-destructive text-start">Today</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA]/50 rounded-lg">
                    {statistics.schoolType.privateToday.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9]/50 rounded-lg">
                    {statistics.schoolType.privateToday.female}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Income  */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>Family Income</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-end gap-4">
            <div className="flex flex-col flex-1 w-full gap-2 p-2 text-center border rounded-xl">
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-start">Above 1500</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA] rounded-lg">
                    {statistics.familyIncome.above1500.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9] rounded-lg">
                    {statistics.familyIncome.above1500.female}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-destructive text-start">Today</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA]/50 rounded-lg">
                    {statistics.familyIncome.above1500Today.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9]/50 rounded-lg">
                    {statistics.familyIncome.above1500Today.female}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 w-full gap-2 p-2 text-center border rounded-xl">
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-start">Bellow 1500</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA] rounded-lg">
                    {statistics.familyIncome.below1500.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9] rounded-lg">
                    {statistics.familyIncome.below1500.female}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 ">
                <p className="text-destructive text-start">Today</p>
                <div className="flex items-end w-full col-span-4 gap-4">
                  <p className="flex-1 px-2 py-1 bg-[#D8D4BA]/50 rounded-lg">
                    {statistics.familyIncome.below1500Today.male}
                  </p>
                  <p className="flex-1 px-2 py-1 bg-[#D9D9D9]/50 rounded-lg">
                    {statistics.familyIncome.below1500Today.female}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Students */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>Total Registered Accounts</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-2">
            <div>
              <div className="text-4xl font-bold">
                {statistics.students.total}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +{statistics.today.students.total} today
              </p>
            </div>
            <div className="flex gap-2">
              <div className="bg-[#D8D4BA] p-2 rounded-lg">
                <div className="text-2xl font-bold">
                  {statistics.students.male}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +{statistics.today.students.male} today
                </p>
              </div>
              <div className="bg-[#D9D9D9] p-2 rounded-lg">
                <div className="text-2xl font-bold">
                  {statistics.students.female}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +{statistics.today.students.female} today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Total Applications */}
        {statistics.today.applications && (
          <Card className="break-inside-avoid-column">
            <CardHeader>
              <CardTitle>Total Applications</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2">
              <div>
                <div className="text-4xl font-bold">
                  {statistics.applications?.total}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +{statistics.today.applications?.total} today
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-[#D8D4BA] p-2 rounded-lg">
                  <div className="text-2xl font-bold">
                    {statistics.applications?.male}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    +{statistics.today.applications?.male} today
                  </p>
                </div>
                <div className="bg-[#D9D9D9] p-2 rounded-lg">
                  <div className="text-2xl font-bold">
                    {statistics.applications?.female}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    +{statistics.today.applications?.female} today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total applications per status */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>Total Applications Per Status</CardTitle>
          </CardHeader>
          {/* totalApplicationsPerStatus */}
          <CardContent className="flex flex-col gap-2">
            {statusApplications.map((item, i) => (
              <div className="flex items-baseline gap-2" key={i}>
                <p className="flex-1">{item.status}</p>
                <p className="">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Total applications per university */}
        <Card className="break-inside-avoid-column">
          <CardHeader>
            <CardTitle>Total Applications Per University</CardTitle>
          </CardHeader>
          {/* totalApplicationsPerStatus */}
          <CardContent className="flex flex-col gap-2">
            {uniApplications.map((item, i) => (
              <div className="flex items-baseline gap-2" key={i}>
                <p className="flex-1">{item.uni}</p>
                <p className="">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
