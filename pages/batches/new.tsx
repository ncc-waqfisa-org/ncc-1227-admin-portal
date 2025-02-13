import React, { FC } from "react";
import { PageComponent } from "../../components/page-component";
import { GetServerSideProps } from "next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSingleBatch } from "../../src/CustomAPI";

import { CreateBatchInput, CreateBatchMutationVariables } from "../../src/API";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cn } from "../../src/utils";
import BatchCreateForm, {
  BatchCreateFormInputValues,
} from "../../components/batch/BatchCreateForm";
import BatchForm from "../../components/batch/BatchForm";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "batches",
        "pageTitles",
        "signIn",
        "common",
        "errors",
      ])),
    },
  };
};

type PageType = {};

const CreateSingleBatchPage: FC<PageType> = ({}) => {
  const { push } = useRouter();
  const { t } = useTranslation("batches");
  const queryClient = useQueryClient();

  // async function handleCreate(values: BatchCreateFormInputValues) {
  //   const input: CreateBatchInput = {
  //     ...values,
  //     batch: values.batch ?? 0,
  //   };
  //   createBatchMutation.mutate({
  //     input,
  //   });
  // }

  // const createBatchMutation = useMutation({
  //   mutationFn: (values: CreateBatchMutationVariables) => {
  //     return createSingleBatch(values);
  //   },
  //   async onSuccess(data) {
  //     if (data?.createBatch) {
  //       queryClient.invalidateQueries({ queryKey: ["batches"] });

  //       toast.success(t("createdSuccessfully"));
  //       push("/batches");
  //     } else {
  //       toast.error(t("failedToCreate"));
  //     }
  //   },
  //   async onError(error) {
  //     toast.error(error.message, { duration: 6000 });
  //   },
  // });

  return (
    <PageComponent title="Batch">
      <div className="relative flex flex-col w-full max-w-3xl mx-auto">
        {/* header */}
        <div className="py-6 ">
          <div className="text-2xl font-semibold ">{t("batch")}</div>
          <div className="text-base font-medium text-gray-500 ">
            {`${t("createNewBatch")}`}
          </div>
        </div>

        {/* <BatchCreateForm
          onSubmit={(values) => {
            handleCreate(values);
            return values;
          }}
          onError={(values, error) => {
            console.log("error", error);
            console.log("onError:", values);
          }}
        ></BatchCreateForm> */}

        <BatchForm />

        {/* <div
          className={cn(
            "absolute justify-center flex bg-white/20 backdrop-blur-sm duration-200 pointer-events-none items-center opacity-0 z-50 inset-0",
            createBatchMutation.isPending && "opacity-100  pointer-events-auto"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="loading"></span>
            <p>{t("loading")}...</p>
          </div>
        </div> */}
      </div>
    </PageComponent>
  );
};

export default CreateSingleBatchPage;
