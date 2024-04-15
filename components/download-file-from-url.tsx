import React, { FC, PropsWithChildren } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

type TDownloadFileFromUrl = {
  fileName: string;
  url: string;

  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};
export const DownloadFileFromUrl: FC<
  PropsWithChildren<TDownloadFileFromUrl>
> = ({ fileName, url, children, variant = "outline" }) => {
  const { token } = useAuth();
  const { t: tApplications } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");
  return (
    <Button
      className="rounded-xl"
      variant={variant}
      onClick={() => {
        toast.promise(
          fetch(url, {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }).then(async (res) => {
            if (res.ok) {
              const { url } = await res.json();
              if (url) {
                const a = document.createElement("a");
                a.href = url;
                a.download = `${fileName}-${dayjs().toISOString()}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }
            } else {
              const { message } = await res.json();
              throw new Error(message);
            }
          }),
          {
            loading: tApplications("loading"),
            success: tApplications("success"),
            error: (err) => (err ? err.message : tErrors("somethingWentWrong")),
          }
        );
      }}
    >
      {children}
    </Button>
  );
};
