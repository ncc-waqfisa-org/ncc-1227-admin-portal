import React, { FC } from "react";
import { PageComponent } from "../../components/page-component";
import { GetServerSideProps } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleBatch, updateSingleBatch } from "../../src/CustomAPI";

import { Batch } from "../../src/models";
import { UpdateBatchMutationVariables } from "../../src/API";
import toast from "react-hot-toast";

import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cn } from "../../src/utils";
import { DownloadFileFromUrl } from "../../components/download-file-from-url";
import { BulkUploadGpa } from "../../components/batch/BulkUploadGpa";
import BatchUpdateForm from "../../components/batch/BatchUpdateForm";
import { BatchUpdateFormInputValues } from "../../src/ui-components/BatchUpdateForm";

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
  const queryClient = useQueryClient();
  const { data: batch, isPending } = useQuery({
    queryKey: ["batch", batchYear],
    queryFn: () => getSingleBatch({ batch: batchYear ?? 0 }),
  });

  // updateSingleBatch

  async function handleUpdate(values: BatchUpdateFormInputValues) {
    updateBatchMutation.mutate({
      input: {
        ...values,
        batch: batch?.getBatch?.batch ?? 0,
        _version: batch?.getBatch?._version,
      },
    });
  }

  const updateBatchMutation = useMutation({
    mutationFn: (values: UpdateBatchMutationVariables) => {
      return updateSingleBatch(values);
    },
    async onSuccess(data) {
      if (data?.updateBatch) {
        queryClient.invalidateQueries({
          queryKey: ["batch", batchYear],
        });
        queryClient.invalidateQueries({ queryKey: ["batches"] });

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
        <div className="p-6">
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
              // url={`https://zcpmds4jptbtkcc6ynxxxsmcee0kjlud.lambda-url.us-east-1.on.aws?batch=${batchYear}`}
            >
              {t("downloadCPRsList")}
            </DownloadFileFromUrl>
            {batchYear && <BulkUploadGpa batch={batchYear} />}
          </div>
        </div>

        {batch?.getBatch && (
          // <BatchUpdateForm
          //   batch={
          //     new Batch({
          //       batch: batchYear ?? 0,
          //       createApplicationStartDate:
          //         batch.getBatch.createApplicationStartDate,
          //       createApplicationEndDate:
          //         batch.getBatch.createApplicationEndDate,
          //       updateApplicationEndDate:
          //         batch.getBatch.updateApplicationEndDate,
          //       signUpStartDate: batch.getBatch.signUpStartDate,
          //       signUpEndDate: batch.getBatch.signUpEndDate,
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
          // ></BatchUpdateForm>
          <BatchUpdateForm batch={batch.getBatch} />
        )}

        <div
          className={cn(
            "absolute justify-center flex bg-white/20 backdrop-blur-sm duration-200 pointer-events-none items-center opacity-0 z-50 inset-0",
            (isPending || updateBatchMutation.isPending) &&
              "opacity-100  pointer-events-auto"
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
