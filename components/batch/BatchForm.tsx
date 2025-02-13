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
  Batch,
  CreateBatchMutationVariables,
  UpdateBatchMutationVariables,
} from "../../src/API";
import { createSingleBatch, updateSingleBatch } from "../../src/CustomAPI";
import DatePicker from "react-date-picker";
import { cn } from "../../src/lib/utils";
import { Button } from "../ui/button";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { Input } from "../ui/input";

interface Props {
  batch?: Batch;
}

export default function BatchForm({ batch }: Props) {
  const { locale, back } = useRouter();

  const { t } = useTranslation("batches");
  const { t: tErrors } = useTranslation("errors");

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    batch: z.number().min(1, `${tErrors("Required")}`),
    signUpStartDate: z.string().min(1, `${tErrors("Required")}`),
    signUpEndDate: z.string().min(1, `${tErrors("Required")}`),
    createApplicationStartDate: z.string().min(1, `${tErrors("Required")}`),
    createApplicationEndDate: z.string().min(1, `${tErrors("Required")}`),
    updateApplicationEndDate: z.string().min(1, `${tErrors("Required")}`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch: batch?.batch ?? undefined,
      signUpStartDate: batch?.signUpStartDate
        ? format(batch?.signUpStartDate, "yyyy-MM-dd")
        : undefined,
      signUpEndDate: batch?.signUpEndDate
        ? format(batch?.signUpEndDate, "yyyy-MM-dd")
        : undefined,
      createApplicationStartDate: batch?.createApplicationStartDate
        ? format(batch?.createApplicationStartDate, "yyyy-MM-dd")
        : undefined,
      createApplicationEndDate: batch?.createApplicationEndDate
        ? format(batch?.createApplicationEndDate, "yyyy-MM-dd")
        : undefined,
      updateApplicationEndDate: batch?.updateApplicationEndDate
        ? format(batch?.updateApplicationEndDate, "yyyy-MM-dd")
        : undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (batch) {
        let updatedBatchDetails: UpdateBatchMutationVariables = {
          input: {
            batch: batch?.batch,
            _version: batch?._version,
            signUpStartDate: values.signUpStartDate,
            signUpEndDate: values.signUpEndDate,
            createApplicationStartDate: values.createApplicationStartDate,
            createApplicationEndDate: values.createApplicationEndDate,
            updateApplicationEndDate: values.updateApplicationEndDate,
          },
        };

        await toast.promise(
          updateSingleBatch(updatedBatchDetails)
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
            success: "Batch updated successfully",
            error: (error: any) => {
              return `${error?.message}`;
            },
          }
        );
      } else {
        let createBatchDetails: CreateBatchMutationVariables = {
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
          createSingleBatch(createBatchDetails)
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
            success: "Batch created successfully",
            error: (error: any) => {
              return `${error?.message}`;
            },
          }
        );
      }

      setIsLoading(false);
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
                  <FormLabel htmlFor="name">{t("batchCurrent")}</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        disabled={batch?.batch !== undefined}
                        type="text"
                        placeholder={
                          t("batchYearExample") ?? "Batch Year (eg. 2025)"
                        }
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(Number(value));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "e" || e.key === "+" || e.key === "-") {
                            e.preventDefault();
                          }
                        }}
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
            className="flex gap-2 items-center w-fit mt-4"
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
