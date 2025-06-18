import { Formik, Form, Field } from "formik";
import React, { useEffect, useRef, useState } from "react";
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
import { ApplicationsIcon, SearchIcon } from "./icons";
import { cn } from "../src/utils";
import StudentInfoCard from "./student/StudentInfoCard";

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

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstSearchDone && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [firstSearchDone]);

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
    <div className="relative grow">
      <div
        ref={formRef}
        className={`transition-all duration-500 ease-in-out ${
          firstSearchDone
            ? "z-50 px-4 pt-4 pb-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-xl shadow-black/10"
            : "flex justify-center items-center min-h-[80svh]"
        }`}
      >
        <div className={` mx-auto ${firstSearchDone ? "w-full" : ""}`}>
          <header
            className={`text-center mb-6 ${
              firstSearchDone ? "animate-cpr-fade-down" : ""
            }`}
          >
            <div className="inline-block p-2 mb-4 bg-yellow-100 rounded-full">
              <ApplicationsIcon size={40} className="text-[#e1ba3d]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t("applicantSearch")}
            </h1>
          </header>
          <div className="flex justify-center flex-col items-center gap-6">
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
                setStudent(undefined);
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
                <Form className="container flex flex-col gap-6 w-full max-w-md">
                  <div className="mb-4 w-full">
                    <label
                      htmlFor="cpr"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      {t("applicantCPR")}
                    </label>
                    <Field
                      name="cpr"
                      type="text"
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e1ba3d]",
                        errors.cpr && "border-error"
                      )}
                      placeholder={t("applicantCPR")}
                    />
                    {errors.cpr && (
                      <label className="label-text-alt text-error">
                        {errors.cpr}
                      </label>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`w-full bg-[#e1ba3d] gap-4 text-white py-2 px-4 disabled:bg-gray-400 rounded-md hover:bg-[#c9a636] focus:outline-none focus:ring-2 focus:ring-[#e1ba3d] focus:ring-offset-2 flex items-center justify-center transition-all duration-300 ${
                      loading ? "" : ""
                    }`}
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting && (
                      <span className="animate-pulse loading"></span>
                    )}
                    {!isSubmitting && <SearchIcon size={20} />}
                    {loading ? t("searching") : t("applicantSearch")}
                  </button>
                </Form>
              )}
            </Formik>
            <div
              className={cn(
                "w-0 opacity-0  duration-300",
                student && "w-full  opacity-100"
              )}
            >
              {student && (
                <StudentInfoCard
                  student={student}
                  bachelorApplicationStatus={
                    student.applications &&
                    student.applications.items.filter(
                      (app) => app?._deleted !== true
                    ).length > 0
                      ? "Yes"
                      : "No"
                  }
                  masterApplicationStatus={
                    student.applications &&
                    student.applications.items.filter(
                      (app) => app?._deleted !== true
                    ).length > 0
                      ? "Yes"
                      : "No"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {firstSearchDone && student && (
        <div className="isolate z-20 px-4 py-8 mx-auto max-w-4xl flex flex-col gap-6">
          <div>
            {/* Show selected student data */}
            {firstSearchDone && (
              <div className="flex z-10 flex-col items-center p-4 mt-6 bg-white rounded-lg border border-gray-200 animate-cpr-fade-in-up">
                {loading && <div>{t("loading")}</div>}

                {!student && !loading && firstSearchDone && (
                  <div>{t("noData")}</div>
                )}

                {applicantType.isBoth && !loading && (
                  <div className="py-4 w-full max-w-2xl">
                    <BMTabs
                      type={type}
                      onChange={setType}
                      isBachelorDisabled={!applicantType.isBachelor}
                      isMasterDisabled={!applicantType.isMaster}
                    />
                  </div>
                )}
                {/* {student && !applicantType.isBoth && !loading && (
                  <div className="flex items-center p-4 my-6 space-x-4 max-w-xl rounded-md border pe-10">
                    <ApplicationsIcon className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
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
                )} */}

                {/* Bachelor */}
                {student &&
                  !loading &&
                  applicantType.isBachelor &&
                  type === "bachelor" && (
                    <div className="flex flex-col w-full max-w-3xl">
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
                              <UpdateParentInfo
                                parentInfo={student.ParentInfo}
                              />
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className={"flex flex-col gap-10 w-full"}>
                        <div>
                          <p className="py-3 text-xl font-medium">
                            {t("applications")}
                          </p>
                          <div className="flex overflow-hidden overflow-x-scroll gap-6 items-center py-2">
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
                    <div className="flex flex-col w-full max-w-3xl">
                      <MasterInfoForm
                        student={student}
                        // universities={universities}
                      />

                      <div className={"flex flex-col gap-10 w-full"}>
                        <div>
                          <p className="py-3 text-xl font-medium">
                            {t("MApplications")}
                          </p>
                          <div className="flex overflow-hidden overflow-x-scroll gap-6 items-center py-2">
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
        </div>
      )}

      {firstSearchDone && !student && (
        <div className="flex z-10 flex-col items-center p-4 mx-auto mt-6 max-w-4xl bg-white rounded-lg border border-gray-200 animate-cpr-fade-in-up">
          <p>{t("noApplicantWithThisCPR")}</p>
        </div>
      )}

      {/* Background SVG */}
      <svg
        className="isolate fixed bottom-0 left-0 z-10 w-full h-auto pointer-events-none"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          fill="#e1ba3d"
          fillOpacity="0.05"
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
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
            <div className="flex justify-between items-center">
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
        <Link href={`/applications/masters/${application.id}`}>
          <div className="p-3 border min-w-[18rem] flex flex-col gap-1 border-gray-200 bg-zinc-50 hover:bg-zinc-100 stat card">
            <div className="flex justify-between items-center">
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
