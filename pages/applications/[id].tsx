import { useRouter } from "next/router";
import React, { FC } from "react";
import { Toaster } from "react-hot-toast";
import { PageComponent } from "../../components/page-component";
import { getApplicationByIdAPI } from "../../context/StudentContext";
import { GetServerSideProps } from "next";
import { Application } from "../../src/API";
import ViewApplication from "../../components/application-view-component";
import StudentInfoComponent from "../../components/student-info-component";
import ParentsInfoComponent from "../../components/parents-info-component";
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

interface Props {
  application: Application;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  const res = await getApplicationByIdAPI(`${id}`);

  return {
    props: {
      application: res,
      ...(await serverSideTranslations(locale ?? "en", [
        "pageTitles",
        "signIn",
        "applications",
        "common",
        "applicationLog",
        "errors",
      ])),
    },
  };
};

const ApplicationInfo: FC<Props> = (props) => {
  const { t } = useTranslation("applications");

  return (
    <div>
      <PageComponent title={"ApplicationInfo"}>
        <Toaster />
        <div className="">
          <div className="text-2xl font-semibold ">{t("application")}</div>
        </div>

        {/* <div>
          <div className="mt-10 ">
            <div className="text-base font-medium text-gray-500 ">
              {t("studentInformation")}
            </div>
          </div>
          <StudentInfoComponent
            student={props.application.student}
            showAll
          ></StudentInfoComponent>
        </div>
        <div className="divider"></div>
        <div className="mb-4">
          <div className="mt-10">
            <div className="text-base font-medium text-gray-500 ">
              {t("parentsInformation")}
            </div>
          </div>
          <ParentsInfoComponent
            parents={props.application.student?.ParentInfo}
          ></ParentsInfoComponent>
        </div> */}

        {props.application.student && (
          <Accordion
            className="w-full"
            type="single"
            defaultValue="applicationInformation"
            collapsible
          >
            <AccordionItem value="applicationInformation">
              <AccordionTrigger className="text-xl font-medium">
                {" "}
                {t("applicationInformation")}
              </AccordionTrigger>
              <AccordionContent>
                <ApplicationForm application={props.application} />
                {/* <ViewApplication
                  application={props.application}
                  downloadLinks={{
                    schoolCertificate:
                      props.application.attachment?.schoolCertificate,
                    transcriptDoc: props.application.attachment?.transcriptDoc,
                    signedContractDoc:
                      props.application.attachment?.signedContractDoc,
                  }}
                  readOnly={false}
                ></ViewApplication> */}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="studentInformation">
              <AccordionTrigger className="text-xl font-medium">
                {" "}
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

        {/* <ViewApplication
          application={props.application}
          downloadLinks={{
            schoolCertificate: props.application.attachment?.schoolCertificate,
            transcriptDoc: props.application.attachment?.transcriptDoc,
            signedContractDoc: props.application.attachment?.signedContractDoc,
          }}
          readOnly={false}
        ></ViewApplication> */}
      </PageComponent>
    </div>
  );
};

export default ApplicationInfo;
