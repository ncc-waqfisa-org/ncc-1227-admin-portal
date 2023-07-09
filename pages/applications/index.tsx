import { Field, Form, Formik } from "formik";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Toaster } from "react-hot-toast";
import { BsFillEyeFill } from "react-icons/bs";
import { HiOutlineClipboardList } from "react-icons/hi";
import { PageComponent } from "../../components/page-component";
import { StudentsTableHeaders } from "../../constants/table-headers";
import { useEducation } from "../../context/EducationContext";
import { useStudent } from "../../context/StudentContext";
import { Application, ProgramChoice, SchoolType, Status } from "../../src/API";
import { getStatusOrder } from "../../src/Helpers";
import { BatchSelectorComponent } from "../../components/batch-selector-component";
import { columns } from "../../components/ui/applications/columns";

import {
  TableCaption,
  TableHeader,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
} from "../../components/ui/table";
import { DataTable } from "../../components/ui/applications/data-table";

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

  const { applications, batch, updateBatch, applicationsBeingFetched } =
    useStudent();
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

        <BatchSelectorComponent
          batch={batch}
          updateBatch={updateBatch}
        ></BatchSelectorComponent>
      </div>

      {applicationsBeingFetched ? (
        <div className="min-h-[12.8rem] flex justify-center items-center animate-pulse bg-black/10 rounded-md">
          <p>{t("loading")}</p>
        </div>
      ) : (
        <DataTable columns={columns} data={applications ?? []}></DataTable>
      )}
    </PageComponent>
  );
};

export default Applications;
