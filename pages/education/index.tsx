import React, { useEffect, useState } from "react";
import { PageComponent } from "../../components/page-component";
import {
  EducationTableHeaders,
  MasterEducationTableHeaders,
} from "../../constants/table-headers";
import { useEducation } from "../../context/EducationContext";
import {
  BahrainUniversities,
  MasterAppliedUniversities,
  Program,
  University,
} from "../../src/API";
import { useRouter } from "next/router";
import SecondaryButton from "../../components/secondary-button";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/use-auth";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../src/utils";
import { Checkbox } from "../../components/ui/checkbox";
import { useAppContext } from "../../context/AppContext";
import { useQuery } from "@tanstack/react-query";
import {
  listAllBahrainUniversities,
  listAllMasterUniversities,
} from "../../src/CustomAPI";
import { BMTabs } from "../../components/BMTabs";
import { MasterUniTabs } from "../../components/MasterUniTabs";
import MasterUniversitiesTable from "../../components/universities/MasterUniversitiesTable";
import AddMasterUniversityDialog from "../../components/universities/AddMasterUniversityDialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";

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
  const { push, locale } = useRouter();
  const { isSuperAdmin } = useAuth();
  const { type } = useAppContext();
  const { t } = useTranslation("education");
  const { t: tCommon } = useTranslation("common");
  const { t: tErrors } = useTranslation("errors");

  // const [searchValue, setSearchValue] = useState("");
  const [resultList, setResultList] = useState<any>([]);
  const [masterUniResultList, setMasterUniResultList] = useState<any>([]);
  const [bahrainiUniResultList, setBahrainiUniResultList] = useState<any>([]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCreateMasterUniSubmitted, setIsCreateMasterUniSubmitted] =
    useState<boolean>(false);

  // Table Data Pagination
  const elementPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableForward, setDisableForward] = useState(false);
  const [disableBackward, setDisableBackward] = useState(true);
  const [shownData, setShownData] = useState<University[] | undefined>([]);
  const [uniType, setUniType] = useState<"bahrainiUni" | "masterUni">(
    "bahrainiUni"
  );

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMasterUniDialogOpen, setIsAddMasterUniDialogOpen] =
    useState<boolean>(false);

  const initialFilterValues: InitialFilterValues = {
    search: "",
    activeStatus: "",
  };

  const initialValues = {
    universityName: "",
    universityArName: "",
    universityAvailability: 0,
  };

  const { data: bahrainiUniversities } = useQuery({
    queryKey: ["bahrainiUniversities"],
    queryFn: () => listAllBahrainUniversities(),
  });

  const { data: masterUniversities } = useQuery({
    queryKey: ["masterUniversities"],
    queryFn: () => listAllMasterUniversities(),
  });

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
      const tempShowData = resultList?.slice(
        (currentPage - 1) * elementPerPage,
        currentPage * elementPerPage
      );
      setShownData(tempShowData);
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
    setBahrainiUniResultList(bahrainiUniversities);
    setMasterUniResultList(masterUniversities);
    return () => {};
  }, [universityList, bahrainiUniversities, masterUniversities]);
  // Table Data Pagination

  function resetList() {
    setResultList(universityList);
  }

  //filter through uni and program list
  function search(searchValue: string, isDisabled: string) {
    let searchUniResult = universityList
      ?.filter((value) => {
        let sameUniName = (locale == "ar" ? value.nameAr ?? "-" : value.name)
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
        let haveProgramWithName = value.Programs?.items?.filter((prog) =>
          (locale == "ar" ? prog?.nameAr ?? "-" : prog?.name)
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
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

  // filter through master universities
  function searchMasterUniversities(searchValue: string, isDisabled: string) {
    let searchMasterUniResult = masterUniversities
      ?.filter((value) => {
        let sameUniName = (
          locale == "ar" ? value.universityNameAr ?? "-" : value.universityName
        )
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());

        if (sameUniName) {
          return true;
        } else {
          return false;
        }
      })
      .filter((value: MasterAppliedUniversities) => {
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

    if (searchMasterUniResult) {
      setMasterUniResultList(searchMasterUniResult);
    }
  }

  // filter through bahrain universities
  function searchBahrainiUniversities(searchValue: string, isDisabled: string) {
    let searchBahrainiUniResult = bahrainiUniversities
      ?.filter((value) => {
        let sameUniName = (
          locale == "ar" ? value.universityNameAr ?? "-" : value.universityName
        )
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());

        if (sameUniName) {
          return true;
        } else {
          return false;
        }
      })
      .filter((value: BahrainUniversities) => {
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

    if (searchBahrainiUniResult) {
      setBahrainiUniResultList(searchBahrainiUniResult);
    }
  }

  // allow admins to add, edit university and related program info here
  return (
    <PageComponent title={"Education"}>
      <Toaster />
      <div className="mb-8">
        <div className="text-2xl font-semibold">
          {t(type === "masters" ? "m_educationTitle" : "educationTitle")}
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

          if (type === "bachelor") {
            search(values.search, values.activeStatus);
          }

          if (type === "masters") {
            if (uniType === "bahrainiUni") {
              searchBahrainiUniversities(values.search, values.activeStatus);
            } else {
              searchMasterUniversities(values.search, values.activeStatus);
            }
          }

          actions.setSubmitting(false);
        }}
      >
        {({ values, handleChange, isSubmitting, isValid }) => (
          <Form>
            <div className="flex flex-wrap gap-4 justify-between items-center p-4 my-8 w-full rounded-xl border md:flex-row border-nccGray-100 bg-nccGray-100">
              <div className="grow">
                <Field
                  className="w-full input input-bordered"
                  type="text"
                  name="search"
                  placeholder={`${tCommon("search")}...`}
                  onChange={handleChange}
                  value={values.search}
                ></Field>
              </div>
              <div>
                <div>
                  <Field
                    dir="ltr"
                    className="select select-bordered"
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
              {isSuperAdmin && (
                <div className="flex">
                  <div className="h-full w-[1px] bg-gray-300"></div>

                  {type === "bachelor" && (
                    <div className="flex gap-4">
                      <button
                        className="min-w-[8rem] px-4 py-2 border-2 border-anzac-400 rounded-xl bg-anzac-400 text-white text-xs font-bold hover:cursor-pointer"
                        onClick={() => setIsSubmitted(!isSubmitted)}
                      >
                        {t("addUniversityButton")}
                      </button>
                      <SecondaryButton
                        name={t("addProgramsButton")}
                        buttonClick={() => {
                          push("/education/programs/addProgram");
                        }}
                      ></SecondaryButton>
                    </div>
                  )}
                  {type === "masters" && (
                    <Dialog
                      open={isAddMasterUniDialogOpen}
                      onOpenChange={setIsAddMasterUniDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className=" bg-transparent min-w-[8rem] px-4 py-2 border-2 border-anzac-500 rounded-xl text-anzac-500 text-xs font-bold hover:cursor-pointer"
                        >
                          {t("addUniversityButton")}
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <AddMasterUniversityDialog
                          masterUniversities={masterUniversities}
                          bahrainiUniversities={bahrainiUniversities}
                          onCreateUniversity={(res) => {
                            if (res) {
                              setIsAddMasterUniDialogOpen(false);
                            }
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>

      {/* modal dialogue - adds bachelor universities to db */}
      <div className={` modal ${isSubmitted && "modal-open"}`}>
        <div className="relative modal-box">
          <label
            onClick={() => setIsSubmitted(!isSubmitted)}
            className="absolute top-2 right-2 btn btn-sm btn-circle"
          >
            ✕
          </label>
          <div className="p-4 mb-4">
            <div className="text-lg font-bold">{t("addUniversityButton")}</div>
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={yup.object({
                  universityName: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                  universityArName: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                  universityAvailability:
                    type === "bachelor"
                      ? yup
                          .number()
                          .integer()
                          .required(`${tErrors("requiredField")}`)
                      : yup.number().integer(),
                })}
                onSubmit={async (values) => {
                  if (type === "bachelor") {
                    let uniFound = universityList
                      ?.filter((value) => value._deleted !== true)
                      .find(
                        (value) =>
                          value.name?.toLowerCase() ===
                          values.universityName.toLowerCase()
                      );

                    if (uniFound) {
                      toast.error(t("aUniversityAlreadyExistsWithTheSameName"));
                    } else {
                      setIsSubmitted(true);
                      toast
                        .promise(
                          addNewUniversity(
                            values.universityName,
                            values.universityArName,
                            values.universityAvailability
                          ).catch((error) => {
                            throw error;
                          }),
                          {
                            loading: "Loading...",
                            success: () => {
                              return t(`universitySuccessfullyAdded`);
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
                  }

                  if (type === "masters") {
                    let uniFound: boolean = false;

                    let masterUniAlreadyExists = masterUniversities
                      ?.filter((value) => value._deleted !== true)
                      .find(
                        (value) =>
                          value.universityName?.toLowerCase() ===
                          values.universityName.toLowerCase()
                      );

                    let bahrainiUniAlreadyExists = bahrainiUniversities
                      ?.filter((value) => value._deleted !== true)
                      .find(
                        (value) =>
                          value.universityName?.toLowerCase() ===
                          values.universityName.toLowerCase()
                      );

                    if (masterUniAlreadyExists || bahrainiUniAlreadyExists) {
                      uniFound = true;
                    } else {
                      uniFound = false;
                    }

                    if (uniFound) {
                      toast.error(t("aUniversityAlreadyExistsWithTheSameName"));
                    } else {
                      setIsSubmitted(true);
                      toast
                        .promise(
                          addNewUniversity(
                            values.universityName,
                            values.universityArName,
                            values.universityAvailability
                          ).catch((error) => {
                            throw error;
                          }),
                          {
                            loading: "Loading...",
                            success: () => {
                              return t(`universitySuccessfullyAdded`);
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
                    console.log(
                      `Add university form values: ${JSON.stringify(
                        values
                      )}, already exists? ${uniFound}`
                    );
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
                    <div className="flex flex-col">
                      <label className="label">
                        {t("addUniversityArName")}
                      </label>
                      <Field
                        name="universityArName"
                        type="text"
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input input-bordered input-primary ${
                          errors.universityArName && "input-error"
                        }`}
                      />
                      <label className="label-text-alt text-error">
                        {errors.universityArName &&
                          touched.universityArName &&
                          errors.universityArName}
                      </label>
                    </div>
                    <div className="flex flex-col">
                      <label className="label">{t("availability")}</label>
                      <Field
                        name="universityAvailability"
                        type="number"
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={type === "masters"}
                        className={`input input-bordered input-primary ${
                          errors.universityAvailability && "input-error"
                        }`}
                      />
                      <label className="label-text-alt text-error">
                        {errors.universityAvailability &&
                          touched.universityAvailability &&
                          errors.universityAvailability}
                      </label>
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-primary`}
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting && <span className="loading"></span>}
                      {t("submit")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Education Table */}
      {type === "bachelor" && (
        <div>
          <div className="overflow-x-auto w-full rounded-xl border">
            <table className="table w-full border-b table-auto">
              <thead className="">
                <tr>
                  {EducationTableHeaders.map((title, index) => (
                    <th className="bg-nccGray-100" key={index}>
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
                      className={cn(
                        `hover:bg-anzac-50 hover:text-anzac-500`,
                        index % 2 !== 0 && "bg-anzac-50",
                        datum.isDeactivated && " bg-gray-200"
                      )}
                    >
                      <td
                        key={`${datum.id}-isDeactivated`}
                        className="bg-transparent"
                      >
                        <div
                          className={`flex justify-between hover:cursor-pointer ${
                            datum.isDeactivated && "text-gray-400"
                          }`}
                          onClick={() =>
                            push(`/education/universities/${datum.id}`)
                          }
                        >{`${
                          locale == "ar" ? datum.nameAr ?? "-" : datum.name
                        }`}</div>
                      </td>
                      <td
                        key={`${datum.id}-availability`}
                        className="bg-transparent"
                      >
                        <div
                          className={`flex justify-between hover:cursor-pointer ${
                            datum.isDeactivated && "text-gray-400"
                          }`}
                        >{`${datum.availability}`}</div>
                      </td>
                      <td
                        key={`${datum.id}-isException`}
                        className="bg-transparent"
                      >
                        <Checkbox
                          className="pointer-events-none"
                          checked={datum.isException === 1}
                        />
                      </td>
                      <td
                        key={`${datum.id}-isExtended`}
                        className="bg-transparent"
                      >
                        <Checkbox
                          className="pointer-events-none"
                          checked={datum.isExtended === 1}
                        />
                      </td>
                      <td
                        key={`${datum.id}-extensionDuration`}
                        className="bg-transparent"
                      >
                        {`${datum.extensionDuration ?? 0} ${t("days")}`}
                      </td>
                      <td className="flex overflow-x-scroll flex-wrap gap-3 bg-transparent">
                        {datum.Programs?.items
                          ?.sort((a: any, b: any) => {
                            let bD = b.isDeactivated === true ? -1 : 1;
                            return bD;
                          })
                          .map((program: Program) => (
                            <Badge
                              variant={
                                program.isDeactivated
                                  ? "destructive"
                                  : "default"
                              }
                              className={cn(
                                "hover:cursor-pointer",
                                !program.isDeactivated &&
                                  "bg-anzac-200 text-black hover:bg-anzac-400"
                              )}
                              onClick={() =>
                                push(`/education/programs/${program.id}`)
                              }
                              key={program.id}
                            >
                              {locale == "ar"
                                ? program?.nameAr ?? "-"
                                : program?.name}
                            </Badge>
                          ))}

                        {datum.Programs?.items.length === 0 && (
                          <div className="badge badge-error text-error-content">
                            {t("noPrograms")}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* fake pagination */}
            <div className="flex justify-center my-4">
              <div className="join">
                <button
                  className="btn btn-accent join-item text-anzac-500"
                  onClick={goPrevPage}
                  disabled={disableBackward}
                >
                  «
                </button>
                <button
                  disabled
                  className="btn hover:cursor-auto join-item disabled:btn-accent"
                >
                  {currentPage}
                </button>
                <button
                  className="btn btn-accent join-item text-anzac-500"
                  onClick={goNextPage}
                  disabled={disableForward}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "masters" && (
        <>
          <div className="pb-4">
            <MasterUniTabs type={uniType} onChange={setUniType} />
          </div>
          <MasterUniversitiesTable
            uniType={uniType}
            university={
              uniType === "bahrainiUni"
                ? bahrainiUniResultList
                : masterUniResultList
            }
          />
        </>
      )}
    </PageComponent>
  );
};

export default Education;
