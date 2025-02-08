import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  BahrainUniversities,
  CreateBahrainUniversitiesMutationVariables,
  CreateMasterAppliedUniversitiesMutationVariables,
  MasterAppliedUniversities,
} from "../../src/API";
import { useEducation } from "../../context/EducationContext";

interface Props {
  masterUniversities: MasterAppliedUniversities[] | undefined;
  bahrainiUniversities: BahrainUniversities[] | undefined;
  onCreateUniversity: (res: boolean) => void;
}
const AddMasterUniversityDialog = ({
  masterUniversities,
  bahrainiUniversities,
  onCreateUniversity,
}: Props) => {
  const { addNewMasterUniversity, addNewBahrainiUniversity } = useEducation();
  const { t } = useTranslation("education");
  const { t: tErrors } = useTranslation("errors");
  const { t: tCommon } = useTranslation("common");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialValues = {
    universityName: "",
    universityArName: "",
    availability: 0,
    universityType: [] as string[],
  };

  return (
    <>
      <div className="p-4 mb-4 ">
        <div className="text-lg font-bold">
          {t("addUniversityButton")} {tCommon("forMasters")}
        </div>
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
              availability: yup.number().min(0),
              universityType: yup
                .array()
                .min(1, `${tErrors("requiredField")}`)
                .required(`${tErrors("requiredField")}`),
            })}
            onSubmit={async (values) => {
              setIsLoading(true);
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

              if (
                values.universityType.includes("mastersUni") &&
                masterUniAlreadyExists
              ) {
                uniFound = true;
              }

              if (
                values.universityType.includes("bahrainiUni") &&
                bahrainiUniAlreadyExists
              ) {
                uniFound = true;
              }

              if (uniFound) {
                toast.error(t("aUniversityAlreadyExistsWithTheSameName"));
              } else {
                if (values.universityType.includes("mastersUni")) {
                  let createMasterUniversityVariableInput: CreateMasterAppliedUniversitiesMutationVariables =
                    {
                      input: {
                        universityName: values.universityName,
                        universityNameAr: values.universityArName,
                        availability: values.availability.toString(),
                      },
                    };

                  await toast
                    .promise(
                      addNewMasterUniversity(
                        createMasterUniversityVariableInput
                      ).catch((err) => {
                        throw err;
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
                      return val;
                    })
                    .catch((err) => {
                      console.log(err);
                    })
                    .finally(() => {});
                }

                if (values.universityType.includes("bahrainiUni")) {
                  let createBahrainiUniversityVariableInput: CreateBahrainUniversitiesMutationVariables =
                    {
                      input: {
                        universityName: values.universityName,
                        universityNameAr: values.universityArName,
                        availability: values.availability.toString(),
                      },
                    };
                  //   isOpen = !isOpen;
                  // setIsSubmitted(true);
                  await toast
                    .promise(
                      addNewBahrainiUniversity(
                        createBahrainiUniversityVariableInput
                      ).catch((err) => {
                        throw err;
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
                      setIsLoading(false);
                      onCreateUniversity(true);
                      // return val;
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
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
                  <label className="label">{t("addUniversityArName")}</label>
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
                    name="availability"
                    type="number"
                    placeholder=""
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input input-bordered input-primary ${
                      errors.availability && "input-error"
                    }`}
                  />
                  <label className="label-text-alt text-error">
                    {errors.availability &&
                      touched.availability &&
                      errors.availability}
                  </label>
                </div>
                {/* Change this to type */}
                <div
                  className=" py-4"
                  role="group"
                  aria-labelledby="checkbox-group"
                >
                  <label className="">{t("masterUniType")}</label>
                  <p className=" text-sm text-muted-foreground pb-4">
                    {t("masterUniTypeDescription")}
                  </p>
                  <div className=" flex flex-col gap-4">
                    <label className=" flex items-center">
                      <Field
                        className="checkbox-primary rounded-sm"
                        type="checkbox"
                        name="universityType"
                        value="bahrainiUni"
                      />
                      <label htmlFor="isBahrainiUni" className=" pl-2">
                        {tCommon("bahrainiUnis")}
                      </label>
                    </label>
                    <label className=" flex items-center">
                      <Field
                        className="checkbox-primary rounded-sm"
                        type="checkbox"
                        name="universityType"
                        value="mastersUni"
                      />
                      <label htmlFor="isMastersUni" className=" pl-2">
                        {tCommon("mastersUnis")}
                      </label>
                    </label>
                    <label className="label-text-alt text-error">
                      {errors.universityType &&
                        touched.universityType &&
                        errors.universityType}
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary`}
                  disabled={isSubmitting || isLoading || !isValid}
                >
                  {isSubmitting && <span className="loading"></span>}
                  {t("submit")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddMasterUniversityDialog;
