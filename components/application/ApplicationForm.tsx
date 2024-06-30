import React, { FC } from "react";
import {
  Application,
  CreateAdminLogMutationVariables,
  Status,
  UpdateApplicationMutationVariables,
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
import {
  DocType,
  createAdminLogInDB,
  updateApplicationInDB,
  updateAttachmentInDB,
  updateProgramChoiceInDB,
  uploadFile,
} from "../../src/CustomAPI";
import { useAuth } from "../../hooks/use-auth";
import { calculateScore, minimumGPA } from "../../src/Helpers";
import { Switch } from "../ui/switch";
import GetStorageLinkComponent from "../get-storage-link-component";
import { FileIcon } from "@radix-ui/react-icons";
import { useBatchContext } from "../../context/BatchContext";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Textarea } from "../ui/textarea";
import WordCounter from "../ui/word-counter";

type TApplicationForm = {
  application: Application;
};

export const ApplicationForm: FC<TApplicationForm> = ({ application }) => {
  const { t } = useTranslation("applications");
  const { t: tL } = useTranslation("applicationLog");
  const { resetApplications } = useBatchContext();
  const { locale, push } = useRouter();
  const { cpr } = useAuth();

  const formSchema = z.object({
    adminPoints: z.number().min(0).max(10).optional(),
    gpa: z.number().min(0).max(100),
    verifiedGPA: z.number().min(0).max(100).optional().nullable(),
    isFamilyIncomeVerified: z.boolean().default(false),
    status: z.enum(Object.values(Status) as [Status]),
    acceptanceLetter: z.string().optional(),
    schoolCertificate: z.string().optional(),
    transcript: z.string().optional(),
    acceptanceLetterFile: z.instanceof(File).optional(),
    schoolCertificateFile: z.instanceof(File).optional(),
    transcriptFile: z.instanceof(File).optional(),
    reason: z
      .string()
      .optional()
      .refine(
        (reason) => {
          return (reason || "").split(/\s+/).filter(Boolean).length <= 100;
        },
        {
          message: t("reasonWords") ?? "Reason must not exceed 100 words.",
        }
      ),
    adminReason: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: application.reason ?? undefined,
      adminReason: "",
      adminPoints: application.adminPoints ?? undefined,
      isFamilyIncomeVerified: application.isFamilyIncomeVerified ?? false,
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
    // upload new docs if selected
    const acceptanceLetterKey = values.acceptanceLetterFile
      ? uploadFile(
          values.acceptanceLetterFile,
          DocType.PRIMARY_PROGRAM_ACCEPTANCE,
          application.studentCPR
        )
      : Promise.resolve(application.programs?.items[0]?.acceptanceLetterDoc);
    const transcriptKey = values.transcriptFile
      ? uploadFile(
          values.transcriptFile,
          DocType.TRANSCRIPT,
          application.studentCPR
        )
      : Promise.resolve(application.attachment?.transcriptDoc);
    const schoolCertificateKey = values.schoolCertificateFile
      ? uploadFile(
          values.schoolCertificateFile,
          DocType.SCHOOL_CERTIFICATE,
          application.studentCPR
        )
      : Promise.resolve(application.attachment?.schoolCertificate);
    // replace the storage keys with the old ones
    const [acceptanceLetter, transcript, schoolCertificate] = await Promise.all(
      [acceptanceLetterKey, transcriptKey, schoolCertificateKey]
    );

    let updateVariables: UpdateApplicationMutationVariables = {
      input: {
        id: application.id,
        status: values.status,
        reason: values.reason,
        adminPoints: values.adminPoints,
        isFamilyIncomeVerified: values.isFamilyIncomeVerified,
        gpa: values.gpa,
        score: calculateScore({
          familyIncome: application.familyIncome,
          gpa: values.verifiedGPA ?? values.gpa,
          adminScore: values?.adminPoints,
        }),
        verifiedGPA: values.verifiedGPA,
        _version: application._version,
      },
    };

    await toast
      .promise(
        Promise.all([
          updateAttachmentInDB({
            input: {
              id: application.attachment?.id ?? "",
              transcriptDoc: transcript,
              schoolCertificate: schoolCertificate,
              _version: application.attachment?._version,
            },
          }),
          updateProgramChoiceInDB({
            input: {
              id: application.programs?.items[0]?.id ?? "",
              acceptanceLetterDoc: acceptanceLetter,
              _version: application.programs?.items[0]?._version,
            },
          }),
          updateApplicationInDB(updateVariables),
        ]),
        {
          loading: "Updating...",
          success: "Application updated successfully",
          error: "Failed to update application",
        }
      )
      .then(async (value) => {
        const oldData = {
          status: application.status,
          adminPoints: application.adminPoints,
          isFamilyIncomeVerified: application.isFamilyIncomeVerified,
          verifiedGPA: application.verifiedGPA,
          gpa: application.gpa,
          reason: application.reason,
        };

        const newData = {
          status: values.status,
          adminPoints: values.adminPoints,
          isFamilyIncomeVerified: values.isFamilyIncomeVerified,
          verifiedGPA: values.verifiedGPA,
          gpa: values.gpa,
          reason: values.reason,
        };

        // Calculate changes
        const snapshot = createChangeSnapshot(oldData, newData);

        let createAdminLogVariables: CreateAdminLogMutationVariables = {
          input: {
            applicationID: application.id,
            adminCPR: cpr ?? "",
            dateTime: new Date().toISOString(),
            snapshot: snapshot,
            reason: values.adminReason,
            applicationAdminLogsId: application.id,
            adminAdminLogsCpr: cpr ?? "",
          },
        };

        await createAdminLogInDB(createAdminLogVariables)
          .then(async (logValue) => {
            resetApplications();
            push("/applications");
            return logValue;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });
  }

  function getUniversityName() {
    let havePrograms = (application.programs?.items.length ?? 0) > 0;
    if (havePrograms) {
      return locale === "ar"
        ? application.programs?.items[0]?.program?.university?.nameAr
        : application.programs?.items[0]?.program?.university?.name;
    } else {
      return locale === "ar"
        ? application.program?.university?.nameAr
        : application.program?.university?.name;
    }
  }
  function getProgramName() {
    let havePrograms = (application.programs?.items.length ?? 0) > 0;
    if (havePrograms) {
      return locale === "ar"
        ? application.programs?.items[0]?.program?.nameAr
        : application.programs?.items[0]?.program?.name;
    } else {
      return locale === "ar"
        ? application.program?.nameAr
        : application.program?.name;
    }
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
            <div className="grid gap-4">
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
            <div className="grid gap-4">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 py-1">
                    <FormLabel>{tL("verifiedGPA")}</FormLabel>
                    {application.verifiedGPA ? (
                      <FiCheckCircle className="text-success" />
                    ) : (
                      <FiAlertCircle className="text-warning" />
                    )}
                  </div>
                  {field.value != null && (
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      className="h-5"
                      type="button"
                      onClick={() => field.onChange(null)}
                    >
                      {t("clear")}
                    </Button>
                  )}
                </div>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("notVerifiedYet") ?? "Not Verified yet"}
                    {...field}
                    value={field.value ?? ""}
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
            name="adminPoints"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 py-1">
                  <FormLabel>{t("adminPoints")}</FormLabel>
                  {application.adminPoints ? (
                    <FiCheckCircle className="text-success" />
                  ) : (
                    <FiAlertCircle className="text-warning" />
                  )}
                </div>
                <FormControl>
                  <Input
                    type="number"
                    max={10}
                    min={0}
                    placeholder={t("notAddedYet") ?? "Not added yet"}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{t("adminPointsD")}</FormDescription>
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
          <FormField
            control={form.control}
            name="isFamilyIncomeVerified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">
                      {t("isFamilyIncomeVerified")}
                    </FormLabel>
                    {application.isFamilyIncomeVerified ? (
                      <FiCheckCircle className="text-success" />
                    ) : (
                      <FiAlertCircle className="text-warning" />
                    )}
                  </div>
                  <FormDescription>
                    {`${t("studentFamilyIncome")} ${t(
                      `${application.familyIncome}`
                    )}`}
                  </FormDescription>
                  <div className="flex items-center gap-1 py-1 border rounded-md w-fit ps-3 pe-2">
                    <FileIcon />
                    <GetStorageLinkComponent
                      storageKey={
                        application.student?.familyIncomeProofDocs?.[0]
                      }
                      showName
                    />
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>{t("searchProgram")}</FormLabel>
            <FormControl>
              <Input
                disabled
                type="text"
                value={getProgramName() ?? "undefined"}
              />
            </FormControl>
            <FormDescription>
              <p>{getUniversityName() ?? t("programNameNotFound")}</p>
              <div className="flex flex-wrap items-center gap-2">
                <p>{t("minimumGPA")}</p>
                <p>
                  {application.programs?.items[0]?.program?.minimumGPA ??
                    minimumGPA}
                </p>
              </div>
            </FormDescription>
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("studentReasonD")}</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Textarea
                      {...field}
                      className="max-h-96 min-h-40"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <WordCounter value={field.value} maxWords={100} />
                  </div>
                </FormControl>
                <FormDescription>{t("studentReasonD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="adminReason"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  {tL("reasonD")} <span className="text-error">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                {/* <FormDescription>{tL("reasonD")}</FormDescription> */}
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

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function createChangeSnapshot(oldData: any, newData: any): string {
  const changes = [];
  if (newData.status !== oldData.status) {
    changes.push(`status from "${oldData.status}" to "${newData.status}"`);
  }
  if (newData.adminPoints !== oldData.adminPoints) {
    changes.push(
      `admin points from "${oldData.adminPoints}" to "${newData.adminPoints}"`
    );
  }
  if (newData.isFamilyIncomeVerified !== oldData.isFamilyIncomeVerified) {
    changes.push(
      `family income verification from "${
        oldData.isFamilyIncomeVerified ? "yes" : "no"
      }" to "${newData.isFamilyIncomeVerified ? "yes" : "no"}"`
    );
  }
  if (newData.verifiedGPA !== oldData.verifiedGPA) {
    changes.push(
      `verified GPA from "${oldData.verifiedGPA}" to "${newData.verifiedGPA}"`
    );
  }
  if (newData.gpa !== oldData.gpa) {
    changes.push(`GPA from "${oldData.gpa}" to "${newData.gpa}"`);
  }
  if (newData.reason !== oldData.reason) {
    changes.push(
      `Student reason from "${oldData.reason}" to "${newData.reason}"`
    );
  }

  return changes.join(", ");
}
