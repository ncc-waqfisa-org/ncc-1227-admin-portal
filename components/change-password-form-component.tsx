import { Formik, Form, Field } from "formik";
import React from "react";
import * as yup from "yup";

import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "react-i18next";
import { LangSwitcher } from "./langSwitcher";

export interface IChangePasswordForm {
  newPassword: string;
}

export default function ChangePasswordFormComponent() {
  const { push, reload } = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation("changePassword");
  const { t: tErrors } = useTranslation("errors");

  const initialValues: IChangePasswordForm = {
    newPassword: "",
  };

  async function changePasswordInCognito(password: string) {
    user?.completeNewPasswordChallenge(password, null, {
      onSuccess(session) {
        push("/").then(() => reload());
        return session;
      },
      onFailure: () => {
        throw new Error("Failed to change user password");
      },
    });
  }

  return (
    <div>
      <div className="p-4 border rounded-xl min-w-[25rem]">
        <div className="flex flex-col justify-between">
          <div className="flex gap-2 justify-between items-center">
            <div className="flex items-center justify-center text-xl font-bold ">
              {t("changePassword")}
            </div>
            <LangSwitcher></LangSwitcher>
          </div>

          <div className="">
            <Formik
              initialValues={initialValues}
              validationSchema={yup.object({
                newPassword: yup
                  .string()
                  .min(8, `${tErrors("min8")}`)
                  .required(`${tErrors("requiredField")}`),
              })}
              onSubmit={async (values, actions) => {
                await toast.promise(
                  changePasswordInCognito(values.newPassword),
                  {
                    loading: "Loading...",
                    success: () => {
                      return `Password changed successfully. Welcome ${user?.getUsername()}`;
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
                    <label className="label">{t("newPassword")}</label>
                    <Field
                      name="newPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newPassword}
                      className={`input input-bordered input-primary ${
                        errors.newPassword && "input-error"
                      }`}
                    />
                    <label className="label-text-alt text-error mt-2">
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
                    {t("setNewPassword")}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
