import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/use-auth";
import Link from "next/link";
import Image from "next/image";
import { LangSwitcher } from "../langSwitcher";
import { ProgramTypeSwitcher } from "../program_type/ProgramTypeSwitcher";
import {
  ApplicationsIcon,
  BatchesIcon,
  DashboardIcon,
  UniversitiesIcon,
} from "../icons";
import { FiStar, FiUser } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { cn } from "../../src/utils";
import { GiNextButton } from "react-icons/gi";
import { Button } from "../ui/button";

export function AppSidebar() {
  const { signOut, isSignedIn, user, admin, isSuperAdmin } = useAuth();
  const { t } = useTranslation("pageTitles");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  function goBack() {
    router.back();
  }

  // Menu items.
  const items = [
    {
      title: t("Dashboard"),
      url: "/",
      icon: (
        <DashboardIcon className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
      ),
    },
    {
      title: t("Applications"),
      url: "/applications",
      icon: (
        <ApplicationsIcon className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
      ),
    },
    {
      title: t("Universities"),
      url: "/education",
      icon: (
        <UniversitiesIcon className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
      ),
    },
    {
      title: t("Applicants"),
      url: "/students",
      icon: (
        <ApplicationsIcon className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
      ),
    },
    {
      title: t("Scholarships"),
      url: "/scholarships",
      icon: (
        <FiStar className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
      ),
    },
  ];

  const superItems = [
    {
      title: t("Batches"),
      url: "/batches",
      icon: (
        <BatchesIcon className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
      ),
    },
    {
      title: t("Admins"),
      url: "/users",
      icon: (
        <FiUser className="w-5 h-5 stroke-gray hover:stroke-anzac-500 hover:cursor-pointer" />
      ),
    },
  ];

  return (
    <Sidebar side={router.locale === "en" ? "left" : "right"}>
      <SidebarHeader className="flex flex-col gap-4 p-3 py-10">
        <Link href="/" className="max-w-[200px] mx-auto">
          <Image
            className=""
            src="/logo.svg"
            alt="logo"
            width={200}
            height={100}
          />
        </Link>
        <div className="flex gap-3 items-center">
          {!isHomePage && (
            <Button
              className="flex-1"
              size={"sm"}
              variant={"outline"}
              onClick={goBack}
            >
              {t("Back")}
            </Button>
          )}
          <LangSwitcher className="flex-1"></LangSwitcher>
        </div>
        <ProgramTypeSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className={cn(
                    "flex justify-start px-4 py-2 text-sm rounded-xl  text-gray hover:bg-anzac-100 hover:border-anzac-100 hover:text-anzac-500 hover:cursor-pointer",
                    (item.url != "/"
                      ? router.pathname.startsWith(item.url)
                      : item.url === router.pathname) &&
                      "bg-anzac-50 border-anzac-200 border text-anzac-500"
                  )}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("superAdmins")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      "flex justify-start px-4 py-2 text-sm rounded-xl text-gray hover:bg-anzac-100 hover:border-anzac-100 hover:text-anzac-500 hover:cursor-pointer"
                    )}
                    asChild
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {isSignedIn && (
        <SidebarFooter>
          <div className="flex flex-col">
            <div className="flex justify-start px-4 py-2 w-52 text-sm rounded-xl text-gray hover:cursor-pointer">
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
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
