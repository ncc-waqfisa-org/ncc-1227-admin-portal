import React, { FC } from "react";
import { PageComponent } from "../../../components/page-component";
import { GetServerSideProps } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSingleMasterBatch,
  updateSingleMasterBatch,
} from "../../../src/CustomAPI";

import { MasterBatch } from "../../../src/models";
import { UpdateMasterBatchMutationVariables } from "../../../src/API";
import toast from "react-hot-toast";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cn } from "../../../src/utils";
import { DownloadFileFromUrl } from "../../../components/download-file-from-url";
import { BulkUploadGpa } from "../../../components/batch/BulkUploadGpa";
import MasterBatchUpdateForm, {
  MasterBatchUpdateFormInputValues,
} from "../../../src/ui-components/MasterBatchUpdateForm";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { batch } = ctx.query;
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "batches",
        "pageTitles",
        "applications",
        "signIn",
        "common",
        "errors",
      ])),
      batchYear: batch ? Number(batch) : null,
    },
  };
};

type PageType = {
  batchYear: number | null;
};

const SingleMasterBatchPage: FC<PageType> = ({ batchYear }) => {
  const { t } = useTranslation("batches");
  const queryClient = useQueryClient();
  const { data: batch, isPending } = useQuery({
    queryKey: ["masterBatch", batchYear],
    queryFn: () => getSingleMasterBatch({ batch: batchYear ?? 0 }),
  });

  // updateSingleBatch

  async function handleUpdate(values: MasterBatchUpdateFormInputValues) {
    updateMasterBatchMutation.mutate({
      input: {
        ...values,
        batch: batch?.getMasterBatch?.batch ?? 0,
        _version: batch?.getMasterBatch?._version,
      },
    });
  }

  const updateMasterBatchMutation = useMutation({
    mutationFn: (values: UpdateMasterBatchMutationVariables) => {
      return updateSingleMasterBatch(values);
    },
    async onSuccess(data) {
      if (data?.updateMasterBatch) {
        queryClient.invalidateQueries({
          queryKey: ["masterBatch", batchYear],
        });
        queryClient.invalidateQueries({ queryKey: ["masterBatches"] });

        toast.success(t("updatedSuccessfully"));
      } else {
        toast.error(t("failedToUpdate"));
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  // if (isPending || updateBatchMutation.isPending) {
  //   return (
  //     <PageComponent title="Batch">

  //     </PageComponent>
  //   );
  // }

  if ((!batch || !batch.getMasterBatch || batchYear === null) && !isPending) {
    return (
      <PageComponent title="Batch">
        <p>{t("notFound")}</p>
      </PageComponent>
    );
  }

  return (
    <PageComponent title="Batch">
      <div className="relative flex flex-col w-full max-w-3xl gap-4 mx-auto">
        {/* header */}
        <div className="p-6 ">
          <div className="text-2xl font-semibold ">{t("MBatch")}</div>
          <div className="text-base font-medium text-gray-500 ">
            {`${t("editBatch")} ${batch?.getMasterBatch?.batch}`}
          </div>
        </div>

        <div className="grid gap-2 px-4">
          <p className="font-medium">{t("toolbar")}</p>
          <div className="flex flex-wrap gap-3 p-3 border rounded-lg">
            <DownloadFileFromUrl
              fileName={"Eligible-CPR's"}
              url={`${process.env.NEXT_PUBLIC_ELIGIBLE_MASTERS_CPRS_ENDPOINT}?batch=${batchYear}`}
            >
              {t("downloadCPRsList")}
            </DownloadFileFromUrl>
            {/* TODO: update any lambda functions inside of this */}
            {batchYear && <BulkUploadGpa batch={batchYear} />}
          </div>
        </div>

        {batch?.getMasterBatch && (
          <MasterBatchUpdateForm
            masterBatch={
              new MasterBatch({
                batch: batchYear ?? 0,
                createApplicationStartDate:
                  batch.getMasterBatch.createApplicationStartDate,
                createApplicationEndDate:
                  batch.getMasterBatch.createApplicationEndDate,
                updateApplicationEndDate:
                  batch.getMasterBatch.updateApplicationEndDate,
                signUpStartDate: batch.getMasterBatch.signUpStartDate,
                signUpEndDate: batch.getMasterBatch.signUpEndDate,
              })
            }
            onSubmit={(values) => {
              handleUpdate(values);
              return values;
            }}
            onError={(values, error) => {
              console.log("error", error);
              console.log("onError:", values);
            }}
          ></MasterBatchUpdateForm>
        )}

        <div
          className={cn(
            "absolute justify-center flex bg-white/20 backdrop-blur-sm duration-200 pointer-events-none items-center opacity-0 z-50 inset-0",
            (isPending || updateMasterBatchMutation.isPending) &&
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

export default SingleMasterBatchPage;
