import React, { useEffect, useState } from "react";
import {
  BahrainUniversities,
  MasterAppliedUniversities,
  University,
} from "../../src/API";
import { MasterEducationTableHeaders } from "../../constants/table-headers";
import { useTranslation } from "react-i18next";
import { cn } from "../../src/utils";
import { useRouter } from "next/router";

interface Props {
  uniType: "bahrainiUni" | "masterUni";
  university: MasterAppliedUniversities[] | BahrainUniversities[] | undefined;
}

const MasterUniversitiesTable = ({ uniType, university }: Props) => {
  const { t } = useTranslation("education");
  const { push, locale } = useRouter();

  // Table Data Pagination
  const elementPerPage = 10;
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableForward, setDisableForward] = useState(false);
  const [disableBackward, setDisableBackward] = useState(true);
  const [shownData, setShownData] = useState<University[] | undefined>([]);

  const [resultList, setResultList] = useState<any>([]);

  useEffect(() => {
    setNumberOfPages(Math.ceil((resultList?.length ?? 0) / elementPerPage));

    return () => {};
  }, [resultList]);

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
      const tempShowData = resultList?.slice(
        (currentPage - 1) * elementPerPage,
        currentPage * elementPerPage
      );
      setShownData(tempShowData);
    }

    paginate();

    return () => {};
  }, [currentPage, resultList]);

  function goNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function goPrevPage() {
    setCurrentPage(currentPage - 1);
  }

  return (
    <div>
      <div className="w-full overflow-x-auto border rounded-xl">
        <table className="table w-full border-b table-auto">
          <thead className="">
            <tr>
              {MasterEducationTableHeaders.map((title, index) => (
                <th className=" bg-nccGray-100" key={index}>
                  {t(title)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {university
              ?.sort((a, b) => {
                let bD = b.isDeactivated === true ? -1 : 1;
                return bD;
              })
              .map((datum: any, index: number) => (
                <tr
                  key={index}
                  className={cn(
                    `hover:bg-anzac-50 hover:text-anzac-500`,
                    index % 2 !== 0 && "bg-anzac-50",
                    datum.isDeactivated && " bg-gray-200"
                  )}
                >
                  <td
                    key={`${datum.id}-isDeactivated`}
                    className="bg-transparent"
                  >
                    <div
                      className={`flex justify-between hover:cursor-pointer ${
                        datum.isDeactivated && "text-gray-400"
                      }`}
                      onClick={() =>
                        push(
                          uniType === "bahrainiUni"
                            ? `education/universities/masters/${datum.id}?type=bahrainiUni`
                            : `education/universities/masters/${datum.id}?type=masterUni`
                        )
                      }
                    >{`${
                      locale == "ar"
                        ? datum.universityNameAr ?? "-"
                        : datum.universityName
                    }`}</div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* fake pagination */}
        <div className="flex justify-center my-4 ">
          <div className="join">
            <button
              className="btn btn-accent join-item text-anzac-500"
              onClick={goPrevPage}
              disabled={disableBackward}
            >
              «
            </button>
            <button
              disabled
              className="btn hover:cursor-auto join-item disabled:btn-accent"
            >
              {currentPage}
            </button>
            <button
              className="btn btn-accent join-item text-anzac-500"
              onClick={goNextPage}
              disabled={disableForward}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterUniversitiesTable;
