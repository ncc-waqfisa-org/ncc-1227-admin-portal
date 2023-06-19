import { Formik, Form, Field } from "formik";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import * as yup from "yup";

interface Props {
  batch: number;
  updateBatch: (newBatch: number) => void;
}

export const BatchSelectorComponent: FC<Props> = ({
  batch: passedBatch,
  updateBatch,
}) => {
  let initialValues = {
    batch: passedBatch,
  };
  const { t } = useTranslation("common");
  const { t: tErrors } = useTranslation("errors");

  return (
    <div dir="ltr" className="">
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          batch: yup
            .number()
            .integer()
            .required(`${tErrors("requiredField")}`),
        })}
        onSubmit={async (values, actions) => {
          updateBatch(values.batch);
          actions.setSubmitting(false);
        }}
      >
        {({ values, handleChange, isSubmitting, isValid }) => (
          <Form
            className={`flex items-center justify-center gap-3 w-min input input-bordered ${
              !isValid && "border-error"
            }`}
          >
            <Field
              className={`input input-xs input-ghost text-gray-600`}
              name="batch"
              type="number"
              placeholder="Year"
              value={values.batch}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="btn btn-sm btn-ghost"
              disabled={
                isSubmitting || passedBatch === values.batch || !isValid
              }
            >
              {t("apply")}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
