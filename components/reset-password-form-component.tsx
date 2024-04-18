import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import * as yup from "yup";

import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "react-i18next";
import { Auth } from "aws-amplify";
import { LangSwitcher } from "./langSwitcher";

export interface IResetPasswordCPRVerificationForm {
  userName: string;
}
export interface IResetPasswordForm {
  validationCode: string;
  newPassword: string;
}

export default function ResetPasswordFormComponent() {
  const { push } = useRouter();
  const { user, checkIfCprExist } = useAuth();
  const { t } = useTranslation("signIn");
  const { t: tErrors } = useTranslation("errors");

  const initialValuesCprVerification: IResetPasswordCPRVerificationForm = {
    userName: "",
  };
  const initialValuesOPT: IResetPasswordForm = {
    validationCode: "",
    newPassword: "",
  };

  const [nextStep, setNextStep] = useState(false);
  const [userName, setUserName] = useState("");

  /**
   * This function verifies if a CPR exists and initiates a forgot password flow if it does.
   * @param {string} username - The username parameter is a string that is used to check if a CPR
   * (Central Person Register) number exists in the system. If the CPR number exists, the function
   * initiates a forgot password flow for the user associated with that CPR number. If the CPR number
   * does not exist, the function throws an
   * @returns the value of the `nextStep` variable, which is likely a boolean value indicating whether
   * the `forgotPassword` function was successfully called and the `setNextStep` function was executed.
   * However, it's important to note that the `nextStep` variable is being set asynchronously within the
   * `then` block of the `forgotPassword` function, so it's possible that the
   */
  async function verifyCPR(username: string) {
    const doesExist = await checkIfCprExist(username);

    if (doesExist) {
      Auth.forgotPassword(username)
        .then(() => {
          setUserName(username);
          setNextStep(true);
        })
        .catch((err) => {
          throw err;
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
    return await toast.promise(
      Auth.forgotPasswordSubmit(username, otpCode, newPassword),
      {
        loading: "Loading...",
        success: () => {
          push("/");
          return "Password changed successfully";
        },
        error: (error) => {
          return `${error.message}`;
        },
      }
    );
  }

  return (
    <div className="w-full container mx-auto max-w-lg">
      <div className="p-4  sm:border rounded-xl">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="flex items-center justify-center mb-4 text-xl font-bold ">
              {t("resetPassword")}
            </div>
            <LangSwitcher></LangSwitcher>
          </div>
          {/* Verify CPR step */}
          {!nextStep && (
            <div className="">
              <Formik
                initialValues={initialValuesCprVerification}
                validationSchema={yup.object({
                  userName: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                })}
                onSubmit={async (values, actions) => {
                  await toast.promise(verifyCPR(values.userName), {
                    loading: "Loading...",
                    success: () => {
                      return "An OTP was sent to your registered email";
                    },
                    error: (error) => {
                      return `${error.message}`;
                    },
                  });
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.userName}
                        className={`input input-bordered input-primary ${
                          errors.userName && touched.userName && "input-error"
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-primary `}
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting && <span className="loading"></span>}
                      {t("getValidation")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          {/* OTP and new password step */}
          {nextStep && (
            <div className="">
              <Formik
                initialValues={initialValuesOPT}
                validationSchema={yup.object({
                  validationCode: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                  newPassword: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                })}
                onSubmit={async (values, actions) => {
                  await forgetPassword(
                    userName,
                    values.validationCode,
                    values.newPassword
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
                      <div className="text-center flex flex-col gap-3">
                        <label className="font-bold">{t("otpCode")}</label>
                        <p className="stat-desc whitespace-pre-wrap">
                          {t("otpIsSentTo")}
                        </p>
                        <p className="stat-value text-center my-3">
                          {userName || "undefined"}
                        </p>
                      </div>
                      <label className="label">{t("otpCode")}</label>
                      <Field
                        name="validationCode"
                        type="string"
                        placeholder="XXXXXX"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.validationCode}
                        className={`input input-bordered input-primary ${
                          errors.validationCode &&
                          touched.validationCode &&
                          "input-error"
                        }`}
                      />
                      <label className="label">{t("newPassword")}</label>
                      <Field
                        name="newPassword"
                        type="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.newPassword}
                        className={`input input-bordered input-primary ${
                          errors.newPassword &&
                          touched.newPassword &&
                          "input-error"
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
                      className={`btn btn-primary`}
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting && <span className="loading"></span>}
                      {t("resetPassword")}
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
