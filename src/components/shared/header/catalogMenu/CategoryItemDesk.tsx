"use client";

import Link from "next/link";
import { CatalogItem } from "@/types/catalogItem";

interface CategoryItemDeskProps {
  category: CatalogItem;
  onClose: () => void;
}

export default function CategoryItemDesk({
  category,
  onClose,
}: CategoryItemDeskProps) {
  const { title, href } = category;

  return (
    <div className="relative hidden lg:flex items-center gap-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] group-last:after:hidden after:bg-white after:opacity-[24%] cursor-pointer xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out">
      <Link
        href={href}
        onClick={onClose}
        className="flex gap-x-[9px] items-center w-full"
      >
        <span className="text-[18px] font-light leading-[120%]">{title}</span>
      </Link>
    </div>
  );
}
