import React from "react";
import { FaUser } from "react-icons/fa";
interface Props {
  fullName: string;
  userName: string;
}

export default function UsersCardInfo({ fullName, userName }: Props) {
  return (
    <div className=" border rounded-xl bg-anzac-50 border-anzac-50 p-4 min-w-56 h-20 flex justify-start items-center overflow-hidden text-ellipsis">
      {/* row */}
      <div className=" flex justify-between gap-4 w-full">
        {/* user icon */}
        <div className=" border  rounded-lg bg-anzac-100 border-anzac-100 p-2 flex justify-center items-center">
          <FaUser className=" fill-anzac-400" />
        </div>
        {/* user information */}
        <div className="grow overflow-hidden ">
          <p className=" text-sm font-semibold">{fullName}</p>
          <p className=" text-xs font-semibold text-gray-500">#{userName}</p>
        </div>
      </div>
    </div>
  );
}
