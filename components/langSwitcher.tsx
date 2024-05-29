import { useRouter } from "next/router";
import React from "react";

export const LangSwitcher = () => {
  const { locale, asPath, push } = useRouter();

  let isEnglish = locale === "en";

  function handleSwitch() {
    let toLocale = !isEnglish ? "en" : "ar";
    push(asPath, asPath, { locale: toLocale });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSwitch}
        className="px-4 py-2 text-sm duration-200 border rounded-lg ltr:pb-3 ltr:leading-3 hover:bg-primary/5 hover:text-black"
      >
        {!isEnglish ? "English" : "عربي"}
      </button>
    </div>
  );
};
