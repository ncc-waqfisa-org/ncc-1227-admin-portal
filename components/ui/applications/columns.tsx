import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "../checkbox";

import { schoolTypes, statuses } from "./data/data";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Application, Status } from "../../../src/API";
import { Badge } from "../badge";
import Link from "next/link";
import { Button } from "../button";

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
    enablePinning: true,
  },
  {
    accessorKey: "studentCPR",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Student"
        className="min-w-[10rem]"
      />
    ),
    cell: ({ row }) => (
      <Link
        href={`/applications/${row.original.id}`}
        className="min-w-[10rem] hover:text-anzac-400"
      >
        <p className="font-semibold">{row.original.student?.fullName}</p>
        <div className="">{row.getValue("studentCPR")}</div>
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
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
        <Badge
          variant={
            status.value === Status.REJECTED ||
            status.value === Status.ELIGIBLE ||
            status.value === Status.APPROVED
              ? "destructive"
              : "outline"
          }
          className={`flex items-center justify-start ${
            (status.value === Status.WITHDRAWN ||
              status.value === Status.NOT_COMPLETED) &&
            "bg-slate-200"
          } ${status.value === Status.REVIEW && "bg-amber-100"} ${
            status.value === Status.ELIGIBLE && "bg-blue-500"
          } ${status.value === Status.APPROVED && "bg-green-500"}`}
        >
          {status.icon && <status.icon className="w-4 h-4 mr-2" />}
          <span className="">{status.label}</span>
        </Badge>
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
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("gpa")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isEmailSent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Sent" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge
            variant={row.original.isEmailSent ? "default" : "outline"}
            className="max-w-[500px] truncate font-medium"
          >
            {row.original.isEmailSent ? "Yes" : "No"}
          </Badge>
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
            <schoolType.icon className="w-4 h-4 mr-2 text-muted-foreground" />
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
    id: "programs",
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
    accessorKey: "dateTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Application date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {Intl.DateTimeFormat("en", {
              timeStyle: "short",
              dateStyle: "medium",
            }).format(new Date(row.original.dateTime))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last updated" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {Intl.DateTimeFormat("en", {
              timeStyle: "short",
              dateStyle: "medium",
            }).format(new Date(row.original.updatedAt))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "view",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="View" />
    ),
    cell: ({ row }) => (
      <Link href={`/applications/${row.original.id}`}>
        <Button variant={"outline"}>View</Button>
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
