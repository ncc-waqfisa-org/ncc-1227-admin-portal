import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useEducation } from "../context/EducationContext";
import { Program, UpdateProgramMutationVariables } from "../src/API";
import { updateProgramById } from "../src/CustomAPI";
import { useAuth } from "../hooks/use-auth";
import { minimumGPA } from "../src/Helpers";

interface Props {
  program?: Program;
  programName: string;
  programArName: string;
  universityID: string | undefined;
  requirements: string;
  requirementsAr: string;
  isDeactivated: boolean;
  minimumGPA: number;
}

export default function ProgramFormComponent({ program }: Props) {
  const { locale, back } = useRouter();
  const { isSuperAdmin } = useAuth();
  const { t } = useTranslation("education");
  const { t: tErrors } = useTranslation("errors");
  const { universityList, addProgramToUni, getProgramsFromUniID, syncUniList } =
    useEducation();

  const initialValues = {
    programName: program?.name ?? "",
    programNameAr: program?.nameAr ?? "",
    universityID: program?.universityID ?? undefined,
    requirements: program?.requirements ?? "",
    requirementsAr: program?.requirementsAr ?? "",
    isDeactivated: program?.isDeactivated ?? false,
    minimumGPA: program?.minimumGPA ?? minimumGPA,
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          programName: yup.string().required(`${tErrors("requiredField")}`),
          programNameAr: yup.string().required(`${tErrors("requiredField")}`),
          universityID: yup.string().required(`${tErrors("requiredField")}`),
          requirements: yup.string().required(`${tErrors("requiredField")}`),
          requirementsAr: yup.string().required(`${tErrors("requiredField")}`),
          minimumGPA: yup
            .number()
            .default(minimumGPA)
            .required(`${tErrors("requiredField")}`),
        })}
        onSubmit={async (values, actions) => {
          let getPrograms = await getProgramsFromUniID(values.universityID!);

          let programFound = getPrograms?.Programs?.items
            .filter((value) => value?._deleted !== true)
            .find(
              (value) =>
                value?.name?.toLowerCase() === values.programName?.toLowerCase()
            );

          if (program) {
            let programVariables: UpdateProgramMutationVariables = {
              input: {
                id: program.id,
                name: values.programName,
                nameAr: values.programNameAr,
                requirements: values.requirements,
                requirementsAr: values.requirementsAr,
                isDeactivated: values.isDeactivated,
                minimumGPA: values.minimumGPA,
                _version: program._version,
              },
            };
            console.log(
              "🚀 ~ onSubmit={ ~ programVariables: UpdateProgramMutationVariables.input:",
              programVariables
            );

            await toast
              .promise(
                updateProgramById(programVariables).catch((error) => {
                  throw error;
                }),
                {
                  loading: "Loading...",
                  success: "Program updated successfully",
                  error: (error) => {
                    return `${error?.message}`;
                  },
                }
              )
              .then(async (val) => {
                await syncUniList();
                return val;
              })
              .finally(() => {
                back();
              });
          } else {
            if (programFound) {
              toast.error("There is an existing program with the same name");
            } else {
              toast
                .promise(
                  addProgramToUni({
                    uniID: values.universityID!,
                    programName: values.programName,
                    programNameAr: values.programNameAr,
                    requirements: values.requirements,
                    requirementsAr: values.requirementsAr,
                    minimumGPA: values.minimumGPA,
                    isDeactivated: values.isDeactivated,
                  }).catch((error) => {
                    throw error;
                  }),
                  {
                    loading: "Loading...",
                    success: `Program successfully added`,
                    error: (error) => {
                      return `${error?.message}`;
                    },
                  }
                )
                .then(async (val) => {
                  await syncUniList();
                  return val;
                })
                .finally(() => {
                  back();
                });
            }
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue,
          isValid,
        }) => (
          <Form className="flex flex-col max-w-3xl gap-3">
            <div className="flex flex-col">
              <label className="label">{t("programName")}</label>
              <Field
                name="programName"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input input-bordered input-primary ${
                  errors.programName && "input-error"
                }`}
                value={values.programName}
                disabled={!isSuperAdmin}
              />
              <label className="label-text-alt text-error">
                {errors.programName &&
                  touched.programName &&
                  errors.programName}
              </label>
            </div>
            <div className="flex flex-col">
              <label className="label">{t("programNameAr")}</label>
              <Field
                name="programNameAr"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input input-bordered input-primary ${
                  errors.programNameAr && "input-error"
                }`}
                value={values.programNameAr}
                disabled={!isSuperAdmin}
              />
              <label className="label-text-alt text-error">
                {errors.programNameAr &&
                  touched.programNameAr &&
                  errors.programNameAr}
              </label>
            </div>

            <div className="flex flex-col">
              <label className="label">{t("universityID")}</label>
              <Field
                disabled={program || !isSuperAdmin}
                as="select"
                name="universityID"
                onChange={(event: any) => {
                  handleChange(event);
                }}
                onBlur={handleBlur}
                className={`select select-bordered select-primary ${
                  errors.universityID && "select-error"
                }`}
                value={values.universityID}
              >
                <option value={undefined}>Select</option>
                {universityList?.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {locale == "ar" ? uni?.nameAr ?? "-" : uni?.name}
                  </option>
                ))}
              </Field>
              <label className="label-text-alt text-error">
                {errors.universityID &&
                  touched.universityID &&
                  errors.universityID}
              </label>
            </div>

            <div className="flex justify-between gap-4 ">
              <div
                dir="ltr"
                className="flex flex-col items-center justify-between"
              >
                <label className="label">{t("deactivate")}</label>

                <Field
                  name="isDeactivated"
                  type="checkbox"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!isSuperAdmin}
                  className={` checkbox text-orange-50 checkbox-warning ${
                    errors.isDeactivated && "input-error"
                  }`}
                  checked={values.isDeactivated}
                />
                <label className="label-text-alt text-error">
                  {errors.isDeactivated &&
                    touched.isDeactivated &&
                    errors.isDeactivated}
                </label>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="label">{t("minimumGPA")}</label>
              <Field
                name="minimumGPA"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input input-bordered input-primary ${
                  errors.minimumGPA && "input-error"
                }`}
                value={values.minimumGPA}
              />
              <label className="label-text-alt text-error">
                {errors.minimumGPA && touched.minimumGPA && errors.minimumGPA}
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("programRequirements")}</span>
              </label>
              <textarea
                className="h-24 textarea textarea-bordered"
                name="requirements"
                title="requirements"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.requirements}
                disabled={!isSuperAdmin}
              ></textarea>
              <label className="label-text-alt text-error">
                {errors.requirements &&
                  touched.requirements &&
                  errors.requirements}
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("programArRequirements")}</span>
              </label>
              <textarea
                className="h-24 textarea textarea-bordered"
                name="requirementsAr"
                title="requirementsAr"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.requirementsAr}
                disabled={!isSuperAdmin}
              ></textarea>
              <label className="label-text-alt text-error">
                {errors.requirementsAr &&
                  touched.requirementsAr &&
                  errors.requirementsAr}
              </label>
            </div>

            {isSuperAdmin && (
              <button
                type="submit"
                className={`btn btn-primary`}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting && <span className="loading"></span>}
                {program ? t("saveButton") : t("submitButton")}
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
