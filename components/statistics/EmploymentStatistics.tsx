import { useTranslation } from "react-i18next";
import {
  THistogram,
  TMoreStatisticsIncomePerEmploymentStatus,
} from "../../src/custom-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const formatTableData = ({
  data,
  employmentStatus,
}: {
  data: TMoreStatisticsIncomePerEmploymentStatus;
  employmentStatus: "Employed" | "Unemployed";
}) => {
  const { t } = useTranslation("common");

  return Object.entries(data[employmentStatus])
    .map(([key, value]) => {
      if (key !== "total") {
        const histogram: THistogram = value as THistogram;
        return {
          incomeRange:
            key === "LESS_THAN_1500"
              ? `${t("bellow1500")}`
              : `${t("above1500")}`,
          female: histogram.female,
          male: histogram.male,
          total: histogram.total,
        };
      }
      return null;
    })
    .filter(Boolean);
};

export default function EmploymentStatistics({
  data,
}: {
  data: TMoreStatisticsIncomePerEmploymentStatus;
}) {
  const { t } = useTranslation("common");

  return (
    <div className="py-4 mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex gap-2 items-baseline">
              <div className="text-4xl font-bold">{data.Employed.total}</div>
              {t("employed")} - ({t("applicantIncome")})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Income Range</TableHead>
                <TableHead>Female</TableHead>
                <TableHead>Male</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formatTableData({ data, employmentStatus: "Employed" }).map(
                (row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row?.incomeRange}</TableCell>
                    <TableCell>
                      {row?.female} (
                      {row?.incomeRange === "Less than 1500"
                        ? `+${data.Employed.LESS_THAN_1500.todayFemale} ${t(
                            "today"
                          )}`
                        : `+${data.Employed.MORE_THAN_1500.todayFemale} ${t(
                            "today"
                          )}`}
                      )
                    </TableCell>
                    <TableCell>
                      {row?.male} (
                      {row?.incomeRange === "Less than 1500"
                        ? `+${data.Employed.LESS_THAN_1500.todayMale} ${t(
                            "today"
                          )}`
                        : `+${data.Employed.MORE_THAN_1500.todayMale} ${t(
                            "today"
                          )}`}
                      )
                    </TableCell>
                    <TableCell>{row?.total}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex gap-2 items-baseline">
              <div className="text-4xl font-bold">{data.Unemployed.total}</div>
              {t("unemployed")} - ({t("guardianIncome")})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Income Range</TableHead>
                <TableHead>Female</TableHead>
                <TableHead>Male</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formatTableData({ data, employmentStatus: "Unemployed" }).map(
                (row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row?.incomeRange}</TableCell>
                    <TableCell>
                      {row?.female} (
                      {row?.incomeRange === "Less than 1500"
                        ? `+${data.Unemployed.LESS_THAN_1500.todayFemale} ${t(
                            "today"
                          )}`
                        : `+${data.Unemployed.MORE_THAN_1500.todayFemale} ${t(
                            "today"
                          )}`}
                      )
                    </TableCell>
                    <TableCell>
                      {row?.male} (
                      {row?.incomeRange === "Less than 1500"
                        ? `+${data.Unemployed.LESS_THAN_1500.todayMale} ${t(
                            "today"
                          )}`
                        : `+${data.Unemployed.MORE_THAN_1500.todayMale} ${t(
                            "today"
                          )}`}
                      )
                    </TableCell>
                    <TableCell>{row?.total}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
