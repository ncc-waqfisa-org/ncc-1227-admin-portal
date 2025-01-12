import { FC, PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../hooks/use-auth";
import NavbarComponent from "./navbar-component";
import SignInFormComponent from "./sign-in-form-component";

import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
}

export const PageComponent: FC<PropsWithChildren<Props>> = (props) => {
  const { isSignedIn, user, isInitializing: init } = useAuth();

  const { t: tCommon } = useTranslation("common");

  const isInitializing = init ?? true;

  return (
    <div>
      <Toaster
        toastOptions={{
          className: "ltr",
        }}
      />

      <div className="fixed top-0 left-0 z-50 shadow-lg navbar lg:hidden bg-nccGray-50 shadow-black/5">
        <div className="flex-none">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button rounded-xl lg:hidden"
          >
            <GiHamburgerMenu className=" fill-white" />
          </label>
        </div>
        <div className="flex-1">
          <Image
            className="h-16"
            src="/logo.svg"
            alt="logo"
            width={200}
            height={100}
          />
        </div>
        <div className="flex flex-col items-center justify-center p-3 text-center rounded-lg bg-zinc-100">
          <p className="text-zinc-500">{user?.getUsername()}</p>
        </div>
      </div>
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer-2"
          type="checkbox"
          className="drawer-toggle"
          title="pageComponent"
        />

        <div className="drawer-content">
          {isInitializing ? (
            <div className="flex items-center justify-center flex-col w-full h-[100svh] bg-gray-200 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="loading"></span>
                {` ${tCommon("loading")} `}
              </div>
            </div>
          ) : (
            <div>
              {!isSignedIn ? (
                <SignInFormComponent></SignInFormComponent>
              ) : (
                user?.challengeName !== "NEW_PASSWORD_REQUIRED" && (
                  <div className="m-4">
                    <div className="container px-6 mx-auto mt-24 md:px-10 lg:px-16 ">
                      {props.children}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {isSignedIn && (
          <div className="z-10 drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <NavbarComponent></NavbarComponent>
          </div>
        )}
      </div>
    </div>
  );
};
