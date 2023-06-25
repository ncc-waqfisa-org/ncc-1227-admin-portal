import React from "react";
import { FaUser } from "react-icons/fa";
import { AdminRole } from "../src/API";
import { ADMIN, SUPER_ADMIN } from "../src/Helpers";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/use-auth";
import { useRouter } from "next/router";
interface Props {
  fullName: string;
  userName: string;
  role: AdminRole | null | undefined;
}

export default function UsersCardInfo({ fullName, userName, role }: Props) {
  const isSuperAdmin = role === SUPER_ADMIN;
  const { isSuperAdmin: isAuthSuperAdmin } = useAuth();
  const { push } = useRouter();

  const { t: tCommon } = useTranslation("common");

  return (
    <button
      disabled={!isAuthSuperAdmin}
      onClick={() => {
        push(`/users/editUser/${userName}`);
      }}
      className={`text-start border rounded-xl ${
        isSuperAdmin
          ? "bg-anzac-50 border-anzac-50"
          : "bg-blue-50 border-blue-50"
      } p-4 min-w-56 h-20 flex justify-start items-center overflow-hidden text-ellipsis`}
    >
      {/* row */}
      <div className="flex justify-between gap-4 w-full">
        {/* user icon */}
        <div
          className={`border rounded-lg ${
            isSuperAdmin
              ? "bg-anzac-100 border-anzac-100"
              : "bg-blue-100 border-blue-100"
          } p-2 flex justify-center items-center`}
        >
          <FaUser
            className={isSuperAdmin ? " fill-anzac-400" : "fill-blue-400"}
          />
        </div>
        {/* user information */}
        <div className="grow overflow-hidden ">
          <p className="text-sm font-semibold">{fullName}</p>
          <p className="text-xs font-semibold text-gray-500">#{userName}</p>
          <p className="text-xs font-semibold text-gray-500">
            {isSuperAdmin ? tCommon(SUPER_ADMIN) : tCommon(ADMIN)}
          </p>
        </div>
      </div>
    </button>
  );
}
