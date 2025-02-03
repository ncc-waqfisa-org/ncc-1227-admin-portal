import {
  CreateAdminLogMutationVariables,
  FamilyIncome,
  Gender,
  Language,
  Nationality,
  SchoolType,
  Student,
  UpdateStudentMutationVariables,
} from "../../src/API";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import "yup-phone";
import {
  updateStudentInDB,
  uploadFile,
  DocType,
  createAdminLogInDB,
} from "../../src/CustomAPI";
import { toast } from "react-hot-toast";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import MultiUpload from "../MultiUpload";
import { checkIfFilesAreTooBig } from "../../src/Helpers";
import GetStorageLinkComponent from "../get-storage-link-component";
import { PhoneNumberInput } from "../phone";
import { createStudentInfoChangeSnapshot } from "./studentAdminLog";
import { useAuth } from "../../hooks/use-auth";
import { TextField } from "@aws-amplify/ui-react";
import React from "react";
import { format } from "date-fns";

interface Props {
  student: Student;
  applicationId?: string;
}

interface FormValues {
  cprDocFile: string | null | undefined;
  fullName: string | null | undefined;
  firstName: string | null | undefined;
  secondName: string | null | undefined;
  thirdName: string | null | undefined;
  lastName: string | null | undefined;
  dob: string | null | undefined;
  phone: string | null | undefined;
  gender: Gender | null | undefined;
  schoolName: string | null | undefined;
  schoolType: SchoolType | null | undefined;
  specialization: string | null | undefined;
  placeOfBirth: string | null | undefined;

  familyIncome: FamilyIncome | null | undefined;
  familyIncomeProofDocs: (string | null)[] | null | undefined;
  familyIncomeProofDocsFile: File[];

  nationality: string | null | undefined;
  nationalityCategory: Nationality | null | undefined;
  studentOrderAmongSiblings: number | null | undefined;
  preferredLanguage: Language | null | undefined;
  graduationDate: string | null | undefined;
  address: string | null | undefined;
  adminReason: string | null | undefined;
}

export default function ViewAccount({ student, applicationId }: Props) {
  const { t } = useTranslation("applications");
  const { t: tErrors } = useTranslation("errors");
  const { cpr: adminCpr } = useAuth();

  const [familyIncomeProofDocsFile, setFamilyIncomeProofDocsFile] = useState<
    File[]
  >([]);
  const [familyIncomeProofInvalid, setFamilyIncomeProofInvalid] =
    useState<boolean>(false);
  const [cprDoc, setCprDoc] = useState<File | undefined>(undefined);

  let initialValues: FormValues = {
    adminReason: undefined,
    cprDocFile: undefined,
    fullName: student.fullName,
    phone: student.phone,
    gender: student.gender,
    schoolName: student.schoolName,
    schoolType: student.schoolType,
    specialization: student.specialization,
    placeOfBirth: student.placeOfBirth,
    familyIncome: student.familyIncome,
    familyIncomeProofDocs: student.familyIncomeProofDocs ?? [],
    familyIncomeProofDocsFile: [],
    nationality: student.nationality,
    nationalityCategory: student.nationalityCategory,
    studentOrderAmongSiblings: student.studentOrderAmongSiblings,
    preferredLanguage: student.preferredLanguage,
    graduationDate: student.graduationDate,
    address: student.address,
    dob: student.dob,
    firstName: student.firstName,
    secondName: student.secondName,
    thirdName: student.thirdName,
    lastName: student.lastName,
  };

  async function updateProcess(inputs: UpdateStudentMutationVariables) {
    return await updateStudentInDB(inputs).then(async (value) => {
      if (value === undefined) {
        throw new Error("Failed to update");
      }
      return value;
    });
  }

  async function newAdminLog(
    applicationId: string,
    oldData: any,
    newData: any,
    adminReason: string | null | undefined
  ) {
    const snapshot = createStudentInfoChangeSnapshot(oldData, newData);

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

  const [dateOfBirth, setDateOfBirth] = React.useState(initialValues.dob);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        cprDoc: yup.string(),
        cprDocFile: yup.mixed(),
        phone: yup
          .string()
          .phone()
          .required(`${tErrors("requiredField")}`),
        fullName: yup.string().required(`${tErrors("requiredField")}`),
        gender: yup.string().required(`${tErrors("requiredField")}`),
        schoolName: yup.string().required(`${tErrors("requiredField")}`),
        schoolType: yup.string().required(`${tErrors("requiredField")}`),
        specialization: yup.string().required(`${tErrors("requiredField")}`),
        address: yup.string().required(`${tErrors("requiredField")}`),
        placeOfBirth: yup.string().required(`${tErrors("requiredField")}`),
        familyIncome: yup.string().required(`${tErrors("requiredField")}`),
        familyIncomeProofDocs: yup.array(yup.string().nullable()),
        familyIncomeProofDocsFile: yup.array(yup.string()),
        nationalityCategory: yup
          .string()
          .required(`${tErrors("requiredField")}`),
        studentOrderAmongSiblings: yup
          .number()
          .required(`${tErrors("requiredField")}`),
        preferredLanguage: yup.string().required(`${tErrors("requiredField")}`),
        graduationDate: yup.date().required(`${tErrors("requiredField")}`),
        adminReason: yup.string().required(`${tErrors("requiredField")}`),
      })}
      onSubmit={async (values, actions) => {
        const cprDocStorage = cprDoc
          ? await toast.promise(uploadFile(cprDoc, DocType.CPR, student.cpr), {
              loading: "Uploading...",
              success: "CPR uploaded successfully",
              error: (err) => {
                return `${err.message}`;
              },
            })
          : student.cprDoc;

        // TODO: make sure
        const storageKeys =
          familyIncomeProofDocsFile.length > 0
            ? await toast.promise(
                Promise.all([
                  ...familyIncomeProofDocsFile.map((f, index) =>
                    uploadFile(
                      f,
                      DocType.FAMILY_INCOME_PROOF,
                      student.cpr,
                      index
                    )
                  ),
                ]),
                {
                  loading: "Uploading...",
                  success: "Family income proofs uploaded successfully",
                  error: (err) => {
                    return `${err.message}`;
                  },
                }
              )
            : student.familyIncomeProofDocs;

        let updateVars: UpdateStudentMutationVariables = {
          input: {
            cpr: student.cpr,
            cprDoc: cprDocStorage,
            phone: values.phone,
            fullName: values.fullName,
            gender: values.gender,
            schoolName: values.schoolName,
            schoolType: values.schoolType,
            specialization: values.specialization,
            placeOfBirth: values.placeOfBirth,
            nationality: values.nationalityCategory?.toString(),
            nationalityCategory: values.nationalityCategory,
            studentOrderAmongSiblings: values.studentOrderAmongSiblings,
            familyIncome: values.familyIncome,
            familyIncomeProofDocs: storageKeys,
            preferredLanguage: values.preferredLanguage,
            graduationDate: values.graduationDate,
            address: values.address,
            _version: student._version,
          },
        };

        await toast.promise(updateProcess(updateVars), {
          loading: "Updating...",
          success: "Updated successfully",
          error: (err) => {
            return `${err.message}`;
          },
        });

        applicationId &&
          (await newAdminLog(
            applicationId,
            { ...initialValues, cprDocFile: student.cprDoc },
            updateVars.input,
            values.adminReason
          ));

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
        setFieldError,
        setFieldValue,
        dirty,
      }) => (
        <Form className="container grid items-end max-w-3xl grid-cols-1 gap-3 mx-auto md:grid-cols-2">
          {/* CPR */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("cpr")}</label>
            <Field
              dir="ltr"
              type="text"
              name="cpr"
              title="cpr"
              placeholder="CPR"
              className={`input input-bordered input-primary `}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
              value={student.cpr ?? ""}
            />
          </div>
          {/* cprDoc */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">
              {t("studentCPRdoc")}
              <GetStorageLinkComponent
                storageKey={student.cprDoc}
              ></GetStorageLinkComponent>
            </label>
            {
              <Field
                dir="ltr"
                type="file"
                accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps,application/msword"
                id="cprDocFile"
                name="cprDocFile"
                title="cprDocFile"
                placeholder="CPR Doc"
                className={`file-input file-input-bordered file-input-primary  text-primary-content ${
                  errors.cprDocFile && "input-error"
                }`}
                onChange={(event: any) => {
                  let file: File | undefined = event.currentTarget.files[0];

                  let isValid = checkIfFilesAreTooBig(file);
                  if (isValid) {
                    setCprDoc(file);
                    handleChange(event);
                  } else {
                    setFieldError("cprDoc", "File is too large");
                  }
                }}
                onBlur={handleBlur}
                value={values.cprDocFile ?? ""}
              />
            }
            <label className="label-text-alt text-error">
              {errors.cprDocFile && touched.cprDocFile && errors.cprDocFile}
            </label>
          </div>
          {/* Email */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("emailAddress")}</label>
            <Field
              dir="ltr"
              type="email"
              name="email"
              title="email"
              placeholder="Email"
              className={`input input-bordered input-primary`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={student.email}
              disabled
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("phoneNumber")}</label>
            {/* <Field
              dir="ltr"
              type="phone"
              name="phone"
              title="phone"
              placeholder="Phone (+973)"
              className={`input input-bordered input-primary ${
                errors.phone && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
            /> */}
            <PhoneNumberInput
              dir="ltr"
              type="phone"
              name="phone"
              title="phone"
              placeholder={`${t("phone")} (+973)`}
              className={`input input-bordered input-primary ${
                errors.phone && touched.phone && "input-error"
              }`}
              onChange={(value) =>
                setFieldValue("phone", (value ?? "")?.toString())
              }
              onBlur={handleBlur}
              value={values.phone ?? ""}
            />
            <label className="label-text-alt text-error">
              {errors.phone && touched.phone && errors.phone}
            </label>
          </div>

          {/* FullName */}
          <div className=" md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("firstName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="firstName"
                title="firstName"
                placeholder="First name"
                className={`input input-bordered input-primary`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
              />
              <label className="label-text-alt text-error">
                {errors.firstName && touched.firstName && errors.firstName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("secondName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="secondName"
                title="secondName"
                placeholder="Second name"
                className={`input input-bordered input-primary`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.secondName}
              />
              <label className="label-text-alt text-error">
                {errors.secondName && touched.secondName && errors.secondName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("thirdName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="thirdName"
                title="thirdName"
                placeholder="Third name"
                className={`input input-bordered input-primary`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.thirdName}
              />
              <label className="label-text-alt text-error">
                {errors.thirdName && touched.thirdName && errors.thirdName}
              </label>
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="label">{t("lastName")}</label>
              <Field
                dir="ltr"
                type="text"
                name="lastName"
                title="lastName"
                placeholder="Last name"
                className={`input input-bordered input-primary`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
              />
              <label className="label-text-alt text-error">
                {errors.lastName && touched.lastName && errors.lastName}
              </label>
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("gender")}</label>
            <Field
              dir="ltr"
              as="select"
              name="gender"
              title="gender"
              placeholder="Gender"
              className={`input input-bordered input-primary ${
                errors.gender && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.gender}
            >
              <option disabled selected value={undefined}>
                Select
              </option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
            </Field>
            <label className="label-text-alt text-error">
              {errors.gender && touched.gender && errors.gender}
            </label>
          </div>

          {/* address */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("address")}</label>
            <Field
              dir="ltr"
              type="text"
              name="address"
              title="address"
              placeholder="Student Address"
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

          {/* schoolName */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("schoolName")}</label>
            <Field
              dir="ltr"
              type="text"
              name="schoolName"
              title="schoolName"
              placeholder="School name"
              className={`input input-bordered input-primary ${
                errors.schoolName && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.schoolName}
            />
            <label className="label-text-alt text-error">
              {errors.schoolName && touched.schoolName && errors.schoolName}
            </label>
          </div>

          {/* schoolType */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("schoolType")}</label>
            <Field
              dir="ltr"
              as="select"
              name="schoolType"
              title="schoolType"
              placeholder="Preferred Language"
              className={`input input-bordered input-primary ${
                errors.schoolType && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.schoolType}
            >
              <option disabled selected value={undefined}>
                Select
              </option>
              <option value={SchoolType.PRIVATE}>
                {t(SchoolType.PRIVATE)}
              </option>
              <option value={SchoolType.PUBLIC}>{t(SchoolType.PUBLIC)}</option>
            </Field>
            <label className="label-text-alt text-error">
              {errors.schoolType && touched.schoolType && errors.schoolType}
            </label>
          </div>

          {/* specialization */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("specialization")}</label>
            <Field
              dir="ltr"
              type="text"
              name="specialization"
              title="specialization"
              placeholder="Specialization"
              className={`input input-bordered input-primary ${
                errors.specialization && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.specialization}
            />
            <label className="label-text-alt text-error">
              {errors.specialization &&
                touched.specialization &&
                errors.specialization}
            </label>
          </div>
          {/* placeOfBirth */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("placeOfBirth")}</label>
            <Field
              dir="ltr"
              type="text"
              name="placeOfBirth"
              title="placeOfBirth"
              placeholder="Place Of Birth"
              className={`input input-bordered input-primary ${
                errors.placeOfBirth && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.placeOfBirth}
            />
            <label className="label-text-alt text-error">
              {errors.placeOfBirth &&
                touched.placeOfBirth &&
                errors.placeOfBirth}
            </label>
          </div>

          {/* nationality */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("nationality")}</label>
            <Field
              dir="ltr"
              as="select"
              name="nationalityCategory"
              title="nationalityCategory"
              placeholder={t("nationality")}
              className={`input input-bordered input-primary ${
                errors.nationalityCategory &&
                touched.nationalityCategory &&
                "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.nationalityCategory}
            >
              <option disabled selected value={undefined}>
                {t("select")}
              </option>
              <option value={Nationality.BAHRAINI}>
                {t(Nationality.BAHRAINI)}
              </option>
              <option value={Nationality.NON_BAHRAINI}>
                {t(Nationality.NON_BAHRAINI)}
              </option>
            </Field>
            {/* <Field
              dir="ltr"
              type="text"
              name="nationalityCategory"
              title="nationalityCategory"
              placeholder="nationality"
              className={`input input-bordered input-primary ${
                errors.nationalityCategory && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.nationalityCategory}
            /> */}
            <label className="label-text-alt text-error">
              {errors.nationalityCategory &&
                touched.nationalityCategory &&
                errors.nationalityCategory}
            </label>
          </div>

          <TextField
            label={t("dateOfBirth")}
            isRequired={false}
            isReadOnly={false}
            type="date"
            value={dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : undefined}
            onChange={(e) => {
              let { value } = e.target;
              const date = new Date(value);
              setDateOfBirth(date.toISOString());

              handleChange(date.toISOString());
            }}
            errorMessage={errors.dob}
          ></TextField>

          {/* Student Order Among Siblings */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("studentOrderAmongSiblings")}</label>
            <Field
              dir="ltr"
              type="number"
              name="studentOrderAmongSiblings"
              title="studentOrderAmongSiblings"
              placeholder="Student Order Among Siblings"
              className={`input input-bordered input-primary ${
                errors.studentOrderAmongSiblings && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.studentOrderAmongSiblings}
            />
            <label className="label-text-alt text-error">
              {errors.studentOrderAmongSiblings &&
                touched.studentOrderAmongSiblings &&
                errors.studentOrderAmongSiblings}
            </label>
          </div>

          {/* familyIncome */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("familyIncome")}</label>
            <Field
              dir="ltr"
              as="select"
              name="familyIncome"
              title="familyIncome"
              placeholder="Preferred Language"
              className={`input input-bordered input-primary ${
                errors.familyIncome && touched.familyIncome && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.familyIncome}
            >
              <option disabled selected value={undefined}>
                {t("select")}
              </option>
              <option value={FamilyIncome.LESS_THAN_1500}>
                {t("lessThan1500")}
              </option>
              <option value={FamilyIncome.MORE_THAN_1500}>
                {t("moreThan1500")}
              </option>
            </Field>
            {/* <Field
              dir="ltr"
              as="select"
              name="familyIncome"
              title="familyIncome"
              placeholder="Preferred Language"
              className={`input input-bordered input-primary ${
                errors.familyIncome && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.familyIncome}
            >
              <option disabled selected value={undefined}>
                Select
              </option>

              <option value={FamilyIncome.LESS_THAN_500}>Less than 500</option>
              <option value={FamilyIncome.BETWEEN_500_AND_700}>500-700</option>
              <option value={FamilyIncome.BETWEEN_700_AND_1000}>
                700-1000
              </option>
              <option value={FamilyIncome.OVER_1000}>More than 1000</option>
            </Field> */}
            <label className="label-text-alt text-error">
              {errors.familyIncome &&
                touched.familyIncome &&
                errors.familyIncome}
            </label>
          </div>
          {/* Family income proof */}
          <div className="justify-start md:col-span-2">
            <MultiUpload
              single
              onFiles={(files) => {
                setFamilyIncomeProofDocsFile(files);
              }}
              isInvalid={setFamilyIncomeProofInvalid}
              handleChange={(event) => {
                handleChange(event);
              }}
              handleOnClear={() => {
                setFamilyIncomeProofDocsFile([]);
              }}
              value={values.familyIncomeProofDocsFile ?? ""}
              filedName={"familyIncomeProofDocsFile"}
              title={`${t("familyIncomeProofDoc")}`}
              storageKeys={student.familyIncomeProofDocs}
            ></MultiUpload>
          </div>

          {/* preferredLanguage */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("preferredLanguage")}</label>
            <Field
              dir="ltr"
              as="select"
              name="preferredLanguage"
              title="preferredLanguage"
              placeholder="Preferred Language"
              className={`input input-bordered input-primary ${
                errors.preferredLanguage && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.preferredLanguage}
            >
              <option disabled selected value={undefined}>
                Select
              </option>
              <option value={Language.ARABIC}>Arabic</option>
              <option value={Language.ENGLISH}>English</option>
            </Field>
            <label className="label-text-alt text-error">
              {errors.preferredLanguage &&
                touched.preferredLanguage &&
                errors.preferredLanguage}
            </label>
          </div>

          {/* graduationDate */}
          <div className="flex flex-col justify-start w-full">
            <label className="label">{t("graduationDate")}</label>
            <Field
              dir="ltr"
              type="date"
              name="graduationDate"
              title="graduationDate"
              placeholder="Graduation Date"
              className={`input input-bordered input-primary ${
                errors.graduationDate && "input-error"
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.graduationDate}
            />
            <label className="label-text-alt text-error">
              {errors.graduationDate &&
                touched.graduationDate &&
                errors.graduationDate}
            </label>
          </div>

          {/* adminReason */}
          <div className="flex flex-col md:col-span-2 justify-start w-full">
            <label className="label">{t("adminReason")}</label>
            <Field
              dir="ltr"
              type="text"
              name="adminReason"
              title="adminReason"
              placeholder={
                t("adminReasonD") ??
                "Enter your reason for updating the student."
              }
              className={`input input-bordered input-primary`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.adminReason}
            />
            <label className="label-text-alt text-error">
              {errors.adminReason && touched.adminReason && errors.adminReason}
            </label>
          </div>

          {/* Submit */}
          {
            <button
              className="my-3 text-white md:col-span-2 btn btn-primary"
              type="submit"
              disabled={
                isSubmitting ||
                !isValid ||
                !dirty ||
                familyIncomeProofInvalid ||
                (familyIncomeProofDocsFile.length === 0 &&
                  (student.familyIncomeProofDocs ?? []).length === 0)
              }
            >
              {t("update")}
            </button>
          }
        </Form>
      )}
    </Formik>
  );
}
