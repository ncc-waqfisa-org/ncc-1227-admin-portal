import React, { FC } from "react";
import {
  MasterScholarship,
  Scholarship,
  ScholarshipStatus,
  UpdateMasterScholarshipMutationVariables,
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
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MultiUpload from "../MultiUpload";
import toast from "react-hot-toast";
import {
  DocType,
  updateSingleMasterScholarship,
  updateSingleScholarship,
  uploadFile,
} from "../../src/CustomAPI";
import { Switch } from "../ui/switch";
import { useBatchContext } from "../../context/BatchContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

type TMastersScholarshipForm = {
  mastersScholarship: MasterScholarship;
};

export const MastersScholarshipForm: FC<TMastersScholarshipForm> = ({
  mastersScholarship,
}) => {
  const { t } = useTranslation("scholarships");
  const { push } = useRouter();
  const { resetMasterScholarships } = useBatchContext();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    unsignedContractFile: z.instanceof(File).optional(),
    signedContractFile: z.instanceof(File).optional(),
    IBANLetterFile: z.instanceof(File).optional(),
    IBAN: z.string().optional(),
    bankName: z.string().optional(),
    isConfirmed: z.boolean().default(false),
    status: z.enum(Object.values(ScholarshipStatus) as [ScholarshipStatus]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      IBAN: mastersScholarship.IBAN ?? undefined,
      bankName: mastersScholarship.bankName ?? undefined,
      isConfirmed: mastersScholarship.isConfirmed ?? false,
      status: mastersScholarship.status ?? undefined,
    },
  });

  async function uploadAndUpdate(values: z.infer<typeof formSchema>) {
    // upload new docs if selected
    const unsignedContractKey = values.unsignedContractFile
      ? uploadFile(
          values.unsignedContractFile,
          DocType.UNSIGNED_CONTRACT,
          mastersScholarship.studentCPR ?? "undefined"
        )
      : Promise.resolve(mastersScholarship.unsignedContractDoc);

    const signedContractKey = values.signedContractFile
      ? uploadFile(
          values.signedContractFile,
          DocType.SIGNED_CONTRACT,
          mastersScholarship.studentCPR ?? "undefined"
        )
      : Promise.resolve(mastersScholarship.signedContractDoc);

    const IBANLetterKey = values.IBANLetterFile
      ? uploadFile(
          values.IBANLetterFile,
          DocType.BANK_LETTER,
          mastersScholarship.studentCPR ?? "undefined"
        )
      : Promise.resolve(mastersScholarship.IBANLetterDoc);

    // replace the storage keys with the old ones
    const [unsignedContract, signedContract, IBANLetter] = await Promise.all([
      unsignedContractKey,
      signedContractKey,
      IBANLetterKey,
    ]);

    let updateVariables: UpdateMasterScholarshipMutationVariables = {
      input: {
        status: values.status,
        isConfirmed: values.isConfirmed,
        IBAN: values.IBAN,
        bankName: values.bankName,
        IBANLetterDoc: IBANLetter,
        unsignedContractDoc: unsignedContract,
        signedContractDoc: signedContract,
        id: mastersScholarship.id,
        _version: mastersScholarship._version,
      },
    };

    return updateSingleMasterScholarship(updateVariables);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await toast
      .promise(uploadAndUpdate(values), {
        loading: t("updating"),
        success: t("updatedSuccessfully"),
        error: t("failedToUpdate"),
      })
      .then(async (value) => {
        resetMasterScholarships();
        queryClient.invalidateQueries({
          queryKey: ["mastersScholarship", mastersScholarship.id],
        });
        push("/scholarships/masters");
      });
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="IBAN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("IBAN")}</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>{t("IBAND")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("bankName")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("notAddedYet") ?? undefined}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("bankNameD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value as ScholarshipStatus}
                    onValueChange={(val) =>
                      field.onChange(val as ScholarshipStatus)
                    }
                  >
                    <SelectTrigger className="overflow-visible focus:ring-1 focus:ring-blue-800">
                      <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ScholarshipStatus).map((value, i) => (
                        <SelectItem key={i} value={value}>
                          {t(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>{t("statusD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isConfirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("isConfirmed")}
                  </FormLabel>
                  <FormDescription>{t("isConfirmedD")}</FormDescription>
                  {/* <div className="flex items-center gap-1 py-1 border rounded-md w-fit ps-3 pe-2">
                    <FileIcon />
                  </div> */}
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

          <div className="flex items-center gap-4 sm:col-span-2">
            <span className="w-full h-[1px] bg-border "></span>{" "}
            <p>{t("documents")}</p>
            <span className="w-full h-[1px] bg-border "></span>
          </div>
          <FormField
            control={form.control}
            name="unsignedContractFile"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[
                      mastersScholarship.unsignedContractDoc ?? null,
                    ]}
                    onFiles={(files) => {
                      field.onChange(files.length > 0 ? files[0] : undefined);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError("unsignedContractFile", Error("invalid"))
                    }
                    handleOnClear={() => {
                      field.onChange(undefined);
                    }}
                    filedName={t("unsignedContract")}
                    title={`${t("unsignedContract")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>{t("unsignedContractD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="IBANLetterFile"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[mastersScholarship.IBANLetterDoc ?? null]}
                    onFiles={(files) => {
                      field.onChange(files.length > 0 ? files[0] : undefined);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError("IBANLetterFile", Error("invalid"))
                    }
                    handleOnClear={() => {
                      field.onChange(undefined);
                    }}
                    filedName={t("IBANLetter")}
                    title={`${t("IBANLetter")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>{t("IBANLetterD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="signedContractFile"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <MultiUpload
                    single
                    required={false}
                    storageKeys={[mastersScholarship.signedContractDoc ?? null]}
                    onFiles={(files) => {
                      field.onChange(files.length > 0 ? files[0] : undefined);
                    }}
                    isInvalid={(isInvalid) =>
                      isInvalid &&
                      form.setError("signedContractFile", Error("invalid"))
                    }
                    handleOnClear={() => {
                      field.onChange(undefined);
                    }}
                    filedName={t("signedContract")}
                    title={`${t("signedContract")}`}
                  ></MultiUpload>
                </FormControl>
                <FormDescription>{t("signedContractD")}</FormDescription>
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
