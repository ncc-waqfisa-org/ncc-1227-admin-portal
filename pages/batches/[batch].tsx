import React, { FC } from "react";
import { PageComponent } from "../../components/page-component";
import { GetServerSideProps } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleBatch, updateSingleBatch } from "../../src/CustomAPI";

import { UpdateBatchMutationVariables } from "../../src/API";
import toast from "react-hot-toast";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cn } from "../../src/utils";
import { DownloadFileFromUrl } from "../../components/download-file-from-url";
import { BulkUploadGpa } from "../../components/batch/BulkUploadGpa";
import { BatchUpdateFormInputValues } from "../../src/ui-components/BatchUpdateForm";
import BatchForm from "../../components/batch/BatchForm";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/use-auth";


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

const SingleBatchPage: FC<PageType> = ({ batchYear }) => {
  const { t } = useTranslation("batches");
  const { token } = useAuth();

  const queryClient = useQueryClient();
  const { data: batch, isPending } = useQuery({
    queryKey: ["batch", batchYear],
    queryFn: () => getSingleBatch({ batch: batchYear ?? 0 }),
  });

  // updateSingleBatch

  // async function handleUpdate(values: BatchUpdateFormInputValues) {
  //   updateBatchMutation.mutate({
  //     input: {
  //       ...values,
  //       batch: batch?.getBatch?.batch ?? 0,
  //       _version: batch?.getBatch?._version,
  //     },
  //   });
  // }

  const updateApplicationsStatuses = useMutation({
    mutationFn: () => fetch(`${process.env.NEXT_PUBLIC_LAMBDA_GET_BACHELOR_APPLICATION}/refresh-statuses`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ batch: batchYear }),
    }),
    async onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success(t("updatedSuccessfully"));
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

  if ((!batch || !batch.getBatch || batchYear === null) && !isPending) {
    return (
      <PageComponent title="Batch">
        <p>{t("notFound")}</p>
      </PageComponent>
    );
  }

  return (
    <PageComponent title="Batch">
      <div className="flex relative flex-col gap-4 mx-auto w-full max-w-3xl">
        {/* header */}
        <div className="py-6">
          <div className="text-2xl font-semibold">{t("batch")}</div>
          <div className="text-base font-medium text-gray-500">
            {`${t("editBatch")} ${batch?.getBatch?.batch}`}
          </div>
        </div>

        <div className="grid gap-2 px-4">
          <p className="font-medium">{t("toolbar")}</p>
          <div className="flex flex-wrap gap-3 p-3 rounded-lg border">
            <DownloadFileFromUrl
              fileName={"Unverified-CPR's"}
              url={`${process.env.NEXT_PUBLIC_ELIGIBLE_CPRS_ENDPOINT}?batch=${batchYear}`}
            >
              {t("downloadCPRsList")}
            </DownloadFileFromUrl>
            {batchYear && <BulkUploadGpa batch={batchYear} />}
            <Button
              className="rounded-xl"
              variant={"outline"}
              disabled={updateApplicationsStatuses.isPending}
              onClick={() => updateApplicationsStatuses.mutate()
              }
            >
              {t("refreshApplicationsStatus")}
            </Button>
          </div>
        </div>

        {!batch?.getBatch && (
          <div>
            <div className="max-w-4xl bg-gray-100 w-full rounded-sm p-8">
              <p className=" text-center text-gray-500">{t("noBatchFound")}</p>
            </div>
          </div>
        )}
        {batch?.getBatch && <BatchForm batch={batch.getBatch} />}

        <div
          className={cn(
            "absolute justify-center flex bg-white/20 backdrop-blur-sm duration-200 pointer-events-none items-center opacity-0 z-50 inset-0",
            isPending && "opacity-100  pointer-events-auto"
          )}
        >
          <div className="flex gap-2 items-center">
            <span className="loading"></span>
            <p>{t("loading")}...</p>
          </div>
        </div>
      </div>
    </PageComponent>
  );
};

export default SingleBatchPage;
