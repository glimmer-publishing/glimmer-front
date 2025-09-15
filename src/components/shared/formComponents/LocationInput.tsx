"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import CustomizedInput from "./CustomizedInput";
import { useFormikContext } from "formik";
import { ValuesCheckoutFormType } from "../forms/checkoutForm/CheckoutForm";

interface Option {
  key: string;
  description: string;
}

interface LocationInputProps {
  fieldName: keyof ValuesCheckoutFormType;
  placeholder: string;
  options: Option[];
  isLoading?: boolean;
  isDropDownOpen: boolean;
  setIsDropDownOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (option: Option) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LocationInput({
  fieldName,
  placeholder,
  options,
  isLoading = false,
  setIsDropDownOpen,
  isDropDownOpen,
  onSelect,
  onChange,
}: LocationInputProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const { setFieldError, setFieldTouched, setFieldValue, errors, touched } =
    useFormikContext<ValuesCheckoutFormType>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    }

    if (isDropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen, setIsDropDownOpen]);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full laptop:w-[49%] deskxl:w-[31.5%] h-fit"
    >
      <CustomizedInput
        onFocus={() => setIsDropDownOpen(true)}
        onBlur={() => {
          setFieldTouched(fieldName, true);
          if (!selectedOption) {
            setFieldValue(fieldName, "");
          }
        }}
        onChange={(e) => {
          setSelectedOption(null);
          setFieldValue(fieldName, e.target.value);
          onChange?.(e);
        }}
        fieldName={fieldName}
        isRequired
        isLoading={isLoading}
        placeholder={placeholder}
        errors={errors}
        touched={touched}
      />

      <ul
        className={`${
          isDropDownOpen ? "block" : "hidden"
        } absolute top-[calc(100%+4px)] left-0 w-full bg-white shadow-sm rounded-[12px] h-[120px] lg:h-[140px] overflow-x-hidden overflow-y-auto z-20 
        scrollbar scrollbar-w-[2px] scrollbar-h-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
        scrollbar-thumb-main popup-scroll`}
      >
        {options.map((item: Option) => (
          <li
            key={item.key}
            className="p-2 cursor-pointer xl:hover:bg-main/10 xl:hover:text-main transition duration-300 ease-in-out"
            onClick={() => {
              setSelectedOption(item);
              setFieldValue(fieldName, item.description); // зберігаємо значення у Formik
              setFieldError(fieldName, undefined); // прибираємо помилку
              onSelect(item);
              setIsDropDownOpen(false);
            }}
          >
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
