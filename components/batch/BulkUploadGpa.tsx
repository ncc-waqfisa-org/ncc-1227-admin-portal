import React, { FC, useState } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import MultiUpload from "../MultiUpload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/use-auth";

type TBulkUploadGpa = {
  batch: number;
};

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = [
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
];

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const BulkUploadGpa: FC<TBulkUploadGpa> = ({ batch }) => {
  const { t } = useTranslation("batches");
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const uploadVerifiedGPAs = useMutation({
    mutationFn: async (file: File) => {
      // const base64string = await toBase64(file);
      // console.log("🚀 ~ mutationFn: ~ base64string:", base64string);
      const formData = new FormData();
      formData.append("csv", file);

      return fetch(
        `https://ob7e09fm1m.execute-api.us-east-1.amazonaws.com/default/gpas?batch=${batch}`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
          // body: JSON.stringify({
          //   csv: base64string,
          // }),
        }
      );
    },
    async onSuccess(res) {
      const data = await res.json();
      console.log("🚀 ~ onSuccess ~ res:", res);
      console.log("🚀 ~ onSuccess ~ data:", data);
      if (res.ok) {
        toast.success(data.message ?? t("uploadedSuccessfully"));
        setIsOpen(false);
      } else {
        toast.error(data.message ? data.message : t("failedToUpload"));
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  const formSchema = z.object({
    csvFile: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        return !file || file.size <= MAX_UPLOAD_SIZE;
      }, "File size must be less than 3MB")
      .refine((file) => {
        return file && ACCEPTED_FILE_TYPES.includes(file.type);
      }, "File must be a CSV"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      csvFile: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    {
      values.csvFile && uploadVerifiedGPAs.mutate(values.csvFile);
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className={"rounded-xl"} variant="outline">
            {t("uploadVerifiedGPAs")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("verifiedGPAs")}</DialogTitle>
            <DialogDescription>{t("uploadVerifiedGPAs")}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="csvFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiUpload
                          single
                          accept={{ "text/csv": [".csv"] }}
                          onFiles={(files) => {
                            field.onChange(
                              files.length > 0 ? files[0] : undefined
                            );
                          }}
                          isInvalid={(isInvalid) =>
                            isInvalid &&
                            form.setError("csvFile", Error("invalid"))
                          }
                          handleOnClear={() => {
                            field.onChange(undefined);
                          }}
                          filedName={t("verifiedGPAs")}
                          title={`${t("verifiedGPAs")}`}
                        ></MultiUpload>
                      </FormControl>
                      <FormDescription>
                        <p>{t("csvFormatWarning")}</p>
                        <p>{t("csvFormatDescription")}</p>
                        <p>{t("csvFormat")}</p>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button disabled={uploadVerifiedGPAs.isPending} type="submit">
                    {uploadVerifiedGPAs.isPending && (
                      <span className="loading"></span>
                    )}
                    {t("submit")}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
