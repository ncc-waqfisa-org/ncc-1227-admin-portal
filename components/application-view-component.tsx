import { Field, Form, Formik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import {
  Application,
  CreateAdminLogMutationVariables,
  Status,
  UpdateApplicationMutationVariables,
} from "../src/API";
import * as yup from "yup";
import { createAdminLogInDB, updateApplicationInDB } from "../src/CustomAPI";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/use-auth";
import { useRouter } from "next/router";
import GetStorageLinkComponent from "./get-storage-link-component";
import { useStudent } from "../context/StudentContext";
import { useTranslation } from "react-i18next";

interface Props {
  application: Application;
  downloadLinks: {
    schoolCertificate?: string | null;
    transcriptDoc?: string | null;
    signedContractDoc?: string | null;
  };
  readOnly: boolean;
}

interface IApplicationForm {
  applicationStatus: Status | undefined;
  reason: string | undefined;
  readOnly: false;
}

export default function ViewApplication({
  application,
  downloadLinks,
  readOnly,
}: Props) {
  // const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, isSuperAdmin } = useAuth();
  const { push, locale } = useRouter();
  const { syncUpdatedApplication } = useStudent();
  const { t } = useTranslation("applicationLog");
  const { t: tErrors } = useTranslation("errors");
  const tA = useTranslation("applications");

  const primaryProgram = application.programs?.items?.sort(
    (a, b) => (a?.choiceOrder ?? 0) - (b?.choiceOrder ?? 0)
  )[0];
  const secondaryProgram = application.programs?.items?.sort(
    (a, b) => (a?.choiceOrder ?? 0) - (b?.choiceOrder ?? 0)
  )[1];

  const initialValues: IApplicationForm = {
    applicationStatus: application.status ?? Status.REVIEW,
    reason: undefined,
    readOnly: false,
  };

  return (
    <div className="mx-auto overflow-x-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          reason: yup.string().required(`${tErrors("requiredField")}`),
        })}
        onSubmit={async (values, actions) => {
          setIsLoading(true);

          let updateVariables: UpdateApplicationMutationVariables = {
            input: {
              id: application.id,
              status: values.applicationStatus,
              _version: application._version,
            },
          };

          if (values.applicationStatus === application.status) {
            toast("No changes were detected!");
          } else {
            await toast
              .promise(updateApplicationInDB(updateVariables), {
                loading: "Updating...",
                success: "Application updated successfully",
                error: "Failed to update application",
              })
              .then(async (value) => {
                let createAdminLogVariables: CreateAdminLogMutationVariables = {
                  input: {
                    applicationID: application.id,
                    adminCPR: user?.getUsername() ?? "",
                    dateTime: new Date().toISOString(),
                    snapshot: `changed application status from ${application.status} to ${values.applicationStatus}`,
                    reason: values.reason,
                    applicationAdminLogsId: application.id,
                    adminAdminLogsCpr: user?.getUsername() ?? "",
                  },
                };

                await createAdminLogInDB(createAdminLogVariables)
                  .then(async (logValue) => {
                    const updatedApplication =
                      value?.updateApplication as Application;

                    await syncUpdatedApplication(updatedApplication);

                    push("/applications");
                    return logValue;
                  })
                  .catch((err) => {
                    console.log(err);
                    throw err;
                  });
              });
          }

          actions.setSubmitting(false);
          setIsLoading(false);
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            <table className="table w-full mb-4 table-fixed">
              <thead>
                <tr>
                  <th>{t("applicationField")}</th>
                  <th>{t("value")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("createdAt")}</td>
                  <td>
                    {Intl.DateTimeFormat("en", {
                      timeStyle: "short",
                      dateStyle: "medium",
                    }).format(new Date(application.createdAt))}
                  </td>
                </tr>
                <tr>
                  <td>{t("status")}</td>
                  <td>
                    <div className="flex items-center gap-8 ">
                      {!readOnly && (
                        <Field
                          className=" select select-bordered rounded-xl"
                          as="select"
                          name="applicationStatus"
                          value={values.applicationStatus}
                          onBlur={handleBlur}
                          disabled={application.status === Status.WITHDRAWN}
                        >
                          <option
                            disabled={
                              application.status === Status.WITHDRAWN ||
                              !isSuperAdmin
                            }
                            value={Status.WITHDRAWN}
                          >
                            {tA.t("WITHDRAWN")}
                          </option>
                          <option
                            disabled={
                              application.status === Status.NOT_COMPLETED
                            }
                            value={Status.NOT_COMPLETED}
                          >
                            {tA.t("NOT_COMPLETED")}
                          </option>
                          <option
                            disabled={application.status === Status.REVIEW}
                            value={Status.REVIEW}
                          >
                            {tA.t("REVIEW")}
                          </option>
                          <option
                            disabled={application.status === Status.ELIGIBLE}
                            value={Status.ELIGIBLE}
                          >
                            {tA.t("ELIGIBLE")}
                          </option>
                          <option
                            disabled={
                              application.status === Status.APPROVED ||
                              !isSuperAdmin
                            }
                            value={Status.APPROVED}
                          >
                            {tA.t("APPROVED")}
                          </option>
                          <option
                            disabled={
                              application.status === Status.REJECTED ||
                              !isSuperAdmin
                            }
                            value={Status.REJECTED}
                          >
                            {tA.t("REJECTED")}
                          </option>
                        </Field>
                      )}

                      {application.status !== values.applicationStatus && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
                          <span>{tA.t(`${application.status}`)}</span>
                          <span>{"->"}</span>
                          <span className="text-black">
                            {tA.t(`${values.applicationStatus}`)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>

                {!readOnly && (
                  <>
                    <tr>
                      <td>{t("graduationDate")}</td>
                      <td>{application.student?.graduationDate}</td>
                    </tr>
                    <tr>
                      <td>{t("schoolName")}</td>
                      <td>{application.schoolName}</td>
                    </tr>
                    <tr>
                      <td>{t("schoolType")}</td>
                      <td>{application.schoolType}</td>
                    </tr>
                    <tr>
                      <td>{t("schoolSpecialization")}</td>
                      <td>{application.student?.specialization}</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td>{t("gpa")}</td>
                  <td>{application.gpa}</td>
                </tr>
                <tr>
                  <td>{t("primaryProgram")}</td>
                  <td className="flex flex-col gap-2 overflow-x-scroll">
                    <div>
                      {`${
                        locale == "ar"
                          ? primaryProgram?.program?.nameAr ?? "-"
                          : primaryProgram?.program?.name
                      } - ${
                        locale == "ar"
                          ? primaryProgram?.program?.university?.nameAr ?? "-"
                          : primaryProgram?.program?.university?.name
                      }`}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="stat-desc">{t("acceptanceLetter")}</p>
                      <GetStorageLinkComponent
                        storageKey={primaryProgram?.acceptanceLetterDoc}
                      ></GetStorageLinkComponent>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{t("secondaryProgram")}</td>
                  <td className="flex flex-col gap-2 overflow-x-scroll">
                    <div>
                      {`${
                        locale == "ar"
                          ? secondaryProgram?.program?.nameAr ?? "-"
                          : secondaryProgram?.program?.name
                      } - ${
                        locale == "ar"
                          ? secondaryProgram?.program?.university?.nameAr ?? "-"
                          : secondaryProgram?.program?.university?.name
                      }`}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="stat-desc">{t("acceptanceLetter")}</p>
                      <GetStorageLinkComponent
                        storageKey={secondaryProgram?.acceptanceLetterDoc}
                      ></GetStorageLinkComponent>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{tA.t("schoolCertificate")}</td>
                  <td>
                    {
                      <GetStorageLinkComponent
                        storageKey={downloadLinks.schoolCertificate}
                      ></GetStorageLinkComponent>
                    }
                  </td>
                </tr>
                <tr>
                  <td>{t("transcriptDocument")}</td>
                  <td>
                    {
                      <GetStorageLinkComponent
                        storageKey={downloadLinks.transcriptDoc}
                      ></GetStorageLinkComponent>
                    }
                  </td>
                </tr>
                <tr>
                  <td>{t("studentLog")}</td>
                  <td>
                    <Link
                      className="btn btn-ghost btn-sm text-primary hover:bg-primary/20"
                      href={`/studentLogs/${application.id}`}
                    >
                      {t("view")}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>{t("adminLogs")}</td>
                  <td>
                    <Link
                      className="btn btn-ghost btn-sm text-primary hover:bg-primary/20"
                      href={`/applications/applicationHistory/${application.id}`}
                    >
                      {t("view")}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
            {application.status !== values.applicationStatus && !readOnly && (
              <div>
                <div className="form-control">
                  <label className="label">
                    <span className="text-base font-medium text-gray-500">
                      {t("reasonForChange")}
                      <span className="text-base font-medium text-error">
                        *
                      </span>
                    </span>
                  </label>
                  <Field
                    as="textarea"
                    placeholder="Reason for changes made..."
                    name="reason"
                    onChange={handleChange}
                    value={values.reason}
                    className={`textarea textarea-bordered resize-none mx-2 h-24 ${
                      errors.reason && "input-error"
                    }`}
                  ></Field>
                </div>
                <div className="flex justify-end m-4 ">
                  <button
                    type="submit"
                    className={`btn btn-primary text-white ${
                      isSubmitting && "loading"
                    }`}
                    disabled={isSubmitting || isLoading || !isValid}
                  >
                    {t("save")}
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
