/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";

import {
  fetchByPath,
  getOverrideProps,
  validateField,
} from "../../src/ui-components/utils";
import { useTranslation } from "react-i18next";

export default function BatchCreateForm(props) {
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
    batch: "",
    createApplicationStartDate: "",
    createApplicationEndDate: "",
    updateApplicationEndDate: "",
    signUpStartDate: "",
    signUpEndDate: "",
  };
  const [batch, setBatch] = React.useState(initialValues.batch);
  const [createApplicationStartDate, setCreateApplicationStartDate] =
    React.useState(initialValues.createApplicationStartDate);
  const [createApplicationEndDate, setCreateApplicationEndDate] =
    React.useState(initialValues.createApplicationEndDate);
  const [updateApplicationEndDate, setUpdateApplicationEndDate] =
    React.useState(initialValues.updateApplicationEndDate);
  const [signUpStartDate, setSignUpStartDate] = React.useState(
    initialValues.signUpStartDate
  );
  const [signUpEndDate, setSignUpEndDate] = React.useState(
    initialValues.signUpEndDate
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setBatch(initialValues.batch);
    setCreateApplicationStartDate(initialValues.createApplicationStartDate);
    setCreateApplicationEndDate(initialValues.createApplicationEndDate);
    setUpdateApplicationEndDate(initialValues.updateApplicationEndDate);
    setSignUpStartDate(initialValues.signUpStartDate);
    setSignUpEndDate(initialValues.signUpEndDate);
    setErrors({});
  };
  const validations = {
    batch: [],
    createApplicationStartDate: [],
    createApplicationEndDate: [],
    updateApplicationEndDate: [],
    signUpStartDate: [],
    signUpEndDate: [],
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

  const { t } = useTranslation("batches");

  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          batch,
          createApplicationStartDate,
          createApplicationEndDate,
          updateApplicationEndDate,
          signUpStartDate,
          signUpEndDate,
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
      }}
      {...getOverrideProps(overrides, "BatchCreateForm")}
      {...rest}
    >
      <TextField
        label={t("batchCurrent")}
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        placeholder={t("batchYearExample")}
        value={batch}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              batch: value,
              createApplicationStartDate,
              createApplicationEndDate,
              updateApplicationEndDate,
              signUpStartDate,
              signUpEndDate,
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
        label={t("tableBatchSignUpStartDate")}
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={signUpStartDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              batch,
              createApplicationStartDate,
              createApplicationEndDate,
              updateApplicationEndDate,
              signUpStartDate: value,
              signUpEndDate,
            };
            const result = onChange(modelFields);
            value = result?.signUpStartDate ?? value;
          }
          if (errors.signUpStartDate?.hasError) {
            runValidationTasks("signUpStartDate", value);
          }
          setSignUpStartDate(value);
        }}
        onBlur={() => runValidationTasks("signUpStartDate", signUpStartDate)}
        errorMessage={errors.signUpStartDate?.errorMessage}
        hasError={errors.signUpStartDate?.hasError}
        {...getOverrideProps(overrides, "signUpStartDate")}
      ></TextField>
      <TextField
        label={t("tableBatchSignUpEndDate")}
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={signUpEndDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              batch,
              createApplicationStartDate,
              createApplicationEndDate,
              updateApplicationEndDate,
              signUpStartDate,
              signUpEndDate: value,
            };
            const result = onChange(modelFields);
            value = result?.signUpEndDate ?? value;
          }
          if (errors.signUpEndDate?.hasError) {
            runValidationTasks("signUpEndDate", value);
          }
          setSignUpEndDate(value);
        }}
        onBlur={() => runValidationTasks("signUpEndDate", signUpEndDate)}
        errorMessage={errors.signUpEndDate?.errorMessage}
        hasError={errors.signUpEndDate?.hasError}
        {...getOverrideProps(overrides, "signUpEndDate")}
      ></TextField>
      <TextField
        label={t("tableBatchCreateApplicationStartDate")}
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={createApplicationStartDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              batch,
              createApplicationStartDate: value,
              createApplicationEndDate,
              updateApplicationEndDate,
              signUpStartDate,
              signUpEndDate,
            };
            const result = onChange(modelFields);
            value = result?.createApplicationStartDate ?? value;
          }
          if (errors.createApplicationStartDate?.hasError) {
            runValidationTasks("createApplicationStartDate", value);
          }
          setCreateApplicationStartDate(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "createApplicationStartDate",
            createApplicationStartDate
          )
        }
        errorMessage={errors.createApplicationStartDate?.errorMessage}
        hasError={errors.createApplicationStartDate?.hasError}
        {...getOverrideProps(overrides, "createApplicationStartDate")}
      ></TextField>
      <TextField
        label={t("tableBatchCreateApplicationEndDate")}
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={createApplicationEndDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              batch,
              createApplicationStartDate,
              createApplicationEndDate: value,
              updateApplicationEndDate,
              signUpStartDate,
              signUpEndDate,
            };
            const result = onChange(modelFields);
            value = result?.createApplicationEndDate ?? value;
          }
          if (errors.createApplicationEndDate?.hasError) {
            runValidationTasks("createApplicationEndDate", value);
          }
          setCreateApplicationEndDate(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "createApplicationEndDate",
            createApplicationEndDate
          )
        }
        errorMessage={errors.createApplicationEndDate?.errorMessage}
        hasError={errors.createApplicationEndDate?.hasError}
        {...getOverrideProps(overrides, "createApplicationEndDate")}
      ></TextField>
      <TextField
        label={t("tableBatchUpdateApplicationEndDate")}
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={updateApplicationEndDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              batch,
              createApplicationStartDate,
              createApplicationEndDate,
              updateApplicationEndDate: value,
              signUpStartDate,
              signUpEndDate,
            };
            const result = onChange(modelFields);
            value = result?.updateApplicationEndDate ?? value;
          }
          if (errors.updateApplicationEndDate?.hasError) {
            runValidationTasks("updateApplicationEndDate", value);
          }
          setUpdateApplicationEndDate(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "updateApplicationEndDate",
            updateApplicationEndDate
          )
        }
        errorMessage={errors.updateApplicationEndDate?.errorMessage}
        hasError={errors.updateApplicationEndDate?.hasError}
        {...getOverrideProps(overrides, "updateApplicationEndDate")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children={t("clear")}
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
            children={t("submit")}
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
