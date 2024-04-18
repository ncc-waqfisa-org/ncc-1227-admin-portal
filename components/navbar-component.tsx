import React from "react";
import NavBarButton from "./navbar-button";
import Image from "next/image";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "react-i18next";
import { LangSwitcher } from "./langSwitcher";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  FiStar,
  FiCalendar,
  FiBriefcase,
  FiUsers,
  FiMessageCircle,
  FiBook,
  FiGrid,
  FiUser,
} from "react-icons/fi";

export default function NavbarComponent() {
  const { signOut, isSignedIn, user, admin, isSuperAdmin } = useAuth();
  const { t } = useTranslation("pageTitles");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  function goBack() {
    router.back();
  }

  return (
    <div className="flex flex-col h-[100svh] w-full max-w-64 justify-between  p-4 py-24 bg-nccGray-50">
      <div className="flex flex-col gap-4">
        {!isHomePage && (
          <button className="btn btn-ghost" onClick={goBack}>
            {t("Back")}
          </button>
        )}
        <div className="max-w-[200px] flex justify-center">
          <LangSwitcher></LangSwitcher>
        </div>
        <Link href="/" className=" max-w-[200px] ">
          <Image
            className=""
            src="/logo.svg"
            alt="logo"
            width={200}
            height={100}
          />
        </Link>
        <div
          className={`flex flex-col items-center justify-center p-3 text-center rounded-lg ${
            isSuperAdmin ? "bg-anzac-100" : "bg-blue-100"
          }`}
        >
          <p
            className={`${
              isSuperAdmin ? "text-anzac-500" : "text-blue-500"
            } text-xs`}
          >
            {isSuperAdmin ? tCommon("SUPER_ADMIN") : tCommon("ADMIN")}
          </p>
          <p className={isSuperAdmin ? "text-anzac-500" : "text-blue-500"}>
            {admin?.fullName}
          </p>
          <p className={isSuperAdmin ? "text-anzac-500" : "text-blue-500"}>
            {user?.getUsername()}
          </p>
        </div>

        <NavBarButton
          name={t("Dashboard")}
          icon={
            <FiGrid className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
          }
          linkTo={"/"}
        ></NavBarButton>
        <NavBarButton
          name={t("Applications")}
          icon={
            <FiBriefcase className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
          }
          linkTo={"/applications"}
        ></NavBarButton>
        <NavBarButton
          name={t("Education")}
          icon={
            <FiBook className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
          }
          linkTo={"/education"}
        ></NavBarButton>
        <NavBarButton
          name={t("Students")}
          icon={
            <FiUsers className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
          }
          linkTo={"/students"}
        ></NavBarButton>
        {isSuperAdmin && (
          <NavBarButton
            name={t("Admins")}
            icon={
              <FiUser className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
            }
            linkTo={"/users"}
          ></NavBarButton>
        )}
        {isSuperAdmin && (
          <NavBarButton
            name={t("Batches")}
            icon={
              <FiCalendar className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
            }
            linkTo={"/batches"}
          ></NavBarButton>
        )}
        <NavBarButton
          name={t("Scholarships")}
          icon={
            <FiStar className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
          }
          linkTo={"/scholarships"}
        ></NavBarButton>
        {/* <NavBarButton
          name={t("Logs")}
          icon={
            <HiOutlineClipboardList className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
          }
          linkTo={"/adminLogs"}
        ></NavBarButton> */}
        <NavBarButton
          name={t("Support")}
          disabled
          icon={
            <FiMessageCircle className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
          }
          linkTo={"https://app.crisp.chat/"}
          target={"_blank"}
        ></NavBarButton>
      </div>

      {!isSignedIn ? (
        <></>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-start px-4 py-2 text-sm w-52 text-gray rounded-xl hover:cursor-pointer">
            <Image
              src={"/logout_icon.svg"}
              alt={"Log out icon"}
              width={20}
              height={20}
            />
            <button className="ltr:pl-4 rtl:pr-4" onClick={signOut}>
              {t("signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
