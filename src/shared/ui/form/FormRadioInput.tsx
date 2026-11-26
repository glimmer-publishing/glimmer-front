import { Field } from "formik";
import { ReactNode } from "react";

type FormRadioInputProps = {
  /* The Formik field it reads and writes. */
  fieldName: string;
  /* Text beside the control. */
  label: string | ReactNode;
  /* The value this option stores. */
  value: string;
  /* Extra classes for the field itself. */
  fieldClassName?: string;
  /* Called when the option is picked. */
  onClick?: () => void;
};

/* Base classes of the label and the radio. */
const labelStyles =
  "relative cursor-pointer flex items-center gap-x-2 pl-0.5 w-fit";
const fieldStyles =
  "relative cursor-pointer appearance-none size-[19px] rounded-full outline-none transition duration-300 ease-out";

/**
 * A Formik radio button with its label.
 */
export default function FormRadioInput({
  fieldName,
  label = "",
  value = "",
  fieldClassName = "",
  onClick,
}: FormRadioInputProps) {
  return (
    <label className={labelStyles}>
      <Field
        name={fieldName}
        type="radio"
        onClick={onClick}
        value={value}
        autoComplete="on"
        className={`${fieldStyles} ${fieldClassName} shrink-0 shadow-[0_0_0_2px_#94C5E8] border-[5px] border-white bg-white checked:bg-main transition duration-300 ease-in-out`}
      ></Field>
      <p>{label}</p>
    </label>
  );
}
