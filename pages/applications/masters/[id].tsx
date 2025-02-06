import React, { FC } from "react";
import { Toaster } from "react-hot-toast";
import { MasterApplication, Status } from "../../../src/API";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import router, { useRouter } from "next/router";
import { PageComponent } from "../../../components/page-component";
import { DownloadFileFromUrl } from "../../../components/download-file-from-url";
import { FiAlertCircle, FiCheckCircle, FiPrinter } from "react-icons/fi";
import { PhoneNumberInput } from "../../../components/phone";
import { Button, buttonVariants } from "../../../components/ui/button";
import { IoMdArrowRoundBack } from "react-icons/io";

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";

import { listScholarshipsOfApplicationId } from "../../../src/CustomAPI";
import { cn } from "../../../src/utils";
import { getMasterApplicationByIdAPI } from "../../../context/StudentContext";
import MasterInfoForm from "../../../components/student/MasterInfoForm";
import { GenerateScholarshipForm } from "../../../components/scholarships/GenerateScholarshipForm";

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
  const scholarships = await listScholarshipsOfApplicationId({
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

  const { locale } = useRouter();

  function goBack() {
    router.back();
  }

  return (
    <div>
      <PageComponent title={"MApplicationInfo"}>
        <button className="flex-1 btn btn-ghost" onClick={goBack}>
          <IoMdArrowRoundBack />

          {tCommon("back")}
        </button>
        <Toaster />
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">{tPageTitle("MApplication")}</div>
          {/* TODO add this url to env */}
          <DownloadFileFromUrl
            url={`https://a69a50c47l.execute-api.us-east-1.amazonaws.com/default/applications/pdf?applicationId=${
              props.application.id
            }&lang=${locale ?? "en"}`}
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
          </div>
          <div className="flex flex-col gap-3">
            <p>{`${t("nationality")} ${t(
              props.application.nationalityCategory?.toString() ?? ""
            )}`}</p>
            <p>{`${t("tableTitleGpa")} ${
              props.application?.verifiedGPA ?? props.application?.gpa ?? 0
            }`}</p>
            <div className="flex gap-4 items-center">
              <p>{t("tableTitleVerifiedGpa")}</p>

              {props.application.verifiedGPA ? (
                <FiCheckCircle className="text-success" />
              ) : (
                <FiAlertCircle className="text-warning" />
              )}
            </div>
            <div className="flex gap-4 items-center">
              <p>{t("adminPoints")}</p>

              {props.application.adminPoints ? (
                <FiCheckCircle className="text-success" />
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
          </div>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <p className="font-medium">{t("studentReasonD")}</p>
            <Textarea
              disabled
              className="max-h-96 min-h-40  sm:min-h-20 !cursor-default"
            >
              {props.application.reason ?? t("empty")}
            </Textarea>
          </div>
        </div>

        {props.scholarship.canCreateNewScholarship && (
          <div className="grid p-6 mt-6 rounded-md border sm:grid-cols-2">
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

            <Dialog>
              {props.scholarship.scholarshipId ? (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-auto"
                  )}
                  href={`/scholarships/${props.scholarship.scholarshipId}`}
                >
                  {t("goToScholarship")}
                </Link>
              ) : (
                <DialogTrigger asChild>
                  <Button variant="default" className="mt-auto">
                    {t("createScholarship")}
                  </Button>
                </DialogTrigger>
              )}
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>{t("generateScholarship")}</DialogTitle>
                  <DialogDescription>
                    {`${t("thisWillGenerateAScholarshipFor")} ${
                      props.application.studentCPR
                    }`}
                  </DialogDescription>
                  {/* Download Contract template */}
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  {/* <div className="flex flex-col gap-1">
                    <DownloadFileFromUrl
                      isFromLocal
                      url={`/Waqfisa-scholarship.pdf`}
                      fileName={`Scholarship-Contract-${props.application.studentCPR}`}
                    >
                      {t("downloadContractTemplate")}
                    </DownloadFileFromUrl>
                    <DialogDescription>
                      {`${t("downloadContractTemplateD")}`}
                    </DialogDescription>
                  </div> */}
                  <GenerateScholarshipForm
                    type={"masters"}
                    masterApplicationId={props.application.id}
                    onGenerate={function (
                      data: {
                        applicationID: string;
                        startDate: string;
                        scholarshipPeriod: number;
                        numberOfSemesters: number;
                      } & { contract: string }
                    ): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
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
