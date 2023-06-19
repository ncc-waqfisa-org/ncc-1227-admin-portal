import { Field, Form, Formik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import {
  Application,
  CreateAdminLogMutationVariables,
  Status,
  UpdateApplicationMutationVariables,
} from "../src/API";
import PrimaryButton from "./primary-button";
import * as yup from "yup";
import {
  createAdminLogInDB,
  updateApplicationInDB,
  updateEmailSentToApplication,
} from "../src/CustomAPI";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/use-auth";
import { useRouter } from "next/router";
import GetStorageLinkComponent from "./get-storage-link-component";
import { ISendEmail } from "../pages/api/sendEmail";
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

  const { user } = useAuth();
  const { push, replace, asPath } = useRouter();
  const { syncApplications } = useStudent();
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

  let emailData: ISendEmail = {
    status:
      application.status === Status.APPROVED ? application.status : undefined,
    email: application.student?.email ?? undefined,
    studentName: application.student?.fullName ?? undefined,
    id: application.id,
  };

  async function sendApprovedEmail() {
    await toast.promise(
      fetch("../../api/sendEmail", {
        method: "POST",
        body: JSON.stringify(emailData),
      }).then(async (res) => {
        if (res.status === 200) {
          await updateEmailSentToApplication({
            applicationId: application.id,
            version: application._version,

            isEmailSent: true,
          }).then((val) => {
            if (val) {
              replace(asPath);
            }
          });
        }
      }),
      {
        loading: "Sending email...",
        success: "Email sent to user!",
        error: "Failed to send email to user",
      }
    );
  }

  return (
    <div className="mx-auto overflow-x-auto">
      <div className="flex justify-end gap-4 m-4">
        {/* {!readOnly && (
          <PrimaryButton
            name={!isEditing ? tA.t("edit") : tA.t("close")}
            buttonClick={function (): void {
              setIsEditing(!isEditing);
            }}
          ></PrimaryButton>
        )} */}
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          reason: yup.string().required(`${tErrors("requiredField")}`),
        })}
        onSubmit={async (values, actions) => {
          setIsLoading(true);
          let rejectEmailData: ISendEmail = {
            status:
              values.applicationStatus === Status.APPROVED ||
              values.applicationStatus === Status.REJECTED
                ? values.applicationStatus
                : undefined,
            email: application.student?.email ?? undefined,
            studentName: application.student?.fullName ?? undefined,
            id: application.id,
          };

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
                // setIsEditing(false);

                if (values.applicationStatus === Status.REJECTED) {
                  await toast.promise(
                    fetch("../../api/sendEmail", {
                      method: "POST",
                      body: JSON.stringify(rejectEmailData),
                    }),
                    {
                      loading: "Sending email...",
                      success: "Email sent to user!",
                      error: "Failed to send email to user",
                    }
                  );

                  await updateEmailSentToApplication({
                    applicationId: application.id,
                    version:
                      value?.updateApplication?._version ??
                      application._version,

                    isEmailSent: true,
                  });
                }

                if (
                  (values.applicationStatus === Status.APPROVED ||
                    values.applicationStatus === Status.ELIGIBLE) &&
                  application.status === Status.REJECTED
                ) {
                  await updateEmailSentToApplication({
                    applicationId: application.id,
                    version:
                      value?.updateApplication?._version ??
                      application._version,
                    isEmailSent: false,
                  });
                }

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
                  .then(async (value) => {
                    syncApplications();
                    push("/applications");
                    return value;
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
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          isValid,
        }) => (
          <Form dir="ltr">
            <table className="table w-full mb-4 table-fixed">
              <thead>
                <tr>
                  <th>{t("applicationField")}</th>
                  <th>{t("value")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("emailHasBeenSent")}</td>
                  <td className="flex items-center gap-8">
                    {application.isEmailSent === true ? t("yes") : t("no")}
                    <div>
                      {application.status === Status.APPROVED && (
                        <PrimaryButton
                          name={tA.t("sendEmail")}
                          buttonClick={sendApprovedEmail}
                        ></PrimaryButton>
                      )}
                    </div>
                  </td>
                </tr>
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
                      {/* <div className="text-sm font-semibold ">
                        {application.status === Status.ELIGIBLE
                          ? tA.t(Status.REVIEW)
                          : tA.t(`${application.status}`)}
                      </div> */}
                      {!readOnly && application.status !== Status.WITHDRAWN && (
                        <Field
                          className="border rounded-xl"
                          as="select"
                          name="applicationStatus"
                          value={values.applicationStatus}
                          onBlur={handleBlur}
                        >
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
                            disabled={application.status === Status.APPROVED}
                            value={Status.APPROVED}
                          >
                            {tA.t("APPROVED")}
                          </option>
                          <option
                            disabled={application.status === Status.REJECTED}
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
                  <td className="flex flex-col gap-2">
                    <div>
                      {`${primaryProgram?.program?.name} - ${primaryProgram?.program?.university?.name}`}
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
                  <td className="flex flex-col gap-2">
                    <div>
                      {`${secondaryProgram?.program?.name} - ${secondaryProgram?.program?.university?.name}`}
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
                {/* <tr>
                  <td>{t("signedContract")}</td>
                  <td>
                    {
                      <GetStorageLinkComponent
                        storageKey={downloadLinks.signedContractDoc}
                      ></GetStorageLinkComponent>
                    }
                  </td>
                </tr> */}
                <tr>
                  <td>{t("studentLog")}</td>
                  <td>
                    <Link
                      className="link link-primary"
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
                      className="link link-primary"
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
