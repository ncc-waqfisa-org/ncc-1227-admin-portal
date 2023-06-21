import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import * as yup from "yup";

import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "react-i18next";
import { Auth } from "aws-amplify";

export interface IResetPasswordForm {
  userName: string;
  validationCode: string;
  newPassword: string;
}

export default function ResetPasswordFormComponent() {
  const { push } = useRouter();
  const { user, checkIfCprExist } = useAuth();
  const { t } = useTranslation("signIn");
  const { t: tErrors } = useTranslation("errors");

  const initialValues: IResetPasswordForm = {
    userName: "",
    validationCode: "",
    newPassword: "",
  };

  const [nextStep, setNextStep] = useState(false);
  const [userName, setUserName] = useState("");

  async function verifyCPR(username: string) {
    const doesExist = await checkIfCprExist(username);

    if (doesExist) {
      Auth?.forgotPassword(username).then((value) => {
        setNextStep(true);
      });
    } else {
      throw new Error("This user does not exist");
    }
    return nextStep;
  }

  async function forgetPassword(
    username: string,
    otpCode: string,
    newPassword: string
  ) {
    return await Auth?.forgotPasswordSubmit(username, otpCode, newPassword);
  }

  return (
    <div>
      <div className="p-4 border rounded-xl">
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-center mb-4 text-xl font-bold ">
            {t("resetPassword")}
          </div>
          <div className="">
            <Formik
              initialValues={initialValues}
              validationSchema={yup.object({
                userName: yup.string().required(`${tErrors("requiredField")}`),
              })}
              onSubmit={async (values, actions) => {
                await toast.promise(
                  verifyCPR(values.userName).then((value) => {
                    if (value) {
                    }
                  }),
                  {
                    loading: "Loading...",
                    success: () => {
                      return "CPR found!";
                    },
                    error: (error) => {
                      return `${error.message}`;
                    },
                  }
                );
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
                <Form className="flex flex-col gap-8 p-4">
                  <div className="flex flex-col ">
                    <label className="label">{t("enterCPRNumber")}</label>
                    <label className="label">{t("cpr")}</label>
                    <Field
                      name="userName"
                      type="string"
                      placeholder="CPR number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userName}
                      className={`input input-bordered input-primary ${
                        errors.userName && "input-error"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-primary ${isSubmitting && "loading"}`}
                    disabled={isSubmitting || !isValid}
                  >
                    {t("getValidation")}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          {nextStep && (
            <div className="">
              <Formik
                initialValues={initialValues}
                validationSchema={yup.object({
                  userName: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                })}
                onSubmit={async (values, actions) => {
                  await toast.promise(
                    verifyCPR(values.userName).then((value) => {
                      if (value) {
                      }
                    }),
                    {
                      loading: "Loading...",
                      success: () => {
                        return "CPR found!";
                      },
                      error: (error) => {
                        return `${error.message}`;
                      },
                    }
                  );
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
                  <Form className="flex flex-col gap-8 p-4">
                    <div className="flex flex-col ">
                      <label className="label">{t("enterOTPcode")}</label>
                      <label className="label">{t("otpCode")}</label>
                      <Field
                        name="otpCode"
                        type="string"
                        placeholder="XXXXXX"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.validationCode}
                        className={`input input-bordered input-primary ${
                          errors.userName && "input-error"
                        }`}
                      />
                      <label className="label">{t("newPassword")}</label>
                      <Field
                        name="newPassword"
                        type="password"
                        placeholder="New password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.newPassword}
                        className={`input input-bordered input-primary ${
                          errors.newPassword && "input-error"
                        }`}
                      />
                      <label className="label-text-alt text-error">
                        {errors.newPassword &&
                          touched.newPassword &&
                          errors.newPassword}
                      </label>
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-primary ${isSubmitting && "loading"}`}
                      disabled={isSubmitting || !isValid}
                    >
                      {t("getValidation")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
