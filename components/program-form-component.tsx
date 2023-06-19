import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useEducation } from "../context/EducationContext";
import { Program, UpdateProgramMutationVariables } from "../src/API";
import { updateProgramById } from "../src/CustomAPI";

interface Props {
  program?: Program;
  programName: string;
  universityID: string | undefined;
  availability: number;
  requirements: string;
  isDeactivated: boolean;
}

export default function ProgramFormComponent({ program }: Props) {
  const { push, back } = useRouter();
  const { t } = useTranslation("education");
  const { t: tErrors } = useTranslation("errors");
  const { universityList, addProgramToUni, getProgramsFromUniID, syncUniList } =
    useEducation();

  const initialValues = {
    programName: program?.name ?? "",
    universityID: program?.universityID ?? undefined,
    availability: program?.availability ?? 0,
    requirements: program?.requirements ?? "",
    isDeactivated: program?.isDeactivated ?? false,
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          programName: yup.string().required(`${tErrors("requiredField")}`),
          universityID: yup.string().required(`${tErrors("requiredField")}`),
          availability: yup.number().required(`${tErrors("requiredField")}`),
          requirements: yup.string().required(`${tErrors("requiredField")}`),
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
                requirements: values.requirements,
                availability: values.availability,
                isDeactivated: values.isDeactivated,
                _version: program._version,
              },
            };
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
                  addProgramToUni(
                    values.universityID!,
                    values.programName,
                    values.availability,
                    values.requirements,
                    values.isDeactivated
                  ).catch((error) => {
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
          isValid,
        }) => (
          <Form className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="label">{t("programName")}</label>
              <Field
                name="programName"
                type="text"
                placeholder="Program Name"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input input-bordered input-primary ${
                  errors.programName && "input-error"
                }`}
              />
              <label className="label-text-alt text-error">
                {errors.programName &&
                  touched.programName &&
                  errors.programName}
              </label>
            </div>

            <div className="flex flex-col">
              <label className="label">{t("universityID")}</label>
              <Field
                dir="ltr"
                disabled={program}
                as="select"
                name="universityID"
                placeholder="University ID"
                onChange={(event: any) => {
                  handleChange(event);
                }}
                onBlur={handleBlur}
                className={`input input-bordered input-primary ${
                  errors.universityID && "input-error"
                }`}
                value={values.universityID}
              >
                <option value={undefined}>Select</option>
                {universityList?.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni?.name}
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
              <div className="flex flex-col grow">
                <label className="label">{t("availability")}</label>
                <Field
                  name="availability"
                  type="number"
                  min="0"
                  placeholder="Availability"
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
              <div
                dir="ltr"
                className="flex flex-col items-center justify-between"
              >
                <label className="label">{t("deactivate")}</label>
                <Field
                  name="isDeactivated"
                  type="checkbox"
                  placeholder="Availability"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={` checkbox text-orange-50 checkbox-warning ${
                    errors.isDeactivated && "input-error"
                  }`}
                />
                <label className="label-text-alt text-error">
                  {errors.isDeactivated &&
                    touched.isDeactivated &&
                    errors.isDeactivated}
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("programRequirements")}</span>
              </label>
              <textarea
                className="h-24 textarea textarea-bordered"
                placeholder={
                  program?.requirements ?? "Enter the program requirements here"
                }
                name="requirements"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.requirements}
              ></textarea>
              <label className="label-text-alt text-error">
                {errors.requirements &&
                  touched.requirements &&
                  errors.requirements}
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting && "loading"}`}
              disabled={isSubmitting || !isValid}
            >
              {program ? t("saveButton") : t("submitButton")}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
