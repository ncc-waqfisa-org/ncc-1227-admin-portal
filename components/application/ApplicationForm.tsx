import React, { FC } from "react";
import {
  Application,
  CreateAdminLogMutationVariables,
  Status,
  UpdateApplicationMutationVariables,
} from "../../src/API";
import { ZodEnum, z } from "zod";
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

import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { Button, buttonVariants } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MultiUpload from "../MultiUpload";
import Link from "next/link";
import { cn } from "../../src/utils";
import { Label } from "../ui/label";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { createAdminLogInDB, updateApplicationInDB } from "../../src/CustomAPI";
import { useAuth } from "../../hooks/use-auth";
import { useStudent } from "../../context/StudentContext";

type TApplicationForm = {
  application: Application;
};
export const ApplicationForm: FC<TApplicationForm> = ({ application }) => {
  const { t } = useTranslation("applications");
  const { t: tL } = useTranslation("applicationLog");
  const { syncUpdatedApplication } = useStudent();
  const { locale, push } = useRouter();
  const { cpr } = useAuth();

  const formSchema = z.object({
    gpa: z.number().min(0).max(100),
    verifiedGPA: z.number().min(0).max(100),
    status: z.enum(Object.values(Status) as [Status]),
    acceptanceLetter: z.string().optional(),
    schoolCertificate: z.string().optional(),
    transcript: z.string().optional(),
    acceptanceLetterFile: z.instanceof(File).optional(),
    schoolCertificateFile: z.instanceof(File).optional(),
    transcriptFile: z.instanceof(File).optional(),
    reason: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gpa: application.gpa ?? 0,
      verifiedGPA: application.verifiedGPA ?? undefined,
      status: application.status ?? undefined,
      acceptanceLetter:
        application.programs?.items[0]?.acceptanceLetterDoc ?? undefined,
      schoolCertificate: application.attachment?.schoolCertificate ?? undefined,
      transcript: application.attachment?.transcriptDoc ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: upload new docs if selected

    // TODO: replace the storage keys with the old ones
    // TODO: update attachment
    // TODO: update programChoice

    let updateVariables: UpdateApplicationMutationVariables = {
      input: {
        id: application.id,
        status: values.status,
        gpa: values.gpa,
        verifiedGPA: values.verifiedGPA,
        _version: application._version,
      },
    };
    console.log(
      "🚀 ~ onSubmit ~ updateVariables: UpdateApplicationMutationVariables.input:",
      updateVariables
    );

    await toast
      .promise(updateApplicationInDB(updateVariables), {
        loading: "Updating...",
        success: "Application updated successfully",
        error: "Failed to update application",
      })
      .then(async (value) => {
        let createAdminLogVariables: CreateAdminLogMutationVariables = {
          input: {
            applicationID: application.id,
            adminCPR: cpr ?? "",
            dateTime: new Date().toISOString(),
            // TODO: snapshot update
            snapshot: `changed application status from ${application.status} to ${values.status}`,
            reason: values.reason,
            applicationAdminLogsId: application.id,
            adminAdminLogsCpr: cpr ?? "",
          },
        };

        await createAdminLogInDB(createAdminLogVariables)
          .then(async (logValue) => {
            const updatedApplication = value?.updateApplication as Application;

            await syncUpdatedApplication(updatedApplication);

            push("/applications");
            return logValue;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });

    console.log(values);
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="grid w-full gap-2">
            <Label>{tL("studentLog")}</Label>
            <div className="grid gap-4 ">
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href={`/studentLogs/${application.id}`}
              >
                {t("view")}
              </Link>
            </div>
          </div>
          <div className="grid w-full gap-2">
            <Label>{tL("adminLogs")}</Label>
            <div className="grid gap-4 ">
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href={`/applications/applicationHistory/${application.id}`}
              >
                {t("view")}
              </Link>
            </div>
          </div>
          <FormField
            control={form.control}
            name="gpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tL("gpa")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{tL("gpaD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verifiedGPA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tL("verifiedGPA")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Not Verified yet"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{tL("verifiedGPAD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tL("status")}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value as Status}
                    onValueChange={(val) => field.onChange(val as Status)}
                  >
                    <SelectTrigger className="overflow-visible focus:ring-1 focus:ring-blue-800">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Status).map((value, i) => (
                        <SelectItem key={i} value={value}>
                          {t(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>{tL("statusD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>{tL("program")}</FormLabel>
            <FormControl>
              <Input
                disabled
                type="text"
                value={
                  (locale === "ar"
                    ? application.programs?.items[0]?.program?.nameAr
                    : application.programs?.items[0]?.program?.name) ??
                  "undefined"
                }
              />
            </FormControl>
            <FormDescription>
              <p>
                {locale === "ar"
                  ? application.programs?.items[0]?.program?.university?.nameAr
                  : application.programs?.items[0]?.program?.university?.name}
              </p>
            </FormDescription>
            <FormMessage />
          </FormItem>

          <div className="flex items-center gap-4 sm:col-span-2">
            <span className="w-full h-[1px] bg-border "></span>{" "}
            <p>{t("documents")}</p>
            <span className="w-full h-[1px] bg-border "></span>
          </div>
          <FormField
            control={form.control}
            name="acceptanceLetterFile"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormControl>
                  {application.programs?.items[0]?.program?.university
                    ?.isException ? (
                    <p>{tL("acceptationLetterNotNeeded")}</p>
                  ) : (
                    <MultiUpload
                      single
                      required={false}
                      storageKeys={[
                        application.programs?.items[0]?.acceptanceLetterDoc ??
                          null,
                      ]}
                      onFiles={(files) => {
                        field.onChange(files.length > 0 ? files[0] : undefined);
                      }}
                      isInvalid={(isInvalid) =>
                        isInvalid &&
                        form.setError("acceptanceLetterFile", Error("invalid"))
                      }
                      handleOnClear={() => {
                        field.onChange(undefined);
                      }}
                      filedName={t("acceptanceLetter")}
                      title={`${t("acceptanceLetter")}`}
                    ></MultiUpload>
                  )}
                </FormControl>
                <FormDescription>
                  <p>{`${tL("acceptationLetterD")} ${
                    locale === "ar"
                      ? application.programs?.items[0]?.program?.nameAr
                      : application.programs?.items[0]?.program?.name
                  }-${
                    locale === "ar"
                      ? application.programs?.items[0]?.program?.university
                          ?.nameAr
                      : application.programs?.items[0]?.program?.university
                          ?.name
                  }`}</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transcriptFile"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[
                      application.attachment?.transcriptDoc ?? null,
                    ]}
                    onFiles={(files) => {
                      field.onChange(files.length > 0 ? files[0] : undefined);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError("transcriptFile", Error("invalid"))
                    }
                    handleOnClear={() => {
                      field.onChange(undefined);
                    }}
                    filedName={tL("transcriptDocument")}
                    title={`${tL("transcriptDocument")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>
                  <p>{tL("transcriptFileD")}</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schoolCertificateFile"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[
                      application.attachment?.schoolCertificate ?? null,
                    ]}
                    onFiles={(files) => {
                      field.onChange(files.length > 0 ? files[0] : undefined);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError("schoolCertificateFile", Error("invalid"))
                    }
                    handleOnClear={() => {
                      field.onChange(undefined);
                    }}
                    filedName={t("schoolCertificate")}
                    title={`${t("schoolCertificate")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>
                  <p>{tL("schoolCertificateD")}</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{tL("reason")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>{tL("reasonD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit">{t("update")}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
