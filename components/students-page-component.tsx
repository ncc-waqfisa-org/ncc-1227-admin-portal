import { Formik, Form, Field } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useStudent } from "../context/StudentContext";
import {
  Application,
  BahrainUniversities,
  MasterApplication,
  Student,
} from "../src/API";
import Link from "next/link";
import { formatDate, formatDateTime } from "../src/Helpers";
import StudentUpdate from "./student/StudentUpdate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import UpdateParentInfo from "./student/UpdateParentInfo";
import { BMTabs } from "./BMTabs";
import MasterInfoForm from "./student/MasterInfoForm";

interface IStudentForm {
  cpr: string;
}

export default function StudentsPageComponent({
  universities,
}: {
  universities: BahrainUniversities[];
}) {
  const { t } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");
  const { getStudentInfo, applicantType } = useStudent();

  const [firstSearchDone, setFirstSearchDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student | undefined>(undefined);

  const [type, setType] = useState<"masters" | "bachelor">("bachelor");

  useEffect(() => {
    if (!applicantType.isBoth) {
      if (applicantType.isBachelor) {
        setType("bachelor");
      } else if (applicantType.isMaster) {
        setType("masters");
      }
    }

    return () => {};
  }, [applicantType]);

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
              className={`btn btn-primary`}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting && <span className="loading"></span>}
              {t("searchForStudent")}
            </button>
          </Form>
        )}
      </Formik>

      {/* Show selected student data */}
      {firstSearchDone && (
        <div className="flex flex-col items-center p-4 mt-6 border border-gray-200 rounded-lg">
          {loading && <div>{t("loading")}</div>}

          {!student && !loading && firstSearchDone && <div>{t("noData")}</div>}

          {applicantType.isBoth && !loading && (
            <div className="w-full max-w-2xl">
              <BMTabs
                type={type}
                onChange={setType}
                isBachelorDisabled={!applicantType.isBachelor}
                isMasterDisabled={!applicantType.isMaster}
              />
            </div>
          )}
          {student && !applicantType.isBoth && !loading && (
            <div className="flex items-center w-full max-w-xl p-4 my-6 space-x-4 border rounded-md">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {t("applicantType")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {applicantType.isBachelor && t("bachelor")}
                  {applicantType.isMaster && t("masters")}
                </p>
              </div>
            </div>
          )}

          {/* TODO: have update master student info */}

          {/* Bachelor */}
          {student &&
            !loading &&
            applicantType.isBachelor &&
            type === "bachelor" && (
              <div className="flex flex-col w-full">
                <Accordion
                  className="w-full"
                  type="single"
                  defaultValue="studentInformation"
                  collapsible
                >
                  <AccordionItem value="studentInformation">
                    <AccordionTrigger className="text-xl font-medium">
                      {" "}
                      {t("studentInformation")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <StudentUpdate student={student} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="parentsInformation">
                    <AccordionTrigger className="text-xl font-medium">
                      {t("parentsInformation")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {student.ParentInfo && (
                        <UpdateParentInfo parentInfo={student.ParentInfo} />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className={"flex flex-col w-full gap-10"}>
                  <div>
                    <p className="py-3 text-xl font-medium">
                      {t("applications")}
                    </p>
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
                            const dateA = new Date(a.dateTime).setHours(
                              0,
                              0,
                              0,
                              0
                            );
                            const dateB = new Date(b.dateTime).setHours(
                              0,
                              0,
                              0,
                              0
                            );

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
              </div>
            )}

          {/* Masters */}
          {student &&
            !loading &&
            applicantType.isMaster &&
            type == "masters" && (
              <div className="flex flex-col w-full">
                <MasterInfoForm student={student} universities={universities} />

                {/* TODO: have master applications  */}

                <div className={"flex flex-col w-full gap-10"}>
                  <div>
                    <p className="py-3 text-xl font-medium">
                      {t("applications")}
                    </p>
                    <div className="flex items-center gap-6 py-2 overflow-hidden overflow-x-scroll">
                      {student.m_masterApplications &&
                      student.m_masterApplications.items.filter(
                        (app) => app?._deleted !== true
                      ).length > 0 ? (
                        student.m_masterApplications?.items
                          .filter((app) => app?._deleted !== true)
                          .sort((a, b) => {
                            if (!a || !b) {
                              return -1;
                            }
                            // Assuming dateTime is a property on the application objects
                            const dateA = new Date(a.dateTime).setHours(
                              0,
                              0,
                              0,
                              0
                            );
                            const dateB = new Date(b.dateTime).setHours(
                              0,
                              0,
                              0,
                              0
                            );

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
                            <MasterApplicationCard
                              key={index}
                              application={item}
                            ></MasterApplicationCard>
                          ))
                      ) : (
                        <div className="p-3 border min-w-[18rem] text-center flex flex-col gap-1 border-gray-200 bg-zinc-50 hover:bg-zinc-100 stat card">
                          {t("noData")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}
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
        <Link href={`/applications/masters/${application.id}`}>
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

interface IMasterApplicationCard {
  application: MasterApplication | null;
}

function MasterApplicationCard({ application }: IMasterApplicationCard) {
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
