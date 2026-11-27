"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import FormInput from "@/shared/ui/form/FormInput";
import { useFormikContext } from "formik";
import type { CheckoutLocationOption } from "../model/types";

type CheckoutLocationInputProps = {
  /* The Formik field the picked description is stored in. */
  fieldName: string;
  /* Floating label of the input. */
  placeholder: string;
  /* Entries matching what was typed. */
  options: CheckoutLocationOption[];
  /* Shows the spinner while options load. */
  isLoading?: boolean;
  /* Shown in the open dropdown when there is nothing to pick. */
  emptyMessage?: string;
  /* Whether the dropdown is open. */
  isDropDownOpen: boolean;
  /* Opens or closes the dropdown. */
  setIsDropDownOpen: Dispatch<SetStateAction<boolean>>;
  /* Called with the entry the customer picked. */
  onSelect: (option: CheckoutLocationOption) => void;
  /* Called on every keystroke, after the field value is updated. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Text input with a dropdown of matches. Text that was not picked from the
 * dropdown is cleared on blur, so only a known entry can be submitted.
 */
export default function CheckoutLocationInput({
  fieldName,
  placeholder,
  options,
  isLoading = false,
  emptyMessage,
  setIsDropDownOpen,
  isDropDownOpen,
  onSelect,
  onChange,
}: CheckoutLocationInputProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] =
    useState<CheckoutLocationOption | null>(null);

  const { setFieldError, setFieldTouched, setFieldValue, errors, touched } =
    useFormikContext<Record<string, string>>();

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
      <FormInput
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
        {!isLoading && !options.length && !!emptyMessage && (
          <li className="p-2 text-black/50">{emptyMessage}</li>
        )}
        {options.map((item: CheckoutLocationOption) => (
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
