import { useTranslation } from "next-i18next";
import React from "react";

interface Props {
  searchChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export default function SearchBarComponent(props: Props) {
  function name(event: any) {
    if (event.key === "Enter") {
      props.onSubmit(event.target.value);
    }
  }
  const { t } = useTranslation("common");
  return (
    <div className=" w-full">
      <input
        type="search"
        className="input input-bordered w-full"
        onChange={(event) => props.searchChange(event.target.value)}
        onKeyDown={(event) => name(event)}
        placeholder={`${t('search')}...` ?? "Search..."}
      />
    </div>
  );
}
