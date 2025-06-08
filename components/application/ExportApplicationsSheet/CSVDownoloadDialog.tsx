"use client";

import { FC, useEffect, useState } from "react";
import {
  FiDownload as Download,
  FiRefreshCw as RefreshCw,
  FiCalendar as Calendar,
  FiFileText as FileText,
} from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../hooks/use-auth";
import { useBatchContext } from "../../../context/BatchContext";
import { checkFileStatus } from "./CheckFileStatus";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import arLocale from "dayjs/locale/ar";
import enLocale from "dayjs/locale/en";

dayjs.extend(relativeTime);

type Props = {
  exportType?: "bachelor" | "master";
};

const bachelorLambdaUrl = (batch: number) =>
  `${process.env.NEXT_PUBLIC_LAMBDA_EXPORT_CSV_STATISTICS}?batch=${batch}`;
const masterLambdaUrl = (batch: number) =>
  `${process.env.NEXT_PUBLIC_LAMBDA_EXPORT_MASTER_CSV_STATISTICS}?batch=${batch}`;

export const CSVDownoloadDialog: FC<Props> = ({ exportType = "bachelor" }) => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { token } = useAuth();
  const { batch } = useBatchContext();

  const isArabic = locale === "ar";

  const s3Key =
    exportType == "master"
      ? `reports/MasterApplications ${batch}.xlsx`
      : `reports/Applications ${batch}.xlsx`;

  const [status, setStatus] = useState<{
    phase: "idle" | "generating" | "ready" | "error" | "loading";
    lastModified?: Date;
    downloadUrl?: string;
    error?: string;
    lastChecked?: Date;
  }>({ phase: "loading" });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function getFirstLink() {
      const result = await checkFileStatus(s3Key);
      setStatus((prev) => ({
        ...prev,
        phase: "idle",
        downloadUrl: result.downloadUrl,
        lastChecked: new Date(),
        lastModified: result.lastModified,
        error: result.error?.message,
      }));
    }
    if (open) {
      getFirstLink();
    }

    return () => {};
  }, [open]);

  // Check if CSV is older than 30 minutes
  const isOld = () => {
    if (!status.lastModified) return false;
    const diffMs = Date.now() - status.lastModified.getTime();
    return diffMs > 30 * 60 * 1000;
  };

  const handleDownload = () => {
    if (!status.downloadUrl) return;
    // Simulate CSV download
    const url = status.downloadUrl;
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${
      status.lastModified?.toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateFile = async () => {
    setStatus({ phase: "generating" });
    const generationStartTime = new Date();

    try {
      // 1. Trigger Lambda generation
      const res = fetch(
        exportType == "master"
          ? masterLambdaUrl(batch)
          : bachelorLambdaUrl(batch),
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      // 2. Start polling with proper closure
      const poll = async () => {
        try {
          const result = await checkFileStatus(s3Key, generationStartTime);

          setStatus((prev) => ({
            ...prev,
            lastChecked: new Date(),
            lastModified: result.lastModified,
            error: result.error?.message,
          }));

          if (result.isReady && result.downloadUrl) {
            setStatus({
              phase: "ready",
              lastModified: result.lastModified,
              downloadUrl: result.downloadUrl,
              lastChecked: new Date(),
            });
          } else {
            // Continue polling regardless of status.phase
            // Using a ref or checking something more reliable than status.phase
            setTimeout(poll, 5000);
          }
        } catch (error) {
          setStatus({
            phase: "error",
            error: error instanceof Error ? error.message : "Polling failed",
          });
        }
      };

      poll();
    } catch (error) {
      setStatus({
        phase: "error",
        error: error instanceof Error ? error.message : "Generation failed",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isArabic ? "ar-BH" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          <FileText className="me-2 h-4 w-4" />
          {t("exportCSV")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("exportCSV")}
          </DialogTitle>
          <DialogDescription>
            {t("downloadOrGenerateANewCSV")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button
                onClick={handleDownload}
                disabled={!status.downloadUrl}
                className="flex-1 me-3"
              >
                <Download className="me-2 h-4 w-4" />
                {t("downloadCSV")}
              </Button>
              {isOld() && (
                <Badge variant="destructive" className="text-xs">
                  {t("old")}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {t("generated")}:{" "}
                {status.phase === "loading"
                  ? t("loading")
                  : status.lastModified
                  ? formatDate(status.lastModified)
                  : t("notAvailable")}
              </span>
              {status.lastModified && (
                <span>
                  {dayjs(status.lastModified)
                    .locale(isArabic ? arLocale : enLocale)
                    .fromNow()}
                </span>
              )}
            </div>
          </div>

          {/* Generate New Section */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {isOld()
                  ? t("theCurrentExportIsOutdated")
                  : t("generateNewIfYouNeedMostRecent")}
              </div>

              <Button
                variant={isOld() ? "default" : "outline"}
                onClick={generateFile}
                disabled={status.phase === "generating"}
                className="w-full"
              >
                {status.phase === "generating" ? (
                  <>
                    <RefreshCw className="me-2 h-4 w-4 animate-spin" />
                    {t("generating")}
                  </>
                ) : (
                  <>
                    <RefreshCw className="me-2 h-4 w-4" />
                    {t("generateNewCSV")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
