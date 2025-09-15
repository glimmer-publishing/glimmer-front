"use client";

import ArrowIcon from "../../icons/ArrowIcon";
import Link from "next/link";
import { CatalogItem } from "@/types/catalogItem";

interface CategoryItemDeskProps {
  category: CatalogItem;
  onClose: () => void;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryItemDesk({
  category,
  onClose,
  isActive,
  onClick,
}: CategoryItemDeskProps) {
  const { title, genres } = category;

  const hasSub = genres && genres?.length > 0;

  return (
    <div
      className={`relative hidden lg:flex items-center gap-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] group-last:after:hidden after:bg-white after:opacity-[24%] cursor-pointer ${
        isActive ? "text-main" : ""
      } xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out`}
      onClick={hasSub ? onClick : undefined}
    >
      {hasSub ? (
        <>
          <span
            className={`text-[18px] font-light leading-[120%] ${isActive ? "border-b border-main" : ""}`}
          >
            {title}
          </span>
          <ArrowIcon
            className={`-rotate-90 ml-auto transition ${isActive ? "text-main" : ""}`}
          />
        </>
      ) : (
        <Link
          href={`/catalog/${category.slug}`}
          onClick={onClose}
          className="flex gap-x-[9px] items-center w-full"
        >
          <span className="text-[18px] font-light leading-[120%]">{title}</span>
        </Link>
      )}
    </div>
  );
}
