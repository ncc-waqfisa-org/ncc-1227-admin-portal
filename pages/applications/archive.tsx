import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { BsFillEyeFill } from "react-icons/bs";
import { HiDotsVertical, HiOutlineClipboardList } from "react-icons/hi";
import { PageComponent } from "../../components/page-component";
import { StudentsTableHeaders } from "../../constants/table-headers";
import { useStudent } from "../../context/StudentContext";
import { Application, ProgramChoice, Status } from "../../src/API";
import { getStatusOrder } from "../../src/Helpers";

interface InitialFilterValues {
  search: string;
  applicationStatus: string;
  university: string;
  program: string;
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from "next";
import { getAllApprovedApplicationsAPI } from "../../src/CustomAPI";
import { BatchSelectorComponent } from "../../components/batch-selector-component";

const defaultBatch = new Date().getFullYear();

interface Props {
  applications: Application[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;

  const applications =
    (await getAllApprovedApplicationsAPI(defaultBatch)) ?? [];

  return {
    props: {
      applications: applications,
      ...(await serverSideTranslations(locale ?? "en", [
        "applications",
        "pageTitles",
        "signIn",
        "errors",
      ])),
    },
  };
};

const ArchivePage: FC<Props> = ({ applications: initialApplications }) => {
  const { t } = useTranslation("applications");

  const { students } = useStudent();
  const { push, locale } = useRouter();

  const [batch, setBatch] = useState<number>(defaultBatch);
  const isInitialMount = useRef(true);

  // Table Data Pagination
  const elementPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableForward, setDisableForward] = useState(false);
  const [disableBackward, setDisableBackward] = useState(true);
  const [applications, setApplications] = useState<Application[] | undefined>(
    initialApplications
  );
  const [shownData, setShownData] = useState<Application[] | undefined>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application[]>(
    []
  );

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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      toast
        .promise(getAllApprovedApplicationsAPI(batch), {
          loading: "loading..",
          success: "fetched applications successfully",
          error: "Failed to fetch applications",
        })
        .then((newApplications) => {
          setApplications(newApplications);
        });
    }

    return () => {};
  }, [batch]);

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

  return (
    <PageComponent title={"ApplicationsArchive"}>
      <Toaster />
      <div className="flex flex-wrap items-center justify-between mb-8 ">
        <div className="flex flex-col items-start gap-3">
          <div className="">
            <div className="text-2xl font-semibold ">
              {t("applicationArchiveTitle")}
            </div>
            <div className="text-base font-medium text-gray-500 ">
              {t("applicationArchiveSubtitle")}
            </div>
          </div>
          <CSVLink
            className="text-xs hover:!text-white btn btn-primary btn-sm btn-outline"
            filename={`${batch}-Applications-${new Date().toISOString()}.csv`}
            data={[
              ...(applications ?? []).map((app, index) => {
                let sortedProgramChoices: (ProgramChoice | null)[] | undefined =
                  app.programs?.items?.sort(
                    (a, b) => (a?.choiceOrder ?? 0) - (b?.choiceOrder ?? 0)
                  );

                return {
                  row: index + 1,
                  applicationId: app.id,
                  gpa: app.gpa,
                  status: app.status,
                  studentCPR: app.studentCPR,
                  dateTime: app.dateTime,
                  primaryProgramID: sortedProgramChoices?.[0]?.program?.id,
                  primaryProgram: `${sortedProgramChoices?.[0]?.program?.name}-${sortedProgramChoices?.[0]?.program?.university?.name}`,
                  secondaryProgramID: sortedProgramChoices?.[1]?.program?.id,
                  secondaryProgram: `${sortedProgramChoices?.[1]?.program?.name}-${sortedProgramChoices?.[1]?.program?.university?.name}`,
                };
              }),
            ]}
            onClick={() => {
              setSelectedApplication([]);
            }}
          >
            {t("exportAllAsCSV")}
          </CSVLink>
        </div>
        <BatchSelectorComponent
          batch={batch}
          updateBatch={setBatch}
        ></BatchSelectorComponent>
      </div>

      {(shownData?.length ?? 0) > 0 ? (
        <div>
          <div dir="ltr" className="w-full h-screen overflow-x-auto">
            <table className="table w-full ">
              <thead className="border rounded-xl border-nccGray-100">
                <tr>
                  {StudentsTableHeaders.map((title, index) =>
                    index !== 0 ? (
                      <th className=" bg-nccGray-100" key={index}>
                        {t(title)}
                      </th>
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
                    <td>
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
                          (datum.status === Status.NOT_COMPLETED && "") ||
                          (datum.status === Status.REVIEW &&
                            "text-primary-content badge-accent")
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
                      }).format(new Date(datum.createdAt))}`}</div>
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
                      <div className="flex justify-end ">
                        <button className="relative btn btn-ghost btn-xs group">
                          <HiDotsVertical />
                          <div className="absolute flex-col hidden p-1 bg-white rounded-lg shadow-lg right-6 top-5 group-focus:flex min-w-min">
                            <div
                              className="flex justify-start w-24 gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                              onClick={() => {
                                push(`/applications/${datum.id}`);
                              }}
                            >
                              <BsFillEyeFill />
                              {t("view")}
                            </div>
                            <div
                              className="flex justify-start w-24 gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                              onClick={() => {
                                push(
                                  `/applications/applicationHistory/${datum.id}`
                                );
                              }}
                            >
                              <HiOutlineClipboardList />
                              {t("history")}
                            </div>
                          </div>
                        </button>
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

export default ArchivePage;
