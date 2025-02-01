//3 TanStack Libraries!!!
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import React, { useCallback, useState } from "react";
import {
  InfiniteApplication,
  InfiniteMasterApplication,
  NextStartKey,
  TInfiniteApplications,
  TInfiniteMasterApplications,
} from "./infinite-applications-type";
import { Checkbox } from "../checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Button } from "../button";
import { useAuth } from "../../../hooks/use-auth";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { BatchApplicationsToolbar } from "./batch-applications-toolbar";
import { Badge } from "../badge";
import { useBatchContext } from "../../../context/BatchContext";
import { schoolTypes, statuses } from "./data/data";
import { Status } from "../../../src/API";
import { FiAlertCircle, FiCircle } from "react-icons/fi";
import { Program } from "../../../src/models";
import { DataTableToolbar } from "./data-table-toolbar";
import { BatchMasterApplicationsToolbar } from "./batch-master-applications-toolbar";

export const InfiniteMasterApplications = () => {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [rowSelection, setRowSelection] = React.useState({});
  const {
    mastersBatch: selectedBatch,
    selectedApplicationsStatus: selectedStatus,
    setSelectedApplicationsStatus: setSelectedStatus,
    setMasterApplicationsData,
    masterApplicationsData,
    nextMasterApplicationsKey,
    setNextMasterApplicationsKey,
    isMasterInitialFetching,
  } = useBatchContext();

  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");

  const { t } = useTranslation("applications");
  const { t: common } = useTranslation("common");
  const { locale } = useRouter();

  const { token } = useAuth();

  const columns = React.useMemo<ColumnDef<InfiniteMasterApplication>[]>(
    () => [
      {
        id: "select",
        size: 40,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px] mx-3"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px] mx-3"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
      },
      {
        accessorKey: "studentCPR",
        size: 300,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("student")}
            // className="min-w-[13rem]"
          />
        ),
        cell: ({ row }) => (
          <Link
            href={`/applications/masters/${row.original.id}`}
            className=" hover:text-anzac-400"
          >
            <p className="font-semibold">{row.original.studentName}</p>
            <div className="">{row.getValue("studentCPR")}</div>
          </Link>
        ),
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
      },
      {
        accessorKey: "status",
        enableSorting: false,
        enableHiding: false,
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
                // status.value === Status.REJECTED ||
                // status.value === Status.ELIGIBLE ||
                // status.value === Status.APPROVED
                //   ? "destructive"
                //   : "outline"
                "outline"
              }
              className={`flex h-fit w-fit items-center justify-start ${
                (status.value === Status.WITHDRAWN ||
                  status.value === Status.NOT_COMPLETED) &&
                "bg-slate-200"
              } ${
                status.value === Status.REVIEW &&
                "bg-amber-100 border-amber-300 "
              } ${
                status.value === Status.REJECTED &&
                "border-red-300 text-red-600 bg-red-50"
              } ${
                status.value === Status.ELIGIBLE &&
                "border-blue-300 text-blue-600 bg-blue-50"
              } ${
                status.value === Status.APPROVED &&
                "border-green-400 bg-green-50 text-green-600"
              }`}
            >
              {status.icon && <status.icon className="w-6 h-6 p-1 me-2" />}
              <span className="min-w-fit">
                {locale === "ar" ? status.arLabel : status.label}
              </span>
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },

      {
        size: 100,
        accessorKey: "attentionNeeded",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("tableTitleAttention")}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex w-full space-x-2">
              <span className="font-medium truncate ">
                {!row.original.isIncomeVerified ||
                !row.original.verifiedGPA ||
                !row.original.adminPoints ? (
                  <FiAlertCircle className="text-warning" />
                ) : (
                  <FiCircle className="text-gray-300" />
                )}
              </span>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        size: 60,
        accessorKey: "score",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("tableTitleScore")} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue("score")}
              </span>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "verifiedGPA",

        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("tableTitleVerifiedGpa")}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="font-medium truncate ">
                {row.getValue("verifiedGPA") === 0
                  ? "-"
                  : row.getValue("verifiedGPA") ?? "-"}
              </span>
            </div>
          );
        },
        size: 110,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "gpa",
        size: 60,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("tableTitleGpa")} />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="font-medium truncate ">
                {row.getValue("gpa")}
              </span>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "program",
        size: 100,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("program")} />
        ),
        cell: ({ row }) => {
          // const program = program.find(
          //   (schoolType) => schoolType.value === row.getValue("program")
          // );

          // if (!schoolType) {
          //   return null;
          // }

          if (!row.getValue("program")) {
            return null;
          }

          return <div className="flex items-center">{"program"}</div>;
          // return (
          //   <div className="flex items-center">
          //     {schoolType.icon && (
          //       <schoolType.icon className="w-4 h-4 me-2 text-muted-foreground" />
          //     )}
          //     <span>
          //       {locale === "ar" ? schoolType.arLabel : schoolType.label}
          //     </span>
          //   </div>
          // );
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "dateTime",
        size: 200,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("tableTitleApplicationDate")}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="font-medium truncate ">
                {Intl.DateTimeFormat(locale, {
                  timeStyle: "short",
                  dateStyle: "medium",
                }).format(new Date(row.original.dateTime))}
              </span>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "updatedAt",
        size: 200,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("tableTitleLastUpdate")}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="font-medium truncate ">
                {Intl.DateTimeFormat(locale, {
                  timeStyle: "short",
                  dateStyle: "medium",
                }).format(new Date(row.original.updatedAt))}
              </span>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "view",
        size: 100,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={common("view")} />
        ),
        cell: ({ row }) => (
          <Link href={`/applications/masters/${row.original.id}`}>
            <Button variant={"outline"}>{common("view")}</Button>
          </Link>
        ),
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
      },
    ],
    [common, locale, t]
  );

  const fetchApplications = useCallback(
    async (nextKey: NextStartKey) => {
      const next = nextKey ? `&startKey=${JSON.stringify(nextKey)}` : "";
      const batchQuery = selectedBatch ? `batch=${selectedBatch}` : "";
      const statusQuery = selectedStatus ? `&status=${selectedStatus}` : "";
      setIsFetching(true);

      const fetchedData = (await fetch(
        `${process.env.NEXT_PUBLIC_LAMBDA_GET_MASTERS_APPLICATION}?${batchQuery}${statusQuery}${next}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((d) => d.json())
        .catch((err) => console.log(err))
        .finally(() => {
          setIsFetching(false);
        })) as TInfiniteMasterApplications;

      setMasterApplicationsData((old) => [...old, ...fetchedData.data]);
      setNextMasterApplicationsKey(fetchedData.nextStartKey);
      return fetchedData;
    },
    [
      selectedBatch,
      selectedStatus,
      token,
      setMasterApplicationsData,
      setNextMasterApplicationsKey,
    ]
  );

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          !isMasterInitialFetching &&
          nextMasterApplicationsKey
        ) {
          fetchApplications(nextMasterApplicationsKey);
        }
      }
    },
    [
      fetchApplications,
      isFetching,
      isMasterInitialFetching,
      nextMasterApplicationsKey,
    ]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: masterApplicationsData,
    columns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    debugTable: true,
    enableRowSelection: true,
    enablePinning: true,
    meta: {
      locale: locale ?? "en",
    },
  });

  //scroll to top of table when sorting changes
  const handleStatusChange = (updater: string) => {
    setSelectedStatus(updater);
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };
  const handleBatchChange = (updater: string) => {
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };
  const handleSearchChange = (updater: string) => {
    setSearch(updater);
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  const { rows } = table?.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 56, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  if (isMasterInitialFetching) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96">
        <p className="flex items-center gap-3">
          <span className="loading"></span> {t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <BatchMasterApplicationsToolbar
          handleStatusChange={handleStatusChange}
          selectedStatus={selectedStatus}
          handleBatchChange={handleBatchChange}
          // handleSearchChange={handleSearchChange}
          masterTable={table}
        />
      </div>
      {/* <DataTableToolbar table={table} />x */}
      <div
        className=" border rounded-md overflow-auto relative h-[600px] space-y-4"
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table className="relative text-sm">
          <TableHeader
            className="grid pt-4 bg-background"
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className=""
                key={headerGroup.id}
                style={{ display: "flex", width: "100%" }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        display: "flex",
                        width: header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: "relative", //needed for absolute positioning of rows
            }}
          >
            {rowVirtualizer.getVirtualItems().length > 0 ? (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[
                  virtualRow.index
                ] as Row<InfiniteMasterApplication>;
                return (
                  <TableRow
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    key={row.id}
                    style={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: "100%",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            display: "flex",
                            width: cell.column.getSize(),
                          }}
                          className="items-center"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {common("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
      {isFetching && (
        <div className="flex gap-2 p-2 mx-auto border rounded-md w-fit">
          <span className="loading"></span>
          {common("fetchingMore")}
        </div>
      )}
    </div>
  );
};
