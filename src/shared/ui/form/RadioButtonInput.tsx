import { Field } from "formik";
import { ReactNode } from "react";

interface CustomizedInputProps {
  fieldName: string;
  label: string | ReactNode;
  value: string;
  fieldClassName?: string;
  onClick?: () => void;
}

const labelStyles =
  "relative cursor-pointer flex items-center gap-x-2 pl-0.5 w-fit";
const fieldStyles =
  "relative cursor-pointer appearance-none size-[19px] rounded-full outline-none transition duration-300 ease-out";

export default function RadioButtonInput({
  fieldName,
  label = "",
  value = "",
  fieldClassName = "",
  onClick,
}: CustomizedInputProps) {
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
