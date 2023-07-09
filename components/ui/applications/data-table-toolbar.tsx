import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../button";
import { Input } from "../input";
import { DataTableViewOptions } from "./data-table-view-options";

import { statuses } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 space-x-2">
        <Input
          placeholder="Filter students by cpr..."
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
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          className="h-8"
          variant={table.getIsAllRowsSelected() ? "default" : "outline"}
          onClick={() =>
            table.toggleAllRowsSelected(!table.getIsAllRowsSelected())
          }
        >
          Select All
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
