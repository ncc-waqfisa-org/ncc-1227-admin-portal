import React, { FC } from "react";
import { Toaster } from "react-hot-toast";
import { PageComponent } from "../../components/page-component";
import { getApplicationByIdAPI } from "../../context/StudentContext";
import { GetServerSideProps } from "next";
import { Application, Status } from "../../src/API";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import StudentUpdate from "../../components/student/StudentUpdate";
import UpdateParentInfo from "../../components/student/UpdateParentInfo";
import { ApplicationForm } from "../../components/application/ApplicationForm";
import { listScholarshipsOfApplicationId } from "../../src/CustomAPI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button, buttonVariants } from "../../components/ui/button";
import { CreateScholarshipForm } from "../../components/scholarships/NewScholarshipForm";
import { useRouter } from "next/router";
import Link from "next/link";
import { cn } from "../../src/utils";

interface Props {
  application: Application;
  scholarship: {
    canCreateNewScholarship: boolean;
    scholarshipId: string | null;
  };
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  const res = await getApplicationByIdAPI(`${id}`);

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
      ])),
    },
  };
};

const ApplicationInfo: FC<Props> = (props) => {
  const { t } = useTranslation("applications");
  const { locale } = useRouter();

  return (
    <div>
      <PageComponent title={"ApplicationInfo"}>
        <Toaster />
        <div className="">
          <div className="text-2xl font-semibold ">{t("application")}</div>
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
                {`${
                  locale === "ar"
                    ? props.application.programs?.items?.[0]?.program?.nameAr
                    : props.application.programs?.items?.[0]?.program?.name
                } - ${
                  locale === "ar"
                    ? props.application.programs?.items?.[0]?.program
                        ?.university?.nameAr
                    : props.application.programs?.items?.[0]?.program
                        ?.university?.name
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
                </DialogHeader>
                <div className="">
                  <CreateScholarshipForm application={props.application} />
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
                <ApplicationForm application={props.application} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="studentInformation">
              <AccordionTrigger className="text-xl font-medium">
                {t("studentInformation")}
              </AccordionTrigger>
              <AccordionContent>
                <StudentUpdate student={props.application.student} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="parentsInformation">
              <AccordionTrigger className="text-xl font-medium">
                {t("parentsInformation")}
              </AccordionTrigger>
              <AccordionContent>
                {props.application.student.ParentInfo && (
                  <UpdateParentInfo
                    parentInfo={props.application.student.ParentInfo}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </PageComponent>
    </div>
  );
};

export default ApplicationInfo;
