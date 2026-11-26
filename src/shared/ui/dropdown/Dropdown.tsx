"use client";

import { useEffect, useRef, useState } from "react";
import ArrowIcon from "@/shared/ui/icons/ArrowIcon";

/* One choice of a Dropdown. */
export type DropdownOption = {
  /* Text shown for the option. */
  title: string;
  /* Value reported to onChange. */
  value: string;
};

type DropdownProps = {
  /* Text left of the select. */
  label: string;
  /* Choices in the list. */
  options: DropdownOption[];
  /* Selected value; the first option shows when it matches none. */
  value: string;
  /* Called with the newly picked value, not when the same one is picked again. */
  onChange: (value: string) => void;
  /* Width of the trigger and the list, e.g. "w-[170px] lg:w-[190px]". */
  widthClassName?: string;
  /* Extra classes for the outer row. */
  className?: string;
};

/**
 * Labelled pill select, shared by the catalog filter and sort. It only keeps
 * its open state and reports the picked value to the caller.
 */
export default function Dropdown({
  label,
  options,
  value,
  onChange,
  widthClassName = "w-[190px] lg:w-[210px]",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    setIsOpen(false);
    if (optionValue !== selected?.value) onChange(optionValue);
  };

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <p className="text-[14px] lg:text-[18px] font-light leading-[120%]">
        {label}
      </p>
      <div className={`relative shrink-0 ${widthClassName}`} ref={rootRef}>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="group cursor-pointer flex items-center justify-between w-full h-8 lg:h-9 px-3 rounded-full border border-gray text-[12px]
           lg:text-[14px] font-light bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
        >
          <span className="truncate text-[12px] lg:text-[14px] font-light leading-[120%]">
            {selected?.title}
          </span>
          <ArrowIcon
            className={`size-4 ${isOpen ? "rotate-180" : "rotate-0"} transition duration-500 ease-in-out`}
          />
        </button>

        <ul
          aria-label={label}
          aria-hidden={!isOpen}
          className={`${isOpen ? "opacity-100 z-20" : "opacity-0 pointer-events-none"} absolute right-0 w-full mt-1 bg-white rounded-[14px]
            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] overflow-hidden text-[12px] lg:text-[14px] font-light transition duration-500 ease-in-out`}
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                aria-current={
                  option.value === selected?.value ? "true" : undefined
                }
                tabIndex={isOpen ? 0 : -1}
                onClick={() => handleSelect(option.value)}
                className="cursor-pointer w-full text-left px-4 py-2.5 xl:hover:bg-main/10 xl:hover:text-main transition duration-300 ease-in-out"
              >
                {option.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
