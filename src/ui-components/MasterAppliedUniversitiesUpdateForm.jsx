/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { MasterAppliedUniversities } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function MasterAppliedUniversitiesUpdateForm(props) {
  const {
    id: idProp,
    masterAppliedUniversities: masterAppliedUniversitiesModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    universityName: "",
    universityNameAr: "",
    isDeactivated: false,
    availability: "",
  };
  const [universityName, setUniversityName] = React.useState(
    initialValues.universityName
  );
  const [universityNameAr, setUniversityNameAr] = React.useState(
    initialValues.universityNameAr
  );
  const [isDeactivated, setIsDeactivated] = React.useState(
    initialValues.isDeactivated
  );
  const [availability, setAvailability] = React.useState(
    initialValues.availability
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = masterAppliedUniversitiesRecord
      ? { ...initialValues, ...masterAppliedUniversitiesRecord }
      : initialValues;
    setUniversityName(cleanValues.universityName);
    setUniversityNameAr(cleanValues.universityNameAr);
    setIsDeactivated(cleanValues.isDeactivated);
    setAvailability(cleanValues.availability);
    setErrors({});
  };
  const [masterAppliedUniversitiesRecord, setMasterAppliedUniversitiesRecord] =
    React.useState(masterAppliedUniversitiesModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(MasterAppliedUniversities, idProp)
        : masterAppliedUniversitiesModelProp;
      setMasterAppliedUniversitiesRecord(record);
    };
    queryData();
  }, [idProp, masterAppliedUniversitiesModelProp]);
  React.useEffect(resetStateValues, [masterAppliedUniversitiesRecord]);
  const validations = {
    universityName: [{ type: "Required" }],
    universityNameAr: [{ type: "Required" }],
    isDeactivated: [],
    availability: [],
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
          universityName,
          universityNameAr,
          isDeactivated,
          availability,
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
          await DataStore.save(
            MasterAppliedUniversities.copyOf(
              masterAppliedUniversitiesRecord,
              (updated) => {
                Object.assign(updated, modelFields);
              }
            )
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "MasterAppliedUniversitiesUpdateForm")}
      {...rest}
    >
      <TextField
        label="University name"
        isRequired={true}
        isReadOnly={false}
        value={universityName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              universityName: value,
              universityNameAr,
              isDeactivated,
              availability,
            };
            const result = onChange(modelFields);
            value = result?.universityName ?? value;
          }
          if (errors.universityName?.hasError) {
            runValidationTasks("universityName", value);
          }
          setUniversityName(value);
        }}
        onBlur={() => runValidationTasks("universityName", universityName)}
        errorMessage={errors.universityName?.errorMessage}
        hasError={errors.universityName?.hasError}
        {...getOverrideProps(overrides, "universityName")}
      ></TextField>
      <TextField
        label="University name ar"
        isRequired={true}
        isReadOnly={false}
        value={universityNameAr}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              universityName,
              universityNameAr: value,
              isDeactivated,
              availability,
            };
            const result = onChange(modelFields);
            value = result?.universityNameAr ?? value;
          }
          if (errors.universityNameAr?.hasError) {
            runValidationTasks("universityNameAr", value);
          }
          setUniversityNameAr(value);
        }}
        onBlur={() => runValidationTasks("universityNameAr", universityNameAr)}
        errorMessage={errors.universityNameAr?.errorMessage}
        hasError={errors.universityNameAr?.hasError}
        {...getOverrideProps(overrides, "universityNameAr")}
      ></TextField>
      <SwitchField
        label="Is deactivated"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isDeactivated}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              universityName,
              universityNameAr,
              isDeactivated: value,
              availability,
            };
            const result = onChange(modelFields);
            value = result?.isDeactivated ?? value;
          }
          if (errors.isDeactivated?.hasError) {
            runValidationTasks("isDeactivated", value);
          }
          setIsDeactivated(value);
        }}
        onBlur={() => runValidationTasks("isDeactivated", isDeactivated)}
        errorMessage={errors.isDeactivated?.errorMessage}
        hasError={errors.isDeactivated?.hasError}
        {...getOverrideProps(overrides, "isDeactivated")}
      ></SwitchField>
      <TextField
        label="Availability"
        isRequired={false}
        isReadOnly={false}
        value={availability}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              universityName,
              universityNameAr,
              isDeactivated,
              availability: value,
            };
            const result = onChange(modelFields);
            value = result?.availability ?? value;
          }
          if (errors.availability?.hasError) {
            runValidationTasks("availability", value);
          }
          setAvailability(value);
        }}
        onBlur={() => runValidationTasks("availability", availability)}
        errorMessage={errors.availability?.errorMessage}
        hasError={errors.availability?.hasError}
        {...getOverrideProps(overrides, "availability")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || masterAppliedUniversitiesModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || masterAppliedUniversitiesModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
