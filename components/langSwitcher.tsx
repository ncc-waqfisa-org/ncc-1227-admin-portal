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
        className="btn btn-outline hover:bg-primary/10 hover:text-black"
      >
        {!isEnglish ? "English" : "عربي"}
      </button>
    </div>
  );
};
