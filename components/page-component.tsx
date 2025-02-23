import { FC, PropsWithChildren, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import SignInFormComponent from "./sign-in-form-component";

import { useTranslation } from "react-i18next";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./dashboard_layout/app-sidebar";
import { cn } from "../src/utils";

interface Props {
  title: string;
}

export const PageComponent: FC<PropsWithChildren<Props>> = (props) => {
  const { isSignedIn, user, isInitializing: init, refreshToken } = useAuth();

  useEffect(() => {
    refreshToken();

    return () => {};
  }, []);

  const { t: tCommon } = useTranslation("common");

  const isInitializing = init ?? true;

  return (
    <SidebarProvider>
      {isSignedIn && <AppSidebar />}
      <main className="flex-1 overflow-clip">
        {isSignedIn && (
          <div
            className={cn(
              "flex isolate sticky top-0 gap-2 items-center p-4 bg-white border-b border-gray-200 z-[999]"
            )}
          >
            <SidebarTrigger className="px-2 min-w-fit">
              <p>{tCommon("sidebar")}</p>
            </SidebarTrigger>
          </div>
        )}

        {isInitializing ? (
          <div className="flex items-center justify-center flex-col w-full h-[100svh] bg-gray-200 animate-pulse">
            <div className="flex gap-2 items-center">
              <span className="loading"></span>
              {` ${tCommon("loading")} `}
            </div>
          </div>
        ) : !isSignedIn ? (
          <SignInFormComponent></SignInFormComponent>
        ) : (
          // Authorized -> Content
          user?.challengeName !== "NEW_PASSWORD_REQUIRED" && (
            <div className="container px-6 mx-auto mt-14 md:px-10 lg:px-16">
              {props.children}
            </div>
          )
        )}
      </main>
    </SidebarProvider>
  );
};
