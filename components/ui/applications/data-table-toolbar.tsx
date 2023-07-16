import { ReloadIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button, buttonVariants } from "../button";
import { Input } from "../input";
import { DataTableViewOptions } from "./data-table-view-options";

import { statuses } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CSVLink } from "react-csv";
import { Application, ProgramChoice } from "../../../src/API";
import { useStudent } from "../../../context/StudentContext";
import { cn } from "../../../src/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../tooltip";
import { useTranslation } from "react-i18next";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { batch, applicationsBeingFetched, syncApplications } = useStudent();

  const { t } = useTranslation("applications");

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 gap-1">
        <Input
          placeholder={t("filterStudents") ?? "Filter students by cpr..."}
          value={
            (table.getColumn("studentCPR")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: any) =>
            table.getColumn("studentCPR")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title={t("Status") ?? "Status"}
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {t("reset")}
            <Cross2Icon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1">
        {!applicationsBeingFetched && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  onClick={() => syncApplications()}
                  className="h-8"
                >
                  <ReloadIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("refresh")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
          <CSVLink
            className={`${cn(buttonVariants({ variant: "outline" }))} h-8`}
            filename={`${batch}-Applications-${new Date().toISOString()}.csv`}
            data={[
              ...table.getSelectedRowModel().rows.map((row, index) => {
                const app = row.original as Application;
                let sortedProgramChoices: (ProgramChoice | null)[] | undefined =
                  app.programs?.items?.sort(
                    (a, b) => (a?.choiceOrder ?? 0) - (b?.choiceOrder ?? 0)
                  );

                return {
                  row: index + 1,
                  cpr: app.studentCPR,
                  name: app.student?.fullName,
                  email: app.student?.email,
                  phone: app.student?.phone,
                  gpa: app.gpa,
                  status: app.status,
                  date: Intl.DateTimeFormat("en", {
                    timeStyle: "short",
                    dateStyle: "medium",
                  }).format(new Date(app.dateTime)),
                  primaryProgram: `${sortedProgramChoices?.[0]?.program?.name}-${sortedProgramChoices?.[0]?.program?.university?.name}`,
                  secondaryProgram: `${sortedProgramChoices?.[1]?.program?.name}-${sortedProgramChoices?.[1]?.program?.university?.name}`,
                  applicationId: app.id,
                  primaryProgramID: sortedProgramChoices?.[0]?.program?.id,
                  secondaryProgramID: sortedProgramChoices?.[1]?.program?.id,
                };
              }),
            ]}
            onClick={() => {
              table.toggleAllRowsSelected(false);
            }}
          >
            {t("exportAllAsCSV")}
          </CSVLink>
        )}

        <Button
          className="h-8"
          variant={table.getIsAllRowsSelected() ? "default" : "outline"}
          onClick={() =>
            table.toggleAllRowsSelected(!table.getIsAllRowsSelected())
          }
        >
          {t("selectAll")}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
