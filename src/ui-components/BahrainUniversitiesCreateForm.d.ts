/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type BahrainUniversitiesCreateFormInputValues = {
    universityName?: string;
    universityNameAr?: string;
    isDeactivated?: boolean;
    availability?: string;
};
export declare type BahrainUniversitiesCreateFormValidationValues = {
    universityName?: ValidationFunction<string>;
    universityNameAr?: ValidationFunction<string>;
    isDeactivated?: ValidationFunction<boolean>;
    availability?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BahrainUniversitiesCreateFormOverridesProps = {
    BahrainUniversitiesCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    universityName?: PrimitiveOverrideProps<TextFieldProps>;
    universityNameAr?: PrimitiveOverrideProps<TextFieldProps>;
    isDeactivated?: PrimitiveOverrideProps<SwitchFieldProps>;
    availability?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BahrainUniversitiesCreateFormProps = React.PropsWithChildren<{
    overrides?: BahrainUniversitiesCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BahrainUniversitiesCreateFormInputValues) => BahrainUniversitiesCreateFormInputValues;
    onSuccess?: (fields: BahrainUniversitiesCreateFormInputValues) => void;
    onError?: (fields: BahrainUniversitiesCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BahrainUniversitiesCreateFormInputValues) => BahrainUniversitiesCreateFormInputValues;
    onValidate?: BahrainUniversitiesCreateFormValidationValues;
} & React.CSSProperties>;
export default function BahrainUniversitiesCreateForm(props: BahrainUniversitiesCreateFormProps): React.ReactElement;
