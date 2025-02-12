import React, { FC } from "react";
import { PageComponent } from "../../../components/page-component";

import { GetServerSideProps } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMastersScholarshipsWithId,
  getScholarshipsWithId,
  updateSingleMasterScholarship,
  updateSingleScholarship,
} from "../../../src/CustomAPI";

import {
  UpdateMasterScholarshipMutationVariables,
  UpdateScholarshipMutationVariables,
} from "../../../src/API";
import toast from "react-hot-toast";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cn } from "../../../src/utils";
import { ScholarshipForm } from "../../../components/scholarships/ScholarshipForm";
import { MastersScholarshipForm } from "../../../components/scholarships/MastersScholarshipForm";

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
    queryKey: ["mastersScholarship", id],
    queryFn: () => (id ? getMastersScholarshipsWithId({ id: id }) : null),
  });

  // updateSingleScholarship
  async function handleUpdate(values: any) {
    updateScholarshipMutation.mutate({
      input: {
        ...values,
        id: scholarship?.id ?? "",
        _version: scholarship?._version,
      },
    });
  }

  const updateScholarshipMutation = useMutation({
    mutationFn: (values: UpdateMasterScholarshipMutationVariables) => {
      return updateSingleMasterScholarship(values);
    },
    async onSuccess(data) {
      if (data?.updateMasterScholarship) {
        queryClient.invalidateQueries({
          queryKey: ["mastersScholarship", id],
        });
        queryClient.invalidateQueries({ queryKey: ["mastersScholarship"] });

        toast.success(t("updatedSuccessfully"));
      } else {
        toast.error(t("failedToUpdate"));
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  if ((!scholarship || !scholarship || id === null) && !isPending) {
    return (
      <PageComponent title="MScholarships">
        <p>{t("notFound")}</p>
      </PageComponent>
    );
  }

  return (
    <PageComponent title="MScholarship">
      <div className="relative flex flex-col w-full max-w-3xl gap-4 mx-auto">
        {/* header */}
        <div className="">
          <div className="text-2xl font-semibold ">
            {t("masterScholarships")}
          </div>
          <div className="text-base font-medium text-gray-500 "></div>
        </div>

        {/* Applicant details */}
        <div className="grid gap-3 p-4 my-4 rounded-lg border sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="w-fit">{t("cpr")}</p>
            <p className="p-1 px-3 rounded-md border w-fit">
              {scholarship?.application?.studentCPR ?? "-"}
            </p>
            <p className="w-fit">{t("applicant")}</p>
            <p className="p-1 px-3 rounded-md border w-fit">
              {scholarship?.application?.studentName ?? "-"}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="w-fit">{t("program")}</p>
            <p className="p-1 px-3 rounded-md border w-fit">
              {scholarship?.application?.program ?? "-"}
            </p>
            <p className="w-fit">{t("university")}</p>
            <p className="p-1 px-3 rounded-md border w-fit">
              {scholarship?.application?.university?.universityName ?? "-"}
            </p>
          </div>
        </div>

        {scholarship && (
          <div>
            <MastersScholarshipForm mastersScholarship={scholarship} />
          </div>
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
