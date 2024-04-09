import React, { FC } from "react";
import { useBatchContext } from "../../context/BatchContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
type TBatchSelector = {
  handleBatchChange?: (value: string) => void;
};
export const BatchSelector: FC<TBatchSelector> = ({ handleBatchChange }) => {
  const { batch, setBatch } = useBatchContext();

  return (
    <Select
      onValueChange={(value) => {
        setBatch(Number(value));

        handleBatchChange && handleBatchChange(value);
      }}
      value={batch.toString()}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Year</SelectLabel>
          {Array.from(
            { length: new Date().getFullYear() - 2022 },
            (_, i) => 2023 + i
          )
            .reverse()
            .map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
