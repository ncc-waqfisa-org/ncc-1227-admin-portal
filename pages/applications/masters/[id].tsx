import React, { FC, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MasterApplication, Status } from "../../../src/API";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { PageComponent } from "../../../components/page-component";
import { DownloadFileFromUrl } from "../../../components/download-file-from-url";
import { FiAlertCircle, FiCheckCircle, FiPrinter } from "react-icons/fi";
import { PhoneNumberInput } from "../../../components/phone";
import { Button, buttonVariants } from "../../../components/ui/button";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

import Link from "next/link";
import { MasterApplicationForm } from "../../../components/application/MasterApplicationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";

import {
  listMastersScholarshipsOfApplicationId,
  listScholarshipsOfApplicationId,
} from "../../../src/CustomAPI";
import { cn } from "../../../src/utils";
import { getMasterApplicationByIdAPI } from "../../../context/StudentContext";
import MasterInfoForm from "../../../components/student/MasterInfoForm";
import {
  GenerateScholarshipForm,
  TGeneratedScholarship,
} from "../../../components/scholarships/GenerateScholarshipForm";
import { useAuth } from "../../../hooks/use-auth";
import { calculateAge, isValidAge } from "../../../src/Helpers";

interface Props {
  application: MasterApplication;
  scholarship: {
    canCreateNewScholarship: boolean;
    scholarshipId: string | null;
  };
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  const res = await getMasterApplicationByIdAPI(`${id}`);

  // check if application have scholarship
  const scholarships = await listMastersScholarshipsOfApplicationId({
    applicationId: `${id}`,
  });

  return {
    props: {
      application: res,
      scholarship: {
        canCreateNewScholarship: res?.status === Status.APPROVED,
        scholarshipId: scholarships.length > 0 ? scholarships[0].id : null,
      },
      ...(await serverSideTranslations(locale ?? "en", [
        "pageTitles",
        "signIn",
        "applications",
        "scholarships",
        "common",
        "applicationLog",
        "errors",
        "account",
      ])),
    },
  };
};

const MasterApplicationInfo: FC<Props> = (props) => {
  const { t } = useTranslation("applications");
  const { t: tPageTitle } = useTranslation("pageTitles");
  const { t: tCommon } = useTranslation("common");
  const { token } = useAuth();

  const { locale, back, push } = useRouter();

  const [isAttachingPending, setIsAttachingPending] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generatedContractData, setGeneratedContractData] =
    useState<TGeneratedScholarship>();

  async function attachAndCreate(): Promise<void> {
    setIsAttachingPending(true);

    await toast.promise(
      fetch(
        `${process.env.NEXT_PUBLIC_LAMBDA_POST_CREATE_SCHOLARSHIP_MASTERS}`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(generatedContractData),
        }
      ),
      {
        loading: t("creatingScholarship"),
        success: (res) => {
          res.json().then((data) => {
            const id: string | null = data?.scholarship?.id;
            if (id) {
              push(`/${locale}/scholarships/masters/${id}`);
            }
          });
          setGeneratedContractData(undefined);
          return t("createdSuccessfully");
        },
        error: t("failedToCreate"),
      }
    );

    setIsAttachingPending(false);
  }

  let studentName = `${props.application.student?.m_firstName} ${props.application.student?.m_secondName} ${props.application.student?.m_thirdName} ${props.application.student?.m_lastName}`;
  let applicantAge = calculateAge(props.application.student?.dob ?? "");
  return (
    <div>
      <PageComponent title={"MApplicationInfo"}>
        <button className="flex-1 btn btn-ghost" onClick={() => back()}>
          <IoMdArrowRoundBack />

          {tCommon("back")}
        </button>
        <Toaster />
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">
            {tPageTitle("MApplication")}
          </div>
          {/* TODO add this url to env */}
          <DownloadFileFromUrl
            url={`${
              process.env.NEXT_PUBLIC_LAMBDA_GET_MASTERS_APPLICATION_PDF
            }?applicationId=${props.application.id}&lang=${locale ?? "en"}`}
            fileName={`${props.application.student?.cpr} Application`}
          >
            <div className="flex gap-2 items-center">
              <FiPrinter />
              {t("print")}
            </div>
          </DownloadFileFromUrl>
        </div>

        {/*  */}
        <div className="grid gap-3 p-4 my-4 rounded-lg border sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="w-fit">{props.application.student?.fullName}</p>
            <p className="p-1 rounded-md border w-fit">
              {props.application.student?.cpr}
            </p>
            <p className="w-fit">{props.application.student?.email}</p>
            <PhoneNumberInput
              className="w-fit"
              value={props.application.student?.phone?.toString() ?? ""}
              disabled
              onChange={() => {}}
            />
            {props.application.student?.dob && (
              <div
                className={cn(
                  "flex gap-4 items-center p-2 px-3 rounded-md border border-input w-fit",
                  !isValidAge(applicantAge, "masters") &&
                    "border-error bg-error/10"
                )}
              >
                <p>{t("applicantAge")} -</p>
                <p>{applicantAge}</p>
                {isValidAge(applicantAge, "masters") ? (
                  <FiCheckCircle className="text-success" />
                ) : (
                  <FiAlertCircle className="text-error" />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <p>{`${t("nationality")} ${t(
              props.application.nationalityCategory?.toString() ?? ""
            )}`}</p>
            <div className="flex gap-4 items-center">
              <p>{`${t("tableTitleGpa")}`}</p>{" "}
              <p className="p-1 px-3 font-medium rounded-sm border border-input">
                {props.application?.gpa ?? 0}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <p>{t("tableTitleVerifiedGpa")}</p>
              {props.application.verifiedGPA ? (
                <div className="flex gap-4 items-center">
                  <p className="p-1 px-3 font-medium rounded-sm border  border-input">
                    {props.application.verifiedGPA}
                  </p>
                  <FiCheckCircle className="text-success" />
                </div>
              ) : (
                <FiAlertCircle className="text-warning" />
              )}
            </div>
            <div className="flex gap-4 items-center">
              <p>{t("adminPoints")}</p>

              {props.application.adminPoints ? (
                <div className="flex gap-4 items-center">
                  <p className="p-1 px-3 font-medium rounded-sm border  border-input">
                    {props.application.adminPoints}
                  </p>
                  <FiCheckCircle className="text-success" />
                </div>
              ) : (
                <FiAlertCircle className="text-warning" />
              )}
            </div>
            <div className="flex gap-4 items-center">
              <p>{t("isIncomeVerified")}</p>

              {props.application.isIncomeVerified ? (
                <FiCheckCircle className="text-success" />
              ) : (
                <FiAlertCircle className="text-warning" />
              )}
            </div>
            <div className="flex gap-4 items-center">
              <p>{t("isToeflIELTSScoreVerified")}</p>

              {props.application.isToeflIELTSScoreVerified ? (
                <div className="flex gap-4 items-center">
                  <p className="p-1 px-3 font-medium rounded-sm border  border-input">
                    {props.application.toeflIELTSScore}
                  </p>
                  <FiCheckCircle className="text-success" />
                </div>
              ) : (
                <FiAlertCircle className="text-warning" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 py-4 md:grid-cols-2 sm:col-span-2">
            <div className="flex flex-col gap-3">
              <p className="font-medium">{t("program")}</p>
              <p className="p-1 px-4 rounded-md border w-fit">
                {props.application.program?.toString() ?? ""}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium">{t("university")}</p>
              <p className="p-1 px-4 rounded-md border w-fit">
                {locale === "ar"
                  ? props.application.university?.universityNameAr.toString() ??
                    ""
                  : props.application.university?.universityName.toString() ??
                    ""}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium">{t("major")}</p>
              <p className="p-1 px-4 rounded-md border w-fit">
                {props.application.major?.toString() ?? ""}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium">{t("applicationScore")}</p>
              <p className="p-1 px-4 rounded-md border w-fit">
                {props.application.score?.toString() ?? ""}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <p className="font-medium">{t("studentReasonD")}</p>
            <Textarea
              disabled
              className="max-h-96 min-h-48  sm:min-h-40 !cursor-default"
            >
              {props.application.reason ?? t("empty")}
            </Textarea>
          </div>
        </div>

        {props.scholarship.canCreateNewScholarship && (
          <div className="grid p-6 my-6 rounded-md border sm:grid-cols-2">
            <div>
              <p className="font-medium">{t("thisApplicationIsApproved")}</p>
              {props.scholarship.scholarshipId ? (
                <p>{t("scholarshipHasBeenCreated")}</p>
              ) : (
                <p>{t("createScholarshipFor")}</p>
              )}

              <p className="pt-4 text-gray-500">
                {`${t("major")} - ${props.application.major}`}
              </p>
              <p className="text-gray-500">
                {`${t("programName")} - ${props.application.program}`}
              </p>
              <p className="text-gray-500">
                {`${t("university")} - ${
                  locale === "ar"
                    ? props.application.university?.universityNameAr
                    : props.application.university?.universityName
                }`}
              </p>
            </div>
            {/*  */}
            <div className="flex flex-col justify-end">
              <Dialog
                open={isGenerateDialogOpen}
                onOpenChange={setIsGenerateDialogOpen}
              >
                {props.scholarship.scholarshipId ? (
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "mt-auto"
                    )}
                    href={`/scholarships/masters/${props.scholarship.scholarshipId}`}
                  >
                    {t("goToScholarship")}
                  </Link>
                ) : (
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      // className="mt-auto"
                      disabled={generatedContractData !== undefined}
                    >
                      {t("generateScholarship")}
                    </Button>
                  </DialogTrigger>
                )}
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>{t("generateScholarship")}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4 items-center sm:col-span-2">
                      <span className="w-full h-[1px] bg-border "></span>{" "}
                      <p className="text-center">{t("applicantInfo")}</p>
                      <span className="w-full h-[1px] bg-border "></span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 py-4">
                      <p className="p-1 px-3 text-center rounded-md border border-input">
                        {`${t("cpr")}`} - {props.application.studentCPR}
                      </p>
                      <p className="p-1 px-3 text-center rounded-md border border-input">
                        {`${t("fullName")}`} - {studentName}
                      </p>
                      <p className="p-1 px-3 text-center rounded-md border border-input">
                        {`${t("university")}`} -{" "}
                        {locale === "ar"
                          ? props.application.university?.universityNameAr
                          : props.application.university?.universityName}
                      </p>
                      <p className="p-1 px-3 text-center rounded-md border border-input">
                        {`${t("programName")}`} - {props.application.program}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center sm:col-span-2">
                      <span className="w-full h-[1px] bg-border "></span>{" "}
                      <p className="text-center">{t("scholarshipInfo")}</p>
                      <span className="w-full h-[1px] bg-border "></span>
                    </div>
                    <GenerateScholarshipForm
                      type={"masters"}
                      masterApplicationId={props.application.id}
                      onGenerate={(generatedData) => {
                        if (generatedData) {
                          setGeneratedContractData(generatedData);
                          setIsGenerateDialogOpen(!isGenerateDialogOpen);
                        }
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              {generatedContractData?.pdfUrl && (
                <div className="flex flex-col gap-6 justify-end items-center mt-auto xl:flex-row">
                  <Link
                    className="pt-2 underline underline-offset-2"
                    // className="btn btn-info btn-sm"
                    target="_blank"
                    href={generatedContractData.pdfUrl}
                  >
                    {t("previewContract")}
                  </Link>
                  <div className="flex flex-col justify-center">
                    <button
                      type="button"
                      className="btn-primary btn btn-sm"
                      disabled={isAttachingPending}
                      onClick={attachAndCreate}
                    >
                      {props.scholarship.scholarshipId ? (
                        <div className="flex gap-2">
                          <FaCheck />
                          {t("scholarshipSent")}
                        </div>
                      ) : (
                        t("sendToApplicant")
                      )}
                    </button>
                    {!props.scholarship.scholarshipId && (
                      <p className="pt-2 text-sm text-gray-400">
                        {t("sendToApplicantD")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {props.application.student && (
          <Accordion
            className="w-full"
            type="single"
            defaultValue="applicationInformation"
            collapsible
          >
            <AccordionItem value="applicationInformation">
              <AccordionTrigger className="text-xl font-medium">
                {t("applicationInformation")}
              </AccordionTrigger>
              <AccordionContent>
                <MasterApplicationForm application={props.application} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="studentInformation">
              <AccordionTrigger className="text-xl font-medium">
                {t("studentInformation")}
              </AccordionTrigger>
              <AccordionContent>
                {/* <StudentUpdate
                  applicationId={props.application.id}
                  student={props.application.student}
                /> */}
                <MasterInfoForm
                  student={props.application.student}
                  applicationId={props.application.id}
                  // universities={bahrainiUniversities}
                />
              </AccordionContent>
            </AccordionItem>
            {/* <AccordionItem value="guardianInformation">
              <AccordionTrigger className="text-xl font-medium">
                {t("guardianInformation")}
              </AccordionTrigger>
              <AccordionContent>
                {props.application.student.m_guardianCPR && (
                  <MasterInfoForm student={props.application.student} />
                )}
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        )}
      </PageComponent>
    </div>
  );
};

export default MasterApplicationInfo;
