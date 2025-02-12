import React, { FC } from "react";
import { PageComponent } from "../../../components/page-component";
import { GetServerSideProps } from "next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSingleBatch,
  createSingleMasterBatch,
} from "../../../src/CustomAPI";

import {
  CreateBatchInput,
  CreateBatchMutationVariables,
  CreateMasterBatchInput,
  CreateMasterBatchMutationVariables,
} from "../../../src/API";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cn } from "../../../src/utils";
import BatchCreateForm, {
  BatchCreateFormInputValues,
} from "../../../components/batch/BatchCreateForm";
import MasterBatchCreateForm, {
  MasterBatchCreateFormInputValues,
} from "../../../src/ui-components/MasterBatchCreateForm";
import MasterBatchForm from "../../../components/batch/MasterBatchForm";

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

const CreateSingleMasterBatchPage: FC<PageType> = ({}) => {
  const { push } = useRouter();
  const { t } = useTranslation("batches");
  const queryClient = useQueryClient();

  async function handleCreate(values: MasterBatchCreateFormInputValues) {
    const input: CreateMasterBatchInput = {
      ...values,
      batch: values.batch ?? 0,
    };
    createMasterBatchMutation.mutate({
      input,
    });
  }

  const createMasterBatchMutation = useMutation({
    mutationFn: (values: CreateMasterBatchMutationVariables) => {
      return createSingleMasterBatch(values);
    },
    async onSuccess(data) {
      if (data?.createMasterBatch) {
        queryClient.invalidateQueries({ queryKey: ["masterBatches"] });

        toast.success(t("createdSuccessfully"));
        push("/batches?scholarship_type=masters");
      } else {
        toast.error(t("failedToCreate"));
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  return (
    <PageComponent title="Batch">
      <div className="flex relative flex-col mx-auto w-full max-w-3xl">
        {/* header */}
        <div className="py-6">
          <div className="text-2xl font-semibold">{t("MBatch")}</div>
          <div className="text-base font-medium text-gray-500">
            {`${t("createNewMBatch")}`}
          </div>
        </div>

        {/* <MasterBatchCreateForm
          onSubmit={(values) => {
            handleCreate(values);
            return values;
          }}
          onError={(values, error) => {
            console.log("error", error);
            console.log("onError:", values);
          }}
        ></MasterBatchCreateForm> */}

        <MasterBatchForm />

        <div
          className={cn(
            "absolute justify-center flex bg-white/20 backdrop-blur-sm duration-200 pointer-events-none items-center opacity-0 z-50 inset-0",
            createMasterBatchMutation.isPending &&
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

export default CreateSingleMasterBatchPage;
