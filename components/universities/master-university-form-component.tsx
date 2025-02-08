import React, { useState } from "react";
import {
  BahrainUniversities,
  MasterAppliedUniversities,
  UpdateBahrainUniversitiesMutationVariables,
  UpdateMasterAppliedUniversitiesMutationVariables,
  UpdateUniversityMutationVariables,
} from "../../src/API";
import {
  updateMasterUniversityById,
  updateBahrainUniversityById,
} from "../../src/CustomAPI";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useEducation } from "../../context/EducationContext";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
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
import { syncBahrainUniversities } from "../../src/graphql/queries";

interface Props {
  type: "bahrainiUni" | "masterUni";
  university: MasterAppliedUniversities | BahrainUniversities | null;
}

export default function MasterUniversityFormComponent({
  type,
  university,
}: Props) {
  const { push, back } = useRouter();

  const { syncUniList } = useEducation();
  const { t } = useTranslation("education");

  const [isLoading, setIsLoading] = useState(false);

  console.log(university?.availability);

  const formSchema = z.object({
    universityName: z.string(),
    universityArName: z.string(),
    universityAvailability: z.number().min(0).default(0),
    isDeactivated: z.boolean().default(false),
    // isException: z.number().min(0).max(1).default(0),
    // isExtended: z.number().min(0).max(1).default(0),
    // extensionDuration: z.number().min(0).default(0),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      universityName: university?.universityName ?? "",
      universityArName: university?.universityNameAr ?? "",
      universityAvailability: parseInt(university?.availability ?? "0"),
      isDeactivated: university?.isDeactivated ?? false,
      // isException: university?.isException ?? 0,
      // isExtended: university?.isExtended ?? 0,
      // extensionDuration: university?.extensionDuration ?? 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (university) {
      let updatedBahrainiUniDetails: UpdateBahrainUniversitiesMutationVariables =
        {
          input: {
            id: university.id,
            _version: university?._version,
            universityName: values.universityName,
            universityNameAr: values.universityArName,
            availability: values.universityAvailability.toString(),
            isDeactivated: values.isDeactivated,
            // isException: values.isException,
            // isExtended: values.isExtended,
            // extensionDuration: values.extensionDuration,
          },
        };

      let updatedMasterUniDetails: UpdateMasterAppliedUniversitiesMutationVariables =
        {
          input: {
            id: university.id,
            _version: university?._version,
            universityName: values.universityName,
            universityNameAr: values.universityArName,
            availability: values.universityAvailability.toString(),
            isDeactivated: values.isDeactivated,
            // isException: values.isException,
            // isExtended: values.isExtended,
            // extensionDuration: values.extensionDuration,
          },
        };

      //TODO add await updateBahrainUniversityById
      type === "masterUni"
        ? await toast
            .promise(
              updateMasterUniversityById(updatedBahrainiUniDetails)
                // .then(() => {})
                .catch((err) => {
                  throw err;
                }),

              // updateUniversityById(updatedUniDetails)
              //   .then(() => {
              //     university?.Programs?.items.map(async (uniProgram) => {
              //       if (uniProgram) {
              //         let updateProgram: UpdateProgramMutationVariables = {
              //           input: {
              //             id: uniProgram.id,
              //             isDeactivated: values.isDeactivated,
              //             _version: uniProgram?._version,
              //           },
              //         };
              //         await updateProgramById(updateProgram)
              //           .catch((err) => {
              //             throw err;
              //           })
              //           .finally(async () => {
              //             await syncUniList();
              //             push("/education");
              //           });
              //       }
              //     });
              //   })
              //   .catch((err) => {
              //     throw err;
              //   }),
              {
                loading: "Loading...",
                success: `${values.universityName} updated successfully`,
                error: (error: any) => {
                  return `${error?.message}`;
                },
              }
            )
            .then((res) => {
              if (res) {
                back();
              }
            })
        : await toast
            .promise(updateBahrainUniversityById(updatedMasterUniDetails), {
              loading: "Loading...",
              success: `${values.universityName} updated successfully`,
              error: (error: any) => {
                return `${error?.message}`;
              },
            })
            .then((res) => {
              if (res) {
                back();
              }
            });
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
                      {/* <FormDescription>{t("tableUniNameD")}</FormDescription> */}
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
                      {/* <FormDescription>{t("tableUniArNameD")}</FormDescription> */}
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
                            disabled
                            id="name"
                            placeholder={`${t("availability")}`}
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                  name="isDeactivated"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 pt-2">
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

                {/* <FormField
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
                /> */}
              </div>
              {/*  <div className="grid gap-4">
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
              </div>*/}

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
