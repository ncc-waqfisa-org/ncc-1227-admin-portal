import React, { FC, useState } from "react";
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
import toast from "react-hot-toast";
import { useBatchContext } from "../../context/BatchContext";
import { useRouter } from "next/router";
import { cn } from "../../src/utils";
import DatePicker from "react-date-picker";
import { format } from "date-fns";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../../hooks/use-auth";

type TGenerateScholarshipForm = {
  applicationId?: string;
  masterApplicationId?: string;
  type: "masters" | "bachelor";
  onGenerate: (data: TGeneratedScholarship) => void;
};

type TGenerateScholarshipMutationVariables = {
  applicationID: string;
  startDate: string;
  scholarshipPeriod: number;
  numberOfSemesters: number;
};

export type TGeneratedScholarship = TGenerateScholarshipMutationVariables & {
  contract: string;
  pdfUrl: string;
};

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const GenerateScholarshipForm: FC<TGenerateScholarshipForm> = ({
  applicationId,
  masterApplicationId,
  type,
  onGenerate,
}) => {
  const { t } = useTranslation("scholarships");
  const { push } = useRouter();
  const { resetScholarships } = useBatchContext();

  const { token } = useAuth();

  const formSchema = z.object({
    startDate: z.string().min(1),
    scholarshipPeriod: z.number().min(1),
    numberOfSemesters: z.number().min(1),
    applicationID: z.string(),
  });

  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: startDate,
      scholarshipPeriod: undefined,
      numberOfSemesters: undefined,
      applicationID:
        (type === "masters" ? masterApplicationId : applicationId) ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    let generateVariables: TGenerateScholarshipMutationVariables = values;

    await toast
      .promise(
        fetch(
          `${process.env.NEXT_PUBLIC_LAMBDA_POST_GENERATE_SCHOLARSHIP_BACHELOR}`,
          {
            method: "POST",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(generateVariables),
          }
        ),
        {
          loading: t("generatingScholarship"),
          success: t("generatedSuccessfully"),
          error: t("failedToGenerate"),
        }
      )
      .then(async (res) => {
        if (res.ok) {
          try {
            const data = await res.json();

            const pdfKey = data.key;
            const presignedUrl = data.presignedUrl;
            if (pdfKey && presignedUrl) {
              const pdfUrl = data.presignedUrl;

              onGenerate({ ...generateVariables, contract: pdfKey, pdfUrl });
            } else {
              toast.error(`Could not generate contract: Some data are missing`);
            }
          } catch (error) {
            toast.error(`Could not generate contract: ${error}`);
          }
        } else {
          toast.error("Could not generate contract");
        }
      });
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="applicationID"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="applicationID">
                  {t("applicationID")}
                </FormLabel>
                <FormControl>
                  <div className="">
                    <Input
                      disabled
                      id="applicationID"
                      placeholder="Application ID"
                      {...field}
                      value={
                        type === "masters" ? masterApplicationId : applicationId
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>{t("applicationIDD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="startDate">{t("startDate")}</FormLabel>
                <FormControl>
                  <DatePicker
                    className={cn(" input input-bordered input-primary")}
                    onChange={(date) => {
                      const startDate: Date | null = date as Date | null;
                      if (startDate) {
                        const value = format(startDate, "yyyy-MM-dd") ?? "";
                        setStartDate(value);
                        field.onChange(value);
                      }
                    }}
                    value={
                      startDate ? format(startDate, "yyyy-MM-dd") : undefined
                    }
                  />
                </FormControl>
                <FormDescription>{t("startDateD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scholarshipPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="scholarshipPeriod">
                  {t("scholarshipPeriod")}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <Input
                      id="scholarshipPeriod"
                      type="number"
                      min={1}
                      placeholder="Enter scholarship period"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                    <p>{t("months")}</p>
                  </div>
                </FormControl>
                <FormDescription>{t("scholarshipPeriodD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfSemesters"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="numberOfSemesters">
                  {t("numberOfSemesters")}
                </FormLabel>
                <FormControl>
                  <div className="">
                    <Input
                      id="numberOfSemesters"
                      type="number"
                      min={1}
                      placeholder="Enter the number of semesters"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>{t("numberOfSemestersD")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end sm:col-span-2">
            <Button disabled={loading} type="submit">
              {t("generate")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
