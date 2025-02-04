import React from "react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import "yup-phone";

import { ParentInfo, UpdateParentInfoMutationVariables } from "../../src/API";
import { updateParentInfoData } from "../../src/CustomAPI";

import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { PhoneNumberInput } from "../phone";
import { getNamePart } from "../../src/Helpers";

interface FormValues {
  guardianFirstName: string | null | undefined;
  guardianSecondName: string | null | undefined;
  guardianThirdName: string | null | undefined;
  guardianLastName: string | null | undefined;
  // guardianFullName: string | null | undefined;
  relation: string | null | undefined;
  guardianCPR: string | null | undefined;
  primaryMobile: string | null | undefined;
  secondaryMobile: string | null | undefined;
  fatherFirstName: string | null | undefined;
  fatherSecondName: string | null | undefined;
  fatherThirdName: string | null | undefined;
  fatherLastName: string | null | undefined;
  // fatherFullName: string | null | undefined;
  fatherCPR: string | null | undefined;
  motherFirstName: string | null | undefined;
  motherSecondName: string | null | undefined;
  motherThirdName: string | null | undefined;
  motherLastName: string | null | undefined;
  // motherFullName: string | null | undefined;
  motherCPR: string | null | undefined;
  numberOfFamilyMembers: number | null | undefined;
  address: string | null | undefined;
}

interface Props {
  parentInfo: ParentInfo;
}

export default function UpdateParentInfo({ parentInfo }: Props) {
  const { t } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");

  let initialValues: FormValues = {
    guardianFirstName:
      parentInfo.guardianFirstName ??
      (parentInfo.guardianFullName
        ? getNamePart(parentInfo.guardianFullName, "first")
        : ""),
    guardianSecondName:
      parentInfo.guardianSecondName ??
      (parentInfo.guardianFullName
        ? getNamePart(parentInfo.guardianFullName, "second")
        : ""),
    guardianThirdName:
      parentInfo.guardianThirdName ??
      (parentInfo.guardianFullName
        ? getNamePart(parentInfo.guardianFullName, "third")
        : ""),
    guardianLastName:
      parentInfo.guardianLastName ??
      (parentInfo.guardianFullName
        ? getNamePart(parentInfo.guardianFullName, "last")
        : ""),
    // guardianFullName: parentInfo.guardianFullName,
    relation: parentInfo.relation,
    guardianCPR: parentInfo.guardianCPR,
    primaryMobile: parentInfo.primaryMobile,
    secondaryMobile: parentInfo.secondaryMobile,
    fatherFirstName: parentInfo.fatherFullName
      ? getNamePart(parentInfo.fatherFullName, "first")
      : "",
    fatherSecondName: parentInfo.fatherFullName
      ? getNamePart(parentInfo.fatherFullName, "second")
      : "",
    fatherThirdName: parentInfo.fatherFullName
      ? getNamePart(parentInfo.fatherFullName, "third")
      : "",
    fatherLastName: parentInfo.fatherFullName
      ? getNamePart(parentInfo.fatherFullName, "last")
      : "",

    // fatherFullName: parentInfo.fatherFullName,
    fatherCPR: parentInfo.fatherCPR,

    motherFirstName: parentInfo.motherFullName
      ? getNamePart(parentInfo.motherFullName, "first")
      : "",
    motherSecondName: parentInfo.motherFullName
      ? getNamePart(parentInfo.motherFullName, "second")
      : "",
    motherThirdName: parentInfo.motherFullName
      ? getNamePart(parentInfo.motherFullName, "third")
      : "",
    motherLastName: parentInfo.motherFullName
      ? getNamePart(parentInfo.motherFullName, "last")
      : "",
    // motherFullName: parentInfo.motherFullName,
    motherCPR: parentInfo.motherCPR,
    numberOfFamilyMembers: parentInfo.numberOfFamilyMembers,
    address: parentInfo.address,
  };

  async function updateProcess(inputs: UpdateParentInfoMutationVariables) {
    return await updateParentInfoData(inputs).then(async (value) => {
      if (value === undefined) {
        throw new Error("Failed to update");
      }

      return value;
    });
  }

  const onlyArabicLettersRegex = /^[\u0621-\u064A ]+$/;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        guardianFirstName: yup
          .string()
          .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
          .required(`${tErrors("requiredField")}`),
        guardianSecondName: yup
          .string()
          .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
          .required(`${tErrors("requiredField")}`),
        guardianThirdName: yup
          .string()
          .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
          .required(`${tErrors("requiredField")}`),
        guardianLastName: yup
          .string()
          .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
          .required(`${tErrors("requiredField")}`),
        // guardianFullName: yup.string().required(`${tErrors("requiredField")}`),
        relation: yup.string().required(`${tErrors("requiredField")}`),
        guardianCPR: yup
          .string()
          .min(9, `${tErrors("cprShouldBe9")}`)
          .max(9, `${tErrors("cprShouldBe9")}`)
          .required(`${tErrors("requiredField")}`),
        address: yup.string().required(`${tErrors("requiredField")}`),

        primaryMobile: yup
          .string()
          .phone()
          .required(`${tErrors("requiredField")}`),
        secondaryMobile: yup
          .string()
          .phone()
          .required(`${tErrors("requiredField")}`),

        fatherFullName: yup.string().nullable(),
        fatherCPR: yup
          .string()
          .min(9, `${tErrors("cprShouldBe9")}`)
          .max(9, `${tErrors("cprShouldBe9")}`)
          .nullable(),
        motherFullName: yup.string().nullable(),
        motherCPR: yup
          .string()
          .min(9, `${tErrors("cprShouldBe9")}`)
          .max(9, `${tErrors("cprShouldBe9")}`)
          .nullable(),
        numberOfFamilyMembers: yup
          .number()
          .required(`${tErrors("requiredField")}`),
      })}
      onSubmit={async (values, actions) => {
        let updateVars: UpdateParentInfoMutationVariables = {
          input: {
            id: parentInfo.id,
            guardianFirstName: values.guardianFirstName,
            guardianSecondName: values.guardianSecondName,
            guardianThirdName: values.guardianThirdName,
            guardianLastName: values.guardianLastName,
            // guardianFullName: `${values.guardianFirstName} ${values.guardianSecondName} ${values.guardianThirdName} ${values.guardianLastName}`,
            relation: values.relation,
            guardianCPR: values.guardianCPR,
            primaryMobile: values.primaryMobile,
            secondaryMobile: values.secondaryMobile,
            fatherFullName: `${values.fatherFirstName} ${values.fatherSecondName} ${values.fatherThirdName} ${values.fatherLastName}`,
            fatherCPR: values.fatherCPR,
            motherFullName: `${values.motherFirstName} ${values.motherSecondName} ${values.motherThirdName} ${values.motherLastName}`,
            motherCPR: values.motherCPR,
            numberOfFamilyMembers: values.numberOfFamilyMembers,
            address: values.address,
            _version: parentInfo._version,
          },
        };

        await toast.promise(updateProcess(updateVars), {
          loading: "Updating...",
          success: "Updated successfully",
          error: (err) => {
            return `${err.message}`;
          },
        });

        actions.setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        isValid,
        setFieldValue,
        dirty,
      }) => (
        <Form className="container grid max-w-3xl grid-cols-1 gap-3 mx-auto md:grid-cols-2">
          {/* guardianFullName */}
          <div className=" font-semibold">{t("guardianName")}</div>
          <div className=" md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("firstName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="guardianFirstName"
                title="guardianFirstName"
                className={`input input-bordered input-primary ${
                  errors.guardianFirstName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.guardianFirstName ?? ""}
              />
              <label className="label-text-alt text-error">
                {errors.guardianFirstName &&
                  touched.guardianFirstName &&
                  errors.guardianFirstName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("secondName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="guardianSecondName"
                title="guardianSecondName"
                className={`input input-bordered input-primary ${
                  errors.guardianSecondName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.guardianSecondName ?? ""}
              />
              <label className="label-text-alt text-error">
                {errors.guardianSecondName &&
                  touched.guardianSecondName &&
                  errors.guardianSecondName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("thirdName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="guardianThirdName"
                title="guardianThirdName"
                className={`input input-bordered input-primary ${
                  errors.guardianThirdName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.guardianThirdName ?? ""}
              />
              <label className="label-text-alt text-error">
                {errors.guardianThirdName &&
                  touched.guardianThirdName &&
                  errors.guardianThirdName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("lastName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="guardianLastName"
                title="guardianLastName"
                className={`input input-bordered input-primary ${
                  errors.guardianLastName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.guardianLastName ?? ""}
              />
              <label className="label-text-alt text-error">
                {errors.guardianLastName &&
                  touched.guardianLastName &&
                  errors.guardianLastName}
              </label>
            </div>
            {/* <div className="flex flex-col justify-start w-full">
              <label className="label">{t("guardianName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="guardianFullName"
                title="guardianFullName"
                className={`input input-bordered input-primary ${
                  errors.guardianFullName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.guardianFullName ?? ""}
              />
              <label className="label-text-alt text-error">
                {errors.guardianFullName &&
                  touched.guardianFullName &&
                  errors.guardianFullName}
              </label>
            </div> */}
          </div>

          {/* relation */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("guardianRelation")}</label>
            <Field
              dir="ltr"
              type="text"
              name="relation"
              title="relation"
              className={`input input-bordered input-primary ${
                errors.relation && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.relation}
            />
            <label className="label-text-alt text-error">
              {errors.relation && touched.relation && errors.relation}
            </label>
          </div>

          {/* Guardian CPR */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("guardianCPR")}</label>
            <Field
              dir="ltr"
              type="text"
              name="guardianCPR"
              title="guardianCPR"
              className={`input input-bordered input-primary ${
                errors.guardianCPR && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.guardianCPR}
            />
            <label className="label-text-alt text-error">
              {errors.guardianCPR && touched.guardianCPR && errors.guardianCPR}
            </label>
          </div>

          {/* Address */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("address")}</label>
            <Field
              dir="ltr"
              type="text"
              name="address"
              title="address"
              className={`input input-bordered input-primary ${
                errors.address && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
            />
            <label className="label-text-alt text-error">
              {errors.address && touched.address && errors.address}
            </label>
          </div>

          {/* primaryMobile */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("primaryMobileNumber")}</label>

            <PhoneNumberInput
              dir="ltr"
              type="phone"
              name="primaryMobile"
              title="primaryMobile"
              placeholder={`${t("phone")} (+973)`}
              className={`input input-bordered input-primary ${
                errors.primaryMobile && touched.primaryMobile && "input-error"
              }`}
              onChange={(value) =>
                setFieldValue("primaryMobile", (value ?? "")?.toString())
              }
              onBlur={handleBlur}
              value={values.primaryMobile ?? ""}
            />
            <label className="label-text-alt text-error">
              {errors.primaryMobile &&
                touched.primaryMobile &&
                errors.primaryMobile}
            </label>
          </div>

          {/* secondaryMobile */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("secondaryMobileNumber")}</label>

            <PhoneNumberInput
              dir="ltr"
              type="phone"
              name="secondaryMobile"
              title="secondaryMobile"
              placeholder={`${t("phone")} (+973)`}
              className={`input input-bordered input-primary ${
                errors.secondaryMobile &&
                touched.secondaryMobile &&
                "input-error"
              }`}
              onChange={(value) =>
                setFieldValue("secondaryMobile", (value ?? "")?.toString())
              }
              onBlur={handleBlur}
              value={values.secondaryMobile ?? ""}
            />
            <label className="label-text-alt text-error">
              {errors.secondaryMobile &&
                touched.secondaryMobile &&
                errors.secondaryMobile}
            </label>
          </div>

          {/* Number Of Family Members */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("numberOfFamilyMembers")}</label>
            <Field
              dir="ltr"
              type="text"
              name="numberOfFamilyMembers"
              title="numberOfFamilyMembers"
              className={`input input-bordered input-primary ${
                errors.numberOfFamilyMembers && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.numberOfFamilyMembers}
            />
            <label className="label-text-alt text-error">
              {errors.numberOfFamilyMembers &&
                touched.numberOfFamilyMembers &&
                errors.numberOfFamilyMembers}
            </label>
          </div>

          <div className="divider md:col-span-2"></div>

          {/* Father Full Name */}
          <div className=" font-semibold">{t("fatherName")}</div>
          <div className=" md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("firstName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="fatherFirstName"
                title="fatherFirstName"
                className={`input input-bordered input-primary ${
                  errors.fatherFirstName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fatherFirstName}
              />
              <label className="label-text-alt text-error">
                {errors.fatherFirstName &&
                  touched.fatherFirstName &&
                  errors.fatherFirstName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("secondName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="fatherSecondName"
                title="fatherSecondName"
                className={`input input-bordered input-primary ${
                  errors.fatherSecondName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fatherSecondName}
              />
              <label className="label-text-alt text-error">
                {errors.fatherSecondName &&
                  touched.fatherSecondName &&
                  errors.fatherSecondName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("thirdName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="fatherThirdName"
                title="fatherThirdName"
                className={`input input-bordered input-primary ${
                  errors.fatherThirdName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fatherThirdName}
              />
              <label className="label-text-alt text-error">
                {errors.fatherThirdName &&
                  touched.fatherThirdName &&
                  errors.fatherThirdName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("lastName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="fatherLastName"
                title="fatherLastName"
                className={`input input-bordered input-primary ${
                  errors.fatherLastName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fatherLastName}
              />
              <label className="label-text-alt text-error">
                {errors.fatherLastName &&
                  touched.fatherLastName &&
                  errors.fatherLastName}
              </label>
            </div>
            {/* <div className="flex flex-col justify-start w-full">
              <label className="label">{t("fatherName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="fatherFullName"
                title="fatherFullName"
                className={`input input-bordered input-primary ${
                  errors.fatherFullName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fatherFullName}
              />
              <label className="label-text-alt text-error">
                {errors.fatherFullName &&
                  touched.fatherFullName &&
                  errors.fatherFullName}
              </label>
            </div> */}
          </div>

          {/* Father CPR */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("fatherCPR")}</label>
            <Field
              dir="ltr"
              type="text"
              name="fatherCPR"
              title="fatherCPR"
              className={`input input-bordered input-primary ${
                errors.fatherCPR && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.fatherCPR}
            />
            <label className="label-text-alt text-error">
              {errors.fatherCPR && touched.fatherCPR && errors.fatherCPR}
            </label>
          </div>

          <div className="md:col-span-2 divider"></div>

          {/* Mother Full Name */}
          <div className="font-semibold">{t("motherName")}</div>
          <div className=" md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("firstName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="motherFirstName"
                title="motherFirstName"
                className={`input input-bordered input-primary ${
                  errors.motherFirstName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.motherFirstName}
              />
              <label className="label-text-alt text-error">
                {errors.motherFirstName &&
                  touched.motherFirstName &&
                  errors.motherFirstName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("secondName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="motherSecondName"
                title="motherSecondName"
                className={`input input-bordered input-primary ${
                  errors.motherSecondName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.motherSecondName}
              />
              <label className="label-text-alt text-error">
                {errors.motherSecondName &&
                  touched.motherSecondName &&
                  errors.motherSecondName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("thirdName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="motherThirdName"
                title="motherThirdName"
                className={`input input-bordered input-primary ${
                  errors.motherThirdName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.motherThirdName}
              />
              <label className="label-text-alt text-error">
                {errors.motherThirdName &&
                  touched.motherThirdName &&
                  errors.motherThirdName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("lastName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="motherLastName"
                title="motherLastName"
                className={`input input-bordered input-primary ${
                  errors.motherLastName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.motherLastName}
              />
              <label className="label-text-alt text-error">
                {errors.motherLastName &&
                  touched.motherLastName &&
                  errors.motherLastName}
              </label>
            </div>
            {/* <div className="flex flex-col justify-start w-full">
              <label className="label">{t("motherName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="motherFullName"
                title="motherFullName"
                className={`input input-bordered input-primary ${
                  errors.motherFullName && "input-error"
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.motherFullName}
              />
              <label className="label-text-alt text-error">
                {errors.motherFullName &&
                  touched.motherFullName &&
                  errors.motherFullName}
              </label>
            </div> */}
          </div>

          {/* Mother CPR */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("motherCPR")}</label>
            <Field
              dir="ltr"
              type="text"
              name="motherCPR"
              title="motherCPR"
              className={`input input-bordered input-primary ${
                errors.motherCPR && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.motherCPR}
            />
            <label className="label-text-alt text-error">
              {errors.motherCPR && touched.motherCPR && errors.motherCPR}
            </label>
          </div>

          {/* Submit */}
          {
            <button
              className={`my-3 text-white btn btn-primary md:col-span-2`}
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
            >
              {isSubmitting && <span className="loading"></span>}
              {t("update")}
            </button>
          }
        </Form>
      )}
    </Formik>
  );
}
