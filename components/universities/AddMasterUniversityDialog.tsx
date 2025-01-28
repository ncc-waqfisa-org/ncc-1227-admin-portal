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
  isOpen: boolean;
  onClose: () => void;
}
const AddMasterUniversityDialog = ({
  masterUniversities,
  bahrainiUniversities,
  isOpen,
  onClose,
}: Props) => {
  const { addNewMasterUniversity, addNewBahrainiUniversity } = useEducation();
  const { t } = useTranslation("education");
  const { t: tErrors } = useTranslation("errors");
  const { t: tCommon } = useTranslation("common");

  const initialValues = {
    universityName: "",
    universityArName: "",
    universityType: [] as string[],
  };

  return (
    <>
      <div className={` modal ${isOpen && "modal-open"}`}>
        <div className="relative modal-box">
          <label
            onClick={onClose}
            className="absolute btn btn-sm btn-circle right-2 top-2"
          >
            ✕
          </label>
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
                  universityType: yup
                    .array()
                    .min(1, `${tErrors("requiredField")}`)
                    .required(`${tErrors("requiredField")}`),
                })}
                onSubmit={async (values) => {
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
                    if (values.universityType.includes("mastersUni")) {
                      let createMasterUniversityVariableInput: CreateMasterAppliedUniversitiesMutationVariables =
                        {
                          input: {
                            universityName: values.universityName,
                            universityNameAr: values.universityArName,
                          },
                        };
                      onClose(); // Call onClose prop to communicate dialog should close
                      toast
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
                        .finally(() => {
                          // setIsSubmitted(false);
                          onClose();
                        });
                    }

                    if (values.universityType.includes("bahrainiUni")) {
                      let createBahrainiUniversityVariableInput: CreateBahrainUniversitiesMutationVariables =
                        {
                          input: {
                            universityName: values.universityName,
                            universityNameAr: values.universityArName,
                          },
                        };
                      //   isOpen = !isOpen;
                      // setIsSubmitted(true);
                      toast
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
                          return val;
                        })
                        .catch((err) => {
                          console.log(err);
                        })
                        .finally(() => {
                          //   isOpen = !isOpen;
                          // setIsSubmitted(false);
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
    </>
  );
};

export default AddMasterUniversityDialog;
