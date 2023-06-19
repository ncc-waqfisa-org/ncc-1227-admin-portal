import { Field, Form, Formik } from "formik";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Toaster } from "react-hot-toast";
import { BsFillEyeFill } from "react-icons/bs";
import { HiOutlineClipboardList } from "react-icons/hi";
import { PageComponent } from "../../components/page-component";
import { StudentsTableHeaders } from "../../constants/table-headers";
import { useEducation } from "../../context/EducationContext";
import { useStudent } from "../../context/StudentContext";
import { Application, ProgramChoice, SchoolType, Status } from "../../src/API";
import { getStatusOrder } from "../../src/Helpers";
import { BatchSelectorComponent } from "../../components/batch-selector-component";

interface InitialFilterValues {
  search: string;
  applicationStatus: string;
  schoolType: string;
  university: string;
  program: string;
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "applications",
        "pageTitles",
        "signIn",
        "applicationLog",
        "common",
        "errors",
      ])),
    },
  };
};

const Applications = () => {
  const initialFilterValues: InitialFilterValues = {
    search: "",
    applicationStatus: "",
    schoolType: "",
    university: "",
    program: "",
  };

  const { applications, students, batch, updateBatch } = useStudent();
  const { universityList, programsList } = useEducation();
  const { push, locale } = useRouter();
  const { t } = useTranslation("applications");
  const { t: common } = useTranslation("common");

  // Table Data Pagination
  const elementPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableForward, setDisableForward] = useState(false);
  const [disableBackward, setDisableBackward] = useState(true);
  const [shownData, setShownData] = useState<Application[] | undefined>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application[]>(
    []
  );

  // let selectedApplication: Application[] = [];

  let sortedApplications = applications
    ?.sort(
      (a, b) =>
        (a.student?.householdIncome ?? 0) - (b.student?.householdIncome ?? 0)
    )
    .sort((a, b) => (b.gpa ?? 0) - (a.gpa ?? 0))
    .sort((a, b) => {
      if (a.status && b.status) {
        if (getStatusOrder(b.status) > getStatusOrder(a.status)) return 1;
        if (getStatusOrder(b.status) < getStatusOrder(a.status)) return -1;
      }
      return 0;
    });

  useEffect(() => {
    setNumberOfPages(
      Math.ceil((sortedApplications?.length ?? 0) / elementPerPage)
    );

    return () => {};
  }, [sortedApplications?.length]);

  useEffect(() => {
    setDisableBackward(true);
    setDisableForward(true);

    if (currentPage > 1) {
      setDisableBackward(false);
    }

    if (currentPage < numberOfPages) {
      setDisableForward(false);
    }

    return () => {};
  }, [currentPage, numberOfPages]);

  useEffect(() => {
    function paginate() {
      setShownData(
        sortedApplications?.slice(
          (currentPage - 1) * elementPerPage,
          currentPage * elementPerPage
        )
      );
    }
    paginate();
    return () => {};
  }, [sortedApplications, currentPage]);

  function addToSelected(app: Application) {
    setSelectedApplication([...selectedApplication, app]);
  }
  function removeFromSelected(app: Application) {
    setSelectedApplication(
      selectedApplication.filter((a: Application) => a.id !== app.id)
    );
  }

  function goNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function goPrevPage() {
    setCurrentPage(currentPage - 1);
  }

  function findStudentName(id: string) {
    return students?.find((value) => value.cpr === id)?.fullName;
  }
  // Table Data Pagination

  function filter(values: InitialFilterValues) {
    let filteredApplications = sortedApplications?.filter(
      (element) =>
        (findStudentName(element.studentCPR)
          ?.toLowerCase()
          .includes(values.search.toLowerCase()) ||
          element.studentCPR
            .toLowerCase()
            .includes(values.search.toLowerCase())) &&
        (values.applicationStatus
          ? element.status === values.applicationStatus
          : true) &&
        (values.program
          ? element.programs?.items.find(
              (p) => p?.program?.name === values.program
            )
          : true) &&
        (values.university
          ? element.programs?.items.find(
              (p) => p?.program?.university?.name === values.university
            )
          : true) &&
        (values.schoolType ? element.schoolType === values.schoolType : true)
    );

    setShownData(filteredApplications);
  }

  function resetFilters() {
    setShownData(sortedApplications);
    setSelectedApplication([]);
  }

  return (
    <PageComponent title={"Applications"}>
      <Toaster />
      <div className="flex flex-wrap items-center justify-between mb-8 ">
        <div className="flex flex-col items-start gap-3 ">
          <div className="">
            <div className="text-2xl font-semibold ">
              {t("applicationTitle")}
            </div>
            <div className="text-base font-medium text-gray-500">
              {t("applicationSubtitle")}
            </div>
          </div>
          <Link
            href="/applications/archive"
            className="btn btn-ghost btn-sm text-primary hover:bg-primary/30"
          >
            {t("archives")}
          </Link>
        </div>

        <BatchSelectorComponent
          batch={batch}
          updateBatch={updateBatch}
        ></BatchSelectorComponent>
      </div>

      {/* applications search bar */}
      <div className="flex items-center w-full p-4 my-8 border border-nccGray-100 rounded-xl bg-nccGray-100">
        <div className="flex w-full gap-4 ">
          <Formik
            initialValues={initialFilterValues}
            onSubmit={(values) => {
              filter(values);
            }}
          >
            {({ values, handleChange, handleReset }) => (
              <Form className="flex flex-wrap items-end gap-3 p-4">
                {/* Search Bar */}
                <div>
                  <div className="text-sm font-semibold text-gray-500 ">
                    {common("search")}
                  </div>
                  <div>
                    <Field
                      className="input input-bordered"
                      type="text"
                      name="search"
                      placeholder={`${common("search")}...`}
                      onChange={handleChange}
                      value={values.search}
                    ></Field>
                  </div>
                </div>

                {/* Status filter */}
                <div>
                  <div className="text-sm font-semibold text-gray-500 ">
                    {t("searchStatus")}
                  </div>
                  <div>
                    <Field
                      dir="ltr"
                      className="input input-bordered min-w-[10rem]"
                      as="select"
                      name="applicationStatus"
                      onChange={handleChange}
                      value={values.applicationStatus}
                    >
                      <option value={""}>{common("all")}</option>

                      {Object.keys(Status).map((status) => (
                        <option value={status} key={status}>
                          {t(status)}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                {/* School Type filter */}
                <div>
                  <div className="text-sm font-semibold text-gray-500 ">
                    {t("searchSchoolType")}
                  </div>
                  <div>
                    <Field
                      dir="ltr"
                      className="input input-bordered min-w-[10rem]"
                      as="select"
                      name="schoolType"
                      onChange={handleChange}
                      value={values.schoolType}
                    >
                      <option value={""}>{common("all")}</option>

                      {Object.keys(SchoolType).map((type) => (
                        <option value={type} key={type}>
                          {t(type)}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                {/* University filter */}
                <div>
                  <div className="text-sm font-semibold text-gray-500 ">
                    {t("searchUniversity")}
                  </div>
                  <div>
                    <Field
                      dir="ltr"
                      className="input input-bordered"
                      as="select"
                      name="university"
                      onChange={handleChange}
                      value={values.university}
                    >
                      <option value={""}>{common("all")}</option>
                      {universityList?.map((uni) => (
                        <option key={`${uni.id}`} value={`${uni.name}`}>
                          {uni.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                {/* Program filter */}
                <div>
                  <div className="text-sm font-semibold text-gray-500 ">
                    {t("searchProgram")}
                  </div>
                  <div>
                    <Field
                      dir="ltr"
                      className="input input-bordered"
                      as="select"
                      name="program"
                      onChange={handleChange}
                      value={values.program}
                    >
                      <option value={""}>{common("all")}</option>
                      {programsList?.map((program, index) => (
                        <option key={index} value={`${program.name}`}>
                          {program.name}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 ">
                  <button
                    type="submit"
                    className={`min-w-[8rem] px-4 py-2 border-2 border-anzac-400 btn btn-primary btn-md bg-anzac-400 text-white text-xs font-bold hover:cursor-pointer`}
                  >
                    {t("applyFilters")}
                  </button>
                  <div
                    onClick={() => {
                      handleReset();
                      resetFilters();
                    }}
                    className=" btn btn-ghost min-w-fit"
                  >
                    {t("resetFilters")}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* applications table with pagination*/}
      {(shownData?.length ?? 0) > 0 ? (
        <div>
          <div dir="ltr" className="w-full h-screen overflow-x-auto">
            <table className="table w-full ">
              <thead className="border rounded-xl border-nccGray-100">
                <tr>
                  {StudentsTableHeaders.map((title, index) =>
                    index !== 0 ? (
                      index === StudentsTableHeaders.length - 1 ? (
                        <th
                          key={index}
                          className={`sticky right-0 bg-nccGray-100 `}
                        >
                          {""}
                        </th>
                      ) : (
                        <th
                          className={` bg-nccGray-100 ${
                            index === 1 && `sticky left-14`
                          }`}
                          key={index}
                        >
                          {t(title)}
                        </th>
                      )
                    ) : selectedApplication.length > 0 ? (
                      <th className=" bg-nccGray-100" key={index}>
                        <CSVLink
                          className="text-xs hover:!text-white btn btn-primary btn-sm btn-outline"
                          filename={`${batch}-Applications-${new Date().toISOString()}.csv`}
                          data={[
                            ...selectedApplication.map((app, index) => {
                              let sortedProgramChoices:
                                | (ProgramChoice | null)[]
                                | undefined = app.programs?.items?.sort(
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
                          ]}
                          key={index}
                          onClick={() => {
                            setSelectedApplication([]);
                          }}
                        >
                          CSV
                        </CSVLink>
                      </th>
                    ) : (
                      <th className=" bg-nccGray-100" key={index}>
                        {""}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {shownData?.map((datum: any, index: number) => (
                  <tr key={index}>
                    <th key={datum?.id}>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          title="selectApplications"
                          checked={
                            selectedApplication.find(
                              (app: Application) => app.id === datum.id
                            ) !== undefined
                          }
                          onChange={(event) => {
                            if (event.target.checked) {
                              addToSelected(datum as Application);
                            } else {
                              removeFromSelected(datum as Application);
                            }
                          }}
                        />
                      </label>
                    </th>
                    <td className="sticky left-14">
                      <div className="flex flex-col justify-between ">
                        <div className="text-sm font-semibold ">{`${findStudentName(
                          datum.studentCPR
                        )}`}</div>
                        <div className="text-sm ">{`${datum.studentCPR}`}</div>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge text-sm font-semibold 
                        ${
                          // (datum.status === Status.NOT_COMPLETED && "") ||
                          datum.status === Status.REVIEW &&
                          "text-primary-content badge-accent"
                        } 
                        ${
                          datum.status === Status.WITHDRAWN ||
                          (datum.status === Status.REJECTED &&
                            "text-error-content badge-error")
                        } 
                        ${
                          datum.status === Status.APPROVED &&
                          "text-success-content badge-success"
                        }
                        ${
                          datum.status === Status.ELIGIBLE &&
                          "text-info-content badge-info"
                        }
                        mr-2`}
                      >{`${t(datum.status)}`}</div>
                    </td>

                    <td>
                      <div className="flex justify-between ">
                        {datum.schoolType}
                      </div>
                    </td>

                    <td>
                      <div className="flex justify-between ">{datum.gpa}</div>
                    </td>

                    <td>
                      <div className="flex flex-col gap-4 ">
                        {datum.programs?.items.map(
                          (value: any, index: number) => (
                            <div
                              key={index}
                              className=""
                            >{`${value?.program?.name} - ${value?.program?.university?.name}`}</div>
                          )
                        )}
                      </div>
                    </td>
                    <td>
                      <div
                        dir={locale === "en" ? "ltr" : "rtl"}
                        className="flex justify-between "
                      >{`${Intl.DateTimeFormat(locale ?? "en", {
                        timeStyle: "short",
                        dateStyle: "medium",
                      }).format(new Date(datum.dateTime))}`}</div>
                    </td>
                    <td>
                      <div
                        dir={locale === "en" ? "ltr" : "rtl"}
                        className="flex justify-between "
                      >{`${Intl.DateTimeFormat(locale ?? "en", {
                        timeStyle: "short",
                        dateStyle: "medium",
                      }).format(new Date(datum.updatedAt))}`}</div>
                    </td>
                    <td>
                      <div
                        dir={locale === "en" ? "ltr" : "rtl"}
                        className="flex justify-between "
                      >
                        {datum.status === Status.APPROVED
                          ? datum.isEmailSent
                            ? t("yes")
                            : t("no")
                          : "-"}
                      </div>
                    </td>

                    <td className="sticky right-0 min-w-fit">
                      <div className="flex flex-col justify-center">
                        <div className="flex flex-col p-1 bg-white rounded-lg ">
                          <div
                            className="flex justify-start gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                            onClick={() => {
                              push(`/applications/${datum.id}`);
                            }}
                          >
                            <BsFillEyeFill />
                            {t("view")}
                          </div>
                          <div
                            className="flex !flex-nowrap justify-start gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                            onClick={() => {
                              push(
                                `/applications/applicationHistory/${datum.id}`
                              );
                            }}
                          >
                            <HiOutlineClipboardList />
                            <p>{t("adminsLogs")}</p>
                          </div>
                          <div
                            className="flex !flex-nowrap justify-start gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                            onClick={() => {
                              push(`/studentLogs/${datum.id}`);
                            }}
                          >
                            <HiOutlineClipboardList />
                            <p>{t("studentsLogs")}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot></tfoot>
            </table>
            {/* fake pagination */}
            <div className="flex justify-center mt-8 ">
              <div className="btn-group">
                <button
                  className="btn btn-accent text-anzac-500"
                  onClick={goPrevPage}
                  disabled={disableBackward}
                >
                  «
                </button>
                <button
                  disabled
                  className="btn hover:cursor-auto disabled:btn-accent"
                >
                  {currentPage}
                </button>
                <button
                  className="btn btn-accent text-anzac-500"
                  onClick={goNextPage}
                  disabled={disableForward}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 border border-nccGray-100 rounded-xl bg-nccGray-100">
          <div className="text-base font-medium ">{t("noData")}</div>
        </div>
      )}
    </PageComponent>
  );
};

export default Applications;
