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
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { MasterStatistics } from "../models";
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
export default function MasterStatisticsCreateForm(props) {
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
    id: "",
    batch: "",
    totalApplications: "",
    totalApplicationsPerStatus: "",
    scoreHistogram: "",
    gpaHistogram: "",
    totalApplicationsPerUniversity: "",
    topUniversities: "",
    topBahrainUniversities: "",
    familyIncome: "",
    universitiesBahrain: "",
    students: "",
    applications: "",
    today: "",
    participatingUniversities: [],
    applicationPerGenderHistogram: "",
    registerAccountsPerGender: "",
    majorsPerGenderHistogram: "",
    incomePerEmploymentStatus: "",
  };
  const [id, setId] = React.useState(initialValues.id);
  const [batch, setBatch] = React.useState(initialValues.batch);
  const [totalApplications, setTotalApplications] = React.useState(
    initialValues.totalApplications
  );
  const [totalApplicationsPerStatus, setTotalApplicationsPerStatus] =
    React.useState(initialValues.totalApplicationsPerStatus);
  const [scoreHistogram, setScoreHistogram] = React.useState(
    initialValues.scoreHistogram
  );
  const [gpaHistogram, setGpaHistogram] = React.useState(
    initialValues.gpaHistogram
  );
  const [totalApplicationsPerUniversity, setTotalApplicationsPerUniversity] =
    React.useState(initialValues.totalApplicationsPerUniversity);
  const [topUniversities, setTopUniversities] = React.useState(
    initialValues.topUniversities
  );
  const [topBahrainUniversities, setTopBahrainUniversities] = React.useState(
    initialValues.topBahrainUniversities
  );
  const [familyIncome, setFamilyIncome] = React.useState(
    initialValues.familyIncome
  );
  const [universitiesBahrain, setUniversitiesBahrain] = React.useState(
    initialValues.universitiesBahrain
  );
  const [students, setStudents] = React.useState(initialValues.students);
  const [applications, setApplications] = React.useState(
    initialValues.applications
  );
  const [today, setToday] = React.useState(initialValues.today);
  const [participatingUniversities, setParticipatingUniversities] =
    React.useState(initialValues.participatingUniversities);
  const [applicationPerGenderHistogram, setApplicationPerGenderHistogram] =
    React.useState(initialValues.applicationPerGenderHistogram);
  const [registerAccountsPerGender, setRegisterAccountsPerGender] =
    React.useState(initialValues.registerAccountsPerGender);
  const [majorsPerGenderHistogram, setMajorsPerGenderHistogram] =
    React.useState(initialValues.majorsPerGenderHistogram);
  const [incomePerEmploymentStatus, setIncomePerEmploymentStatus] =
    React.useState(initialValues.incomePerEmploymentStatus);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setId(initialValues.id);
    setBatch(initialValues.batch);
    setTotalApplications(initialValues.totalApplications);
    setTotalApplicationsPerStatus(initialValues.totalApplicationsPerStatus);
    setScoreHistogram(initialValues.scoreHistogram);
    setGpaHistogram(initialValues.gpaHistogram);
    setTotalApplicationsPerUniversity(
      initialValues.totalApplicationsPerUniversity
    );
    setTopUniversities(initialValues.topUniversities);
    setTopBahrainUniversities(initialValues.topBahrainUniversities);
    setFamilyIncome(initialValues.familyIncome);
    setUniversitiesBahrain(initialValues.universitiesBahrain);
    setStudents(initialValues.students);
    setApplications(initialValues.applications);
    setToday(initialValues.today);
    setParticipatingUniversities(initialValues.participatingUniversities);
    setCurrentParticipatingUniversitiesValue("");
    setApplicationPerGenderHistogram(
      initialValues.applicationPerGenderHistogram
    );
    setRegisterAccountsPerGender(initialValues.registerAccountsPerGender);
    setMajorsPerGenderHistogram(initialValues.majorsPerGenderHistogram);
    setIncomePerEmploymentStatus(initialValues.incomePerEmploymentStatus);
    setErrors({});
  };
  const [
    currentParticipatingUniversitiesValue,
    setCurrentParticipatingUniversitiesValue,
  ] = React.useState("");
  const participatingUniversitiesRef = React.createRef();
  const validations = {
    id: [{ type: "Required" }],
    batch: [{ type: "Required" }],
    totalApplications: [],
    totalApplicationsPerStatus: [{ type: "JSON" }],
    scoreHistogram: [{ type: "JSON" }],
    gpaHistogram: [{ type: "JSON" }],
    totalApplicationsPerUniversity: [{ type: "JSON" }],
    topUniversities: [{ type: "JSON" }],
    topBahrainUniversities: [{ type: "JSON" }],
    familyIncome: [{ type: "JSON" }],
    universitiesBahrain: [{ type: "JSON" }],
    students: [{ type: "JSON" }],
    applications: [{ type: "JSON" }],
    today: [{ type: "JSON" }],
    participatingUniversities: [],
    applicationPerGenderHistogram: [{ type: "JSON" }],
    registerAccountsPerGender: [{ type: "JSON" }],
    majorsPerGenderHistogram: [{ type: "JSON" }],
    incomePerEmploymentStatus: [{ type: "JSON" }],
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
          id,
          batch,
          totalApplications,
          totalApplicationsPerStatus,
          scoreHistogram,
          gpaHistogram,
          totalApplicationsPerUniversity,
          topUniversities,
          topBahrainUniversities,
          familyIncome,
          universitiesBahrain,
          students,
          applications,
          today,
          participatingUniversities,
          applicationPerGenderHistogram,
          registerAccountsPerGender,
          majorsPerGenderHistogram,
          incomePerEmploymentStatus,
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
          await DataStore.save(new MasterStatistics(modelFields));
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
      {...getOverrideProps(overrides, "MasterStatisticsCreateForm")}
      {...rest}
    >
      <TextField
        label="Id"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={id}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              id: value,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.id ?? value;
          }
          if (errors.id?.hasError) {
            runValidationTasks("id", value);
          }
          setId(value);
        }}
        onBlur={() => runValidationTasks("id", id)}
        errorMessage={errors.id?.errorMessage}
        hasError={errors.id?.hasError}
        {...getOverrideProps(overrides, "id")}
      ></TextField>
      <TextField
        label="Batch"
        isRequired={true}
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
              id,
              batch: value,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
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
        label="Total applications"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalApplications}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications: value,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.totalApplications ?? value;
          }
          if (errors.totalApplications?.hasError) {
            runValidationTasks("totalApplications", value);
          }
          setTotalApplications(value);
        }}
        onBlur={() =>
          runValidationTasks("totalApplications", totalApplications)
        }
        errorMessage={errors.totalApplications?.errorMessage}
        hasError={errors.totalApplications?.hasError}
        {...getOverrideProps(overrides, "totalApplications")}
      ></TextField>
      <TextAreaField
        label="Total applications per status"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus: value,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.totalApplicationsPerStatus ?? value;
          }
          if (errors.totalApplicationsPerStatus?.hasError) {
            runValidationTasks("totalApplicationsPerStatus", value);
          }
          setTotalApplicationsPerStatus(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "totalApplicationsPerStatus",
            totalApplicationsPerStatus
          )
        }
        errorMessage={errors.totalApplicationsPerStatus?.errorMessage}
        hasError={errors.totalApplicationsPerStatus?.hasError}
        {...getOverrideProps(overrides, "totalApplicationsPerStatus")}
      ></TextAreaField>
      <TextAreaField
        label="Score histogram"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram: value,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.scoreHistogram ?? value;
          }
          if (errors.scoreHistogram?.hasError) {
            runValidationTasks("scoreHistogram", value);
          }
          setScoreHistogram(value);
        }}
        onBlur={() => runValidationTasks("scoreHistogram", scoreHistogram)}
        errorMessage={errors.scoreHistogram?.errorMessage}
        hasError={errors.scoreHistogram?.hasError}
        {...getOverrideProps(overrides, "scoreHistogram")}
      ></TextAreaField>
      <TextAreaField
        label="Gpa histogram"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram: value,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.gpaHistogram ?? value;
          }
          if (errors.gpaHistogram?.hasError) {
            runValidationTasks("gpaHistogram", value);
          }
          setGpaHistogram(value);
        }}
        onBlur={() => runValidationTasks("gpaHistogram", gpaHistogram)}
        errorMessage={errors.gpaHistogram?.errorMessage}
        hasError={errors.gpaHistogram?.hasError}
        {...getOverrideProps(overrides, "gpaHistogram")}
      ></TextAreaField>
      <TextAreaField
        label="Total applications per university"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity: value,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.totalApplicationsPerUniversity ?? value;
          }
          if (errors.totalApplicationsPerUniversity?.hasError) {
            runValidationTasks("totalApplicationsPerUniversity", value);
          }
          setTotalApplicationsPerUniversity(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "totalApplicationsPerUniversity",
            totalApplicationsPerUniversity
          )
        }
        errorMessage={errors.totalApplicationsPerUniversity?.errorMessage}
        hasError={errors.totalApplicationsPerUniversity?.hasError}
        {...getOverrideProps(overrides, "totalApplicationsPerUniversity")}
      ></TextAreaField>
      <TextAreaField
        label="Top universities"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities: value,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.topUniversities ?? value;
          }
          if (errors.topUniversities?.hasError) {
            runValidationTasks("topUniversities", value);
          }
          setTopUniversities(value);
        }}
        onBlur={() => runValidationTasks("topUniversities", topUniversities)}
        errorMessage={errors.topUniversities?.errorMessage}
        hasError={errors.topUniversities?.hasError}
        {...getOverrideProps(overrides, "topUniversities")}
      ></TextAreaField>
      <TextAreaField
        label="Top bahrain universities"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities: value,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.topBahrainUniversities ?? value;
          }
          if (errors.topBahrainUniversities?.hasError) {
            runValidationTasks("topBahrainUniversities", value);
          }
          setTopBahrainUniversities(value);
        }}
        onBlur={() =>
          runValidationTasks("topBahrainUniversities", topBahrainUniversities)
        }
        errorMessage={errors.topBahrainUniversities?.errorMessage}
        hasError={errors.topBahrainUniversities?.hasError}
        {...getOverrideProps(overrides, "topBahrainUniversities")}
      ></TextAreaField>
      <TextAreaField
        label="Family income"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome: value,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
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
      ></TextAreaField>
      <TextAreaField
        label="Universities bahrain"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain: value,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.universitiesBahrain ?? value;
          }
          if (errors.universitiesBahrain?.hasError) {
            runValidationTasks("universitiesBahrain", value);
          }
          setUniversitiesBahrain(value);
        }}
        onBlur={() =>
          runValidationTasks("universitiesBahrain", universitiesBahrain)
        }
        errorMessage={errors.universitiesBahrain?.errorMessage}
        hasError={errors.universitiesBahrain?.hasError}
        {...getOverrideProps(overrides, "universitiesBahrain")}
      ></TextAreaField>
      <TextAreaField
        label="Students"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students: value,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.students ?? value;
          }
          if (errors.students?.hasError) {
            runValidationTasks("students", value);
          }
          setStudents(value);
        }}
        onBlur={() => runValidationTasks("students", students)}
        errorMessage={errors.students?.errorMessage}
        hasError={errors.students?.hasError}
        {...getOverrideProps(overrides, "students")}
      ></TextAreaField>
      <TextAreaField
        label="Applications"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications: value,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.applications ?? value;
          }
          if (errors.applications?.hasError) {
            runValidationTasks("applications", value);
          }
          setApplications(value);
        }}
        onBlur={() => runValidationTasks("applications", applications)}
        errorMessage={errors.applications?.errorMessage}
        hasError={errors.applications?.hasError}
        {...getOverrideProps(overrides, "applications")}
      ></TextAreaField>
      <TextAreaField
        label="Today"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today: value,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.today ?? value;
          }
          if (errors.today?.hasError) {
            runValidationTasks("today", value);
          }
          setToday(value);
        }}
        onBlur={() => runValidationTasks("today", today)}
        errorMessage={errors.today?.errorMessage}
        hasError={errors.today?.hasError}
        {...getOverrideProps(overrides, "today")}
      ></TextAreaField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities: values,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            values = result?.participatingUniversities ?? values;
          }
          setParticipatingUniversities(values);
          setCurrentParticipatingUniversitiesValue("");
        }}
        currentFieldValue={currentParticipatingUniversitiesValue}
        label={"Participating universities"}
        items={participatingUniversities}
        hasError={errors?.participatingUniversities?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "participatingUniversities",
            currentParticipatingUniversitiesValue
          )
        }
        errorMessage={errors?.participatingUniversities?.errorMessage}
        setFieldValue={setCurrentParticipatingUniversitiesValue}
        inputFieldRef={participatingUniversitiesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Participating universities"
          isRequired={false}
          isReadOnly={false}
          value={currentParticipatingUniversitiesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.participatingUniversities?.hasError) {
              runValidationTasks("participatingUniversities", value);
            }
            setCurrentParticipatingUniversitiesValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "participatingUniversities",
              currentParticipatingUniversitiesValue
            )
          }
          errorMessage={errors.participatingUniversities?.errorMessage}
          hasError={errors.participatingUniversities?.hasError}
          ref={participatingUniversitiesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "participatingUniversities")}
        ></TextField>
      </ArrayField>
      <TextAreaField
        label="Application per gender histogram"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram: value,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.applicationPerGenderHistogram ?? value;
          }
          if (errors.applicationPerGenderHistogram?.hasError) {
            runValidationTasks("applicationPerGenderHistogram", value);
          }
          setApplicationPerGenderHistogram(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "applicationPerGenderHistogram",
            applicationPerGenderHistogram
          )
        }
        errorMessage={errors.applicationPerGenderHistogram?.errorMessage}
        hasError={errors.applicationPerGenderHistogram?.hasError}
        {...getOverrideProps(overrides, "applicationPerGenderHistogram")}
      ></TextAreaField>
      <TextAreaField
        label="Register accounts per gender"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender: value,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.registerAccountsPerGender ?? value;
          }
          if (errors.registerAccountsPerGender?.hasError) {
            runValidationTasks("registerAccountsPerGender", value);
          }
          setRegisterAccountsPerGender(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "registerAccountsPerGender",
            registerAccountsPerGender
          )
        }
        errorMessage={errors.registerAccountsPerGender?.errorMessage}
        hasError={errors.registerAccountsPerGender?.hasError}
        {...getOverrideProps(overrides, "registerAccountsPerGender")}
      ></TextAreaField>
      <TextAreaField
        label="Majors per gender histogram"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram: value,
              incomePerEmploymentStatus,
            };
            const result = onChange(modelFields);
            value = result?.majorsPerGenderHistogram ?? value;
          }
          if (errors.majorsPerGenderHistogram?.hasError) {
            runValidationTasks("majorsPerGenderHistogram", value);
          }
          setMajorsPerGenderHistogram(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "majorsPerGenderHistogram",
            majorsPerGenderHistogram
          )
        }
        errorMessage={errors.majorsPerGenderHistogram?.errorMessage}
        hasError={errors.majorsPerGenderHistogram?.hasError}
        {...getOverrideProps(overrides, "majorsPerGenderHistogram")}
      ></TextAreaField>
      <TextAreaField
        label="Income per employment status"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              id,
              batch,
              totalApplications,
              totalApplicationsPerStatus,
              scoreHistogram,
              gpaHistogram,
              totalApplicationsPerUniversity,
              topUniversities,
              topBahrainUniversities,
              familyIncome,
              universitiesBahrain,
              students,
              applications,
              today,
              participatingUniversities,
              applicationPerGenderHistogram,
              registerAccountsPerGender,
              majorsPerGenderHistogram,
              incomePerEmploymentStatus: value,
            };
            const result = onChange(modelFields);
            value = result?.incomePerEmploymentStatus ?? value;
          }
          if (errors.incomePerEmploymentStatus?.hasError) {
            runValidationTasks("incomePerEmploymentStatus", value);
          }
          setIncomePerEmploymentStatus(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "incomePerEmploymentStatus",
            incomePerEmploymentStatus
          )
        }
        errorMessage={errors.incomePerEmploymentStatus?.errorMessage}
        hasError={errors.incomePerEmploymentStatus?.hasError}
        {...getOverrideProps(overrides, "incomePerEmploymentStatus")}
      ></TextAreaField>
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
