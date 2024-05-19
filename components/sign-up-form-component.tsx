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
import { cn } from "../src/utils";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";

export interface ISignUpForm {
  cpr: string;
  fullName: string;
  email: string;
  isDeactivated: boolean | null;
  role: AdminRole | null | undefined;
}

interface Props {
  admin?: Admin | undefined;
}

const SignUpFormComponent: FC<Props> = ({ admin }) => {
  const { push } = useRouter();
  const {
    token,
    checkIfCprExist,
    isSuperAdmin,
    admin: currentSignedAdmin,
  } = useAuth();
  const { admins, syncAdmins } = useAppContext();
  const { t } = useTranslation("users");
  const { t: tErrors } = useTranslation("errors");

  const initialValues: ISignUpForm = {
    cpr: admin?.cpr ?? "",
    fullName: admin?.fullName ?? "",
    email: admin?.email ?? "",
    role: admin?.role ?? AdminRole.ADMIN,
    isDeactivated: admin?.isDeactivated ?? false,
  };

  const deleteAdminMutation = useMutation({
    mutationFn: (adminToDelete: Admin) => {
      return fetch("/api/delete-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, username: adminToDelete.cpr }),
      });
    },
    async onSuccess(data) {
      const resData = await data.json();
      if (data.ok) {
        syncAdmins();
        push("/users");
        toast.success(resData.message ?? t("deletedSuccessfully"));
      } else {
        toast.error(resData.message ?? t("failedToDeleted"));
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

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
            role: values.role,
            isDeactivated: values.isDeactivated,
          };
          const jsonData = JSON.stringify(bodyData);

          const req = new Request("/api/createAdminUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: jsonData,
          });

          await fetch(req)
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
            isDeactivated: values.isDeactivated,
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
      console.log("error updating admin account", err);
      throw err;
    }
  }

  return (
    <PageComponent title={admin ? "EditAdminUser" : "AddAdminUser"}>
      <div>
        {!isSuperAdmin ||
          (admin?.cpr === "999999999" ? (
            <div>
              <p className="p-8 text-xl font-bold text-center text-error">
                {tErrors("accessDenied")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between max-w-3xl gap-3">
                <div className="mb-8 text-xl font-bold ">
                  <p>{admin ? t("editAdmin") : t("signUpAdmin")}</p>
                </div>
                {admin &&
                  currentSignedAdmin?.cpr !== admin.cpr &&
                  admin.role !== AdminRole.SUPER_ADMIN && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={"ghost"}
                          disabled={deleteAdminMutation.isPending}
                          className="text-error hover:bg-error/10 hover:text-error hover:brightness-75"
                        >
                          {deleteAdminMutation.isPending && (
                            <span className="loading"></span>
                          )}
                          {t("deleteAdmin")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deleteAdmin")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteAdminD")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              onClick={() => {
                                admin && deleteAdminMutation.mutate(admin);
                              }}
                              variant={"destructive"}
                              className="bg-destructive hover:bg-destructive hover:brightness-110"
                            >
                              {t("delete")}
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
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
                    try {
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
                    } catch (error) {
                      console.log(error, "Error while submitting admin form");
                    }

                    actions.setSubmitting(false);
                  }}
                >
                  {({
                    errors,
                    touched,
                    isSubmitting,
                    values,
                    handleChange,
                  }) => (
                    <Form className="grid max-w-3xl grid-cols-1 gap-3 p-4 md:grid-cols-2">
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
                          {errors.fullName &&
                            touched.fullName &&
                            errors.fullName}
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
                            disabled={currentSignedAdmin?.cpr === admin?.cpr}
                          >
                            {Object.keys(AdminRole).map((role) => (
                              <option value={role} key={role}>
                                {t(role)}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>
                      <div>
                        {/* <div className="label">{t("isDeactivated")}</div> */}

                        <div className="form-control">
                          <label
                            className={cn(
                              "p-3 duration-300 border rounded-lg label",
                              currentSignedAdmin?.cpr === admin?.cpr ||
                                admin?.role === AdminRole.SUPER_ADMIN
                                ? "cursor-not-allowed "
                                : "cursor-pointer border-anzac-400 hover:bg-anzac-50"
                            )}
                          >
                            <span className="label-text">
                              {t("deactivate")}
                            </span>
                            <Field
                              name="isDeactivated"
                              onChange={handleChange}
                              checked={values.isDeactivated}
                              disabled={
                                currentSignedAdmin?.cpr === admin?.cpr ||
                                admin?.role === AdminRole.SUPER_ADMIN
                              }
                              type="checkbox"
                              className="checkbox checkbox-accent"
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`btn btn-primary md:col-span-2`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <span className="loading"></span>}
                        {admin ? t("updateAdminButton") : t("addAdminButton")}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          ))}
      </div>
    </PageComponent>
  );
};

export default SignUpFormComponent;
