import React from "react";
import Link from "next/link";

interface Props {
  name: string;
  icon: any;
  linkTo: string;
  target?: string;
  disabled?: boolean;
}
export default function NavBarButton({
  name,
  icon,
  linkTo,
  target,
  disabled,
}: Props) {
  return (
    <Link
      href={disabled ? "#" : linkTo}
      target={disabled ? "_self" : target}
      className={`flex justify-start px-4 py-2 text-sm w-52 text-gray rounded-xl hover:bg-anzac-100 hover:border-anzac-100 hover:text-anzac-500 hover:cursor-pointer ${
        disabled &&
        "hover:!cursor-not-allowed hover:!bg-gray-100 hover:!text-gray-500"
      }`}
    >
      <div>{icon}</div>
      <div className="ltr:pl-4 rtl:pr-4 ">{name}</div>
    </Link>
  );
}
