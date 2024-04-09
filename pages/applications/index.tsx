import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { PageComponent } from "../../components/page-component";
import { useEducation } from "../../context/EducationContext";
import { useStudent } from "../../context/StudentContext";
import { Application, Status } from "../../src/API";
import { getStatusOrder } from "../../src/Helpers";
import { BatchSelectorComponent } from "../../components/batch-selector-component";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/ui/applications/data-table-scroll";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { DataTableColumnHeader } from "../../components/ui/applications/data-table-column-header";
import {
  statuses,
  schoolTypes,
} from "../../components/ui/applications/data/data";
import { InfiniteApplications } from "../../components/ui/applications/infinite-applications";
import { useBatchContext } from "../../context/BatchContext";
import { BatchSelector } from "../../components/batch/BatchSelector";

interface InitialFilterValues {
  search: string;
  applicationStatus: string;
  schoolType: string;
  university: string;
  program: string;
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "applications",
        "pageTitles",
        "signIn",
        "applicationLog",
        "common",
        "errors",
      ])),
    },
  };
};

const Applications = () => {
  const initialFilterValues: InitialFilterValues = {
    search: "",
    applicationStatus: "",
    schoolType: "",
    university: "",
    program: "",
  };

  const { applications, applicationsBeingFetched } = useStudent();
  const { batch, setBatch: updateBatch } = useBatchContext();
  const { universityList, programsList } = useEducation();
  const { push, locale } = useRouter();
  const { t } = useTranslation("applications");
  const { t: common } = useTranslation("common");

  // Table Data Pagination
  const elementPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableForward, setDisableForward] = useState(false);
  const [disableBackward, setDisableBackward] = useState(true);
  const [shownData, setShownData] = useState<Application[] | undefined>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application[]>(
    []
  );

  // let selectedApplication: Application[] = [];

  let sortedApplications = applications
    ?.sort(
      (a, b) =>
        (a.student?.householdIncome ?? 0) - (b.student?.householdIncome ?? 0)
    )
    .sort((a, b) => (b.gpa ?? 0) - (a.gpa ?? 0))
    .sort((a, b) => {
      if (a.status && b.status) {
        if (getStatusOrder(b.status) > getStatusOrder(a.status)) return 1;
        if (getStatusOrder(b.status) < getStatusOrder(a.status)) return -1;
      }
      return 0;
    });

  useEffect(() => {
    setNumberOfPages(
      Math.ceil((sortedApplications?.length ?? 0) / elementPerPage)
    );

    return () => {};
  }, [sortedApplications?.length]);

  useEffect(() => {
    setDisableBackward(true);
    setDisableForward(true);

    if (currentPage > 1) {
      setDisableBackward(false);
    }

    if (currentPage < numberOfPages) {
      setDisableForward(false);
    }

    return () => {};
  }, [currentPage, numberOfPages]);

  useEffect(() => {
    function paginate() {
      setShownData(
        sortedApplications?.slice(
          (currentPage - 1) * elementPerPage,
          currentPage * elementPerPage
        )
      );
    }
    paginate();
    return () => {};
  }, [sortedApplications, currentPage]);

  function addToSelected(app: Application) {
    setSelectedApplication([...selectedApplication, app]);
  }
  function removeFromSelected(app: Application) {
    setSelectedApplication(
      selectedApplication.filter((a: Application) => a.id !== app.id)
    );
  }

  function goNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function goPrevPage() {
    setCurrentPage(currentPage - 1);
  }

  // Table Data Pagination

  function filter(values: InitialFilterValues) {
    let filteredApplications = sortedApplications?.filter(
      (element) =>
        (element.student?.fullName
          ?.toLowerCase()
          .includes(values.search.toLowerCase()) ||
          element.studentCPR
            .toLowerCase()
            .includes(values.search.toLowerCase())) &&
        (values.applicationStatus
          ? element.status === values.applicationStatus
          : true) &&
        (values.program
          ? element.programs?.items.find(
              (p) => p?.program?.name === values.program
            )
          : true) &&
        (values.university
          ? element.programs?.items.find(
              (p) => p?.program?.university?.name === values.university
            )
          : true) &&
        (values.schoolType ? element.schoolType === values.schoolType : true)
    );

    setShownData(filteredApplications);
  }

  function resetFilters() {
    setShownData(sortedApplications);
    setSelectedApplication([]);
  }

  const columns: ColumnDef<Application>[] = [
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
          title={t("student")}
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
        <DataTableColumnHeader column={column} title={t("Status")} />
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
            className={`flex gap-2 items-center justify-start ${
              (status.value === Status.WITHDRAWN ||
                status.value === Status.NOT_COMPLETED) &&
              "bg-slate-200"
            } ${status.value === Status.REVIEW && "bg-amber-100"} ${
              status.value === Status.ELIGIBLE &&
              "bg-blue-500 hover:bg-blue-500"
            } ${
              status.value === Status.APPROVED &&
              "bg-green-500 hover:bg-green-500"
            }`}
          >
            {status.icon && <status.icon className={`w-4 h-4`} />}
            <span className="">{t(status.value)}</span>
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
        <DataTableColumnHeader column={column} title={t("tableTitleGpa")} />
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
      accessorKey: "schoolType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("schoolType")} />
      ),
      cell: ({ row }) => {
        const schoolType = schoolTypes.find(
          (schoolType) => schoolType.value === row.getValue("schoolType")
        );

        if (!schoolType) {
          return null;
        }

        return (
          <div className="flex items-center gap-2">
            {schoolType.icon && (
              <schoolType.icon className="w-4 h-4 text-muted-foreground" />
            )}
            <span>{t(schoolType.value)}</span>
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
        <DataTableColumnHeader
          column={column}
          title={t("tableTitleEducation")}
        />
      ),
      cell: ({ row, table }) => (
        <div className="flex flex-col justify-start min-w-[28rem]">
          {row.original.programs?.items
            ?.sort((a, b) => (a?.choiceOrder ?? 0) - (b?.choiceOrder ?? 0))
            .map((value, index: number) => (
              <div key={index} className="flex gap-2">
                <p>{`${index + 1}- `}</p>

                <div className="">{`${
                  (table.options.meta as any)?.locale === "ar"
                    ? value?.program?.nameAr
                    : value?.program?.name
                } - ${
                  (table.options.meta as any)?.locale === "ar"
                    ? value?.program?.university?.nameAr
                    : value?.program?.university?.name
                }`}</div>
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
        <DataTableColumnHeader
          column={column}
          title={t("tableTitleApplicationDate")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {Intl.DateTimeFormat(locale, {
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
        <DataTableColumnHeader
          column={column}
          title={t("tableTitleLastUpdate")}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {Intl.DateTimeFormat(locale, {
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
        <DataTableColumnHeader column={column} title={common("view")} />
      ),
      cell: ({ row }) => (
        <Link href={`/applications/${row.original.id}`}>
          <Button variant={"outline"}>{common("view")}</Button>
        </Link>
      ),
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ];

  return (
    <PageComponent title={"Applications"}>
      <Toaster />
      <div className="flex flex-wrap items-center justify-between mb-8 ">
        <div className="flex flex-col items-start gap-3 ">
          <div className="">
            <div className="text-2xl font-semibold ">
              {t("applicationTitle")}
            </div>
            <div className="text-base font-medium text-gray-500">
              {t("applicationSubtitle")}
            </div>
          </div>
          <Link
            href="/applications/archive"
            className="btn btn-ghost btn-sm text-primary hover:bg-primary/30"
          >
            {t("archives")}
          </Link>
        </div>

        {/* <BatchSelectorComponent
          batch={batch}
          updateBatch={updateBatch}
        ></BatchSelectorComponent> */}
        {/* <BatchSelector /> */}
      </div>

      {/* {applicationsBeingFetched ? (
        <div className="min-h-[12.8rem] flex justify-center items-center animate-pulse bg-black/10 rounded-md">
          <p>{t("loading")}</p>
        </div>
      ) : (
        <DataTable columns={columns} data={applications ?? []}></DataTable>
      )} */}
      <InfiniteApplications></InfiniteApplications>
    </PageComponent>
  );
};

export default Applications;
