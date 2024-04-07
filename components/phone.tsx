import React from "react";

import PhoneInput, {
  DefaultInputComponentProps,
  Props,
  Value,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "../src/lib/utils";

export interface PhoneProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: Value | string;
  onChange(value?: Value | React.ChangeEvent<HTMLInputElement>): void;
}

const PhoneNumberInput = React.forwardRef<
  Props<DefaultInputComponentProps>,
  PhoneProps
>(({ className, type, ...props }, ref) => {
  const css = `
  .phoneNumber {
    direction: ltr;
  }
  .phoneNumber input {
      background: transparent;
      height: 3rem;
      border-inline-start-width: 1px;
      border-radius: 0px;
      padding: 0rem 0.5rem;
      border-color: #e1ba3d;
        }

        .PhoneInputCountry {
          padding: 0 0.8rem;
      }
        `;
  return (
    <>
      <style>{css}</style>
      <PhoneInput
        international
        defaultCountry="BH"
        {...props}
        className={cn(
          "phoneNumber border-[#e1ba3d] flex h-12 w-full rounded-md  border pl-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        type="phone"
      />
    </>
  );
});
PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };
