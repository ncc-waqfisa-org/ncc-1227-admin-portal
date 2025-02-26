/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SelectField,
  SwitchField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { Student } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function StudentCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    cpr: "",
    cprDoc: "",
    fullName: "",
    batch: "",
    email: "",
    phone: "",
    gender: "",
    nationalityCategory: "",
    nationality: "",
    schoolName: "",
    schoolType: "",
    specialization: "",
    placeOfBirth: "",
    studentOrderAmongSiblings: "",
    familyIncome: "",
    familyIncomeProofDoc: "",
    familyIncomeProofDocs: [],
    preferredLanguage: "",
    graduationDate: "",
    address: "",
    firstName: "",
    secondName: "",
    thirdName: "",
    lastName: "",
    dob: "",
    schoolMajor: "",
    m_firstName: "",
    m_secondName: "",
    m_thirdName: "",
    m_lastName: "",
    m_numberOfFamilyMembers: "",
    m_graduationYear: "",
    m_oldProgram: "",
    m_applicantType: [],
    m_isEmployed: false,
    m_placeOfEmployment: "",
    m_income: "",
    m_incomeDoc: "",
    m_guardianCPR: "",
    m_guardianFullName: "",
    m_guardianCPRDoc: "",
    m_guardianFirstName: "",
    m_guardianSecondName: "",
    m_guardianThirdName: "",
    m_guardianLastName: "",
    m_guardianEmail: "",
    m_guardianAddress: "",
  };
  const [cpr, setCpr] = React.useState(initialValues.cpr);
  const [cprDoc, setCprDoc] = React.useState(initialValues.cprDoc);
  const [fullName, setFullName] = React.useState(initialValues.fullName);
  const [batch, setBatch] = React.useState(initialValues.batch);
  const [email, setEmail] = React.useState(initialValues.email);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [gender, setGender] = React.useState(initialValues.gender);
  const [nationalityCategory, setNationalityCategory] = React.useState(
    initialValues.nationalityCategory
  );
  const [nationality, setNationality] = React.useState(
    initialValues.nationality
  );
  const [schoolName, setSchoolName] = React.useState(initialValues.schoolName);
  const [schoolType, setSchoolType] = React.useState(initialValues.schoolType);
  const [specialization, setSpecialization] = React.useState(
    initialValues.specialization
  );
  const [placeOfBirth, setPlaceOfBirth] = React.useState(
    initialValues.placeOfBirth
  );
  const [studentOrderAmongSiblings, setStudentOrderAmongSiblings] =
    React.useState(initialValues.studentOrderAmongSiblings);
  const [familyIncome, setFamilyIncome] = React.useState(
    initialValues.familyIncome
  );
  const [familyIncomeProofDoc, setFamilyIncomeProofDoc] = React.useState(
    initialValues.familyIncomeProofDoc
  );
  const [familyIncomeProofDocs, setFamilyIncomeProofDocs] = React.useState(
    initialValues.familyIncomeProofDocs
  );
  const [preferredLanguage, setPreferredLanguage] = React.useState(
    initialValues.preferredLanguage
  );
  const [graduationDate, setGraduationDate] = React.useState(
    initialValues.graduationDate
  );
  const [address, setAddress] = React.useState(initialValues.address);
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [secondName, setSecondName] = React.useState(initialValues.secondName);
  const [thirdName, setThirdName] = React.useState(initialValues.thirdName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [dob, setDob] = React.useState(initialValues.dob);
  const [schoolMajor, setSchoolMajor] = React.useState(
    initialValues.schoolMajor
  );
  const [m_firstName, setM_firstName] = React.useState(
    initialValues.m_firstName
  );
  const [m_secondName, setM_secondName] = React.useState(
    initialValues.m_secondName
  );
  const [m_thirdName, setM_thirdName] = React.useState(
    initialValues.m_thirdName
  );
  const [m_lastName, setM_lastName] = React.useState(initialValues.m_lastName);
  const [m_numberOfFamilyMembers, setM_numberOfFamilyMembers] = React.useState(
    initialValues.m_numberOfFamilyMembers
  );
  const [m_graduationYear, setM_graduationYear] = React.useState(
    initialValues.m_graduationYear
  );
  const [m_oldProgram, setM_oldProgram] = React.useState(
    initialValues.m_oldProgram
  );
  const [m_applicantType, setM_applicantType] = React.useState(
    initialValues.m_applicantType
  );
  const [m_isEmployed, setM_isEmployed] = React.useState(
    initialValues.m_isEmployed
  );
  const [m_placeOfEmployment, setM_placeOfEmployment] = React.useState(
    initialValues.m_placeOfEmployment
  );
  const [m_income, setM_income] = React.useState(initialValues.m_income);
  const [m_incomeDoc, setM_incomeDoc] = React.useState(
    initialValues.m_incomeDoc
  );
  const [m_guardianCPR, setM_guardianCPR] = React.useState(
    initialValues.m_guardianCPR
  );
  const [m_guardianFullName, setM_guardianFullName] = React.useState(
    initialValues.m_guardianFullName
  );
  const [m_guardianCPRDoc, setM_guardianCPRDoc] = React.useState(
    initialValues.m_guardianCPRDoc
  );
  const [m_guardianFirstName, setM_guardianFirstName] = React.useState(
    initialValues.m_guardianFirstName
  );
  const [m_guardianSecondName, setM_guardianSecondName] = React.useState(
    initialValues.m_guardianSecondName
  );
  const [m_guardianThirdName, setM_guardianThirdName] = React.useState(
    initialValues.m_guardianThirdName
  );
  const [m_guardianLastName, setM_guardianLastName] = React.useState(
    initialValues.m_guardianLastName
  );
  const [m_guardianEmail, setM_guardianEmail] = React.useState(
    initialValues.m_guardianEmail
  );
  const [m_guardianAddress, setM_guardianAddress] = React.useState(
    initialValues.m_guardianAddress
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCpr(initialValues.cpr);
    setCprDoc(initialValues.cprDoc);
    setFullName(initialValues.fullName);
    setBatch(initialValues.batch);
    setEmail(initialValues.email);
    setPhone(initialValues.phone);
    setGender(initialValues.gender);
    setNationalityCategory(initialValues.nationalityCategory);
    setNationality(initialValues.nationality);
    setSchoolName(initialValues.schoolName);
    setSchoolType(initialValues.schoolType);
    setSpecialization(initialValues.specialization);
    setPlaceOfBirth(initialValues.placeOfBirth);
    setStudentOrderAmongSiblings(initialValues.studentOrderAmongSiblings);
    setFamilyIncome(initialValues.familyIncome);
    setFamilyIncomeProofDoc(initialValues.familyIncomeProofDoc);
    setFamilyIncomeProofDocs(initialValues.familyIncomeProofDocs);
    setCurrentFamilyIncomeProofDocsValue("");
    setPreferredLanguage(initialValues.preferredLanguage);
    setGraduationDate(initialValues.graduationDate);
    setAddress(initialValues.address);
    setFirstName(initialValues.firstName);
    setSecondName(initialValues.secondName);
    setThirdName(initialValues.thirdName);
    setLastName(initialValues.lastName);
    setDob(initialValues.dob);
    setSchoolMajor(initialValues.schoolMajor);
    setM_firstName(initialValues.m_firstName);
    setM_secondName(initialValues.m_secondName);
    setM_thirdName(initialValues.m_thirdName);
    setM_lastName(initialValues.m_lastName);
    setM_numberOfFamilyMembers(initialValues.m_numberOfFamilyMembers);
    setM_graduationYear(initialValues.m_graduationYear);
    setM_oldProgram(initialValues.m_oldProgram);
    setM_applicantType(initialValues.m_applicantType);
    setCurrentM_applicantTypeValue("");
    setM_isEmployed(initialValues.m_isEmployed);
    setM_placeOfEmployment(initialValues.m_placeOfEmployment);
    setM_income(initialValues.m_income);
    setM_incomeDoc(initialValues.m_incomeDoc);
    setM_guardianCPR(initialValues.m_guardianCPR);
    setM_guardianFullName(initialValues.m_guardianFullName);
    setM_guardianCPRDoc(initialValues.m_guardianCPRDoc);
    setM_guardianFirstName(initialValues.m_guardianFirstName);
    setM_guardianSecondName(initialValues.m_guardianSecondName);
    setM_guardianThirdName(initialValues.m_guardianThirdName);
    setM_guardianLastName(initialValues.m_guardianLastName);
    setM_guardianEmail(initialValues.m_guardianEmail);
    setM_guardianAddress(initialValues.m_guardianAddress);
    setErrors({});
  };
  const [
    currentFamilyIncomeProofDocsValue,
    setCurrentFamilyIncomeProofDocsValue,
  ] = React.useState("");
  const familyIncomeProofDocsRef = React.createRef();
  const [currentM_applicantTypeValue, setCurrentM_applicantTypeValue] =
    React.useState("");
  const m_applicantTypeRef = React.createRef();
  const getDisplayValue = {
    m_applicantType: (r) => {
      const enumDisplayValueMap = {
        STUDENT: "Student",
        MASTER: "Master",
      };
      return enumDisplayValueMap[r];
    },
  };
  const validations = {
    cpr: [{ type: "Required" }],
    cprDoc: [],
    fullName: [],
    batch: [],
    email: [],
    phone: [],
    gender: [],
    nationalityCategory: [],
    nationality: [],
    schoolName: [],
    schoolType: [],
    specialization: [],
    placeOfBirth: [],
    studentOrderAmongSiblings: [],
    familyIncome: [],
    familyIncomeProofDoc: [],
    familyIncomeProofDocs: [],
    preferredLanguage: [],
    graduationDate: [],
    address: [],
    firstName: [],
    secondName: [],
    thirdName: [],
    lastName: [],
    dob: [],
    schoolMajor: [],
    m_firstName: [],
    m_secondName: [],
    m_thirdName: [],
    m_lastName: [],
    m_numberOfFamilyMembers: [],
    m_graduationYear: [],
    m_oldProgram: [],
    m_applicantType: [],
    m_isEmployed: [],
    m_placeOfEmployment: [],
    m_income: [],
    m_incomeDoc: [],
    m_guardianCPR: [],
    m_guardianFullName: [],
    m_guardianCPRDoc: [],
    m_guardianFirstName: [],
    m_guardianSecondName: [],
    m_guardianThirdName: [],
    m_guardianLastName: [],
    m_guardianEmail: [],
    m_guardianAddress: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          cpr,
          cprDoc,
          fullName,
          batch,
          email,
          phone,
          gender,
          nationalityCategory,
          nationality,
          schoolName,
          schoolType,
          specialization,
          placeOfBirth,
          studentOrderAmongSiblings,
          familyIncome,
          familyIncomeProofDoc,
          familyIncomeProofDocs,
          preferredLanguage,
          graduationDate,
          address,
          firstName,
          secondName,
          thirdName,
          lastName,
          dob,
          schoolMajor,
          m_firstName,
          m_secondName,
          m_thirdName,
          m_lastName,
          m_numberOfFamilyMembers,
          m_graduationYear,
          m_oldProgram,
          m_applicantType,
          m_isEmployed,
          m_placeOfEmployment,
          m_income,
          m_incomeDoc,
          m_guardianCPR,
          m_guardianFullName,
          m_guardianCPRDoc,
          m_guardianFirstName,
          m_guardianSecondName,
          m_guardianThirdName,
          m_guardianLastName,
          m_guardianEmail,
          m_guardianAddress,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(new Student(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "StudentCreateForm")}
      {...rest}
    >
      <TextField
        label="Cpr"
        isRequired={true}
        isReadOnly={false}
        value={cpr}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr: value,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.cpr ?? value;
          }
          if (errors.cpr?.hasError) {
            runValidationTasks("cpr", value);
          }
          setCpr(value);
        }}
        onBlur={() => runValidationTasks("cpr", cpr)}
        errorMessage={errors.cpr?.errorMessage}
        hasError={errors.cpr?.hasError}
        {...getOverrideProps(overrides, "cpr")}
      ></TextField>
      <TextField
        label="Cpr doc"
        isRequired={false}
        isReadOnly={false}
        value={cprDoc}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc: value,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.cprDoc ?? value;
          }
          if (errors.cprDoc?.hasError) {
            runValidationTasks("cprDoc", value);
          }
          setCprDoc(value);
        }}
        onBlur={() => runValidationTasks("cprDoc", cprDoc)}
        errorMessage={errors.cprDoc?.errorMessage}
        hasError={errors.cprDoc?.hasError}
        {...getOverrideProps(overrides, "cprDoc")}
      ></TextField>
      <TextField
        label="Full name"
        isRequired={false}
        isReadOnly={false}
        value={fullName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName: value,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.fullName ?? value;
          }
          if (errors.fullName?.hasError) {
            runValidationTasks("fullName", value);
          }
          setFullName(value);
        }}
        onBlur={() => runValidationTasks("fullName", fullName)}
        errorMessage={errors.fullName?.errorMessage}
        hasError={errors.fullName?.hasError}
        {...getOverrideProps(overrides, "fullName")}
      ></TextField>
      <TextField
        label="Batch"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={batch}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch: value,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.batch ?? value;
          }
          if (errors.batch?.hasError) {
            runValidationTasks("batch", value);
          }
          setBatch(value);
        }}
        onBlur={() => runValidationTasks("batch", batch)}
        errorMessage={errors.batch?.errorMessage}
        hasError={errors.batch?.hasError}
        {...getOverrideProps(overrides, "batch")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email: value,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone: value,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks("phone", value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks("phone", phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, "phone")}
      ></TextField>
      <SelectField
        label="Gender"
        placeholder="Please select an option"
        isDisabled={false}
        value={gender}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender: value,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.gender ?? value;
          }
          if (errors.gender?.hasError) {
            runValidationTasks("gender", value);
          }
          setGender(value);
        }}
        onBlur={() => runValidationTasks("gender", gender)}
        errorMessage={errors.gender?.errorMessage}
        hasError={errors.gender?.hasError}
        {...getOverrideProps(overrides, "gender")}
      >
        <option
          children="Female"
          value="FEMALE"
          {...getOverrideProps(overrides, "genderoption0")}
        ></option>
        <option
          children="Male"
          value="MALE"
          {...getOverrideProps(overrides, "genderoption1")}
        ></option>
      </SelectField>
      <SelectField
        label="Nationality category"
        placeholder="Please select an option"
        isDisabled={false}
        value={nationalityCategory}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory: value,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.nationalityCategory ?? value;
          }
          if (errors.nationalityCategory?.hasError) {
            runValidationTasks("nationalityCategory", value);
          }
          setNationalityCategory(value);
        }}
        onBlur={() =>
          runValidationTasks("nationalityCategory", nationalityCategory)
        }
        errorMessage={errors.nationalityCategory?.errorMessage}
        hasError={errors.nationalityCategory?.hasError}
        {...getOverrideProps(overrides, "nationalityCategory")}
      >
        <option
          children="Bahraini"
          value="BAHRAINI"
          {...getOverrideProps(overrides, "nationalityCategoryoption0")}
        ></option>
        <option
          children="Non bahraini"
          value="NON_BAHRAINI"
          {...getOverrideProps(overrides, "nationalityCategoryoption1")}
        ></option>
      </SelectField>
      <TextField
        label="Nationality"
        isRequired={false}
        isReadOnly={false}
        value={nationality}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality: value,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.nationality ?? value;
          }
          if (errors.nationality?.hasError) {
            runValidationTasks("nationality", value);
          }
          setNationality(value);
        }}
        onBlur={() => runValidationTasks("nationality", nationality)}
        errorMessage={errors.nationality?.errorMessage}
        hasError={errors.nationality?.hasError}
        {...getOverrideProps(overrides, "nationality")}
      ></TextField>
      <TextField
        label="School name"
        isRequired={false}
        isReadOnly={false}
        value={schoolName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName: value,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.schoolName ?? value;
          }
          if (errors.schoolName?.hasError) {
            runValidationTasks("schoolName", value);
          }
          setSchoolName(value);
        }}
        onBlur={() => runValidationTasks("schoolName", schoolName)}
        errorMessage={errors.schoolName?.errorMessage}
        hasError={errors.schoolName?.hasError}
        {...getOverrideProps(overrides, "schoolName")}
      ></TextField>
      <SelectField
        label="School type"
        placeholder="Please select an option"
        isDisabled={false}
        value={schoolType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType: value,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.schoolType ?? value;
          }
          if (errors.schoolType?.hasError) {
            runValidationTasks("schoolType", value);
          }
          setSchoolType(value);
        }}
        onBlur={() => runValidationTasks("schoolType", schoolType)}
        errorMessage={errors.schoolType?.errorMessage}
        hasError={errors.schoolType?.hasError}
        {...getOverrideProps(overrides, "schoolType")}
      >
        <option
          children="Private"
          value="PRIVATE"
          {...getOverrideProps(overrides, "schoolTypeoption0")}
        ></option>
        <option
          children="Public"
          value="PUBLIC"
          {...getOverrideProps(overrides, "schoolTypeoption1")}
        ></option>
      </SelectField>
      <TextField
        label="Specialization"
        isRequired={false}
        isReadOnly={false}
        value={specialization}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization: value,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.specialization ?? value;
          }
          if (errors.specialization?.hasError) {
            runValidationTasks("specialization", value);
          }
          setSpecialization(value);
        }}
        onBlur={() => runValidationTasks("specialization", specialization)}
        errorMessage={errors.specialization?.errorMessage}
        hasError={errors.specialization?.hasError}
        {...getOverrideProps(overrides, "specialization")}
      ></TextField>
      <TextField
        label="Place of birth"
        isRequired={false}
        isReadOnly={false}
        value={placeOfBirth}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth: value,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.placeOfBirth ?? value;
          }
          if (errors.placeOfBirth?.hasError) {
            runValidationTasks("placeOfBirth", value);
          }
          setPlaceOfBirth(value);
        }}
        onBlur={() => runValidationTasks("placeOfBirth", placeOfBirth)}
        errorMessage={errors.placeOfBirth?.errorMessage}
        hasError={errors.placeOfBirth?.hasError}
        {...getOverrideProps(overrides, "placeOfBirth")}
      ></TextField>
      <TextField
        label="Student order among siblings"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={studentOrderAmongSiblings}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings: value,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.studentOrderAmongSiblings ?? value;
          }
          if (errors.studentOrderAmongSiblings?.hasError) {
            runValidationTasks("studentOrderAmongSiblings", value);
          }
          setStudentOrderAmongSiblings(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "studentOrderAmongSiblings",
            studentOrderAmongSiblings
          )
        }
        errorMessage={errors.studentOrderAmongSiblings?.errorMessage}
        hasError={errors.studentOrderAmongSiblings?.hasError}
        {...getOverrideProps(overrides, "studentOrderAmongSiblings")}
      ></TextField>
      <SelectField
        label="Family income"
        placeholder="Please select an option"
        isDisabled={false}
        value={familyIncome}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome: value,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.familyIncome ?? value;
          }
          if (errors.familyIncome?.hasError) {
            runValidationTasks("familyIncome", value);
          }
          setFamilyIncome(value);
        }}
        onBlur={() => runValidationTasks("familyIncome", familyIncome)}
        errorMessage={errors.familyIncome?.errorMessage}
        hasError={errors.familyIncome?.hasError}
        {...getOverrideProps(overrides, "familyIncome")}
      >
        <option
          children="Less than 500"
          value="LESS_THAN_500"
          {...getOverrideProps(overrides, "familyIncomeoption0")}
        ></option>
        <option
          children="Between 500 and 700"
          value="BETWEEN_500_AND_700"
          {...getOverrideProps(overrides, "familyIncomeoption1")}
        ></option>
        <option
          children="Between 700 and 1000"
          value="BETWEEN_700_AND_1000"
          {...getOverrideProps(overrides, "familyIncomeoption2")}
        ></option>
        <option
          children="Less than 1500"
          value="LESS_THAN_1500"
          {...getOverrideProps(overrides, "familyIncomeoption3")}
        ></option>
        <option
          children="More than 1500"
          value="MORE_THAN_1500"
          {...getOverrideProps(overrides, "familyIncomeoption4")}
        ></option>
        <option
          children="Over 1000"
          value="OVER_1000"
          {...getOverrideProps(overrides, "familyIncomeoption5")}
        ></option>
      </SelectField>
      <TextField
        label="Family income proof doc"
        isRequired={false}
        isReadOnly={false}
        value={familyIncomeProofDoc}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc: value,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.familyIncomeProofDoc ?? value;
          }
          if (errors.familyIncomeProofDoc?.hasError) {
            runValidationTasks("familyIncomeProofDoc", value);
          }
          setFamilyIncomeProofDoc(value);
        }}
        onBlur={() =>
          runValidationTasks("familyIncomeProofDoc", familyIncomeProofDoc)
        }
        errorMessage={errors.familyIncomeProofDoc?.errorMessage}
        hasError={errors.familyIncomeProofDoc?.hasError}
        {...getOverrideProps(overrides, "familyIncomeProofDoc")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs: values,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            values = result?.familyIncomeProofDocs ?? values;
          }
          setFamilyIncomeProofDocs(values);
          setCurrentFamilyIncomeProofDocsValue("");
        }}
        currentFieldValue={currentFamilyIncomeProofDocsValue}
        label={"Family income proof docs"}
        items={familyIncomeProofDocs}
        hasError={errors?.familyIncomeProofDocs?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "familyIncomeProofDocs",
            currentFamilyIncomeProofDocsValue
          )
        }
        errorMessage={errors?.familyIncomeProofDocs?.errorMessage}
        setFieldValue={setCurrentFamilyIncomeProofDocsValue}
        inputFieldRef={familyIncomeProofDocsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Family income proof docs"
          isRequired={false}
          isReadOnly={false}
          value={currentFamilyIncomeProofDocsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.familyIncomeProofDocs?.hasError) {
              runValidationTasks("familyIncomeProofDocs", value);
            }
            setCurrentFamilyIncomeProofDocsValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "familyIncomeProofDocs",
              currentFamilyIncomeProofDocsValue
            )
          }
          errorMessage={errors.familyIncomeProofDocs?.errorMessage}
          hasError={errors.familyIncomeProofDocs?.hasError}
          ref={familyIncomeProofDocsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "familyIncomeProofDocs")}
        ></TextField>
      </ArrayField>
      <SelectField
        label="Preferred language"
        placeholder="Please select an option"
        isDisabled={false}
        value={preferredLanguage}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage: value,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.preferredLanguage ?? value;
          }
          if (errors.preferredLanguage?.hasError) {
            runValidationTasks("preferredLanguage", value);
          }
          setPreferredLanguage(value);
        }}
        onBlur={() =>
          runValidationTasks("preferredLanguage", preferredLanguage)
        }
        errorMessage={errors.preferredLanguage?.errorMessage}
        hasError={errors.preferredLanguage?.hasError}
        {...getOverrideProps(overrides, "preferredLanguage")}
      >
        <option
          children="Arabic"
          value="ARABIC"
          {...getOverrideProps(overrides, "preferredLanguageoption0")}
        ></option>
        <option
          children="English"
          value="ENGLISH"
          {...getOverrideProps(overrides, "preferredLanguageoption1")}
        ></option>
      </SelectField>
      <TextField
        label="Graduation date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={graduationDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate: value,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.graduationDate ?? value;
          }
          if (errors.graduationDate?.hasError) {
            runValidationTasks("graduationDate", value);
          }
          setGraduationDate(value);
        }}
        onBlur={() => runValidationTasks("graduationDate", graduationDate)}
        errorMessage={errors.graduationDate?.errorMessage}
        hasError={errors.graduationDate?.hasError}
        {...getOverrideProps(overrides, "graduationDate")}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address: value,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextField>
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        value={firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName: value,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.firstName ?? value;
          }
          if (errors.firstName?.hasError) {
            runValidationTasks("firstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("firstName", firstName)}
        errorMessage={errors.firstName?.errorMessage}
        hasError={errors.firstName?.hasError}
        {...getOverrideProps(overrides, "firstName")}
      ></TextField>
      <TextField
        label="Second name"
        isRequired={false}
        isReadOnly={false}
        value={secondName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName: value,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.secondName ?? value;
          }
          if (errors.secondName?.hasError) {
            runValidationTasks("secondName", value);
          }
          setSecondName(value);
        }}
        onBlur={() => runValidationTasks("secondName", secondName)}
        errorMessage={errors.secondName?.errorMessage}
        hasError={errors.secondName?.hasError}
        {...getOverrideProps(overrides, "secondName")}
      ></TextField>
      <TextField
        label="Third name"
        isRequired={false}
        isReadOnly={false}
        value={thirdName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName: value,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.thirdName ?? value;
          }
          if (errors.thirdName?.hasError) {
            runValidationTasks("thirdName", value);
          }
          setThirdName(value);
        }}
        onBlur={() => runValidationTasks("thirdName", thirdName)}
        errorMessage={errors.thirdName?.errorMessage}
        hasError={errors.thirdName?.hasError}
        {...getOverrideProps(overrides, "thirdName")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName: value,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>
      <TextField
        label="Dob"
        isRequired={false}
        isReadOnly={false}
        value={dob}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob: value,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.dob ?? value;
          }
          if (errors.dob?.hasError) {
            runValidationTasks("dob", value);
          }
          setDob(value);
        }}
        onBlur={() => runValidationTasks("dob", dob)}
        errorMessage={errors.dob?.errorMessage}
        hasError={errors.dob?.hasError}
        {...getOverrideProps(overrides, "dob")}
      ></TextField>
      <TextField
        label="School major"
        isRequired={false}
        isReadOnly={false}
        value={schoolMajor}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor: value,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.schoolMajor ?? value;
          }
          if (errors.schoolMajor?.hasError) {
            runValidationTasks("schoolMajor", value);
          }
          setSchoolMajor(value);
        }}
        onBlur={() => runValidationTasks("schoolMajor", schoolMajor)}
        errorMessage={errors.schoolMajor?.errorMessage}
        hasError={errors.schoolMajor?.hasError}
        {...getOverrideProps(overrides, "schoolMajor")}
      ></TextField>
      <TextField
        label="M first name"
        isRequired={false}
        isReadOnly={false}
        value={m_firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName: value,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_firstName ?? value;
          }
          if (errors.m_firstName?.hasError) {
            runValidationTasks("m_firstName", value);
          }
          setM_firstName(value);
        }}
        onBlur={() => runValidationTasks("m_firstName", m_firstName)}
        errorMessage={errors.m_firstName?.errorMessage}
        hasError={errors.m_firstName?.hasError}
        {...getOverrideProps(overrides, "m_firstName")}
      ></TextField>
      <TextField
        label="M second name"
        isRequired={false}
        isReadOnly={false}
        value={m_secondName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName: value,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_secondName ?? value;
          }
          if (errors.m_secondName?.hasError) {
            runValidationTasks("m_secondName", value);
          }
          setM_secondName(value);
        }}
        onBlur={() => runValidationTasks("m_secondName", m_secondName)}
        errorMessage={errors.m_secondName?.errorMessage}
        hasError={errors.m_secondName?.hasError}
        {...getOverrideProps(overrides, "m_secondName")}
      ></TextField>
      <TextField
        label="M third name"
        isRequired={false}
        isReadOnly={false}
        value={m_thirdName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName: value,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_thirdName ?? value;
          }
          if (errors.m_thirdName?.hasError) {
            runValidationTasks("m_thirdName", value);
          }
          setM_thirdName(value);
        }}
        onBlur={() => runValidationTasks("m_thirdName", m_thirdName)}
        errorMessage={errors.m_thirdName?.errorMessage}
        hasError={errors.m_thirdName?.hasError}
        {...getOverrideProps(overrides, "m_thirdName")}
      ></TextField>
      <TextField
        label="M last name"
        isRequired={false}
        isReadOnly={false}
        value={m_lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName: value,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_lastName ?? value;
          }
          if (errors.m_lastName?.hasError) {
            runValidationTasks("m_lastName", value);
          }
          setM_lastName(value);
        }}
        onBlur={() => runValidationTasks("m_lastName", m_lastName)}
        errorMessage={errors.m_lastName?.errorMessage}
        hasError={errors.m_lastName?.hasError}
        {...getOverrideProps(overrides, "m_lastName")}
      ></TextField>
      <TextField
        label="M number of family members"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={m_numberOfFamilyMembers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers: value,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_numberOfFamilyMembers ?? value;
          }
          if (errors.m_numberOfFamilyMembers?.hasError) {
            runValidationTasks("m_numberOfFamilyMembers", value);
          }
          setM_numberOfFamilyMembers(value);
        }}
        onBlur={() =>
          runValidationTasks("m_numberOfFamilyMembers", m_numberOfFamilyMembers)
        }
        errorMessage={errors.m_numberOfFamilyMembers?.errorMessage}
        hasError={errors.m_numberOfFamilyMembers?.hasError}
        {...getOverrideProps(overrides, "m_numberOfFamilyMembers")}
      ></TextField>
      <TextField
        label="M graduation year"
        isRequired={false}
        isReadOnly={false}
        value={m_graduationYear}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear: value,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_graduationYear ?? value;
          }
          if (errors.m_graduationYear?.hasError) {
            runValidationTasks("m_graduationYear", value);
          }
          setM_graduationYear(value);
        }}
        onBlur={() => runValidationTasks("m_graduationYear", m_graduationYear)}
        errorMessage={errors.m_graduationYear?.errorMessage}
        hasError={errors.m_graduationYear?.hasError}
        {...getOverrideProps(overrides, "m_graduationYear")}
      ></TextField>
      <TextField
        label="M old program"
        isRequired={false}
        isReadOnly={false}
        value={m_oldProgram}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram: value,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_oldProgram ?? value;
          }
          if (errors.m_oldProgram?.hasError) {
            runValidationTasks("m_oldProgram", value);
          }
          setM_oldProgram(value);
        }}
        onBlur={() => runValidationTasks("m_oldProgram", m_oldProgram)}
        errorMessage={errors.m_oldProgram?.errorMessage}
        hasError={errors.m_oldProgram?.hasError}
        {...getOverrideProps(overrides, "m_oldProgram")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType: values,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            values = result?.m_applicantType ?? values;
          }
          setM_applicantType(values);
          setCurrentM_applicantTypeValue("");
        }}
        currentFieldValue={currentM_applicantTypeValue}
        label={"M applicant type"}
        items={m_applicantType}
        hasError={errors?.m_applicantType?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "m_applicantType",
            currentM_applicantTypeValue
          )
        }
        errorMessage={errors?.m_applicantType?.errorMessage}
        getBadgeText={getDisplayValue.m_applicantType}
        setFieldValue={setCurrentM_applicantTypeValue}
        inputFieldRef={m_applicantTypeRef}
        defaultFieldValue={""}
      >
        <SelectField
          label="M applicant type"
          placeholder="Please select an option"
          isDisabled={false}
          value={currentM_applicantTypeValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.m_applicantType?.hasError) {
              runValidationTasks("m_applicantType", value);
            }
            setCurrentM_applicantTypeValue(value);
          }}
          onBlur={() =>
            runValidationTasks("m_applicantType", currentM_applicantTypeValue)
          }
          errorMessage={errors.m_applicantType?.errorMessage}
          hasError={errors.m_applicantType?.hasError}
          ref={m_applicantTypeRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "m_applicantType")}
        >
          <option
            children="Student"
            value="STUDENT"
            {...getOverrideProps(overrides, "m_applicantTypeoption0")}
          ></option>
          <option
            children="Master"
            value="MASTER"
            {...getOverrideProps(overrides, "m_applicantTypeoption1")}
          ></option>
        </SelectField>
      </ArrayField>
      <SwitchField
        label="M is employed"
        defaultChecked={false}
        isDisabled={false}
        isChecked={m_isEmployed}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed: value,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_isEmployed ?? value;
          }
          if (errors.m_isEmployed?.hasError) {
            runValidationTasks("m_isEmployed", value);
          }
          setM_isEmployed(value);
        }}
        onBlur={() => runValidationTasks("m_isEmployed", m_isEmployed)}
        errorMessage={errors.m_isEmployed?.errorMessage}
        hasError={errors.m_isEmployed?.hasError}
        {...getOverrideProps(overrides, "m_isEmployed")}
      ></SwitchField>
      <TextField
        label="M place of employment"
        isRequired={false}
        isReadOnly={false}
        value={m_placeOfEmployment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment: value,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_placeOfEmployment ?? value;
          }
          if (errors.m_placeOfEmployment?.hasError) {
            runValidationTasks("m_placeOfEmployment", value);
          }
          setM_placeOfEmployment(value);
        }}
        onBlur={() =>
          runValidationTasks("m_placeOfEmployment", m_placeOfEmployment)
        }
        errorMessage={errors.m_placeOfEmployment?.errorMessage}
        hasError={errors.m_placeOfEmployment?.hasError}
        {...getOverrideProps(overrides, "m_placeOfEmployment")}
      ></TextField>
      <SelectField
        label="M income"
        placeholder="Please select an option"
        isDisabled={false}
        value={m_income}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income: value,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_income ?? value;
          }
          if (errors.m_income?.hasError) {
            runValidationTasks("m_income", value);
          }
          setM_income(value);
        }}
        onBlur={() => runValidationTasks("m_income", m_income)}
        errorMessage={errors.m_income?.errorMessage}
        hasError={errors.m_income?.hasError}
        {...getOverrideProps(overrides, "m_income")}
      >
        <option
          children="Less than 1500"
          value="LESS_THAN_1500"
          {...getOverrideProps(overrides, "m_incomeoption0")}
        ></option>
        <option
          children="More than 1500"
          value="MORE_THAN_1500"
          {...getOverrideProps(overrides, "m_incomeoption1")}
        ></option>
      </SelectField>
      <TextField
        label="M income doc"
        isRequired={false}
        isReadOnly={false}
        value={m_incomeDoc}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc: value,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_incomeDoc ?? value;
          }
          if (errors.m_incomeDoc?.hasError) {
            runValidationTasks("m_incomeDoc", value);
          }
          setM_incomeDoc(value);
        }}
        onBlur={() => runValidationTasks("m_incomeDoc", m_incomeDoc)}
        errorMessage={errors.m_incomeDoc?.errorMessage}
        hasError={errors.m_incomeDoc?.hasError}
        {...getOverrideProps(overrides, "m_incomeDoc")}
      ></TextField>
      <TextField
        label="M guardian cpr"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianCPR}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR: value,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianCPR ?? value;
          }
          if (errors.m_guardianCPR?.hasError) {
            runValidationTasks("m_guardianCPR", value);
          }
          setM_guardianCPR(value);
        }}
        onBlur={() => runValidationTasks("m_guardianCPR", m_guardianCPR)}
        errorMessage={errors.m_guardianCPR?.errorMessage}
        hasError={errors.m_guardianCPR?.hasError}
        {...getOverrideProps(overrides, "m_guardianCPR")}
      ></TextField>
      <TextField
        label="M guardian full name"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianFullName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName: value,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianFullName ?? value;
          }
          if (errors.m_guardianFullName?.hasError) {
            runValidationTasks("m_guardianFullName", value);
          }
          setM_guardianFullName(value);
        }}
        onBlur={() =>
          runValidationTasks("m_guardianFullName", m_guardianFullName)
        }
        errorMessage={errors.m_guardianFullName?.errorMessage}
        hasError={errors.m_guardianFullName?.hasError}
        {...getOverrideProps(overrides, "m_guardianFullName")}
      ></TextField>
      <TextField
        label="M guardian cpr doc"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianCPRDoc}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc: value,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianCPRDoc ?? value;
          }
          if (errors.m_guardianCPRDoc?.hasError) {
            runValidationTasks("m_guardianCPRDoc", value);
          }
          setM_guardianCPRDoc(value);
        }}
        onBlur={() => runValidationTasks("m_guardianCPRDoc", m_guardianCPRDoc)}
        errorMessage={errors.m_guardianCPRDoc?.errorMessage}
        hasError={errors.m_guardianCPRDoc?.hasError}
        {...getOverrideProps(overrides, "m_guardianCPRDoc")}
      ></TextField>
      <TextField
        label="M guardian first name"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianFirstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName: value,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianFirstName ?? value;
          }
          if (errors.m_guardianFirstName?.hasError) {
            runValidationTasks("m_guardianFirstName", value);
          }
          setM_guardianFirstName(value);
        }}
        onBlur={() =>
          runValidationTasks("m_guardianFirstName", m_guardianFirstName)
        }
        errorMessage={errors.m_guardianFirstName?.errorMessage}
        hasError={errors.m_guardianFirstName?.hasError}
        {...getOverrideProps(overrides, "m_guardianFirstName")}
      ></TextField>
      <TextField
        label="M guardian second name"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianSecondName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName: value,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianSecondName ?? value;
          }
          if (errors.m_guardianSecondName?.hasError) {
            runValidationTasks("m_guardianSecondName", value);
          }
          setM_guardianSecondName(value);
        }}
        onBlur={() =>
          runValidationTasks("m_guardianSecondName", m_guardianSecondName)
        }
        errorMessage={errors.m_guardianSecondName?.errorMessage}
        hasError={errors.m_guardianSecondName?.hasError}
        {...getOverrideProps(overrides, "m_guardianSecondName")}
      ></TextField>
      <TextField
        label="M guardian third name"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianThirdName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName: value,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianThirdName ?? value;
          }
          if (errors.m_guardianThirdName?.hasError) {
            runValidationTasks("m_guardianThirdName", value);
          }
          setM_guardianThirdName(value);
        }}
        onBlur={() =>
          runValidationTasks("m_guardianThirdName", m_guardianThirdName)
        }
        errorMessage={errors.m_guardianThirdName?.errorMessage}
        hasError={errors.m_guardianThirdName?.hasError}
        {...getOverrideProps(overrides, "m_guardianThirdName")}
      ></TextField>
      <TextField
        label="M guardian last name"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianLastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName: value,
              m_guardianEmail,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianLastName ?? value;
          }
          if (errors.m_guardianLastName?.hasError) {
            runValidationTasks("m_guardianLastName", value);
          }
          setM_guardianLastName(value);
        }}
        onBlur={() =>
          runValidationTasks("m_guardianLastName", m_guardianLastName)
        }
        errorMessage={errors.m_guardianLastName?.errorMessage}
        hasError={errors.m_guardianLastName?.hasError}
        {...getOverrideProps(overrides, "m_guardianLastName")}
      ></TextField>
      <TextField
        label="M guardian email"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianEmail}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail: value,
              m_guardianAddress,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianEmail ?? value;
          }
          if (errors.m_guardianEmail?.hasError) {
            runValidationTasks("m_guardianEmail", value);
          }
          setM_guardianEmail(value);
        }}
        onBlur={() => runValidationTasks("m_guardianEmail", m_guardianEmail)}
        errorMessage={errors.m_guardianEmail?.errorMessage}
        hasError={errors.m_guardianEmail?.hasError}
        {...getOverrideProps(overrides, "m_guardianEmail")}
      ></TextField>
      <TextField
        label="M guardian address"
        isRequired={false}
        isReadOnly={false}
        value={m_guardianAddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cpr,
              cprDoc,
              fullName,
              batch,
              email,
              phone,
              gender,
              nationalityCategory,
              nationality,
              schoolName,
              schoolType,
              specialization,
              placeOfBirth,
              studentOrderAmongSiblings,
              familyIncome,
              familyIncomeProofDoc,
              familyIncomeProofDocs,
              preferredLanguage,
              graduationDate,
              address,
              firstName,
              secondName,
              thirdName,
              lastName,
              dob,
              schoolMajor,
              m_firstName,
              m_secondName,
              m_thirdName,
              m_lastName,
              m_numberOfFamilyMembers,
              m_graduationYear,
              m_oldProgram,
              m_applicantType,
              m_isEmployed,
              m_placeOfEmployment,
              m_income,
              m_incomeDoc,
              m_guardianCPR,
              m_guardianFullName,
              m_guardianCPRDoc,
              m_guardianFirstName,
              m_guardianSecondName,
              m_guardianThirdName,
              m_guardianLastName,
              m_guardianEmail,
              m_guardianAddress: value,
            };
            const result = onChange(modelFields);
            value = result?.m_guardianAddress ?? value;
          }
          if (errors.m_guardianAddress?.hasError) {
            runValidationTasks("m_guardianAddress", value);
          }
          setM_guardianAddress(value);
        }}
        onBlur={() =>
          runValidationTasks("m_guardianAddress", m_guardianAddress)
        }
        errorMessage={errors.m_guardianAddress?.errorMessage}
        hasError={errors.m_guardianAddress?.hasError}
        {...getOverrideProps(overrides, "m_guardianAddress")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
