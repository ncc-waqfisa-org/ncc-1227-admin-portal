import React, { FC } from "react";
import { cn } from "../src/lib/utils";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type Props = {
  onChange: (type: "bahrainiUni" | "masterUni") => void;
  type: "bahrainiUni" | "masterUni";
};

export const MasterUniTabs: FC<Props> = ({ type, onChange }) => {
  const { t: tCommon } = useTranslation("common");

  return (
    <>
      <Tabs
        className="w-full"
        defaultValue={type}
        value={type}
        onValueChange={(value) => {
          const t: "bahrainiUni" | "masterUni" = value
            ? (value as "bahrainiUni" | "masterUni")
            : "bahrainiUni";
          onChange(t);
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="bahrainiUni">
            {tCommon("bahrainiUnis")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="masterUni">
            {tCommon("mastersUnis")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className=" py-4 text-sm text-muted-foreground">
        {type === "bahrainiUni"
          ? tCommon("bahrainiUnisDescription")
          : tCommon("mastersUnisDescription")}
      </div>
    </>
  );
};
