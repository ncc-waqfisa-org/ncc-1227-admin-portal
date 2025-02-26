import "yup-phone";
import React, { FC, ReactNode, useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  createAdminLogInDB,
  DocType,
  listAllBahrainUniversities,
  updateStudentInDB,
  uploadFile,
} from "../../src/CustomAPI";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Income,
  MasterUpdateData,
  MasterUpdateFormSchema,
} from "../../src/lib/masters/types";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import "yup-phone";
import { isValidPhoneNumber } from "react-phone-number-input";
import { cn } from "../../src/lib/utils";
import { PhoneNumberInput } from "../phone";
import {
  BahrainUniversities,
  CreateAdminLogMutationVariables,
  Gender,
  Nationality,
  Student,
  UpdateStudentMutationVariables,
} from "../../src/API";

import GetStorageLinkComponent from "../get-storage-link-component";
import DatePicker from "react-date-picker";
import { format } from "date-fns";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { createStudentInfoChangeSnapshot } from "./studentAdminLog";
import { useAuth } from "../../hooks/use-auth";
import { createMasterStudentInfoChangeSnapshot } from "./studentMasterAdminLog";
import { Button } from "../ui/button";

// Add an optional readOnly that will disable all fields and remove the update button
export default function MasterInfoForm({
  student,
  applicationId,
}: // universities,
{
  student: Student;
  applicationId?: string;
  // universities?: BahrainUniversities[];
}) {
  const router = useRouter();
  const { t: tErrors } = useTranslation("errors");
  const { t: tToast } = useTranslation("toast");
  const { t } = useTranslation("account");
  const { cpr: adminCpr, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: bahrainiUniversities,
    isPending: isBahrainiUniversitiesPending,
  } = useQuery({
    queryKey: ["bahrainiUniversities"],
    queryFn: () => listAllBahrainUniversities(),
  });

  const englishNumberRegex = /^[0-9]*$/;
  const onlyArabicLettersRegex = /^[\u0621-\u064A ]+$/;

  const [docs, setDocs] = useState<{ [key: string]: File | null }>({
    cpr_doc: null,
    income_doc: null,
  });

  // const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
  //   student.dob ? new Date(student.dob) : null
  // );

  const getNamePart = (
    fullName: string,
    part: "first" | "second" | "third" | "last"
  ): string => {
    const nameParts = fullName.trim().split(" ");

    switch (part) {
      case "first":
        return nameParts[0] || "";
      case "second":
        // if (nameParts.length > 2) return nameParts[1];
        // return "";
        return nameParts[1] || "";
      case "third":
        // if (nameParts.length > 3) return nameParts[2];
        return nameParts[2] || "";

      case "last":
        // if (nameParts.length === 4) return nameParts[2];
        // if (nameParts.length === 4) return nameParts[2];
        if (nameParts.length >= 3) return nameParts[nameParts.length - 1];
        return "";
    }
  };

  const initialValues: MasterUpdateFormSchema = {
    first_name: student?.m_firstName ?? "",
    second_name: student?.m_secondName ?? "",
    third_name: student?.m_thirdName ?? "",
    last_name: student?.m_lastName ?? "",

    address: student?.address ?? "",
    phone: student?.phone ?? "",

    number_of_family_member: student?.m_numberOfFamilyMembers ?? 1,
    graduation_year: student?.m_graduationYear ?? "",
    old_program: student?.m_oldProgram ?? "",

    isEmployed: student?.m_isEmployed ?? false,
    place_of_employment: student?.m_placeOfEmployment ?? "",
    income: student?.m_income ?? Income.LESS_THAN_1500,

    // Files are not prefilled
    cpr_doc: undefined,
    income_doc: undefined,
    guardian_cpr_doc: undefined,

    gender: student?.gender ?? "",
    place_of_birth: student?.placeOfBirth ?? "",
    nationality: student?.nationalityCategory ?? "",
    universityID: student?.m_universityID ?? "",
    guardian_cpr: student?.m_guardianCPR ?? "",
    // guardian_full_name: student?.m_guardianFullName ?? "",
    guardian_first_name:
      student.m_guardianFirstName ??
      (student?.m_guardianFullName
        ? getNamePart(student?.m_guardianFullName, "first")
        : ""),
    guardian_second_name:
      student.m_guardianSecondName ??
      (student?.m_guardianFullName
        ? getNamePart(student?.m_guardianFullName, "second")
        : ""),
    guardian_third_name:
      student.m_guardianThirdName ??
      (student?.m_guardianFullName
        ? getNamePart(student?.m_guardianFullName, "third")
        : ""),
    guardian_last_name:
      student.m_guardianLastName ??
      (student?.m_guardianFullName
        ? getNamePart(student?.m_guardianFullName, "last")
        : ""),

    dob: student.dob ?? "",
    guardian_email: student.m_guardianEmail ?? "",
    guardian_address: student.m_guardianAddress ?? "",
  };

  const formValidationSchema = yup.object({
    // Personal data
    cpr_doc: yup.mixed(),

    first_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    second_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    third_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    last_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    address: yup.string().required(`${tErrors("requiredField")}`),

    phone: yup
      .string()

      .test("is-valid-phone", `${tErrors("invalidPhone")}`, (value) =>
        value ? isValidPhoneNumber(value.toString()) : false
      )
      .required(`${tErrors("requiredField")}`),
    gender: yup.string().required(`${tErrors("requiredField")}`),
    place_of_birth: yup.string().required(`${tErrors("requiredField")}`),
    nationality: yup.string().required(`${tErrors("requiredField")}`),
    number_of_family_member: yup
      .number()
      .required(`${tErrors("requiredField")}`),

    // Graduated from
    graduation_year: yup.string().required(`${tErrors("requiredField")}`),
    universityID: yup.string().required(`${tErrors("requiredField")}`),
    old_program: yup.string().required(`${tErrors("requiredField")}`),
    dob: yup.string().required(`${tErrors("requiredField")}`),

    // Employment info
    isEmployed: yup.boolean().required(`${tErrors("requiredField")}`),
    place_of_employment: yup.string().when("isEmployed", {
      is: true, // condition
      then: yup.string().required(`${tErrors("requiredField")}`), // required if isEmployed is true
      otherwise: yup.string().notRequired(), // optional if isEmployed is false
    }),

    // Personal income or guardian income based on employment
    income: yup.string().required(`${tErrors("requiredField")}`),
    income_doc: yup.mixed(),

    // Guardian data
    guardian_cpr: yup
      .string()
      .matches(englishNumberRegex, "Only English Numbers are allowed")
      .min(9, `${tErrors("cprShouldBe9")}`)
      .max(9, `${tErrors("cprShouldBe9")}`)
      .required(`${tErrors("requiredField")}`),
    guardian_first_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    guardian_second_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    guardian_third_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    guardian_last_name: yup
      .string()
      .matches(onlyArabicLettersRegex, `${tErrors("invalid")}`)
      .required(`${tErrors("requiredField")}`),
    // guardian_full_name: yup.string().required(`${tErrors("requiredField")}`),
    guardian_cpr_doc: yup.mixed(),
    guardian_email: yup.string().required(`${tErrors("requiredField")}`),
    guardian_address: yup.string().required(`${tErrors("requiredField")}`),
    adminReason: yup.string().required(`${tErrors("requiredField")}`),
  });

  async function newAdminLog(
    applicationId: string,
    oldData: any,
    newData: any,
    adminReason: string | null | undefined
  ) {
    const snapshot = createMasterStudentInfoChangeSnapshot(oldData, newData);

    let createAdminLogVariables: CreateAdminLogMutationVariables = {
      input: {
        applicationID: applicationId,
        adminCPR: adminCpr ?? "",
        dateTime: new Date().toISOString(),
        snapshot: snapshot,
        reason: adminReason ?? "No reason provided.",
        applicationAdminLogsId: applicationId,
        adminAdminLogsCpr: adminCpr ?? "",
      },
    };

    await createAdminLogInDB(createAdminLogVariables)
      .then(async (logValue) => {
        // TODO: refresh()?
        return logValue;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  const [masterUpdateData, setMasterUpdateData] =
    useState<MasterUpdateFormSchema>(initialValues);

  const updateMutation = useMutation({
    mutationFn: async (values: MasterUpdateData) => {
      let studentData: UpdateStudentMutationVariables = {
        input: {
          // prefilled
          cpr: student?.cpr ?? "",
          _version: student?._version,

          cprDoc: values.cpr_doc,
          m_firstName: values.first_name,
          m_secondName: values.second_name,
          m_thirdName: values.third_name,
          m_lastName: values.last_name,
          address: values.address,
          phone: values.phone,
          gender: values.gender as Gender,
          placeOfBirth: values.place_of_birth,
          nationality: values.nationality,
          nationalityCategory: values.nationality as Nationality,
          dob: values.dob,
          m_numberOfFamilyMembers: values.number_of_family_member,
          m_universityID: values.universityID,
          m_graduationYear: values.graduation_year,
          m_oldProgram: values.old_program,
          m_isEmployed: values.isEmployed,
          m_placeOfEmployment: values.place_of_employment,
          m_income: values.income,
          m_incomeDoc: values.income_doc,
          m_guardianFirstName: values.guardian_first_name,
          m_guardianSecondName: values.guardian_second_name,
          m_guardianThirdName: values.guardian_third_name,
          m_guardianLastName: values.guardian_last_name,
          // m_guardianFullName: values.guardian_full_name,
          m_guardianCPR: values.guardian_cpr,
          m_guardianCPRDoc: values.guardian_cpr_doc,
          m_guardianEmail: values.guardian_email,
          m_guardianAddress: values.guardian_address,
        },
      };

      let res = await updateStudentInDB(studentData);

      return res;
    },
    async onSuccess(data) {
      if (data?.updateStudent?.cpr) {
        toast.success(`${t("processComplete")}`);
      } else {
        throw new Error(`${tErrors("somethingWentWrong")}`);
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
    onSettled() {
      setIsLoading(false);
    },
  });

  async function updateProcess(data: MasterUpdateFormSchema) {
    setIsLoading(true);

    if (!student) {
      throw new Error(`CODE:00098 ${"Applicant data is missing"}`);
    }

    /**
     * Upload all documents to S3 with the applicant CPR
     */
    const [cpr_doc, income_doc, guardian_cpr_doc] = await Promise.all([
      docs.cpr_doc
        ? uploadFile(docs.cpr_doc, DocType.CPR, student.cpr)
        : student.cprDoc,
      docs.income_doc
        ? uploadFile(docs.income_doc, DocType.INCOME, student.cpr)
        : student.m_incomeDoc,
      docs.guardian_cpr_doc
        ? uploadFile(docs.guardian_cpr_doc, DocType.GUARDIAN, student.cpr)
        : student.m_guardianCPRDoc,
    ]);

    if (cpr_doc == null) {
      throw new Error(
        `CODE:00003 ${
          tToast("cprDocumentFailedToUpload") ?? "Cpr document failed to upload"
        }`
      );
    }
    if (income_doc == null) {
      throw new Error(
        `CODE:00003 ${
          tToast("incomeDocumentFailedToUpload") ??
          "Income document failed to upload"
        }`
      );
    }
    if (guardian_cpr_doc == null) {
      throw new Error(
        `CODE:00003 ${
          tToast("guardianCprDocumentFailedToUpload") ??
          "Guardian Cpr document failed to upload"
        }`
      );
    }

    const dataToSend: MasterUpdateData = {
      ...data,
      cpr_doc,
      income_doc,
      guardian_cpr_doc,
    };

    setMasterUpdateData(data);

    await updateMutation.mutateAsync(dataToSend).then((res) => {
      if (res) {
        router.back();
      }
    });
  }

  return (
    <div className="flex flex-col items-center">
      <Formik
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        validateOnMount
        onSubmit={(values) => {
          updateProcess(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldError,
          setFieldTouched,
          setFieldValue,
          isValid,
          dirty,
        }) => {
          const formErrors =
            !!errors.first_name ||
            !!errors.second_name ||
            !!errors.last_name ||
            !!errors.address ||
            !!errors.phone ||
            !!errors.gender ||
            !!errors.place_of_birth ||
            !!errors.nationality ||
            !!errors.number_of_family_member ||
            !!errors.graduation_year ||
            !!errors.universityID ||
            !!errors.old_program ||
            (values.isEmployed ? !!errors.place_of_employment : false) ||
            (values.isEmployed ? !!errors.income : false) ||
            (values.isEmployed ? !!errors.income_doc : false);
          !!errors.guardian_first_name ||
            !!errors.guardian_second_name ||
            !!errors.guardian_third_name ||
            !!errors.guardian_last_name ||
            !!errors.guardian_email ||
            !!errors.guardian_address ||
            // !!errors.guardian_full_name ||
            !!errors.guardian_cpr ||
            (!values.isEmployed ? !!errors.income : false) ||
            (!values.isEmployed ? !!errors.income_doc : false) ||
            !!errors.guardian_cpr_doc;

          if (!student) {
            return (
              <div className="w-full max-w-lg p-6 mx-auto my-8 border border-red-200 rounded-lg shadow-lg bg-white/30">
                <div className="flex flex-col gap-4 text-center">
                  <div className="text-xl font-semibold text-error">
                    Applicant details could not be fetched
                  </div>
                  <div className="text-xl font-semibold text-error" dir="rtl">
                    لم نتمكن من جلب تفاصيل المقدم
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Form className="flex flex-col justify-center max-w-4xl mx-auto">
              <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">{t("cpr")}</label>
                  </div>
                  <Field
                    dir="ltr"
                    disabled
                    className={`input disabled input-bordered input-primary`}
                    value={student?.cpr}
                  />
                </div>
                <LabelField
                  title={t("cprDoc")}
                  value={values.cpr_doc}
                  errors={errors.cpr_doc}
                  touched={touched.cpr_doc}
                  fieldName={"cpr_doc"}
                  type="file"
                  onFile={(file) =>
                    setDocs({
                      ...docs,
                      cpr_doc: file,
                    })
                  }
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                  labelComponent={
                    <GetStorageLinkComponent
                      storageKey={student?.cprDoc}
                    ></GetStorageLinkComponent>
                  }
                />
                {/* User Name */}
                <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-4">
                  <LabelField
                    title={t("firstName")}
                    fieldName={"first_name"}
                    value={values.first_name}
                    errors={errors.first_name}
                    touched={touched.first_name}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <LabelField
                    title={t("secondName")}
                    fieldName={"second_name"}
                    value={values.second_name}
                    errors={errors.second_name}
                    touched={touched.second_name}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <LabelField
                    title={t("thirdName")}
                    fieldName={"third_name"}
                    value={values.third_name}
                    errors={errors.third_name}
                    touched={touched.third_name}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <LabelField
                    title={t("lastName")}
                    fieldName={"last_name"}
                    value={values.last_name}
                    errors={errors.last_name}
                    touched={touched.last_name}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                </div>
                <div className="md:col-span-2">
                  <LabelField
                    title={t("address")}
                    value={values.address}
                    errors={errors.address}
                    touched={touched.address}
                    fieldName={"address"}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                </div>
                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">{t("email")}</label>
                  </div>
                  <Field
                    dir="ltr"
                    disabled
                    className={`input disabled input-bordered input-primary`}
                    value={student?.email}
                  />
                </div>
                <LabelField
                  title={t("phone")}
                  value={values.phone}
                  errors={errors.phone}
                  touched={touched.phone}
                  fieldName={"phone"}
                  type={"phone"}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                />
                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">{t("gender")}</label>
                    <label className="text-error label">*</label>{" "}
                  </div>
                  <Field
                    dir="ltr"
                    as="select"
                    name="gender"
                    title="gender"
                    className={`input input-bordered input-primary ${
                      errors.gender && touched.gender && "input-error"
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.gender}
                  >
                    <option disabled selected value={undefined}>
                      {t("select")}
                    </option>
                    <option value={Gender.MALE}>{t("male")}</option>
                    <option value={Gender.FEMALE}>{t("female")}</option>
                  </Field>
                  <label className="pt-2 label-text-alt text-error">
                    {errors.gender && touched.gender && errors.gender}
                  </label>
                </div>

                <div>
                  <div className="flex items-center">
                    <label className="label">{t("dateOfBirth")}</label>
                    <label className="text-error label">*</label>{" "}
                  </div>
                  <DatePicker
                    className={cn(
                      " input input-bordered input-primary",
                      errors.dob && "!input-error"
                    )}
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    format="dd/MM/yyyy"
                    onChange={(date) => {
                      const myDate: Date | null = date as Date | null;
                      if (myDate) {
                        setFieldValue("dob", myDate.toISOString());
                        setFieldError("dob", undefined);
                      } else {
                        setFieldError("dob", "Invalid date of birth");
                      }

                      setFieldValue("dob", myDate?.toISOString());
                    }}
                    onTouchStart={(e) => setFieldTouched("dob", true)}
                    value={values.dob}
                  />

                  <label className="pt-2 label-text-alt text-error">
                    {errors.dob}
                  </label>
                </div>
                <LabelField
                  title={t("placeOfBirth")}
                  value={values.place_of_birth}
                  errors={errors.place_of_birth}
                  touched={touched.place_of_birth}
                  fieldName={"place_of_birth"}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                />
                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">{t("nationality")}</label>
                    <label className="text-error label">*</label>{" "}
                  </div>
                  <Field
                    dir="ltr"
                    as="select"
                    name="nationality"
                    title="nationality"
                    placeholder={t("nationality")}
                    className={`input input-bordered input-primary ${
                      errors.nationality && touched.nationality && "input-error"
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nationality}
                  >
                    <option disabled value={""}>
                      {t("select")}
                    </option>
                    <option value={Nationality.BAHRAINI}>
                      {t(Nationality.BAHRAINI)}
                    </option>
                    <option value={Nationality.NON_BAHRAINI}>
                      {t(Nationality.NON_BAHRAINI)}
                    </option>
                  </Field>
                  <label className="pt-2 label-text-alt text-error">
                    {errors.nationality &&
                      touched.nationality &&
                      errors.nationality}
                  </label>
                </div>

                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">
                      {t("numberOfFamilyMembers")}
                    </label>
                    <label className="text-error label">*</label>{" "}
                  </div>
                  <Field
                    dir="ltr"
                    type="text"
                    name="number_of_family_member"
                    title="number_of_family_member"
                    className={`input input-bordered input-primary ${
                      errors.number_of_family_member && "input-error"
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.number_of_family_member}
                  />
                  <label className="pt-2 label-text-alt text-error">
                    {errors.number_of_family_member &&
                      touched.number_of_family_member &&
                      errors.number_of_family_member}
                  </label>
                </div>
                <FormSeparator title={t("graduationUniversity")} />
                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">{t("university")}</label>
                    <label className="text-error label">*</label>{" "}
                  </div>
                  <Field
                    dir="ltr"
                    as="select"
                    disable={isBahrainiUniversitiesPending}
                    name="universityID"
                    title="universityID"
                    placeholder={t("university")}
                    className={`input input-bordered input-primary ${
                      errors.universityID &&
                      touched.universityID &&
                      "input-error"
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.universityID}
                  >
                    <option disabled selected value={undefined}>
                      {t("select")}
                    </option>
                    {bahrainiUniversities?.map((uni, index) => (
                      <option key={`uni-${index}`} value={uni.id}>
                        {router.locale === "ar"
                          ? uni.universityNameAr
                          : uni.universityName}
                      </option>
                    ))}
                  </Field>
                  <label className="pt-2 label-text-alt text-error">
                    {errors.universityID &&
                      touched.universityID &&
                      errors.universityID}
                  </label>
                </div>
                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">{t("graduationDate")}</label>
                    <label className="text-error label">*</label>{" "}
                  </div>
                  <Field
                    dir="ltr"
                    type="text"
                    name="graduation_year"
                    title="graduation_year"
                    placeholder={t("graduationDate")}
                    className={`input input-bordered input-primary ${
                      errors.graduation_year &&
                      touched.graduation_year &&
                      "input-error"
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.graduation_year}
                  />
                  <label className="pt-2 label-text-alt text-error">
                    {errors.graduation_year &&
                      touched.graduation_year &&
                      errors.graduation_year}
                  </label>
                </div>
                <LabelField
                  title={t("graduationProgram")}
                  value={values.old_program}
                  errors={errors.old_program}
                  touched={touched.old_program}
                  fieldName={"old_program"}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                />
                <FormSeparator title={t("employment")} />
                <div className="flex flex-col justify-start w-full">
                  <div className="flex items-center">
                    <label className="label">{t("employment")}</label>
                    <label className="text-error label">*</label>{" "}
                  </div>
                  <Field
                    dir="ltr"
                    as="select"
                    name="isEmployed"
                    title="employment"
                    placeholder={t("employment")}
                    className={`input input-bordered input-primary ${
                      errors.isEmployed && touched.isEmployed && "input-error"
                    }`}
                    onChange={(v: any) => {
                      setFieldValue(
                        "isEmployed",
                        v.currentTarget.value === "true"
                      );
                    }}
                    onBlur={handleBlur}
                    value={values.isEmployed.toString()}
                  >
                    <option disabled selected value={undefined}>
                      {t("select")}
                    </option>
                    <option value={"true"}>{t("employed")}</option>
                    <option value={"false"}>{t("unemployed")}</option>
                  </Field>
                  <label className="pt-2 label-text-alt text-error">
                    {errors.isEmployed &&
                      touched.isEmployed &&
                      errors.isEmployed}
                  </label>
                </div>
                {values.isEmployed && (
                  <>
                    <LabelField
                      title={t("placeOfEmployment")}
                      value={values.place_of_employment}
                      errors={errors.place_of_employment}
                      touched={touched.place_of_employment}
                      fieldName={"place_of_employment"}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldError={setFieldError}
                      setFieldValue={setFieldValue}
                    />
                    <div className="flex flex-col justify-start w-full">
                      <div className="flex items-center">
                        <label className="label">{t("income")}</label>
                        <label className="text-error label">*</label>{" "}
                      </div>

                      <Field
                        dir="ltr"
                        as="select"
                        name="income"
                        title="income"
                        placeholder="Personal Income"
                        className={`input input-bordered input-primary ${
                          errors.income && touched.income && "input-error"
                        }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.income}
                      >
                        <option disabled selected value={undefined}>
                          {t("select")}
                        </option>
                        <option value={Income.LESS_THAN_1500}>
                          {t("lessThan1500")}
                        </option>
                        <option value={Income.MORE_THAN_1500}>
                          {t("moreThan1500")}
                        </option>
                      </Field>
                      <label className="label-text-alt text-error">
                        {errors.income && touched.income && errors.income}
                      </label>
                    </div>
                    <LabelField
                      title={t("incomeDoc")}
                      value={values.income_doc}
                      errors={errors.income_doc}
                      touched={touched.income_doc}
                      fieldName={"income_doc"}
                      type="file"
                      onFile={(file) =>
                        setDocs({
                          ...docs,
                          income_doc: file,
                        })
                      }
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldError={setFieldError}
                      setFieldValue={setFieldValue}
                      labelComponent={
                        <GetStorageLinkComponent
                          storageKey={student?.m_incomeDoc}
                        ></GetStorageLinkComponent>
                      }
                    />
                  </>
                )}
                <FormSeparator title={t("guardianInfo")} />
                <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <LabelField
                    title={t("firstName")}
                    value={values.guardian_first_name}
                    errors={errors.guardian_first_name}
                    touched={touched.guardian_first_name}
                    fieldName={"guardian_first_name"}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <LabelField
                    title={t("secondName")}
                    value={values.guardian_second_name}
                    errors={errors.guardian_second_name}
                    touched={touched.guardian_second_name}
                    fieldName={"guardian_second_name"}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <LabelField
                    title={t("thirdName")}
                    value={values.guardian_third_name}
                    errors={errors.guardian_third_name}
                    touched={touched.guardian_third_name}
                    fieldName={"guardian_third_name"}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <LabelField
                    title={t("lastName")}
                    value={values.guardian_last_name}
                    errors={errors.guardian_last_name}
                    touched={touched.guardian_last_name}
                    fieldName={"guardian_last_name"}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                </div>
                <LabelField
                  title={t("guardianCpr")}
                  value={values.guardian_cpr}
                  errors={errors.guardian_cpr}
                  touched={touched.guardian_cpr}
                  fieldName={"guardian_cpr"}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                />
                <LabelField
                  value={values.guardian_cpr_doc}
                  errors={errors.guardian_cpr_doc}
                  touched={touched.guardian_cpr_doc}
                  title={t("guardianCprDoc")}
                  fieldName={"guardian_cpr_doc"}
                  type="file"
                  onFile={(file) =>
                    setDocs({
                      ...docs,
                      guardian_cpr_doc: file,
                    })
                  }
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                  labelComponent={
                    <GetStorageLinkComponent
                      storageKey={student?.m_guardianCPRDoc}
                    ></GetStorageLinkComponent>
                  }
                />
                <LabelField
                  title={t("guardianEmail")}
                  fieldName={"guardian_email"}
                  value={values.guardian_email}
                  errors={errors.guardian_email}
                  touched={touched.guardian_email}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                />
                <LabelField
                  title={t("guardianAddress")}
                  fieldName={"guardian_address"}
                  value={values.guardian_address}
                  errors={errors.guardian_address}
                  touched={touched.guardian_address}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                />
                {!values.isEmployed && (
                  <>
                    <div className="flex flex-col justify-start w-full">
                      <div className="flex items-center">
                        <label className="label">{t("income")}</label>
                        <label className="text-error label">*</label>{" "}
                      </div>

                      <Field
                        dir="ltr"
                        as="select"
                        name="income"
                        title="income"
                        placeholder="Personal Income"
                        className={`input input-bordered input-primary ${
                          errors.income && touched.income && "input-error"
                        }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.income}
                      >
                        <option disabled selected value={undefined}>
                          {t("select")}
                        </option>
                        <option value={Income.LESS_THAN_1500}>
                          {t("lessThan1500")}
                        </option>
                        <option value={Income.MORE_THAN_1500}>
                          {t("moreThan1500")}
                        </option>
                      </Field>
                      <label className="label-text-alt text-error">
                        {errors.income && touched.income && errors.income}
                      </label>
                    </div>
                    <LabelField
                      title={t("incomeDoc")}
                      value={values.income_doc}
                      errors={errors.income_doc}
                      touched={touched.income_doc}
                      fieldName={"income_doc"}
                      type="file"
                      onFile={(file) =>
                        setDocs({
                          ...docs,
                          income_doc: file,
                        })
                      }
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldError={setFieldError}
                      setFieldValue={setFieldValue}
                      labelComponent={
                        <GetStorageLinkComponent
                          storageKey={student?.m_incomeDoc}
                        ></GetStorageLinkComponent>
                      }
                    />
                  </>
                )}
                {dirty && (
                  <div className=" col-span-2">
                    <LabelField
                      title={t("reason")}
                      fieldName={"adminReason"}
                      value={values.adminReason}
                      errors={errors.adminReason}
                      touched={touched.adminReason}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldError={setFieldError}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                )}

                {/* Submit */}
                {dirty && (
                  <button
                    className={` w-full my-3 text-white btn btn-primary md:col-span-2`}
                    type="submit"
                    disabled={updateMutation.isPending || isLoading || !dirty}
                  >
                    {isLoading && <span className="loading"></span>}
                    {t("update")}
                  </button>
                )}
              </div>

              {formErrors && (
                <div className="flex flex-col gap-2 pt-8 error-list">
                  <h2 className="text-lg font-bold">{t("formErrors")}</h2>

                  {/*  Errors */}
                  {formErrors && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-error text-md">
                        {t("applicantInfo")}
                      </h3>
                      <ul className="pl-5 list-disc">
                        {errors.cpr_doc && (
                          <li className="text-error">
                            <strong>{t("cprDoc")}:</strong> {errors.cpr_doc}
                          </li>
                        )}
                        {errors.first_name && (
                          <li className="text-error">
                            <strong>{t("firstName")}:</strong>{" "}
                            {errors.first_name}
                          </li>
                        )}
                        {errors.second_name && (
                          <li className="text-error">
                            <strong>{t("secondName")}:</strong>{" "}
                            {errors.second_name}
                          </li>
                        )}
                        {errors.last_name && (
                          <li className="text-error">
                            <strong>{t("lastName")}:</strong> {errors.last_name}
                          </li>
                        )}
                        {errors.address && (
                          <li className="text-error">
                            <strong>{t("address")}:</strong> {errors.address}
                          </li>
                        )}

                        {errors.phone && (
                          <li className="text-error">
                            <strong>{t("phone")}:</strong> {errors.phone}
                          </li>
                        )}
                        {errors.gender && (
                          <li className="text-error">
                            <strong>{t("gender")}:</strong> {errors.gender}
                          </li>
                        )}
                        {errors.place_of_birth && (
                          <li className="text-error">
                            <strong>{t("placeOfBirth")}:</strong>{" "}
                            {errors.place_of_birth}
                          </li>
                        )}
                        {errors.nationality && (
                          <li className="text-error">
                            <strong>{t("nationality")}:</strong>{" "}
                            {errors.nationality}
                          </li>
                        )}
                        {errors.number_of_family_member && (
                          <li className="text-error">
                            <strong>{t("numberOfFamilyMembers")}:</strong>{" "}
                            {errors.number_of_family_member}
                          </li>
                        )}
                        {errors.graduation_year && (
                          <li className="text-error">
                            <strong>{t("graduationYear")}:</strong>{" "}
                            {errors.graduation_year}
                          </li>
                        )}
                        {errors.universityID && (
                          <li className="text-error">
                            <strong>{t("university")}:</strong>{" "}
                            {errors.universityID}
                          </li>
                        )}
                        {errors.old_program && (
                          <li className="text-error">
                            <strong>{t("graduationProgram")}:</strong>{" "}
                            {errors.old_program}
                          </li>
                        )}
                        {errors.isEmployed && (
                          <li className="text-error">
                            <strong>{t("employment")}:</strong>{" "}
                            {errors.isEmployed}
                          </li>
                        )}
                        {values.isEmployed && (
                          <>
                            {errors.place_of_employment && (
                              <li className="text-error">
                                <strong>{t("placeOfEmployment")}:</strong>{" "}
                                {errors.place_of_employment}
                              </li>
                            )}
                            {errors.income && (
                              <li className="text-error">
                                <strong>{t("income")}:</strong> {errors.income}
                              </li>
                            )}
                            {errors.income_doc && (
                              <li className="text-error">
                                <strong>{t("incomeDoc")}:</strong>{" "}
                                {errors.income_doc}
                              </li>
                            )}
                          </>
                        )}
                        {(errors.guardian_first_name ||
                          errors.guardian_second_name ||
                          errors.guardian_third_name ||
                          errors.guardian_last_name) && (
                          <li className="text-error">
                            <strong>{t("guardianFullName")}:</strong>{" "}
                            {errors.guardian_first_name ||
                              errors.guardian_second_name ||
                              errors.guardian_third_name ||
                              errors.guardian_last_name}
                          </li>
                        )}
                        {errors.guardian_cpr && (
                          <li className="text-error">
                            <strong>{t("guardianCpr")}:</strong>{" "}
                            {errors.guardian_cpr}
                          </li>
                        )}
                        {errors.guardian_cpr_doc && (
                          <li className="text-error">
                            <strong>{t("guardianCprDoc")}:</strong>{" "}
                            {errors.guardian_cpr_doc}
                          </li>
                        )}
                        {!values.isEmployed && (
                          <>
                            {errors.income && (
                              <li className="text-error">
                                <strong>{t("income")}:</strong> {errors.income}
                              </li>
                            )}
                            {errors.income_doc && (
                              <li className="text-error">
                                <strong>{t("incomeDoc")}:</strong>{" "}
                                {errors.income_doc}
                              </li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

type TLabelField = {
  title: string;
  fieldName: string;
  type?: string;
  value: any;
  errors: any;
  touched: any;
  disabled?: boolean;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  setFieldError: (field: string, message: string | undefined) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  onFile?: (file: File) => void;
  labelComponent?: ReactNode;
};

const LabelField: FC<TLabelField> = ({
  errors,
  touched,
  value,
  handleChange,
  handleBlur,
  title,
  type = "text",
  fieldName,
  setFieldError,
  setFieldValue,
  onFile,
  labelComponent,
  disabled,
}) => {
  const { t } = useTranslation("account");

  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex items-center">
        <label className="w-full h-10 label">
          <div className="flex justify-between w-full gap-2">
            <p className="inline-flex gap-1">
              {title}

              {type !== "file" && <span className="text-error">*</span>}
            </p>
            <div className="text-end">{labelComponent}</div>
          </div>
        </label>
      </div>

      {type === "phone" && (
        <PhoneNumberInput
          type={type}
          name={fieldName}
          title={fieldName}
          placeholder={title}
          className={cn(
            "input input-bordered input-primary",
            errors && touched && "input-error"
          )}
          onChange={(val) => setFieldValue(fieldName, (val ?? "")?.toString())}
          onBlur={handleBlur}
          value={value}
          disabled={disabled}
        />
      )}
      {type !== "phone" && (
        <Field
          className={cn(
            type === "file"
              ? "file-input file-input-bordered file-input-primary"
              : "input input-bordered input-primary",

            errors && touched && "input-error"
          )}
          disabled={disabled}
          type={type}
          name={fieldName}
          alt={t(`${fieldName}`)}
          title={fieldName}
          placeholder={title}
          onBlur={handleBlur}
          value={value}
          onChange={(e: any) => {
            if (type === "file") {
              const reader = new FileReader();
              const file: File = e.target.files[0];

              reader.onload = () => {
                if (reader.readyState === 2) {
                  // Check file size (2MB = 2 * 1024 * 1024 bytes)
                  if (file.size > 2 * 1024 * 1024) {
                    setFieldError(fieldName, "File size must be less than 2MB");
                    return;
                  }

                  // Check file type
                  const allowedTypes = [
                    "image/jpeg", // Allow JPEG images
                    "image/png", // Allow PNG images
                    "application/pdf", // Allow PDFs
                    // "application/msword", // Allow old Word documents (.doc)
                    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Allow modern Word documents (.docx)
                  ];

                  if (!allowedTypes.includes(file.type)) {
                    setFieldError(fieldName, "File must be an image or PDF");
                    return;
                  }

                  onFile && onFile(file);
                }
              };

              if (file) {
                reader.readAsDataURL(file);
              }
            }

            handleChange(e);
          }}
        />
      )}
      <label className="pt-2 label-text-alt text-error">
        {errors && touched && errors}
      </label>
    </div>
  );
};

export const FormSeparator = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-4 md:col-span-2">
      <div className="h-[1px] bg-zinc-300 flex-1"></div>
      <p>{title}</p>
      <div className="h-[1px] bg-zinc-300 flex-1"></div>
    </div>
  );
};
