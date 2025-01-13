import React, { FC } from "react";
import { cn } from "../src/lib/utils";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type Props = {
  onChange: (type: "masters" | "bachelor") => void;
  type: "masters" | "bachelor";
  isBachelorDisabled?: boolean;
  isMasterDisabled?: boolean;
};

export const BMTabs: FC<Props> = ({
  type,
  onChange,
  isMasterDisabled = false,
  isBachelorDisabled = false,
}) => {
  const { t: commonT } = useTranslation("common");

  return (
    <Tabs
      className="w-full"
      defaultValue={type}
      value={type}
      onValueChange={(value) => {
        const t: "masters" | "bachelor" = value
          ? (value as "masters" | "bachelor")
          : "bachelor";
        onChange(t);
      }}
    >
      <TabsList className="w-full">
        <TabsTrigger
          className="flex-1"
          disabled={isBachelorDisabled}
          value="bachelor"
        >
          {commonT("bachelor")}
        </TabsTrigger>
        <TabsTrigger
          className="flex-1"
          disabled={isMasterDisabled}
          value="masters"
        >
          {commonT("masters")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
