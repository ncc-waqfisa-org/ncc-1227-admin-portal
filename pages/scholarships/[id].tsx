import React, { FC } from "react";
import { PageComponent } from "../../components/page-component";

import { GetServerSideProps } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSingleScholarship,
  updateSingleScholarship,
} from "../../src/CustomAPI";

import { Scholarship } from "../../src/models";
import { UpdateScholarshipMutationVariables } from "../../src/API";
import toast from "react-hot-toast";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cn } from "../../src/utils";
import { DownloadFileFromUrl } from "../../components/download-file-from-url";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "scholarships",
        "pageTitles",
        "applications",
        "signIn",
        "common",
        "errors",
      ])),
      id: id ?? null,
    },
  };
};

type PageType = {
  id: string | null;
};

const SingleScholarshipPage: FC<PageType> = ({ id }) => {
  const { t } = useTranslation("scholarships");
  const queryClient = useQueryClient();
  const { data: scholarship, isPending } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: () => getSingleScholarship({ id: id ?? "" }),
  });

  // updateSingleScholarship

  async function handleUpdate(values: any) {
    updateScholarshipMutation.mutate({
      input: {
        ...values,
        id: scholarship?.getScholarship?.id ?? "",
        _version: scholarship?.getScholarship?._version,
      },
    });
  }

  const updateScholarshipMutation = useMutation({
    mutationFn: (values: UpdateScholarshipMutationVariables) => {
      return updateSingleScholarship(values);
    },
    async onSuccess(data) {
      if (data?.updateScholarship) {
        queryClient.invalidateQueries({
          queryKey: ["scholarship", id],
        });
        queryClient.invalidateQueries({ queryKey: ["scholarship"] });

        toast.success(t("updatedSuccessfully"));
      } else {
        toast.error(t("failedToUpdate"));
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  // if (isPending || updateScholarshipMutation.isPending) {
  //   return (
  //     <PageComponent title="Scholarship">

  //     </PageComponent>
  //   );
  // }

  if (
    (!scholarship || !scholarship.getScholarship || id === null) &&
    !isPending
  ) {
    return (
      <PageComponent title="Scholarships">
        <p>{t("notFound")}</p>
      </PageComponent>
    );
  }

  return (
    <PageComponent title="Scholarship">
      <div className="relative flex flex-col w-full max-w-3xl gap-4 mx-auto">
        {/* header */}
        <div className="p-6 ">
          <div className="text-2xl font-semibold ">{t("scholarship")}</div>
          <div className="text-base font-medium text-gray-500 ">
            {`${t("editScholarship")} ${scholarship?.getScholarship?.id}`}
          </div>
        </div>

        <div className="grid gap-2 px-4">
          <p className="font-medium">{t("toolbar")}</p>
          <div className="flex flex-wrap gap-3 p-3 border rounded-lg">
            {/* <DownloadFileFromUrl
              fileName={"unverified-CPR's"}
              url={`https://zcpmds4jptbtkcc6ynxxxsmcee0kjlud.lambda-url.us-east-1.on.aws?scholarship=${scholarshipYear}`}
            >
              {t("downloadCPRsList")}
            </DownloadFileFromUrl>
            {scholarshipYear && <BulkUploadGpa scholarship={scholarshipYear} />} */}
          </div>
        </div>

        {scholarship?.getScholarship && (
          <div>NOT IMPLEMENTED YET</div>
          // <ScholarshipUpdateForm
          //   scholarship={
          //     new Scholarship({
          //       scholarship: scholarshipYear ?? 0,
          //       createApplicationStartDate:
          //         scholarship.getScholarship.createApplicationStartDate,
          //       createApplicationEndDate:
          //         scholarship.getScholarship.createApplicationEndDate,
          //       updateApplicationEndDate:
          //         scholarship.getScholarship.updateApplicationEndDate,
          //       signUpStartDate: scholarship.getScholarship.signUpStartDate,
          //       signUpEndDate: scholarship.getScholarship.signUpEndDate,
          //     })
          //   }
          //   onSubmit={(values) => {
          //     handleUpdate(values);
          //     return values;
          //   }}
          //   onError={(values, error) => {
          //     console.log("error", error);
          //     console.log("onError:", values);
          //   }}
          // ></ScholarshipUpdateForm>
        )}

        <div
          className={cn(
            "absolute justify-center flex bg-white/20 backdrop-blur-sm duration-200 pointer-events-none items-center opacity-0 z-50 inset-0",
            (isPending || updateScholarshipMutation.isPending) &&
              "opacity-100  pointer-events-auto"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="loading"></span>
            <p>{t("loading")}...</p>
          </div>
        </div>
      </div>
    </PageComponent>
  );
};

export default SingleScholarshipPage;
