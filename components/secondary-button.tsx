import React from "react";

interface Props {
  name: string;
  buttonClick: () => void;
}

export default function SecondaryButton({ name, buttonClick }: Props) {
  return (
    <button
      className=" min-w-[8rem] px-4 py-2 border-2 border-anzac-500 rounded-xl text-anzac-500 text-xs font-bold hover:cursor-pointer"
      onClick={buttonClick}
    >
      {name}
    </button>
  );
}
