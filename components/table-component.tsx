import EventEmitter from "events";
import React from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { HiDotsVertical, HiOutlineClipboardList } from "react-icons/hi";

interface Props {
  headers: String[];
  data?: TableData[];
  viewClick: (event: any) => {};
  historyClick: (event: any) => {};
}

export interface TableData {
  id: string;
  data: any;
}

export default function TableComponent({
  headers,
  data,
  viewClick,
  historyClick,
}: Props) {
  return (
    <div>
      <div className="w-full h-screen overflow-x-auto">
        <table className="table w-full ">
          <thead className="border  rounded-xl border-nccGray-100">
            <tr>
              {headers.map((title, index) => (
                <th className=" bg-nccGray-100" key={index}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((datum, index) => (
              <tr key={index}>
                <th key={datum?.id}>
                  <label>
                    <input
                      title="Select"
                      type="checkbox"
                      className="checkbox"
                    />
                  </label>
                </th>
                {datum?.data.map((hi: any, index: number) => (
                  <td key={index}>
                    <div className="flex justify-between ">{`${hi}`}</div>
                  </td>
                ))}

                <td>
                  <button className="relative btn btn-ghost btn-xs group">
                    <HiDotsVertical />
                    <div className="absolute flex-col hidden p-1 bg-white rounded-lg shadow-lg  right-6 top-5 group-focus:flex min-w-min">
                      <div
                        className="flex justify-start w-24 gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                        onClick={() => viewClick(datum?.id)}
                      >
                        <BsFillEyeFill />
                        View
                      </div>
                      <div
                        className="flex justify-start w-24 gap-2 btn btn-ghost btn-xs hover:bg-anzac-100 hover:cursor-pointer hover:text-anzac-500"
                        onClick={() => {
                          historyClick;
                        }}
                      >
                        <HiOutlineClipboardList />
                        History
                      </div>
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
}
