import React, { useRef } from "react";
import { Status } from "../../../src/API";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectLabel,
} from "../select";
import { IoIosClose, IoMdClose, IoMdNuclear, IoMdSearch } from "react-icons/io";

import { BatchSelector } from "../../batch/BatchSelector";
import { Table } from "@tanstack/react-table";
import {
  InfiniteApplication,
  InfiniteMasterApplication,
} from "./infinite-applications-type";
import { cn } from "../../../src/utils";
import { Button, buttonVariants } from "../button";
import { useBatchContext } from "../../../context/BatchContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/use-auth";
import dayjs from "dayjs";
import Link from "next/link";
import { FiRefreshCw } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../input";
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
} from "../form";
import { syncMasterApplications } from "../../../src/graphql/queries";

interface ApplicationsStatusFilterProps {
  handleStatusChange: (value: string) => void;
  handleBatchChange: (value: string) => void;
  // handleSearchChange: (value: string) => void;
  selectedStatus: Status | string | undefined;
  // search: string;
  masterTable?: Table<InfiniteMasterApplication>;
}

export const BatchMasterApplicationsToolbar: React.FC<
  ApplicationsStatusFilterProps
> = ({
  selectedStatus,
  handleStatusChange,
  handleBatchChange,

  // handleSearchChange,
  masterTable,
  // search,
}) => {
  const {
    batch,
    resetApplicationsFilter,
    searchedCpr,
    searchMasterCpr,
    resetMasterApplications,
  } = useBatchContext();
  const { t } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");
  const { t: tCommon } = useTranslation("common");
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const submitButton = useRef<HTMLButtonElement>(null);

  const searchFormSchema = z.object({
    cpr: z.union([
      z.string().length(0, tErrors("cprShouldBe9") ?? "Invalid"), // Allows an empty string
      z.string().regex(/^\d{9}$/, tErrors("numbersOnly") ?? "Numbers Only"), // Allows a string of exactly 9 digits
    ]),
  });

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      cpr: searchedCpr ?? "",
    },
  });

  async function autoRejectApplications(): Promise<void> {
    await toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_LAMBDA_PUT_AUTO_REJECT_MASTER}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }),
      {
        loading: tCommon("loading"),
        success: () => {
          resetMasterApplications();
          return tCommon("success");
        },
        error: (error) => {
          return `${error.message}`;
        },
      }
    );
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof searchFormSchema>) {
    searchMasterCpr(values.cpr);
  }

  return (
    <div className="flex flex-wrap items-start gap-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-2"
        >
          <FormField
            control={form.control}
            name="cpr"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t("searchCPR") ?? "Search CPR"}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {field.value && (
                      <Button
                        type="button"
                        className={cn("absolute top-0 ltr:right-0 rtl:left-0 ")}
                        onClick={() => {
                          field.onChange("");
                          submitButton.current?.click();
                        }}
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <IoMdClose />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            ref={submitButton}
            variant={"outline"}
            size={"icon"}
            type="submit"
          >
            <IoMdSearch />
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-2">
        <Select onValueChange={handleStatusChange} value={selectedStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {Object.values(Status).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedStatus && (
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={resetApplicationsFilter}
          >
            <IoIosClose />
          </Button>
        )}
      </div>
      <BatchSelector handleBatchChange={handleBatchChange} />
      {(masterTable?.getIsSomeRowsSelected() ||
        masterTable?.getIsAllRowsSelected()) && (
        <Button
          onClick={() => {
            masterTable.toggleAllRowsSelected(false);
            const selectedApplications = masterTable
              .getSelectedRowModel()
              .rows.map((row) => row.original);
            const selectedApplicationsIds = selectedApplications.map(
              (a) => a.id
            );

            // TODO change lamba url
            const url = `${process.env.NEXT_PUBLIC_LAMBDA_EXPORT_MASTER_CSV_STATISTICS}?batch=${batch}`;
            // const url = `https://a69a50c47l.execute-api.us-east-1.amazonaws.com/default/applications/export?batch=${batch}`;
            const test = JSON.stringify({ ids: selectedApplicationsIds });

            toast.promise(
              fetch(url, {
                headers: {
                  ...(token && { Authorization: `Bearer ${token}` }),
                },
                method: "POST",
                body: JSON.stringify({ ids: selectedApplicationsIds }),
              }).then(async (res) => {
                if (res.ok) {
                  const { url } = await res.json();
                  if (url) {
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `selected-applications-${dayjs().toISOString()}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }
                } else {
                  const { message } = await res.json();
                  throw new Error(message);
                }
              }),
              {
                loading: t("loading"),
                success: t("success"),
                error: (err) =>
                  err ? err.message : tErrors("somethingWentWrong"),
              }
            );
          }}
        >
          {t("exportSelectedCSV")}
        </Button>
      )}

      <Button
        variant={"outline"}
        onClick={() => {
          toast.promise(
            fetch(
              `https://z7pe3akpcz6bazr3djdk4yo7e40yqevt.lambda-url.us-east-1.on.aws/?batch=${batch}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then(async (res) => {
                const { url } = await res.json();
                if (url) {
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${batch}-Applications-${new Date().toISOString()}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }
              })
              .finally(() => {
                if (masterTable) {
                  masterTable.toggleAllRowsSelected(false);
                  console.log("changing batch");
                }
              }),
            {
              loading: t("loading"),
              success: t("success"),
              error: tErrors("somethingWentWrong"),
            }
          );
        }}
      >
        {t("exportAllAsCSV")}
      </Button>
      <Link
        className={cn(buttonVariants({ variant: "outline" }))}
        href={`/batches/masters/${batch}`}
      >
        {t("goToBatch")}
      </Link>
      <Button
        onClick={() => {
          resetMasterApplications();
        }}
        size={"icon"}
        variant={"outline"}
      >
        <FiRefreshCw />
      </Button>
      <Button onClick={() => autoRejectApplications()}>Auto Reject</Button>
    </div>
  );
};
