import React, { FC, PropsWithChildren } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

type TDownloadFileFromUrl = {
  fileName?: string;
  url: string;
  isFromLocal?: boolean;
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
> = ({ fileName, url, isFromLocal = false, children, variant = "outline" }) => {
  const { token } = useAuth();
  const { t: tApplications } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");

  const handleDownload = async () => {
    if (isFromLocal) {
      // Download from public directory
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName ?? "File";
      a.click();
    } else {
      // Existing remote download logic
      const res = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.ok) {
        const { url: fileUrl } = await res.json();
        if (fileUrl) {
          const a = document.createElement("a");
          a.href = fileUrl;
          a.download = fileName ?? "File";
          a.click();
          window.URL.revokeObjectURL(fileUrl);
        }
      } else {
        const { message } = await res.json();
        throw new Error(message);
      }
    }
  };

  return (
    <Button
      className="rounded-xl"
      variant={variant}
      onClick={() => {
        toast.promise(handleDownload(), {
          loading: tApplications("loading"),
          success: tApplications("success"),
          error: (err) => (err ? err.message : tErrors("somethingWentWrong")),
        });
      }}
    >
      {children}
    </Button>
  );
};
