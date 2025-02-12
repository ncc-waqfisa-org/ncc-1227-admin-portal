import React, { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  CreateMasterBatchMutationVariables,
  MasterBatch,
  UpdateMasterBatchMutationVariables,
} from "../../src/API";
import {
  createSingleMasterBatch,
  updateSingleMasterBatch,
} from "../../src/CustomAPI";
import DatePicker from "react-date-picker";
import { cn } from "../../src/lib/utils";
import { Button } from "../ui/button";
import { format } from "date-fns";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Input } from "../ui/input";

interface Props {
  masterBatch?: MasterBatch;
}

export default function MasterBatchForm({ masterBatch }: Props) {
  const { back, locale } = useRouter();

  const { t } = useTranslation("batches");
  const { t: tErrors } = useTranslation("errors");

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    batch: z.number(),
    signUpStartDate: z.string().min(1, `${tErrors("Required")}`),
    signUpEndDate: z.string().min(1, `${tErrors("Required")}`),
    createApplicationStartDate: z.string().min(1, `${tErrors("Required")}`),
    createApplicationEndDate: z.string().min(1, `${tErrors("Required")}`),
    updateApplicationEndDate: z.string().min(1, `${tErrors("Required")}`),
  });

  // const formSchema = z.object({
  //   signUpStartDate: z.string().min(1, "Required"),
  //   signUpEndDate: z.string().min(1, "Required"),
  //   createApplicationStartDate: z.string().min(1, "Required"),
  //   createApplicationEndDate: z.string().min(1, "Required"),
  //   updateApplicationEndDate: z.string().min(1, "Required"),
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch: masterBatch?.batch,
      signUpStartDate: masterBatch?.signUpStartDate
        ? format(masterBatch?.signUpStartDate, "yyyy-MM-dd")
        : undefined,
      signUpEndDate: masterBatch?.signUpEndDate
        ? format(masterBatch?.signUpEndDate, "yyyy-MM-dd")
        : undefined,
      createApplicationStartDate: masterBatch?.createApplicationStartDate
        ? format(masterBatch?.createApplicationStartDate, "yyyy-MM-dd")
        : undefined,
      createApplicationEndDate: masterBatch?.createApplicationEndDate
        ? format(masterBatch?.createApplicationEndDate, "yyyy-MM-dd")
        : undefined,
      updateApplicationEndDate: masterBatch?.updateApplicationEndDate
        ? format(masterBatch?.updateApplicationEndDate, "yyyy-MM-dd")
        : undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (masterBatch) {
        setIsLoading(true);

        let updatedBatchDetails: UpdateMasterBatchMutationVariables = {
          input: {
            batch: masterBatch?.batch,
            _version: masterBatch?._version,
            signUpStartDate: values.signUpStartDate,
            signUpEndDate: values.signUpEndDate,
            createApplicationStartDate: values.createApplicationStartDate,
            createApplicationEndDate: values.createApplicationEndDate,
            updateApplicationEndDate: values.updateApplicationEndDate,
          },
        };

        await toast.promise(
          updateSingleMasterBatch(updatedBatchDetails)
            .then((res) => {
              if (res) {
                console.log(res.updateMasterBatch);
                setIsLoading(false);
                back();
              }
            })
            .catch((err) => {
              throw err;
            }),
          {
            loading: "Loading...",
            success: "Master batch updated successfully",
            error: (error: any) => {
              return `${error?.message}`;
            },
          }
        );

        setIsLoading(false);
      } else {
        setIsLoading(true);

        let createBatchDetails: CreateMasterBatchMutationVariables = {
          input: {
            batch: values?.batch,
            signUpStartDate: values.signUpStartDate,
            signUpEndDate: values.signUpEndDate,
            createApplicationStartDate: values.createApplicationStartDate,
            createApplicationEndDate: values.createApplicationEndDate,
            updateApplicationEndDate: values.updateApplicationEndDate,
          },
        };

        await toast.promise(
          createSingleMasterBatch(createBatchDetails)
            .then((res) => {
              if (res) {
                setIsLoading(false);
                back();
              }
            })
            .catch((err) => {
              throw err;
            }),
          {
            loading: "Loading...",
            success: "Master batch created successfully",
            error: (error: any) => {
              return `${error?.message}`;
            },
          }
        );

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(`${error}`);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-6 mt-4">
            <FormField
              control={form.control}
              name="batch"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="name">{t("tableBatchYear")}</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        disabled={masterBatch?.batch !== undefined}
                        type="text"
                        placeholder="Batch Year (eg. 2025)"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="signUpStartDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {t("tableBatchSignUpStartDate")}
                  </FormLabel>
                  <FormControl>
                    <div>
                      <DatePicker
                        className={cn(
                          "flex input input-bordered input-primary",
                          fieldState.error ? "!border-red-500" : "!border-input"
                        )}
                        dayPlaceholder="dd"
                        monthPlaceholder="mm"
                        yearPlaceholder="yyyy"
                        format="dd/MM/yyyy"
                        onChange={(date) => {
                          const myDate: Date | null = date as Date | null;
                          if (myDate) {
                            field.onChange(format(myDate, "yyyy-MM-dd"));
                            form.clearErrors("signUpStartDate");
                          } else {
                            form.resetField("signUpStartDate");
                            form.setError("signUpStartDate", {
                              message:
                                locale === "ar"
                                  ? "تاريخ غير صالح"
                                  : "Invalid Date",
                            });
                          }
                        }}
                        value={form.getValues("signUpStartDate")}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="signUpEndDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {t("tableBatchSignUpEndDate")}
                  </FormLabel>
                  <FormControl>
                    <div>
                      <DatePicker
                        className={cn(
                          "flex input input-bordered input-primary",
                          fieldState.error ? "!border-red-500" : "!border-input"
                        )}
                        dayPlaceholder="dd"
                        monthPlaceholder="mm"
                        yearPlaceholder="yyyy"
                        format="dd/MM/yyyy"
                        onChange={(date) => {
                          const myDate: Date | null = date as Date | null;
                          if (myDate) {
                            field.onChange(format(myDate, "yyyy-MM-dd"));
                            form.clearErrors("signUpEndDate");
                          } else {
                            form.resetField("signUpEndDate");
                            form.setError("signUpEndDate", {
                              message:
                                locale === "ar"
                                  ? "تاريخ غير صالح"
                                  : "Invalid Date",
                            });
                          }
                        }}
                        value={form.getValues("signUpEndDate")}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createApplicationStartDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {t("tableBatchCreateApplicationStartDate")}
                  </FormLabel>
                  <FormControl>
                    <div>
                      <DatePicker
                        className={cn(
                          "flex input input-bordered input-primary",
                          fieldState.error ? "!border-red-500" : "!border-input"
                        )}
                        dayPlaceholder="dd"
                        monthPlaceholder="mm"
                        yearPlaceholder="yyyy"
                        format="dd/MM/yyyy"
                        onChange={(date) => {
                          const myDate: Date | null = date as Date | null;
                          if (myDate) {
                            field.onChange(format(myDate, "yyyy-MM-dd"));
                            form.clearErrors("createApplicationStartDate");
                          } else {
                            form.resetField("createApplicationStartDate");
                            form.setError("createApplicationStartDate", {
                              message:
                                locale === "ar"
                                  ? "تاريخ غير صالح"
                                  : "Invalid Date",
                            });
                          }
                        }}
                        value={form.getValues("createApplicationStartDate")}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="createApplicationEndDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {t("tableBatchCreateApplicationEndDate")}
                  </FormLabel>
                  <FormControl>
                    <div>
                      <DatePicker
                        className={cn(
                          "flex input input-bordered input-primary",
                          fieldState.error ? "!border-red-500" : "!border-input"
                        )}
                        dayPlaceholder="dd"
                        monthPlaceholder="mm"
                        yearPlaceholder="yyyy"
                        format="dd/MM/yyyy"
                        onChange={(date) => {
                          const myDate: Date | null = date as Date | null;
                          if (myDate) {
                            field.onChange(format(myDate, "yyyy-MM-dd"));
                            form.clearErrors("createApplicationEndDate");
                          } else {
                            form.resetField("createApplicationEndDate");
                            form.setError("createApplicationEndDate", {
                              message:
                                locale === "ar"
                                  ? "تاريخ غير صالح"
                                  : "Invalid Date",
                            });
                          }
                        }}
                        value={form.getValues("createApplicationEndDate")}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="updateApplicationEndDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="name">
                    {t("tableBatchUpdateApplicationEndDate")}
                  </FormLabel>
                  <FormControl>
                    <div>
                      <DatePicker
                        className={cn(
                          "flex input input-bordered input-primary",
                          fieldState.error ? "!border-red-500" : "!border-input"
                        )}
                        dayPlaceholder="dd"
                        monthPlaceholder="mm"
                        yearPlaceholder="yyyy"
                        format="dd/MM/yyyy"
                        onChange={(date) => {
                          const myDate: Date | null = date as Date | null;
                          if (myDate) {
                            field.onChange(format(myDate, "yyyy-MM-dd"));
                            form.clearErrors("updateApplicationEndDate");
                          } else {
                            form.resetField("updateApplicationEndDate");
                            form.setError("updateApplicationEndDate", {
                              message:
                                locale === "ar"
                                  ? "تاريخ غير صالح"
                                  : "Invalid Date",
                            });
                          }
                        }}
                        value={form.getValues("updateApplicationEndDate")}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="flex gap-2 items-center w-fit"
            disabled={isLoading}
            type="submit"
          >
            {isLoading && <span className="loading"></span>}
            {t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
