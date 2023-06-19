import { Formik, Form, Field } from "formik";
import React from "react";
import * as yup from "yup";

import { PageComponent } from "./page-component";
import { useAuth } from "../hooks/use-auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";

export interface ISignUpForm {
  cpr: string;
  fullName: string;
  email: string;
}

export default function SignUpFormComponent() {
  const { push } = useRouter();
  const { checkIfCprExist } = useAuth();
  const { admins, syncAdmins } = useAppContext();
  const { t } = useTranslation("users");
  const { t: tErrors } = useTranslation("errors");

  const initialValues: ISignUpForm = {
    cpr: "",
    fullName: "",
    email: "",
  };

  async function createAdminUser(values: ISignUpForm) {
    try {
      await checkIfCprExist(values.cpr).then(async (exist) => {
        if (exist) {
          throw new Error("CPR already exists");
        }

        let findEmail = admins?.listAdmins?.items.find(
          (value) => value?.email === values.email
        );

        if (findEmail?.email !== undefined) {
          throw new Error(
            "The email given is already linked to an existing account"
          );
        } else {
          if (findEmail !== null && findEmail !== undefined) {
            throw new Error("Failed to process admin account");
          }

          await fetch("../../api/createAdminUser", {
            method: "POST",
            body: JSON.stringify(values),
          })
            .then(async (values) => {
              let res = await values.json();
              if (values.status === 200) {
                syncAdmins();
                push("/users");
              } else {
                throw new Error(`${res.error.message}`);
              }
            })
            .catch((error) => {
              console.log("createAdminUser => error", error);
              throw new Error(`${error}`);
            });
        }
      });
    } catch (err) {
      throw err;
    }
  }

  return (
    <PageComponent title={"Add Admin User"}>
      <div>
        <div className="flex flex-col justify-between">
          <div className="mb-8 text-xl font-bold ">{t("signUpAdmin")}</div>
          <div className="">
            <Formik
              initialValues={initialValues}
              validationSchema={yup.object({
                cpr: yup
                  .string()
                  .min(9, `${tErrors("cprShouldBe9")}`)
                  .max(9, `${tErrors("cprShouldBe9")}`)
                  .required(`${tErrors("requiredField")}`),
                email: yup
                  .string()
                  .email()
                  .required(`${tErrors("requiredField")}`),
                fullName: yup.string().required(`${tErrors("requiredField")}`),
              })}
              onSubmit={async (values, actions) => {
                await toast.promise(createAdminUser(values), {
                  loading: "Loading...",
                  success: "Admin account created successfully",
                  error: (error) => {
                    return `${error.message}`;
                  },
                });

                actions.setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="flex flex-col gap-3 p-4">
                  <div className="flex flex-col">
                    <label className="label">{t("cpr")}</label>
                    <Field
                      name="cpr"
                      type="text"
                      placeholder=""
                      className={`input input-bordered input-primary `}
                    />
                    <label className="label-text-alt text-error">
                      {errors.cpr && touched.cpr && errors.cpr}
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label className="label">{t("fullName")}</label>
                    <Field
                      name="fullName"
                      type="text"
                      placeholder=""
                      className={`input input-bordered input-primary `}
                    />
                    <label className="label-text-alt text-error">
                      {errors.fullName && touched.fullName && errors.fullName}
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label className="label">{t("email")}</label>
                    <Field
                      name="email"
                      type="text"
                      placeholder=""
                      className={`input input-bordered input-primary `}
                    />
                    <label className="label-text-alt text-error">
                      {errors.email && touched.email && errors.email}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary ${isSubmitting && "loading"}`}
                    disabled={isSubmitting}
                  >
                    {t("addAdminButton")}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </PageComponent>
  );
}
