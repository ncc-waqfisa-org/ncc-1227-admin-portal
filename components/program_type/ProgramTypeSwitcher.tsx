import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "../ui/select";

const types = ["bachelor", "masters"];

export const ProgramTypeSwitcher = ({ isBox = true }: { isBox?: boolean }) => {
  const { type, setType } = useAppContext();
  const { t } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    const { scholarship_type } = router.query;
    if (
      typeof scholarship_type === "string" &&
      types.includes(scholarship_type)
    ) {
      setType(scholarship_type as "bachelor" | "masters");
    }
  }, [router.query, setType]);

  if (isBox) {
    return (
      <div className="flex flex-col gap-2 p-4 border rounded-lg bg-zinc-50 border-zinc-200">
        <h4 className="text-lg font-semibold">{t("programType")}</h4>
        <Select
          value={type}
          onValueChange={(st) => {
            if (st === "masters" || st === "bachelor") {
              setType(st);
            }
          }}
        >
          <SelectTrigger
            dir={router.locale == "ar" ? "rtl" : "ltr"}
            className="w-full bg-white text-start"
          >
            <SelectValue placeholder={t("programType")} />
          </SelectTrigger>
          <SelectContent dir={router.locale == "ar" ? "rtl" : "ltr"}>
            {types.map((st) => (
              <SelectItem key={st} value={st}>
                {t(st)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Select
      value={type}
      onValueChange={(st) => {
        if (st === "masters" || st === "bachelor") {
          setType(st);
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("programType")} />
      </SelectTrigger>
      <SelectContent>
        {types.map((st) => (
          <SelectItem key={st} value={st}>
            {t(st)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
