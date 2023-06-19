import { t } from "chart.js/dist/chunks/helpers.core";
import React from "react";
import { useTranslation } from "react-i18next";
import { ParentInfo } from "../src/API";

interface Props {
  parents: ParentInfo | null | undefined;
}
export default function ParentsInfoComponent({ parents }: Props) {
  const { t } = useTranslation("applications");
  return (
    <div dir="ltr">
      <table className="table w-full mb-4 table-fixed">
        <thead>
          <tr>
            <th>{t("parentField")}</th>
            <th>{t("value")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("guardianName")}</td>
            <td>{parents?.guardianFullName ?? "-"}</td>
          </tr>
          <tr>
            <td>{t("guardianCPR")}</td>
            <td>{parents?.guardianCPR ?? "-"}</td>
          </tr>
          <tr>
            <td>{t("guardianRelation")}</td>
            <td>{parents?.relation ?? "-"}</td>
          </tr>

          <tr>
            <td>{t("fatherName")}</td>
            <td className={`${!parents?.fatherFullName && "text-error"}`}>
              {parents?.fatherFullName ?? "-"}
            </td>
          </tr>
          <tr>
            <td>{t("fatherCPR")}</td>
            <td className={`${!parents?.fatherCPR && "text-error"}`}>
              {parents?.fatherCPR ?? "-"}
            </td>
          </tr>
          <tr>
            <td>{t("motherName")}</td>
            <td className={`${!parents?.motherFullName && "text-error"}`}>
              {parents?.motherFullName ?? "-"}
            </td>
          </tr>
          <tr>
            <td>{t("motherCPR")}</td>
            <td className={`${!parents?.motherCPR && "text-error"}`}>
              {parents?.motherCPR ?? "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
