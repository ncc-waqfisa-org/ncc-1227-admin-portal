/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { ParentInfo } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function ParentInfoCreateForm(props) {
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
    guardianFullName: "",
    relation: "",
    guardianCPR: "",
    primaryMobile: "",
    secondaryMobile: "",
    fatherFullName: "",
    fatherCPR: "",
    motherFullName: "",
    motherCPR: "",
    numberOfFamilyMembers: "",
    address: "",
    guardianFirstName: "",
    guardianSecondName: "",
    guardianThirdName: "",
    guardianLastName: "",
    guardianEmail: "",
  };
  const [guardianFullName, setGuardianFullName] = React.useState(
    initialValues.guardianFullName
  );
  const [relation, setRelation] = React.useState(initialValues.relation);
  const [guardianCPR, setGuardianCPR] = React.useState(
    initialValues.guardianCPR
  );
  const [primaryMobile, setPrimaryMobile] = React.useState(
    initialValues.primaryMobile
  );
  const [secondaryMobile, setSecondaryMobile] = React.useState(
    initialValues.secondaryMobile
  );
  const [fatherFullName, setFatherFullName] = React.useState(
    initialValues.fatherFullName
  );
  const [fatherCPR, setFatherCPR] = React.useState(initialValues.fatherCPR);
  const [motherFullName, setMotherFullName] = React.useState(
    initialValues.motherFullName
  );
  const [motherCPR, setMotherCPR] = React.useState(initialValues.motherCPR);
  const [numberOfFamilyMembers, setNumberOfFamilyMembers] = React.useState(
    initialValues.numberOfFamilyMembers
  );
  const [address, setAddress] = React.useState(initialValues.address);
  const [guardianFirstName, setGuardianFirstName] = React.useState(
    initialValues.guardianFirstName
  );
  const [guardianSecondName, setGuardianSecondName] = React.useState(
    initialValues.guardianSecondName
  );
  const [guardianThirdName, setGuardianThirdName] = React.useState(
    initialValues.guardianThirdName
  );
  const [guardianLastName, setGuardianLastName] = React.useState(
    initialValues.guardianLastName
  );
  const [guardianEmail, setGuardianEmail] = React.useState(
    initialValues.guardianEmail
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setGuardianFullName(initialValues.guardianFullName);
    setRelation(initialValues.relation);
    setGuardianCPR(initialValues.guardianCPR);
    setPrimaryMobile(initialValues.primaryMobile);
    setSecondaryMobile(initialValues.secondaryMobile);
    setFatherFullName(initialValues.fatherFullName);
    setFatherCPR(initialValues.fatherCPR);
    setMotherFullName(initialValues.motherFullName);
    setMotherCPR(initialValues.motherCPR);
    setNumberOfFamilyMembers(initialValues.numberOfFamilyMembers);
    setAddress(initialValues.address);
    setGuardianFirstName(initialValues.guardianFirstName);
    setGuardianSecondName(initialValues.guardianSecondName);
    setGuardianThirdName(initialValues.guardianThirdName);
    setGuardianLastName(initialValues.guardianLastName);
    setGuardianEmail(initialValues.guardianEmail);
    setErrors({});
  };
  const validations = {
    guardianFullName: [],
    relation: [],
    guardianCPR: [],
    primaryMobile: [],
    secondaryMobile: [],
    fatherFullName: [],
    fatherCPR: [],
    motherFullName: [],
    motherCPR: [],
    numberOfFamilyMembers: [],
    address: [],
    guardianFirstName: [],
    guardianSecondName: [],
    guardianThirdName: [],
    guardianLastName: [],
    guardianEmail: [],
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
          guardianFullName,
          relation,
          guardianCPR,
          primaryMobile,
          secondaryMobile,
          fatherFullName,
          fatherCPR,
          motherFullName,
          motherCPR,
          numberOfFamilyMembers,
          address,
          guardianFirstName,
          guardianSecondName,
          guardianThirdName,
          guardianLastName,
          guardianEmail,
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
          await DataStore.save(new ParentInfo(modelFields));
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
      {...getOverrideProps(overrides, "ParentInfoCreateForm")}
      {...rest}
    >
      <TextField
        label="Guardian full name"
        isRequired={false}
        isReadOnly={false}
        value={guardianFullName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName: value,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.guardianFullName ?? value;
          }
          if (errors.guardianFullName?.hasError) {
            runValidationTasks("guardianFullName", value);
          }
          setGuardianFullName(value);
        }}
        onBlur={() => runValidationTasks("guardianFullName", guardianFullName)}
        errorMessage={errors.guardianFullName?.errorMessage}
        hasError={errors.guardianFullName?.hasError}
        {...getOverrideProps(overrides, "guardianFullName")}
      ></TextField>
      <TextField
        label="Relation"
        isRequired={false}
        isReadOnly={false}
        value={relation}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation: value,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.relation ?? value;
          }
          if (errors.relation?.hasError) {
            runValidationTasks("relation", value);
          }
          setRelation(value);
        }}
        onBlur={() => runValidationTasks("relation", relation)}
        errorMessage={errors.relation?.errorMessage}
        hasError={errors.relation?.hasError}
        {...getOverrideProps(overrides, "relation")}
      ></TextField>
      <TextField
        label="Guardian cpr"
        isRequired={false}
        isReadOnly={false}
        value={guardianCPR}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR: value,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.guardianCPR ?? value;
          }
          if (errors.guardianCPR?.hasError) {
            runValidationTasks("guardianCPR", value);
          }
          setGuardianCPR(value);
        }}
        onBlur={() => runValidationTasks("guardianCPR", guardianCPR)}
        errorMessage={errors.guardianCPR?.errorMessage}
        hasError={errors.guardianCPR?.hasError}
        {...getOverrideProps(overrides, "guardianCPR")}
      ></TextField>
      <TextField
        label="Primary mobile"
        isRequired={false}
        isReadOnly={false}
        value={primaryMobile}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile: value,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.primaryMobile ?? value;
          }
          if (errors.primaryMobile?.hasError) {
            runValidationTasks("primaryMobile", value);
          }
          setPrimaryMobile(value);
        }}
        onBlur={() => runValidationTasks("primaryMobile", primaryMobile)}
        errorMessage={errors.primaryMobile?.errorMessage}
        hasError={errors.primaryMobile?.hasError}
        {...getOverrideProps(overrides, "primaryMobile")}
      ></TextField>
      <TextField
        label="Secondary mobile"
        isRequired={false}
        isReadOnly={false}
        value={secondaryMobile}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile: value,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.secondaryMobile ?? value;
          }
          if (errors.secondaryMobile?.hasError) {
            runValidationTasks("secondaryMobile", value);
          }
          setSecondaryMobile(value);
        }}
        onBlur={() => runValidationTasks("secondaryMobile", secondaryMobile)}
        errorMessage={errors.secondaryMobile?.errorMessage}
        hasError={errors.secondaryMobile?.hasError}
        {...getOverrideProps(overrides, "secondaryMobile")}
      ></TextField>
      <TextField
        label="Father full name"
        isRequired={false}
        isReadOnly={false}
        value={fatherFullName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName: value,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.fatherFullName ?? value;
          }
          if (errors.fatherFullName?.hasError) {
            runValidationTasks("fatherFullName", value);
          }
          setFatherFullName(value);
        }}
        onBlur={() => runValidationTasks("fatherFullName", fatherFullName)}
        errorMessage={errors.fatherFullName?.errorMessage}
        hasError={errors.fatherFullName?.hasError}
        {...getOverrideProps(overrides, "fatherFullName")}
      ></TextField>
      <TextField
        label="Father cpr"
        isRequired={false}
        isReadOnly={false}
        value={fatherCPR}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR: value,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.fatherCPR ?? value;
          }
          if (errors.fatherCPR?.hasError) {
            runValidationTasks("fatherCPR", value);
          }
          setFatherCPR(value);
        }}
        onBlur={() => runValidationTasks("fatherCPR", fatherCPR)}
        errorMessage={errors.fatherCPR?.errorMessage}
        hasError={errors.fatherCPR?.hasError}
        {...getOverrideProps(overrides, "fatherCPR")}
      ></TextField>
      <TextField
        label="Mother full name"
        isRequired={false}
        isReadOnly={false}
        value={motherFullName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName: value,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.motherFullName ?? value;
          }
          if (errors.motherFullName?.hasError) {
            runValidationTasks("motherFullName", value);
          }
          setMotherFullName(value);
        }}
        onBlur={() => runValidationTasks("motherFullName", motherFullName)}
        errorMessage={errors.motherFullName?.errorMessage}
        hasError={errors.motherFullName?.hasError}
        {...getOverrideProps(overrides, "motherFullName")}
      ></TextField>
      <TextField
        label="Mother cpr"
        isRequired={false}
        isReadOnly={false}
        value={motherCPR}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR: value,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.motherCPR ?? value;
          }
          if (errors.motherCPR?.hasError) {
            runValidationTasks("motherCPR", value);
          }
          setMotherCPR(value);
        }}
        onBlur={() => runValidationTasks("motherCPR", motherCPR)}
        errorMessage={errors.motherCPR?.errorMessage}
        hasError={errors.motherCPR?.hasError}
        {...getOverrideProps(overrides, "motherCPR")}
      ></TextField>
      <TextField
        label="Number of family members"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={numberOfFamilyMembers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers: value,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.numberOfFamilyMembers ?? value;
          }
          if (errors.numberOfFamilyMembers?.hasError) {
            runValidationTasks("numberOfFamilyMembers", value);
          }
          setNumberOfFamilyMembers(value);
        }}
        onBlur={() =>
          runValidationTasks("numberOfFamilyMembers", numberOfFamilyMembers)
        }
        errorMessage={errors.numberOfFamilyMembers?.errorMessage}
        hasError={errors.numberOfFamilyMembers?.hasError}
        {...getOverrideProps(overrides, "numberOfFamilyMembers")}
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
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address: value,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
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
        label="Guardian first name"
        isRequired={false}
        isReadOnly={false}
        value={guardianFirstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName: value,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.guardianFirstName ?? value;
          }
          if (errors.guardianFirstName?.hasError) {
            runValidationTasks("guardianFirstName", value);
          }
          setGuardianFirstName(value);
        }}
        onBlur={() =>
          runValidationTasks("guardianFirstName", guardianFirstName)
        }
        errorMessage={errors.guardianFirstName?.errorMessage}
        hasError={errors.guardianFirstName?.hasError}
        {...getOverrideProps(overrides, "guardianFirstName")}
      ></TextField>
      <TextField
        label="Guardian second name"
        isRequired={false}
        isReadOnly={false}
        value={guardianSecondName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName: value,
              guardianThirdName,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.guardianSecondName ?? value;
          }
          if (errors.guardianSecondName?.hasError) {
            runValidationTasks("guardianSecondName", value);
          }
          setGuardianSecondName(value);
        }}
        onBlur={() =>
          runValidationTasks("guardianSecondName", guardianSecondName)
        }
        errorMessage={errors.guardianSecondName?.errorMessage}
        hasError={errors.guardianSecondName?.hasError}
        {...getOverrideProps(overrides, "guardianSecondName")}
      ></TextField>
      <TextField
        label="Guardian third name"
        isRequired={false}
        isReadOnly={false}
        value={guardianThirdName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName: value,
              guardianLastName,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.guardianThirdName ?? value;
          }
          if (errors.guardianThirdName?.hasError) {
            runValidationTasks("guardianThirdName", value);
          }
          setGuardianThirdName(value);
        }}
        onBlur={() =>
          runValidationTasks("guardianThirdName", guardianThirdName)
        }
        errorMessage={errors.guardianThirdName?.errorMessage}
        hasError={errors.guardianThirdName?.hasError}
        {...getOverrideProps(overrides, "guardianThirdName")}
      ></TextField>
      <TextField
        label="Guardian last name"
        isRequired={false}
        isReadOnly={false}
        value={guardianLastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName: value,
              guardianEmail,
            };
            const result = onChange(modelFields);
            value = result?.guardianLastName ?? value;
          }
          if (errors.guardianLastName?.hasError) {
            runValidationTasks("guardianLastName", value);
          }
          setGuardianLastName(value);
        }}
        onBlur={() => runValidationTasks("guardianLastName", guardianLastName)}
        errorMessage={errors.guardianLastName?.errorMessage}
        hasError={errors.guardianLastName?.hasError}
        {...getOverrideProps(overrides, "guardianLastName")}
      ></TextField>
      <TextField
        label="Guardian email"
        isRequired={false}
        isReadOnly={false}
        value={guardianEmail}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              guardianFullName,
              relation,
              guardianCPR,
              primaryMobile,
              secondaryMobile,
              fatherFullName,
              fatherCPR,
              motherFullName,
              motherCPR,
              numberOfFamilyMembers,
              address,
              guardianFirstName,
              guardianSecondName,
              guardianThirdName,
              guardianLastName,
              guardianEmail: value,
            };
            const result = onChange(modelFields);
            value = result?.guardianEmail ?? value;
          }
          if (errors.guardianEmail?.hasError) {
            runValidationTasks("guardianEmail", value);
          }
          setGuardianEmail(value);
        }}
        onBlur={() => runValidationTasks("guardianEmail", guardianEmail)}
        errorMessage={errors.guardianEmail?.errorMessage}
        hasError={errors.guardianEmail?.hasError}
        {...getOverrideProps(overrides, "guardianEmail")}
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
