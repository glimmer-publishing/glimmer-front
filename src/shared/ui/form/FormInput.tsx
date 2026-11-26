"use client";

import {
  ErrorMessage,
  Field,
  FormikErrors,
  FormikTouched,
  useFormikContext,
} from "formik";
import MaskedInput from "react-text-mask";
import { useId } from "react";
import LoaderIcon from "@/shared/ui/icons/LoaderIcon";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/* Formik values of a text form. */
type Values = {
  [fieldName: string]: string;
};

type FormInputProps = {
  /* The Formik field it reads and writes. */
  fieldName: string;
  /* Floating label of the field. */
  placeholder: string;
  /* Formik's errors; this field's is shown under it. */
  errors: FormikErrors<Values>;
  /* Formik's touched map; an error shows once the field is touched. */
  touched: FormikTouched<Values>;
  /* Marks the label with an asterisk. */
  isRequired?: boolean;
  /* "textarea", or MaskedInput for a masked field. */
  as?: string | typeof MaskedInput;
  /* Extra classes for the label wrapper. */
  labelClassName?: string;
  /* Extra classes for the field itself. */
  fieldClassName?: string;
  /* react-text-mask mask, with as={MaskedInput}. */
  mask?: string | RegExp | (string | RegExp)[];
  /* Replaces Formik's change handler; the caller must set the value. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /* Called when the field gains focus. */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /* Replaces Formik's blur handler. */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /* Shows the spinner. */
  isLoading?: boolean;
  /* The input's type attribute. */
  inputType?: string;
  /* Font size classes of the field. */
  fieldFontSize?: string;
};

/* Base classes of the label, field and error; the props add to them. */
const labelStyles = "relative flex flex-col w-full";
const fieldStyles =
  "relative w-full px-4 py-2 text-dark bg-white placeholder-transparent border-2 rounded-full outline-none resize-none transition duration-300 ease-out";
const errorStyles =
  "absolute bottom-[-11px] left-2 text-[9px] font-normal leading-none text-red-500";

/**
 * A Formik text field (input, textarea or masked input) with a floating label,
 * an optional spinner and the field's error.
 */
export default function FormInput({
  fieldName,
  placeholder,
  errors,
  touched,
  isRequired = false,
  as,
  labelClassName = "",
  fieldClassName = "",
  fieldFontSize = "",
  mask = "",
  onChange,
  onFocus,
  onBlur,
  inputType = "text",
  isLoading = false,
}: FormInputProps) {
  const { handleChange, handleBlur, values } = useFormikContext<Values>();
  const isError = (errors as Record<string, unknown>)[fieldName];
  const isTouched = (touched as Record<string, unknown>)[fieldName];
  const fieldValue = values[fieldName];
  const showPlaceholder = !fieldValue;
  const inputId = useId();

  return (
    <label htmlFor={inputId} className={`${labelStyles} ${labelClassName}`}>
      <div className="relative w-full">
        <Field
          id={inputId}
          as={as}
          mask={mask}
          name={fieldName}
          type={inputType}
          autoComplete="on"
          onChange={onChange || handleChange}
          onFocus={onFocus}
          onBlur={onBlur || handleBlur}
          className={twMerge(
            clsx(
              `${fieldStyles}  ${
                isError && isTouched ? "border-red-500" : "border-gray"
              }`,
              fieldClassName,
              fieldFontSize
            )
          )}
        />
        {isLoading && <LoaderIcon />}
        <span
          className={`pointer-events-none absolute left-4 ${
            as === "textarea" ? "top-4" : "top-1/2 -translate-y-1/2"
          } text-placeholder`}
        >
          {showPlaceholder && (
            <>
              <span>
                {isRequired && <span className="text-red-500 mr-1"> *</span>}
              </span>
              <span className="text-placeholder">{placeholder}</span>
            </>
          )}
        </span>
      </div>

      <ErrorMessage name={fieldName} component="p" className={errorStyles} />
    </label>
  );
}
