"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowIcon from "../icons/ArrowIcon";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function Sorting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortingOptions = [
    { title: "За найвищим рейтингом", value: "rating" },
    { title: "За збільшенням ціни", value: "price-ascending" },
    { title: "За зменшенням ціни", value: "price-descending" },
  ];

  const initialSort = searchParams.get("sort") || "rating";
  const initialSelected =
    sortingOptions.find((opt) => opt.value === initialSort) ||
    sortingOptions[0];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  const handleOptionClick = (option: { value: string; title: string }) => {
    setSelected(option);
    setIsOpen(false);

    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    newParams.set("sort", option.value);
    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!searchParams.get("sort")) {
      const newParams = new URLSearchParams(Array.from(searchParams.entries()));
      newParams.set("sort", "rating");
      newParams.set("page", "1");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ x: 20, delay: 0.2 })}
      className="relative z-20 flex justify-between items-center gap-4"
    >
      <p className="text-[14px] lg:text-[18px] font-light leading-[120%]">
        Сортувати:
      </p>
      <div
        className="relative w-[210px] lg:w-[230px] shrink-0 z-20"
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group cursor-pointer flex items-center justify-between w-full h-8 lg:h-9 px-3 rounded-full border border-gray text-[12px] 
          lg:text-[14px] font-light bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
        >
          <span className="truncate text-[12px] lg:text-[14px] font-light leading-[120%]">
            {selected.title}
          </span>
          <ArrowIcon
            className={`size-4 ${isOpen ? "rotate-180" : "rotate-0"} transition duration-500 ease-in-out`}
          />
        </button>

        <div
          className={`${isOpen ? "opacity-100 z-20" : "opacity-0 pointer-events-none"} absolute right-0 w-full mt-1 bg-white rounded-[14px] 
            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] overflow-hidden text-[12px] lg:text-[14px] font-light transition duration-500 ease-in-out`}
        >
          {sortingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer w-full text-left px-4 py-2.5 xl:hover:bg-main/10 xl:hover:text-main transition duration-300 ease-in-out"
            >
              {option.title}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
