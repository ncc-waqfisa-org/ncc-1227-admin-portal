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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import Link from "next/link";
import { MasterApplicationForm } from "../../../components/application/MasterApplicationForm";
import { CreateScholarshipForm } from "../../../components/scholarships/NewScholarshipForm";
import StudentUpdate from "../../../components/student/StudentUpdate";
import UpdateParentInfo from "../../../components/student/UpdateParentInfo";
import { DialogHeader } from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";

import { listScholarshipsOfApplicationId } from "../../../src/CustomAPI";
import { cn } from "../../../src/utils";
import { getMasterApplicationByIdAPI } from "../../../context/StudentContext";
import MasterInfoForm from "../../../components/student/MasterInfoForm";

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
  const { t: tCommon } = useTranslation("common");

  const { locale } = useRouter();

  function goBack() {
    router.back();
  }

  return (
    <div>
      <PageComponent title={"ApplicationInfo"}>
        <button className="flex-1 btn btn-ghost" onClick={goBack}>
          <IoMdArrowRoundBack />

          {tCommon("back")}
        </button>
        <Toaster />
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold ">{t("application")}</div>
          {/* TODO add this url to env */}
          <DownloadFileFromUrl
            url={`https://a69a50c47l.execute-api.us-east-1.amazonaws.com/default/applications/pdf?applicationId=${
              props.application.id
            }&lang=${locale ?? "en"}`}
            fileName={`${props.application.student?.cpr} Application`}
          >
            <div className="flex items-center gap-2">
              <FiPrinter />
              {t("print")}
            </div>
          </DownloadFileFromUrl>
        </div>

        {/*  */}
        <div className="grid gap-3 p-4 my-4 border rounded-lg sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="w-fit">{props.application.student?.fullName}</p>
            <p className="p-1 border rounded-md w-fit">
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
            <div className="flex items-center gap-4">
              <p>{t("tableTitleVerifiedGpa")}</p>

              {props.application.verifiedGPA ? (
                <FiCheckCircle className="text-success" />
              ) : (
                <FiAlertCircle className="text-warning" />
              )}
            </div>
            <div className="flex items-center gap-4">
              <p>{t("adminPoints")}</p>

              {props.application.adminPoints ? (
                <FiCheckCircle className="text-success" />
              ) : (
                <FiAlertCircle className="text-warning" />
              )}
            </div>
            <div className="flex items-center gap-4">
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
          <div className="grid p-6 mt-6 border rounded-md sm:grid-cols-2">
            <div>
              <p className="font-medium">{t("thisApplicationIsApproved")}</p>
              {props.scholarship.scholarshipId ? (
                <p>{t("scholarshipHasBeenCreated")}</p>
              ) : (
                <p>{t("createScholarshipFor")}</p>
              )}
              <p className="text-gray-500">
                {`${props.application.program} - ${
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
                  <DialogTitle>{t("createScholarship")}</DialogTitle>
                  <DialogDescription>
                    {`${t("thisWillCreateScholarship")} ${
                      props.application.studentCPR
                    }`}
                  </DialogDescription>
                  {/* Download Contract template */}
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
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
                  </div>
                  {/* TODO create scholarship form application */}
                  {/* <CreateScholarshipForm application={props.application} /> */}
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
                <MasterInfoForm student={props.application.student} />
              </AccordionContent>
            </AccordionItem>
            {/* <AccordionItem value="guardianInformation">
              <AccordionTrigger className="text-xl font-medium">
                {t("guardianInformation")}
              </AccordionTrigger>
              <AccordionContent>
                {props.application.student.m_guardianCPR && (
                  // <UpdateParentInfo
                  //   parentInfo={props.application.student.ParentInfo}
                  // />
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
