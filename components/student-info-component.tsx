import React from "react";
import { useTranslation } from "react-i18next";
import { Student } from "../src/API";
import GetStorageLinkComponent from "./get-storage-link-component";

interface Props {
  student: Student | null | undefined;
  showAll?: boolean;
}

//View student info - student name, cpr and email address
export default function StudentInfoComponent({ student, showAll }: Props) {
  const { t } = useTranslation("applications");
  return (
    <div dir="ltr">
      <table className="table w-full mb-4 table-fixed">
        <thead>
          <tr>
            <th>{t("studentField")}</th>
            <th>{t("value")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("fullName")}</td>
            <td>{student?.fullName}</td>
          </tr>
          <tr>
            <td>{t("cpr")}</td>
            <td>{student?.cpr}</td>
          </tr>
          <tr>
            <td>{t("studentCPRdoc")}</td>
            <td className="overflow-x-scroll ">
              <GetStorageLinkComponent
                storageKey={student?.cprDoc}
                showName
              ></GetStorageLinkComponent>
            </td>
          </tr>
          <tr>
            <td>{t("emailAddress")}</td>
            <td>{student?.email}</td>
          </tr>
          <tr>
            <td>{t("phoneNumber")}</td>
            <td>{student?.phone}</td>
          </tr>
          <tr>
            <td>{t("address")}</td>
            <td className="overflow-x-scroll ">{student?.address}</td>
          </tr>
          {showAll && (
            <>
              <tr>
                <td>{t("gender")}</td>
                <td className="overflow-x-scroll ">{student?.gender}</td>
              </tr>
              <tr>
                <td>{t("graduationDate")}</td>
                <td className="overflow-x-scroll ">
                  {student?.graduationDate}
                </td>
              </tr>
              <tr>
                <td>{t("nationality")}</td>
                <td className="overflow-x-scroll ">{student?.nationality}</td>
              </tr>
              <tr>
                <td>{t("placeOfBirth")}</td>
                <td className="overflow-x-scroll ">{student?.placeOfBirth}</td>
              </tr>
              <tr>
                <td>{t("preferredLanguage")}</td>
                <td className="overflow-x-scroll ">
                  {student?.preferredLanguage}
                </td>
              </tr>
              <tr>
                <td>{t("schoolName")}</td>
                <td className="overflow-x-scroll ">{student?.schoolName}</td>
              </tr>
              <tr>
                <td>{t("schoolType")}</td>
                <td className="overflow-x-scroll ">{student?.schoolType}</td>
              </tr>
              <tr>
                <td>{t("specialization")}</td>
                <td className="overflow-x-scroll ">
                  {student?.specialization}
                </td>
              </tr>
              <tr>
                <td>{t("studentOrderAmongSiblings")}</td>
                <td className="overflow-x-scroll ">
                  {student?.studentOrderAmongSiblings}
                </td>
              </tr>
            </>
          )}
          <tr>
            <td>{t("familyIncome")}</td>
            <td className="overflow-x-scroll ">{student?.familyIncome}</td>
          </tr>
          <tr>
            <td>{t("familyIncomeProof")}</td>
            <td>
              <div className="flex flex-col p-3 rounded-lg bg-zinc-100">
                <div className="flex flex-wrap items-center gap-2">
                  {student?.familyIncomeProofDocs?.map((doc, index) => (
                    <div key={index} className="">
                      <GetStorageLinkComponent
                        storageKey={doc}
                        showName
                      ></GetStorageLinkComponent>
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
