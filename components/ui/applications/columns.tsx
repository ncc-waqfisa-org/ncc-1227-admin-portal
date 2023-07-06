import { ColumnDef } from "@tanstack/react-table";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Checkbox } from "../checkbox";

import { schoolTypes, statuses } from "./data/data";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Application } from "../../../src/API";

export const columns: ColumnDef<Application>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] mr-3"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentCPR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[10rem]">
        <p className="font-semibold">{row.original.student?.fullName}</p>
        <div className="">{row.getValue("studentCPR")}</div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex  items-center ">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground min-w-fit" />
          )}
          <span className="min-w-fit">{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "gpa",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GPA" />
    ),
    cell: ({ row }) => {
      //   const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("gpa")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "schoolType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Type" />
    ),
    cell: ({ row }) => {
      const schoolType = schoolTypes.find(
        (schoolType) => schoolType.value === row.getValue("schoolType")
      );

      if (!schoolType) {
        return null;
      }

      return (
        <div className="flex items-center">
          {schoolType.icon && (
            <schoolType.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{schoolType.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "studentCPR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Program choices" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col justify-start min-w-[28rem]">
        {row.original.programs?.items.map((value: any, index: number) => (
          <div key={index} className="flex gap-2">
            <p>{`${index + 1}- `}</p>
            <div className="">{`${value?.program?.name} - ${value?.program?.university?.name}`}</div>
          </div>
        ))}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
