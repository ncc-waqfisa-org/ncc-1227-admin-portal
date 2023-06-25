import { Formik, Form, Field } from "formik";
import React, { FC } from "react";
import * as yup from "yup";

import { PageComponent } from "./page-component";
import { useAuth } from "../hooks/use-auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { Admin, AdminRole, UpdateAdminMutationVariables } from "../src/API";
import { updateAdminInDB } from "../src/CustomAPI";

export interface ISignUpForm {
  cpr: string;
  fullName: string;
  email: string;
  role: AdminRole | null | undefined;
}

interface Props {
  admin?: Admin | undefined;
}

const SignUpFormComponent: FC<Props> = ({ admin }) => {
  const { push } = useRouter();
  const { checkIfCprExist, isSuperAdmin } = useAuth();
  const { admins, syncAdmins } = useAppContext();
  const { t } = useTranslation("users");
  const { t: tErrors } = useTranslation("errors");

  const initialValues: ISignUpForm = {
    cpr: admin?.cpr ?? "",
    fullName: admin?.fullName ?? "",
    email: admin?.email ?? "",
    role: admin?.role ?? AdminRole.ADMIN,
  };

  async function createAdminUser(values: ISignUpForm) {
    try {
      await checkIfCprExist(values.cpr).then(async (exist) => {
        if (exist) {
          throw new Error("CPR already exists");
        }

        let findEmail = admins.find((value) => value?.email === values.email);

        if (findEmail?.email !== undefined) {
          throw new Error(
            "The email given is already linked to an existing account"
          );
        } else {
          if (findEmail !== null && findEmail !== undefined) {
            throw new Error("Failed to process admin account");
          }

          const bodyData = {
            cpr: values.cpr,
            fullName: values.fullName,
            email: values.email,
            role: values.role as string,
          };

          const jsonData = JSON.stringify(bodyData);

          await fetch("/api/createAdminUser", {
            method: "POST",
            body: jsonData,
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
  async function editAdminUser(values: ISignUpForm) {
    try {
      if (!admin) {
        throw new Error("Passed admin does not exist");
      }

      await checkIfCprExist(values.cpr).then(async (exist) => {
        if (!exist) {
          throw new Error("CPR does not exist");
        }

        const updateData: UpdateAdminMutationVariables = {
          input: {
            cpr: admin.cpr,
            fullName: values.fullName,
            email: admin.email,
            role: values.role,
            _version: admin._version,
          },
        };

        await updateAdminInDB(updateData).then((res) => {
          if (res?.updateAdmin?.cpr) {
            syncAdmins();
            push("/users");
          }
        });
      });
    } catch (err) {
      throw err;
    }
  }

  return (
    <PageComponent title={admin ? "EditAdminUser" : "AddAdminUser"}>
      <div>
        {!isSuperAdmin && (
          <div>
            <p className="text-error text-xl font-bold text-center p-8">
              {tErrors("accessDenied")}
            </p>
          </div>
        )}
        {isSuperAdmin && (
          <div className="flex flex-col justify-between">
            <div className="mb-8 text-xl font-bold ">
              {admin ? t("editAdmin") : t("signUpAdmin")}
            </div>
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
                  fullName: yup
                    .string()
                    .required(`${tErrors("requiredField")}`),
                  role: yup.string().required(`${tErrors("requiredField")}`),
                })}
                onSubmit={async (values, actions) => {
                  if (admin) {
                    await toast.promise(editAdminUser(values), {
                      loading: "Loading...",
                      success: "Admin account edited successfully",
                      error: (error) => {
                        return `${error.message}`;
                      },
                    });
                  } else {
                    await toast.promise(createAdminUser(values), {
                      loading: "Loading...",
                      success: "Admin account created successfully",
                      error: (error) => {
                        return `${error.message}`;
                      },
                    });
                  }

                  actions.setSubmitting(false);
                }}
              >
                {({ errors, touched, isSubmitting, values, handleChange }) => (
                  <Form className=" max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                    <div className="flex flex-col">
                      <label className="label">{t("cpr")}</label>
                      <Field
                        name="cpr"
                        type="text"
                        placeholder=""
                        disabled={admin}
                        className={`input input-bordered input-primary `}
                      />
                      <label className="label-text-alt text-error">
                        {errors.cpr && touched.cpr && errors.cpr}
                      </label>
                    </div>

                    <div className="flex flex-col">
                      <label className="label">{t("email")}</label>
                      <Field
                        name="email"
                        type="text"
                        disabled={admin}
                        placeholder=""
                        className={`input input-bordered input-primary `}
                      />
                      <label className="label-text-alt text-error">
                        {errors.email && touched.email && errors.email}
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
                    <div>
                      <div className="label">{t("role")}</div>
                      <div>
                        <Field
                          className="select select-bordered select-primary w-full min-w-[10rem]"
                          as="select"
                          name="role"
                          onChange={handleChange}
                          value={values.role}
                        >
                          {Object.keys(AdminRole).map((role) => (
                            <option value={role} key={role}>
                              {t(role)}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`btn btn-primary md:col-span-2 ${
                        isSubmitting && "loading"
                      }`}
                      disabled={isSubmitting}
                    >
                      {admin ? t("updateAdminButton") : t("addAdminButton")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </PageComponent>
  );
};

export default SignUpFormComponent;
