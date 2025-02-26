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

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { MasterScholarship, ScholarshipStatus } from "../../src/API";
import { useBatchContext } from "../../context/BatchContext";

import { Checkbox } from "../ui/checkbox";

import { DataTableColumnHeader } from "../ui/applications/data-table-column-header";
import { scholarshipStatuses } from "../ui/applications/data/data";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  listAllMastersScholarshipsOfBatch,
  listAllScholarshipsOfBatch,
} from "../../src/CustomAPI";
import { cn } from "../../src/utils";

interface TInfiniteMastersScholarships {
  items: MasterScholarship[];
  nextToken: string | null;
}

export const InfiniteMastersScholarships = () => {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [rowSelection, setRowSelection] = React.useState({});
  const {
    batch,
    masterScholarshipsData,
    setMasterScholarshipsData,
    nextMasterScholarshipsKey,
    setNextMasterScholarshipsKey,
    isMasterScholarshipsInitialFetching,
  } = useBatchContext();

  const [isFetching, setIsFetching] = useState(false);

  const { t } = useTranslation("scholarships");
  const { t: common } = useTranslation("common");
  const { locale } = useRouter();

  const columns = React.useMemo<ColumnDef<MasterScholarship>[]>(
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
            className="translate-y-[2px] mx-3 my-auto "
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
          <DataTableColumnHeader column={column} title={t("studentCPR")} />
        ),
        cell: ({ row }) => (
          <Link
            href={`/scholarships/masters/${row.original.id}`}
            className="my-auto hover:text-anzac-400"
          >
            <div className="">{row.getValue("studentCPR")}</div>
            <p className="font-medium">
              {row.original.application?.studentName}
            </p>
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
          <DataTableColumnHeader
            column={column}
            title={t("scholarshipStatus")}
          />
        ),
        cell: ({ row }) => {
          const status = scholarshipStatuses.find(
            (status) => status.value === row.getValue("status")
          );

          if (!status) {
            return null;
          }

          return (
            <Badge
              variant={"outline"}
              className={`flex h-fit my-auto  w-fit items-center justify-start ${
                status.value === ScholarshipStatus.WITHDRAWN && "bg-slate-200"
              } ${
                status.value === ScholarshipStatus.PENDING &&
                "bg-amber-100 border-amber-300 "
              } ${
                status.value === ScholarshipStatus.REJECTED &&
                "border-red-300 text-red-600 bg-red-50"
              } ${
                status.value === ScholarshipStatus.APPROVED &&
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
        accessorKey: "isConfirmed",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("isConfirmed")} />
        ),
        cell: ({ row }) => (
          <Badge
            variant={"outline"}
            className={cn(
              "h-fit my-auto ",
              row.getValue("isConfirmed")
                ? "border-green-400 bg-green-50 text-green-600"
                : "bg-amber-100 border-amber-300 "
            )}
          >
            {row.getValue("isConfirmed") ? t("yes") : t("no")}
          </Badge>
        ),

        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "IBANLetterDoc",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("bankDetailsAdded")}
          />
        ),
        cell: ({ row }) => (
          <Badge variant={"outline"} className="my-auto h-fit">
            {row.getValue("IBANLetterDoc") ? t("yes") : t("no")}
          </Badge>
        ),

        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "signedContractDoc",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("signedContract")} />
        ),
        cell: ({ row }) => (
          <Badge variant={"outline"} className="my-auto h-fit">
            {row.getValue("signedContractDoc") ? t("yes") : t("no")}
          </Badge>
        ),

        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("createdAt")} />
        ),
        cell: ({ row }) => (
          <Badge variant={"outline"} className="my-auto h-fit">
            <span className="font-medium truncate ">
              {Intl.DateTimeFormat(locale, {
                timeStyle: "short",
                dateStyle: "medium",
              }).format(new Date(row.original.createdAt))}
            </span>
          </Badge>
        ),
        size: 200,
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
          <Link href={`/scholarships/masters/${row.original.id}`}>
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

  const fetchScholarships = useCallback(
    async (nextKey: string | null) => {
      setIsFetching(true);

      const fetchedData = (await listAllMastersScholarshipsOfBatch({
        batch,
        nextToken: nextKey,
      }).finally(() => {
        setIsFetching(false);
      })) as TInfiniteMastersScholarships;

      setMasterScholarshipsData((old) => [...old, ...fetchedData.items]);
      setNextMasterScholarshipsKey(fetchedData.nextToken);
      return fetchedData;
    },
    [batch, setNextMasterScholarshipsKey, setMasterScholarshipsData]
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
          !isMasterScholarshipsInitialFetching &&
          nextMasterScholarshipsKey
        ) {
          fetchScholarships(nextMasterScholarshipsKey);
        }
      }
    },
    [
      fetchScholarships,
      isFetching,
      isMasterScholarshipsInitialFetching,
      nextMasterScholarshipsKey,
    ]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: masterScholarshipsData,
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

  // //scroll to top of table when sorting changes
  // const handleScholarshipStatusChange = (updater: string) => {
  //   // setSorting(updater);
  //   // setSelectedScholarshipStatus(updater);
  //   // if (!!table.getRowModel().rows.length) {
  //   //   rowVirtualizer.scrollToIndex?.(0);
  //   // }
  // };
  // const handleBatchChange = (updater: string) => {
  //   // setSorting(updater);
  //   // setSelectedBatch(updater);

  //   if (!!table.getRowModel().rows.length) {
  //     rowVirtualizer.scrollToIndex?.(0);
  //   }
  // };

  const { rows } = table.getRowModel();

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

  if (isMasterScholarshipsInitialFetching) {
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
        {/* <BatchScholarshipsToolbar
          handleScholarshipStatusChange={handleScholarshipStatusChange}
          selectedScholarshipStatus={selectedScholarshipStatus}
          handleBatchChange={handleBatchChange}
          table={table}
        /> */}
      </div>
      {/* <DataTableToolbar table={table} /> */}
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
                const row = rows[virtualRow.index] as Row<MasterScholarship>;
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
