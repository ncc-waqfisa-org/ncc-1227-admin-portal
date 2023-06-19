import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import {
  University,
  UpdateProgramMutationVariables,
  UpdateUniversityMutationVariables,
} from "../src/API";
import * as yup from "yup";
import { updateProgramById, updateUniversityById } from "../src/CustomAPI";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useEducation } from "../context/EducationContext";
import { useTranslation } from "react-i18next";

interface Props {
  university: University | undefined;
}

export default function UniversityFormComponent({ university }: Props) {
  const { push, back } = useRouter();
  const { syncUniList } = useEducation();
  const { t } = useTranslation("education");
  const { t: tErrors } = useTranslation("errors");

  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    universityName: university?.name ?? "",
    isDeactivated: university?.isDeactivated ?? false,
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          universityName: yup.string().required(`${tErrors("requiredField")}`),
        })}
        onSubmit={async (values, actions) => {
          setIsLoading(true);
          if (university) {
            let updatedUniDetails: UpdateUniversityMutationVariables = {
              input: {
                id: university.id,
                name: values.universityName,
                isDeactivated: values.isDeactivated,
                _version: university?._version,
              },
            };

            await toast.promise(
              updateUniversityById(updatedUniDetails)
                .then(() => {
                  university?.Programs?.items.map(async (uniProgram) => {
                    if (uniProgram) {
                      let updateProgram: UpdateProgramMutationVariables = {
                        input: {
                          id: uniProgram.id,
                          isDeactivated: values.isDeactivated,
                          _version: uniProgram?._version,
                        },
                      };
                      await updateProgramById(updateProgram)
                        .catch((err) => {
                          throw err;
                        })
                        .finally(async () => {
                          await syncUniList();
                          back();
                        });
                    }
                  });
                })
                .catch((err) => {
                  throw err;
                }),
              {
                loading: "Loading...",
                success: "University updated successfully",
                error: (error: any) => {
                  return `${error?.message}`;
                },
              }
            );
          }

          actions.setSubmitting(false);
          setIsLoading(false);
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
          <Form className="flex flex-col gap-6">
            <div className="flex justify-between ">
              <div className="flex items-center justify-between gap-10 ">
                <div className="text-base font-medium">{t("tableUniName")}</div>
                <div>
                  <Field
                    name="universityName"
                    type="text"
                    placeholder="University Name"
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
              </div>

              <div className=" w-[150px] flex justify-between items-center">
                <div className="text-base font-medium">{t("deactivate")}</div>
                <div>
                  <Field
                    name="isDeactivated"
                    type="checkbox"
                    placeholder="Deactivate?"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={` checkbox text-orange-50 checkbox-error ${
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
            </div>

            <div className="text-base font-medium">{t("tableUniPrograms")}</div>
            <div dir="ltr">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>{t("tableUniName")}</th>
                      <th>{t("tableUniPrograms")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(university?.Programs?.items?.length ?? 0) == 0 && (
                      <tr className="">
                        <td className="text-error">No Programs</td>
                        <td className="text-error">-</td>
                      </tr>
                    )}
                    {(university?.Programs?.items?.length ?? 0) > 0 &&
                      university?.Programs?.items
                        .sort((a: any, b: any) => {
                          let bD = b.isDeactivated === true ? -1 : 1;
                          return bD;
                        })
                        .map((program) => {
                          return (
                            <tr
                              className={`hover:cursor-pointer hover:bg-anzac-50 hover:text-anzac-500 ${
                                program?.isDeactivated ? "bg-gray-200" : ""
                              }`}
                              onClick={() => {
                                push(`/education/programs/${program?.id}`);
                              }}
                              key={program?.id}
                            >
                              <td className="bg-transparent">
                                {program?.name}
                              </td>
                              <td className="bg-transparent ">
                                <div
                                  className={`badge ${
                                    program?.isDeactivated ? "" : "badge-accent"
                                  }`}
                                >
                                  {program?.isDeactivated
                                    ? t("inactive")
                                    : t("active")}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary text-white ${
                isSubmitting && "loading"
              }`}
              disabled={isSubmitting || isLoading || !isValid}
            >
              {t("saveButton")}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
