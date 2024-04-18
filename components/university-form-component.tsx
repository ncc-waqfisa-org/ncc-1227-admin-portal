import React, { useState } from "react";
import {
  University,
  UpdateProgramMutationVariables,
  UpdateUniversityMutationVariables,
} from "../src/API";
import { updateProgramById, updateUniversityById } from "../src/CustomAPI";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useEducation } from "../context/EducationContext";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
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
} from "./ui/form";

interface Props {
  university: University | null;
}

export default function UniversityFormComponent({ university }: Props) {
  const { push } = useRouter();

  const { syncUniList } = useEducation();
  const { t } = useTranslation("education");

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    universityName: z.string(),
    universityArName: z.string(),
    universityAvailability: z.number().min(0),
    isDeactivated: z.boolean().default(false),
    isException: z.number().min(0).max(1).default(0),
    isExtended: z.number().min(0).max(1).default(0),
    extensionDuration: z.number().min(0).default(0),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      universityName: university?.name ?? "",
      universityArName: university?.nameAr ?? "",
      universityAvailability: university?.availability ?? 0,
      isDeactivated: university?.isDeactivated ?? false,
      isException: university?.isException ?? 0,
      isExtended: university?.isExtended ?? 0,
      extensionDuration: university?.extensionDuration ?? 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (university) {
      let updatedUniDetails: UpdateUniversityMutationVariables = {
        input: {
          id: university.id,
          _version: university?._version,
          name: values.universityName,
          nameAr: values.universityArName,
          availability: values.universityAvailability,
          isDeactivated: values.isDeactivated,
          isException: values.isException,
          isExtended: values.isExtended,
          extensionDuration: values.extensionDuration,
        },
      };

      await toast.promise(
        updateUniversityById(updatedUniDetails)
          .then(() => {
            university?.Programs?.items.map(async (uniProgram) => {
              if (uniProgram) {
                let updateProgram: UpdateProgramMutationVariables = {
                  input: {
                    id: uniProgram.id,
                    isDeactivated: values.isDeactivated,
                    _version: uniProgram?._version,
                  },
                };
                await updateProgramById(updateProgram)
                  .catch((err) => {
                    throw err;
                  })
                  .finally(async () => {
                    await syncUniList();
                    push("/education");
                  });
              }
            });
          })
          .catch((err) => {
            throw err;
          }),
        {
          loading: "Loading...",
          success: "University updated successfully",
          error: (error: any) => {
            return `${error?.message}`;
          },
        }
      );
    }
    setIsLoading(false);
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("updateUniversity")}</CardTitle>
          <CardDescription>{t("updateUniversityD")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="universityName"
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
                  name="universityArName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">
                        {t("tableUniArName")}
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            id="name"
                            placeholder="أدخل اسم الجامعة بالعربية"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>{t("tableUniArNameD")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="universityAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">{t("availability")}</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            id="name"
                            placeholder={`${t("availability")}`}
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>{t("availabilityD")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extensionDuration"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between py-1">
                        <FormLabel htmlFor="name">
                          {t("extensionDuration")}
                        </FormLabel>
                        <FormField
                          control={form.control}
                          name="isExtended"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id="isExtended"
                                    checked={field.value === 1 ? true : false}
                                    onCheckedChange={(checkedState) =>
                                      field.onChange(
                                        typeof checkedState == "boolean"
                                          ? checkedState
                                            ? 1
                                            : 0
                                          : 0
                                      )
                                    }
                                  />
                                  <FormLabel htmlFor="name">
                                    {t("extended")}
                                  </FormLabel>
                                </div>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            id="extensionDuration"
                            placeholder={`${t("extensionDuration")}`}
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                          <p>{t("days")}</p>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t("extensionDurationD")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="isDeactivated"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="deactivated"
                            checked={field.value}
                            onCheckedChange={(checkedState) =>
                              field.onChange(
                                typeof checkedState == "boolean"
                                  ? checkedState
                                  : false
                              )
                            }
                          />
                          <FormLabel htmlFor="name">
                            {t("deactivate")}
                          </FormLabel>
                        </div>
                      </FormControl>
                      <FormDescription>{t("deactivateD")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isException"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="isException"
                            checked={field.value === 1 ? true : false}
                            onCheckedChange={(checkedState) =>
                              field.onChange(
                                typeof checkedState == "boolean"
                                  ? checkedState
                                    ? 1
                                    : 0
                                  : 0
                              )
                            }
                          />
                          <FormLabel htmlFor="name">{t("exception")}</FormLabel>
                        </div>
                      </FormControl>
                      <FormDescription>{t("exceptionD")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="flex items-center gap-2 w-fit"
                disabled={isLoading}
                type="submit"
              >
                {isLoading && <span className="loading"></span>}
                {t("saveButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
