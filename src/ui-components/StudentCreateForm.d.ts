/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type StudentCreateFormInputValues = {
    cpr?: string;
    cprDoc?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    gender?: string;
    nationalityCategory?: string;
    nationality?: string;
    schoolName?: string;
    schoolType?: string;
    specialization?: string;
    placeOfBirth?: string;
    studentOrderAmongSiblings?: number;
    householdIncome?: number;
    familyIncome?: string;
    familyIncomeProofDoc?: string;
    familyIncomeProofDocs?: string[];
    preferredLanguage?: string;
    graduationDate?: string;
    address?: string;
};
export declare type StudentCreateFormValidationValues = {
    cpr?: ValidationFunction<string>;
    cprDoc?: ValidationFunction<string>;
    fullName?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    phone?: ValidationFunction<string>;
    gender?: ValidationFunction<string>;
    nationalityCategory?: ValidationFunction<string>;
    nationality?: ValidationFunction<string>;
    schoolName?: ValidationFunction<string>;
    schoolType?: ValidationFunction<string>;
    specialization?: ValidationFunction<string>;
    placeOfBirth?: ValidationFunction<string>;
    studentOrderAmongSiblings?: ValidationFunction<number>;
    householdIncome?: ValidationFunction<number>;
    familyIncome?: ValidationFunction<string>;
    familyIncomeProofDoc?: ValidationFunction<string>;
    familyIncomeProofDocs?: ValidationFunction<string>;
    preferredLanguage?: ValidationFunction<string>;
    graduationDate?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StudentCreateFormOverridesProps = {
    StudentCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    cpr?: PrimitiveOverrideProps<TextFieldProps>;
    cprDoc?: PrimitiveOverrideProps<TextFieldProps>;
    fullName?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    gender?: PrimitiveOverrideProps<SelectFieldProps>;
    nationalityCategory?: PrimitiveOverrideProps<SelectFieldProps>;
    nationality?: PrimitiveOverrideProps<TextFieldProps>;
    schoolName?: PrimitiveOverrideProps<TextFieldProps>;
    schoolType?: PrimitiveOverrideProps<SelectFieldProps>;
    specialization?: PrimitiveOverrideProps<TextFieldProps>;
    placeOfBirth?: PrimitiveOverrideProps<TextFieldProps>;
    studentOrderAmongSiblings?: PrimitiveOverrideProps<TextFieldProps>;
    householdIncome?: PrimitiveOverrideProps<TextFieldProps>;
    familyIncome?: PrimitiveOverrideProps<SelectFieldProps>;
    familyIncomeProofDoc?: PrimitiveOverrideProps<TextFieldProps>;
    familyIncomeProofDocs?: PrimitiveOverrideProps<TextFieldProps>;
    preferredLanguage?: PrimitiveOverrideProps<SelectFieldProps>;
    graduationDate?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type StudentCreateFormProps = React.PropsWithChildren<{
    overrides?: StudentCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: StudentCreateFormInputValues) => StudentCreateFormInputValues;
    onSuccess?: (fields: StudentCreateFormInputValues) => void;
    onError?: (fields: StudentCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StudentCreateFormInputValues) => StudentCreateFormInputValues;
    onValidate?: StudentCreateFormValidationValues;
} & React.CSSProperties>;
export default function StudentCreateForm(props: StudentCreateFormProps): React.ReactElement;
