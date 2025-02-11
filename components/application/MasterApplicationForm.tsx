import React, { FC, useState } from "react";
import {
  CreateAdminLogMutationVariables,
  Income,
  Major,
  MasterApplication,
  Nationality,
  Status,
  UpdateMasterApplicationMutationVariables,
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
  listAllMasterUniversities,
  updateApplicationInDB,
  updateAttachmentInDB,
  updateMasterApplicationInDB,
  updateMasterAttachmentInDB,
  updateProgramChoiceInDB,
  uploadFile,
} from "../../src/CustomAPI";
import { useAuth } from "../../hooks/use-auth";
import {
  calculateMasterScore,
  calculateScore,
  minimumGPA,
} from "../../src/Helpers";
import { Switch } from "../ui/switch";
import GetStorageLinkComponent from "../get-storage-link-component";
import { FileIcon } from "@radix-ui/react-icons";
import { useBatchContext } from "../../context/BatchContext";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Textarea } from "../ui/textarea";
import WordCounter from "../ui/word-counter";
import { values } from "lodash";
import { InfiniteMasterApplication } from "../ui/applications/infinite-applications-type";
import { useQuery } from "@tanstack/react-query";

type TMasterApplicationForm = {
  application: MasterApplication;
};

export const MasterApplicationForm: FC<TMasterApplicationForm> = ({
  application,
}) => {
  const { t } = useTranslation("applications");
  const { t: tL } = useTranslation("applicationLog");
  const { resetApplications, updateMasterApplication } = useBatchContext();
  const { locale, push } = useRouter();
  const { cpr } = useAuth();

  const [loading, setLoading] = useState(false);

  const { data: masterUniversities, isPending: isMasterUniversitiesPending } =
    useQuery({
      queryKey: ["masterUniversities"],
      queryFn: () => listAllMasterUniversities(),
    });

  const formSchema = z.object({
    adminPoints: z.number().min(0).max(10).optional(),
    gpa: z.number().min(0).max(100),
    toelfIELTSScore: z.number().min(0),
    verifiedGPA: z.number().min(0).max(100).optional().nullable(),
    isIncomeVerified: z.boolean().default(false),
    status: z.enum(Object.values(Status) as [Status]),
    acceptanceLetter: z.string().optional(),
    universityCertificate: z.string().optional(),
    transcript: z.string().optional(),
    toeflIELTSCertificate: z.string().optional(),
    acceptanceLetterFile: z.instanceof(File).optional(),
    universityCertificateFile: z.instanceof(File).optional(),
    transcriptFile: z.instanceof(File).optional(),
    toeflIELTSCertificateFile: z.instanceof(File).optional(),
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
    major: z.string().min(0).optional(),
    universityID: z.string().min(0).optional(),
    program: z.string().min(0).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: application.reason ?? undefined,
      adminReason: "",
      adminPoints: application.adminPoints ?? undefined,
      isIncomeVerified: application.isIncomeVerified ?? false,
      gpa: application.gpa ?? 0,
      toelfIELTSScore: application.toeflIELTSScore ?? 0,
      verifiedGPA: application.verifiedGPA ?? undefined,
      status: application.status ?? undefined,
      acceptanceLetter:
        application.attachment?.acceptanceLetterDoc ?? undefined,
      // acceptanceLetter:
      //   application.programs?.items[0]?.acceptanceLetterDoc ?? undefined,
      transcript: application.attachment?.transcriptDoc ?? undefined,
      // schoolCertificate: application.attachment?.schoolCertificate ?? undefined,
      universityCertificate:
        application.attachment?.universityCertificate ?? undefined,
      toeflIELTSCertificate:
        application.attachment?.toeflIELTSCertificate ?? undefined,
      major: application.major ?? undefined,
      universityID: application.university?.id ?? undefined,
      program: application.program ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    // upload new docs if selected
    const acceptanceLetterKey = values.acceptanceLetterFile
      ? uploadFile(
          values.acceptanceLetterFile,
          DocType.ACCEPTANCE,
          application.studentCPR
        )
      : Promise.resolve(application.attachment?.acceptanceLetterDoc);

    const transcriptKey = values.transcriptFile
      ? uploadFile(
          values.transcriptFile,
          DocType.TRANSCRIPT,
          application.studentCPR
        )
      : Promise.resolve(application.attachment?.transcriptDoc);

    const universityCertificateKey = values.universityCertificateFile
      ? uploadFile(
          values.universityCertificateFile,
          DocType.UNIVERSITY_CERTIFICATE,
          application.studentCPR
        )
      : Promise.resolve(application.attachment?.universityCertificate);

    const toeflIELTSCertificateKey = values.toeflIELTSCertificateFile
      ? uploadFile(
          values.toeflIELTSCertificateFile,
          DocType.TOEFL_IELTS,
          application.studentCPR
        )
      : Promise.resolve(application.attachment?.toeflIELTSCertificate);

    // replace the storage keys with the old ones
    const [
      acceptanceLetter,
      transcript,
      universityCertificate,
      toeflIELTSCertificate,
    ] = await Promise.all([
      acceptanceLetterKey,
      transcriptKey,
      universityCertificateKey,
      toeflIELTSCertificateKey,
    ]);

    let updateVariables: UpdateMasterApplicationMutationVariables = {
      input: {
        id: application.id,
        status: values.status,
        major: values.major as Major,
        universityID: values.universityID,
        program: values.program,
        reason: values.reason,
        adminPoints: values.adminPoints,
        isIncomeVerified: values.isIncomeVerified,
        gpa: values.gpa,
        toeflIELTSScore: values.toelfIELTSScore,
        score: calculateMasterScore({
          income: application.income,
          gpa: values.verifiedGPA ?? values.gpa,
          adminScore: values?.adminPoints,
        }),
        verifiedGPA: values.verifiedGPA,
        _version: application._version,
      },
    };

    // TODO update master application attachments in db

    await toast
      .promise(
        Promise.all([
          updateMasterAttachmentInDB({
            input: {
              id: application.attachment?.id ?? "",
              transcriptDoc: transcript,
              universityCertificate: universityCertificate,
              acceptanceLetterDoc: acceptanceLetter,
              toeflIELTSCertificate: toeflIELTSCertificate,
              _version: application.attachment?._version,
            },
          }),
          updateMasterApplicationInDB(updateVariables),
        ]),
        {
          loading: "Updating...",
          success: "Application updated successfully",
          error: "Failed to update application",
        }
      )
      .then(async ([_, updatedApplication]) => {
        const oldData = {
          status: application.status,
          adminPoints: application.adminPoints,
          isIncomeVerified: application.isIncomeVerified,
          verifiedGPA: application.verifiedGPA,
          gpa: application.gpa,
          toelfIELTSScore: application.toeflIELTSScore,
          reason: application.reason,
        };

        const newData = {
          status: values.status,
          adminPoints: values.adminPoints,
          isIncomeVerified: values.isIncomeVerified,
          verifiedGPA: values.verifiedGPA,
          gpa: values.gpa,
          toelfIELTSScore: values.toelfIELTSScore,
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
            masterApplicationAdminLogsId: application.id,
            adminAdminLogsCpr: cpr ?? "",
          },
        };

        await createAdminLogInDB(createAdminLogVariables)
          .then(async (logValue) => {
            let updatedData = updatedApplication?.updateMasterApplication;
            if (updatedData) {
              let iMasterApplication: InfiniteMasterApplication = {
                major: updatedData.major ?? Major.ENGINEERING,
                nationalityCategory:
                  updatedData.nationalityCategory ?? Nationality.BAHRAINI,
                income: updatedData.income ?? Income.LESS_THAN_1500,
                dateTime: new Date(),
                studentName:
                  (updatedData.student?.m_firstName
                    ? `${updatedData.student?.m_firstName} ${updatedData.student?.m_secondName} ${updatedData.student?.m_thirdName} ${updatedData.student?.m_lastName}`
                    : updatedData.student?.fullName) ?? "-",
                status: updatedData.status ?? Status.WITHDRAWN,
                universityName: updatedData.university?.universityName ?? "",
                universityNameAr:
                  updatedData.university?.universityNameAr ?? "",
                score: updatedData.score ?? 0,
                universityID: updatedData.universityID ?? "",
                _version: updatedData._version ?? 0,
                id: updatedData.id ?? "",
                batch: updatedData.batch ?? 0,
                verifiedGPA: updatedData.verifiedGPA ?? 0,
                __typename: updatedData.__typename ?? "MasterApplication",
                isIncomeVerified: updatedData.isIncomeVerified ?? false,
                _lastChangedAt: updatedData._lastChangedAt ?? 0,
                applicationAttachmentId:
                  updatedData.masterApplicationAttachmentId ?? "",
                processed: updatedData.processed ?? 0,
                createdAt: updatedData.createdAt
                  ? new Date(updatedData.createdAt)
                  : new Date(),
                studentCPR: updatedData.studentCPR ?? "",
                gpa: updatedData.gpa ?? 0,
                toeflIELTSScore: updatedData.toeflIELTSScore ?? 0,
                program: updatedData.program ?? "",
                updatedAt: updatedData.updatedAt
                  ? new Date(updatedData.updatedAt)
                  : new Date(),
                adminPoints: updatedData.adminPoints ?? 0,
                attachmentID: updatedData.attachment?.id ?? "",
                isEmailSent: updatedData.isEmailSent ?? false,
              };

              updateMasterApplication(iMasterApplication);
            }

            push("/applications?type=masters");
            return logValue;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });

    setLoading(false);
  }

  // function getUniversityName() {
  //   return application.university?.universityName;
  // }

  // function getProgramName() {
  //   return application.program ?? "";
  // }

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-4xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="grid gap-2 w-full">
            <Label>{tL("studentLog")}</Label>
            <div className="grid gap-4">
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href={`/studentLogs/masters/${application.id}`}
              >
                {t("view")}
              </Link>
            </div>
          </div>
          <div className="grid gap-2 w-full">
            <Label>{tL("adminLogs")}</Label>
            <div className="grid gap-4">
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href={`/applications/applicationHistory/masters/${application.id}`}
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
                    min={0}
                    max={100}
                    step={"0.01"}
                    value={field.value ?? ""}
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(Number(value));
                    }}
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
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center py-1">
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
                    step={"0.01"}
                    min={0}
                    max={100}
                    value={field.value ?? ""}
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" || value === "0" ? null : Number(value)
                      );
                    }}
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
                <div className="flex gap-2 items-center py-1">
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
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
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
            name="isIncomeVerified"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-2 justify-between items-center p-4 rounded-lg border col-span-2">
                <div className="space-y-0.5">
                  <div className="flex gap-2 items-center">
                    <FormLabel className="text-base">
                      {t("isIncomeVerified")}
                    </FormLabel>
                    {application.isIncomeVerified ? (
                      <FiCheckCircle className="text-success" />
                    ) : (
                      <FiAlertCircle className="text-warning" />
                    )}
                  </div>
                  <FormDescription>
                    {`${t("studentFamilyIncome")} ${t(
                      `${application.income}`
                    )}`}
                  </FormDescription>
                  <div className="flex gap-1 items-center py-1 rounded-md border w-fit ps-3 pe-2">
                    <FileIcon />

                    <GetStorageLinkComponent
                      storageKey={
                        application.incomeDoc ??
                        application.student?.m_incomeDoc
                      }
                      showName
                    />
                  </div>
                </div>

                <FormControl>
                  {(application.incomeDoc ??
                    application.student?.m_incomeDoc) && (
                    <div className="flex flex-col gap-1 items-center">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-success"
                      />
                      <p>{t("verified")}</p>
                    </div>
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem>
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tL("major")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value as Major}
                      onValueChange={(val) => field.onChange(val as Major)}
                    >
                      <SelectTrigger className="overflow-visible focus:ring-1 focus:ring-blue-800">
                        <SelectValue placeholder="Major" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Major).map((value, i) => (
                          <SelectItem key={i} value={value}>
                            {t(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>{tL("majorD")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>
          {/* TODO pull the univeristies and the program inputted by applicant */}
          <FormItem>
            <FormField
              control={form.control}
              name="universityID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tL("university")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger className="overflow-visible focus:ring-1 focus:ring-blue-800">
                        <SelectValue placeholder="Select University" />
                      </SelectTrigger>
                      <SelectContent>
                        {masterUniversities &&
                          masterUniversities.map((uni, i) => (
                            <SelectItem key={i} value={uni.id}>
                              {locale === "ar"
                                ? uni.universityNameAr
                                : uni.universityName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>{tL("universityD")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>
          {/* <FormItem>
            <FormLabel>{t("searchProgram")}</FormLabel>
            <FormControl>
              <Input
                // disabled
                type="text"
                value={ ?? "undefined"}
              />
            </FormControl>
            {/* <FormDescription>
              <p>{getUniversityName() ?? t("programNameNotFound")}</p>
            <div className="flex flex-wrap gap-2 items-center">
                <p>{t("minimumGPA")}</p>
                <p>
                  {application.programs?.items[0]?.program?.minimumGPA ??
                    minimumGPA}
                </p> 
              </div> 
            </FormDescription> 
            <FormMessage />
          </FormItem> */}
          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>
                  {t("searchProgram")} <span className="text-error">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toelfIELTSScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tL("toelfIELTSScore")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    min={0}
                    step={"0.01"}
                    value={field.value ?? ""}
                    onWheel={(event) => {
                      event.currentTarget.blur();
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(Number(value));
                    }}
                  />
                </FormControl>
                {/* <FormDescription>{tL("gpaD")}</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
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

          <div className="flex gap-4 items-center sm:col-span-2">
            <span className="w-full h-[1px] bg-border "></span>{" "}
            <p>{t("documents")}</p>
            <span className="w-full h-[1px] bg-border "></span>
          </div>
          <FormField
            control={form.control}
            name="acceptanceLetterFile"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[
                      application.attachment?.acceptanceLetterDoc ?? null,
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
                    filedName={tL("acceptanceLetter")}
                    title={`${tL("acceptanceLetter")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>
                  <p>{`${tL("acceptationLetterD")} ${application.program}-${
                    locale === "ar"
                      ? application.university?.universityNameAr
                      : application.university?.universityName
                  }`}</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toeflIELTSCertificateFile"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[
                      application.attachment?.toeflIELTSCertificate ?? null,
                    ]}
                    onFiles={(files) => {
                      field.onChange(files.length > 0 ? files[0] : undefined);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError(
                        "toeflIELTSCertificateFile",
                        Error("invalid")
                      )
                    }
                    handleOnClear={() => {
                      field.onChange(undefined);
                    }}
                    filedName={tL("toeflIELTSCertificate")}
                    title={`${tL("toeflIELTSCertificate")}`}
                  ></MultiUpload>
                </FormControl>
                {/* <FormDescription>
                  <p>{`${tL("toeflIELTSCertificateD")} ${application.program}-${
                    locale === "ar"
                      ? application.university?.universityNameAr
                      : application.university?.universityName
                  }`}</p>
                </FormDescription> */}
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
          {/* TODO FIX THIS */}
          <FormField
            control={form.control}
            name="universityCertificateFile"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[
                      application.attachment?.universityCertificate ?? null,
                    ]}
                    onFiles={(files) => {
                      field.onChange(files.length > 0 ? files[0] : undefined);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError(
                        "universityCertificateFile",
                        Error("invalid")
                      )
                    }
                    handleOnClear={() => {
                      field.onChange(undefined);
                    }}
                    filedName={t("universityCertificate")}
                    title={`${t("universityCertificate")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>
                  <p>{tL("universityCertificateD")}</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.isDirty && (
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
          )}
          <div
            className={cn(
              "flex justify-end sm:col-span-2",
              !form.formState.isDirty && "hidden"
            )}
          >
            <Button disabled={loading || !form.formState.isDirty} type="submit">
              {t("update")}
            </Button>
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
  if (newData.isIncomeVerified !== oldData.isIncomeVerified) {
    changes.push(
      `family income verification from "${
        oldData.isIncomeVerified ? "yes" : "no"
      }" to "${newData.isIncomeVerified ? "yes" : "no"}"`
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
  if (newData.major !== oldData.major) {
    changes.push(`Major from "${oldData.major}" to "${newData.major}"`);
  }
  if (newData.universityID !== oldData.universityID) {
    changes.push(
      `University ID from "${oldData.universityID}" to "${newData.universityID}"`
    );
  }
  if (newData.program !== oldData.program) {
    changes.push(`Program from "${oldData.program}" to "${newData.program}"`);
  }
  if (newData.reason !== oldData.reason) {
    changes.push(
      `Student reason from "${oldData.reason}" to "${newData.reason}"`
    );
  }

  return changes.join(", ");
}
