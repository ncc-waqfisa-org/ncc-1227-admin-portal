import React from "react";
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
import { IoIosClose } from "react-icons/io";

import { BatchSelector } from "../../batch/BatchSelector";
import { Table } from "@tanstack/react-table";
import { InfiniteApplication } from "./infinite-applications-type";
import { CSVLink } from "react-csv";
import { cn } from "../../../src/utils";
import { Button, buttonVariants } from "../button";
import { useBatchContext } from "../../../context/BatchContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/use-auth";

interface ApplicationsStatusFilterProps {
  handleStatusChange: (value: string) => void;
  selectedStatus: Status | string | undefined;
  handleBatchChange: (value: string) => void;
  table: Table<InfiniteApplication>;
}

export const BatchApplicationsToolbar: React.FC<
  ApplicationsStatusFilterProps
> = ({
  handleStatusChange,
  selectedStatus,
  handleBatchChange,
  table,
  //   selectedBatch,
}) => {
  const { batch, resetApplicationsFilter } = useBatchContext();
  const { t } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");
  const { token } = useAuth();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <Select onValueChange={handleStatusChange} value={selectedStatus}>
          <SelectTrigger className="w-[180px]">
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
      {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
        <Button
          onClick={() => {
            table.toggleAllRowsSelected(false);
            console.log(
              "🚀 ~ table.getSelectedRowModel().rows:",
              table.getSelectedRowModel().rows.map((row) => row.original)
            );
            toast.error(
              "Unimplemented functionality batch-applications-toolbar"
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
              `https://a69a50c47l.execute-api.us-east-1.amazonaws.com/default/applications/export?batch=${batch}}`,
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
                table.toggleAllRowsSelected(false);
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
    </div>
  );
};
