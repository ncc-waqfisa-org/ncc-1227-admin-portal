import React, { useEffect, useState } from "react";
import { PageComponent } from "../../components/page-component";
import { EducationTableHeaders } from "../../constants/table-headers";
import { useEducation } from "../../context/EducationContext";
import { Program, University } from "../../src/API";
import { useRouter } from "next/router";
import SecondaryButton from "../../components/secondary-button";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useTranslation } from "react-i18next";

interface InitialFilterValues {
  search: string;
  activeStatus: string;
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "education",
        "pageTitles",
        "signIn",
        "common",
        "errors",
      ])),
    },
  };
};

const Education = () => {
  const { universityList, addNewUniversity, syncUniList } = useEducation();
  const { push } = useRouter();
  const { t } = useTranslation("education");
  const { t: common } = useTranslation("common");
  const { t: tErrors } = useTranslation("errors");

  // const [searchValue, setSearchValue] = useState("");
  const [resultList, setResultList] = useState<any>([]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Table Data Pagination
  const elementPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableForward, setDisableForward] = useState(false);
  const [disableBackward, setDisableBackward] = useState(true);
  const [shownData, setShownData] = useState<University[] | undefined>([]);

  const initialFilterValues: InitialFilterValues = {
    search: "",
    activeStatus: "",
  };

  const initialValues = {
    universityName: "",
  };

  useEffect(() => {
    setNumberOfPages(Math.ceil((resultList?.length ?? 0) / elementPerPage));

    return () => {};
  }, [resultList]);

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
        resultList?.slice(
          (currentPage - 1) * elementPerPage,
          currentPage * elementPerPage
        )
      );
    }

    paginate();

    return () => {};
  }, [currentPage, resultList]);

  function goNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function goPrevPage() {
    setCurrentPage(currentPage - 1);
  }

  useEffect(() => {
    setResultList(universityList);
    return () => {};
  }, [universityList]);
  // Table Data Pagination

  function resetList() {
    setResultList(universityList);
  }

  //filter through uni and program list
  function search(searchValue: string, isDisabled: string) {
    let searchUniResult = universityList
      ?.filter((value) => {
        let sameUniName = value.name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
        let haveProgramWithName = value.Programs?.items?.filter((prog) =>
          prog?.name?.toLowerCase().includes(searchValue.toLowerCase())
        );
        let isThereAnyPrograms = (haveProgramWithName ?? []).length > 0;

        if (sameUniName || isThereAnyPrograms) {
          return true;
        } else {
          return false;
        }
      })
      .filter((value: University) => {
        let temp = value.isDeactivated === true ? "Active" : "Inactive";

        if (isDisabled === "") {
          return true;
        }

        if (temp === isDisabled) {
          return false;
        } else {
          return true;
        }
      });

    if (searchUniResult) {
      setResultList(searchUniResult);
    }
  }

  // allow admins to add, edit university and related program info here
  return (
    <PageComponent title={"Education"}>
      <Toaster />
      <div className="mb-8 ">
        <div className="text-2xl font-semibold ">{t("educationTitle")}</div>
        <div className="text-base font-medium text-gray-500 ">
          {t("educationSubtitle")}
        </div>
      </div>

      {/* search bar */}

      <Formik
        initialValues={initialFilterValues}
        validationSchema={yup.object({})}
        onSubmit={async (values, actions) => {
          if (values.search === "") {
            resetList();
          }
          search(values.search, values.activeStatus);

          actions.setSubmitting(false);
        }}
      >
        {({ values, handleChange, isSubmitting, isValid }) => (
          <Form>
            <div className="flex flex-wrap items-center justify-between w-full gap-4 p-4 my-8 border md:flex-row border-nccGray-100 rounded-xl bg-nccGray-100">
              <div className="grow">
                <Field
                  className="w-full input input-bordered"
                  type="text"
                  name="search"
                  placeholder={`${common("search")}...`}
                  onChange={handleChange}
                  value={values.search}
                ></Field>
              </div>
              <div>
                <div>
                  <Field
                    dir="ltr"
                    className="input input-bordered"
                    as="select"
                    name="activeStatus"
                    onChange={handleChange}
                    value={values.activeStatus}
                  >
                    <option value={""}>{t("all")}</option>
                    <option value={"Active"}>{t("active")}</option>
                    <option value={"Inactive"}>{t("inactive")}</option>
                  </Field>
                </div>
              </div>
              <button
                type="submit"
                className={`min-w-[8rem] px-4 py-2 border-2 border-anzac-400 rounded-xl bg-anzac-400 text-white text-xs font-bold hover:cursor-pointer ${
                  isSubmitting && "loading"
                }`}
                disabled={isSubmitting || !isValid}
              >
                {t("applyButton")}
              </button>
              <div className="flex gap-4 ">
                <div className="h-full w-[1px] bg-gray-300"></div>
                <div
                  className="min-w-[8rem] px-4 py-2 border-2 border-anzac-400 rounded-xl bg-anzac-400 text-white text-xs font-bold hover:cursor-pointer"
                  onClick={() => setIsSubmitted(!isSubmitted)}
                >
                  {t("addUniversityButton")}
                </div>
                <SecondaryButton
                  name={t("addProgramsButton")}
                  buttonClick={() => {
                    push("/education/programs/addProgram");
                  }}
                ></SecondaryButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* modal dialogue - adds university to db */}
      <div className={` modal ${isSubmitted && "modal-open"}`}>
        <div className="relative modal-box">
          <label
            onClick={() => setIsSubmitted(!isSubmitted)}
            className="absolute btn btn-sm btn-circle right-2 top-2"
          >
            ✕
          </label>
          <div className="p-4 mb-4 ">
            <div className="text-lg font-bold">{t("addUniversityButton")}</div>
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={yup.object({
                  universityName: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                })}
                onSubmit={async (values) => {
                  let uniFound = universityList
                    ?.filter((value) => value._deleted !== true)
                    .find(
                      (value) =>
                        value.name?.toLowerCase() ===
                        values.universityName.toLowerCase()
                    );

                  if (uniFound) {
                    toast.error("aUniversityAlreadyExistsWithTheSameName");
                  } else {
                    setIsSubmitted(true);
                    toast
                      .promise(
                        addNewUniversity(values.universityName).catch(
                          (error) => {
                            throw error;
                          }
                        ),
                        {
                          loading: "Loading...",
                          success: () => {
                            return `universitySuccessfullyAdded`;
                          },
                          error: (error) => {
                            return `${error?.message}`;
                          },
                        }
                      )
                      .then(async (val) => {
                        await syncUniList();

                        return val;
                      })
                      .catch((err) => {
                        console.log(err);
                      })
                      .finally(() => {
                        setIsSubmitted(false);
                      });
                  }
                }}
              >
                {({
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                  isValid,
                }) => (
                  <Form className="flex flex-col gap-3 p-4">
                    <div className="flex flex-col">
                      <label className="label">{t("addUniversityName")}</label>
                      <Field
                        name="universityName"
                        type="text"
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input input-bordered input-primary ${
                          errors.universityName && "input-error"
                        }`}
                      />
                      <label className="label-text-alt text-error">
                        {errors.universityName &&
                          touched.universityName &&
                          errors.universityName}
                      </label>
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-primary ${isSubmitting && "loading"}`}
                      disabled={isSubmitting || !isValid}
                    >
                      Submit
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Education Table */}
      <div dir="ltr">
        <div className="w-full h-screen overflow-x-auto">
          <table className="table w-full table-auto">
            <thead className="">
              <tr>
                {EducationTableHeaders.map((title, index) => (
                  <th className=" bg-nccGray-100" key={index}>
                    {t(title)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shownData
                ?.sort((a, b) => {
                  let bD = b.isDeactivated === true ? -1 : 1;
                  return bD;
                })
                .map((datum: any, index: number) => (
                  <tr
                    key={index}
                    className={` hover:bg-anzac-50 hover:text-anzac-500 ${
                      datum.isDeactivated && " bg-gray-200"
                    }`}
                  >
                    <td key={datum.id} className="bg-transparent">
                      <div
                        className={`flex justify-between hover:cursor-pointer ${
                          datum.isDeactivated && "text-gray-400"
                        }`}
                        onClick={() =>
                          push(`education/universities/${datum.id}`)
                        }
                      >{`${datum.name}`}</div>
                    </td>
                    <td
                      className="overflow-x-scroll bg-transparent "
                      key={index}
                    >
                      {datum.Programs?.items
                        ?.sort((a: any, b: any) => {
                          let bD = b.isDeactivated === true ? -1 : 1;
                          return bD;
                        })
                        .map((program: Program) => (
                          <div
                            key={program?.id}
                            className={`mr-2 badge text-white hover:cursor-pointer hover:badge-warning duration-150 ${
                              !program.isDeactivated &&
                              "badge-accent text-primary-content"
                            }`}
                            onClick={() => {
                              push(`/education/programs/${program.id}`);
                            }}
                          >
                            {program?.name}
                          </div>
                        ))}

                      {datum.Programs?.items.length === 0 && (
                        <div className="badge badge-error text-error-content">
                          No Programs
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
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
    </PageComponent>
  );
};

export default Education;
