import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useStudent } from "../context/StudentContext";
import { Application, Student } from "../src/API";
import StudentInfoComponent from "./student-info-component";
import Link from "next/link";
import ParentsInfoComponent from "./parents-info-component";
import { formatDate, formatDateTime } from "../src/Helpers";

export default function StudentsPageComponent() {
  const { t } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");
  const { getStudentInfo } = useStudent();

  const [firstSearchDone, setFirstSearchDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student | undefined>(undefined);

  interface IStudentForm {
    cpr: string;
  }

  const initialValues: IStudentForm = {
    cpr: "",
  };

  return (
    <div>
      {/* Form to select a data */}
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          cpr: yup
            .string()
            .min(9, `${tErrors("cprShouldBe9")}`)
            .max(9, `${tErrors("cprShouldBe9")}`)
            .required(`${tErrors("requiredField")}`),
        })}
        onSubmit={async (values, actions) => {
          setLoading(true);
          setFirstSearchDone(true);
          const _student = await getStudentInfo(values.cpr);
          setStudent(_student);
          setLoading(false);
          actions.setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          isValid,
        }) => (
          <Form className="container flex flex-col w-full max-w-md gap-6 mx-auto">
            <div className="flex flex-col">
              <label className="label">{t("cpr")}</label>
              <Field
                name="cpr"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                className={`input input-bordered input-primary ${
                  errors.cpr && "input-error"
                }`}
              />
              <label className="label-text-alt text-error">
                {errors.cpr && errors.cpr}
              </label>
            </div>
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting && "loading"}`}
              disabled={isSubmitting || !isValid}
            >
              {t("searchForStudent")}
            </button>
          </Form>
        )}
      </Formik>

      {/* Show selected student data */}
      <div className="flex flex-col items-center p-4 mt-6 border border-gray-200 rounded-lg">
        {!firstSearchDone && <div>{t("searchForStudentUsingCPR")}</div>}

        {loading && <div>{t("loading")}</div>}

        {!student && !loading && firstSearchDone && <div>{t("noData")}</div>}

        {student && !loading && (
          <div className={"flex flex-col w-full"}>
            <StudentInfoComponent
              showAll
              student={student}
            ></StudentInfoComponent>
            <ParentsInfoComponent
              parents={student?.ParentInfo}
            ></ParentsInfoComponent>
            <div>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="rounded-b-none">{t("applications")}</th>
                  </tr>
                </thead>
              </table>
              <div className="flex items-center gap-6 py-2 overflow-hidden overflow-x-scroll">
                {student.applications &&
                student.applications.items.filter(
                  (app) => app?._deleted !== true
                ).length > 0 ? (
                  student.applications?.items
                    .filter((app) => app?._deleted !== true)
                    .sort((a, b) => {
                      if (!a || !b) {
                        return -1;
                      }
                      // Assuming dateTime is a property on the application objects
                      const dateA = new Date(a.dateTime).setHours(0, 0, 0, 0);
                      const dateB = new Date(b.dateTime).setHours(0, 0, 0, 0);

                      // Compare the date values of dateTime in descending order
                      if (dateA > dateB) {
                        return -1;
                      } else if (dateA < dateB) {
                        return 1;
                      } else {
                        // If date values are equal, compare by updatedAt in descending order
                        const updatedAtA = a.updatedAt;
                        const updatedAtB = b.updatedAt;

                        if (updatedAtA > updatedAtB) {
                          return -1;
                        } else if (updatedAtA < updatedAtB) {
                          return 1;
                        } else {
                          return 0;
                        }
                      }
                    })
                    .map((item, index) => (
                      <ApplicationCard
                        key={index}
                        application={item}
                      ></ApplicationCard>
                    ))
                ) : (
                  <div className="p-3 border min-w-[18rem] text-center flex flex-col gap-1 border-gray-200 bg-zinc-50 hover:bg-zinc-100 stat card">
                    {t("noData")}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface IApplicationCard {
  application: Application | null;
}

function ApplicationCard({ application }: IApplicationCard) {
  const { t } = useTranslation("applications");
  const { t: tAL } = useTranslation("applicationLog");
  return (
    <div>
      {!application && <div>null</div>}
      {application && (
        <Link href={`/applications/${application.id}`}>
          <div className="p-3 border min-w-[18rem] flex flex-col gap-1 border-gray-200 bg-zinc-50 hover:bg-zinc-100 stat card">
            <div className="flex items-center justify-between">
              <p className="stat-desc"> {t("tableTitleApplicationDate")} </p>
              <div className="stat-desc">
                {formatDate(new Date(application.dateTime))}
              </div>
            </div>
            <div className="text-xl stat-value">
              {t(`${application.status}`)}
            </div>
            <div className="stat-desc">
              {t("tableTitleLastUpdate")}{" "}
              {formatDateTime(new Date(application.updatedAt))}
            </div>
            <div className="stat-desc">
              {tAL("emailHasBeenSent")}:{" "}
              {application.isEmailSent ? tAL("yes") : tAL("no")}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
