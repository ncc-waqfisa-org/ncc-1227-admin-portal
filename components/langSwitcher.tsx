import { useRouter } from "next/router";
import React from "react";
import { cn } from "../src/utils";
import { Button } from "./ui/button";

export const LangSwitcher = ({ className }: { className?: string }) => {
  const { locale, asPath, push } = useRouter();

  let isEnglish = locale === "en";

  function handleSwitch() {
    let toLocale = !isEnglish ? "en" : "ar";
    push(asPath, asPath, { locale: toLocale });
  }

  return (
    <Button
      type="button"
      size={"sm"}
      variant={"outline"}
      onClick={handleSwitch}
      className={cn(
        "px-4 py-2 text-sm rounded-lg border duration-200 ltr:pb-3 ltr:leading-3 hover:bg-primary/5 hover:text-black",
        className
      )}
    >
      {!isEnglish ? "English" : "عربي"}
    </Button>
  );
};
