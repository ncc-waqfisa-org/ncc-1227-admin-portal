import React, { FC } from "react";
import { PageComponent } from "../../components/page-component";
import BatchUpdateForm from "../../components/batch/BatchUpdateForm";
import { GetServerSideProps } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleBatch, updateSingleBatch } from "../../src/CustomAPI";

import { Batch } from "../../src/models";
import { UpdateBatchMutationVariables } from "../../src/API";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { batch } = ctx.query;

  return {
    props: {
      batchYear: batch,
    },
  };
};

type PageType = {
  batchYear: number;
};

const SingleBatchPage: FC<PageType> = ({ batchYear }) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { data: batch, isPending } = useQuery({
    queryKey: ["batch", batchYear],
    queryFn: () => getSingleBatch({ batch: batchYear }),
  });

  // updateSingleBatch

  const updateBatchMutation = useMutation({
    mutationFn: (values: UpdateBatchMutationVariables) => {
      return updateSingleBatch(values);
    },
    async onSuccess(data) {
      console.log("🚀 ~ onSuccess ~ data:", data);
      if (data?.updateBatch) {
        console.log("successfully updated");
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["batch", batch?.getBatch?.batch],
          });
          queryClient.invalidateQueries({ queryKey: ["batches"] });
        }, 1000);
        toast.success("Updated successfully");
      } else {
        toast.error("Failed to update");
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  if (isPending || updateBatchMutation.isPending) {
    return (
      <PageComponent title="Batch">
        <div className="flex items-center gap-2">
          <span className="loading"></span>
          <p>Loading...</p>
        </div>
      </PageComponent>
    );
  }

  if ((!batch || !batch.getBatch) && !isPending) {
    return (
      <PageComponent title="Batch">
        <p>Not Found</p>
      </PageComponent>
    );
  }

  return (
    <PageComponent title="Batch">
      <div>
        <p>Batch</p>
        <p>{batch?.getBatch?.batch}</p>
      </div>
      {batch?.getBatch && (
        <BatchUpdateForm
          batch={
            new Batch({
              batch: batch.getBatch.batch,
              createApplicationStartDate:
                batch.getBatch.createApplicationStartDate,
              createApplicationEndDate: batch.getBatch.createApplicationEndDate,
              updateApplicationEndDate: batch.getBatch.updateApplicationEndDate,
              signUpStartDate: batch.getBatch.signUpStartDate,
              signUpEndDate: batch.getBatch.signUpEndDate,
            })
          }
          onSubmit={(values) => {
            console.log("values", values);
            updateBatchMutation.mutate({
              input: {
                ...values,
                batch: batch.getBatch?.batch ?? 0,
                _version: batch.getBatch?._version,
              },
            });
            return values;
          }}
          onSuccess={(values) => {
            // .then(() => {
            //   console.log("called invalidate");
            // queryClient.invalidateQueries({
            //   queryKey: ["batch", batch?.getBatch?.batch],
            // });
            // queryClient.invalidateQueries({ queryKey: ["batches"] });
            // });
          }}
          onError={(values, error) => {
            console.log("error", error);
            console.log("onError:", values);
          }}
        ></BatchUpdateForm>
      )}
    </PageComponent>
  );
};

export default SingleBatchPage;
