import React, { FC } from "react";
import {
  Application,
  CreateScholarshipMutationVariables,
  MasterApplication,
  ScholarshipStatus,
} from "../../src/API";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import MultiUpload from "../MultiUpload";
import toast from "react-hot-toast";
import {
  DocType,
  createSingleScholarship,
  uploadFile,
} from "../../src/CustomAPI";
import { useBatchContext } from "../../context/BatchContext";
import { useRouter } from "next/router";

type TGenerateScholarshipForm = {
  application?: Application;
  masterApplication?: MasterApplication;
  type: "masters" | "bachelor";
};

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const GenerateScholarshipForm: FC<TGenerateScholarshipForm> = ({
  application,
  masterApplication,
  type,
}) => {
  const { t } = useTranslation("scholarships");
  const { push } = useRouter();
  const { resetScholarships } = useBatchContext();

  const formSchema = z.object({
    startDate: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
    },
  });

  // async function uploadAndCreate(values: z.infer<typeof formSchema>) {
  //   // upload new docs if selected
  //   const unsignedContractKey = uploadFile(
  //     values.unsignedContractFile,
  //     DocType.UNSIGNED_CONTRACT,
  //     application.studentCPR ?? "undefined"
  //   );

  //   // replace the storage keys with the old ones
  //   const [unsignedContract] = await Promise.all([unsignedContractKey]);

  //   let createVariables: CreateScholarshipMutationVariables = {
  //     input: {
  //       status: ScholarshipStatus.PENDING,
  //       isConfirmed: false,
  //       applicationID: application.id,
  //       unsignedContractDoc: unsignedContract,
  //       batch: application.batch,
  //       studentCPR: application.studentCPR,
  //     },
  //   };

  //   return createSingleScholarship(createVariables);
  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // await toast
    //   .promise(uploadAndCreate(values), {
    //     loading: t("creating"),
    //     success: t("createdSuccessfully"),
    //     error: t("failedToCreate"),
    //   })
    //   .then(async (value) => {
    //     resetScholarships();
    //     if (value?.createScholarship) {
    //       push(`/scholarships/${value.createScholarship.id}`);
    //     } else {
    //       push(`/scholarships`);
    //     }
    //   });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">{t("tableUniName")}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      id="name"
                      placeholder="Enter university name"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>{t("tableUniNameD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unsignedContractFile"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormControl>
                  <MultiUpload
                    single
                    maxSize={3}
                    required={false}
                    notClearable
                    onFiles={(files) => {
                      files.length > 0 && field.onChange(files[0]);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError("unsignedContractFile", Error("invalid"))
                    }
                    filedName={t("unsignedContract")}
                    title={`${t("unsignedContract")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>{t("unsignedContractDC")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unsignedContractFile"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormControl>
                  <MultiUpload
                    single
                    maxSize={3}
                    required={false}
                    notClearable
                    onFiles={(files) => {
                      files.length > 0 && field.onChange(files[0]);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError("unsignedContractFile", Error("invalid"))
                    }
                    filedName={t("unsignedContract")}
                    title={`${t("unsignedContract")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>{t("unsignedContractDC")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit">{t("create")}</Button>
          </div>
        </form>
      </Form> */}
    </div>
  );
};
