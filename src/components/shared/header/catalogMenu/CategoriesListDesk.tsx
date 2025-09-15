"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryItemDesk from "./CategoryItemDesk";
import Link from "next/link";
import { CatalogItem } from "@/types/catalogItem";

interface CategoriesListDeskProps {
  catalogList: CatalogItem[];
  onClose: () => void;
}

export default function CategoriesListDesk({
  catalogList,
  onClose,
}: CategoriesListDeskProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(
    null
  );

  const activeCategory = catalogList.find(
    (cat) => cat.slug === activeCategorySlug
  );

  return (
    <div className="relative z-10 flex">
      {/* LEFT COLUMNS */}
      <div className="rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)]">
        <ul className="flex flex-col gap-6 px-8 py-6 w-[301px]">
          {catalogList.map((category, idx) => (
            <li key={idx} className="group">
              <CategoryItemDesk
                category={category}
                onClose={onClose}
                isActive={activeCategorySlug === category.slug}
                onClick={() => setActiveCategorySlug(category.slug)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SUBCATEGORY PANEL */}

      <AnimatePresence mode="wait">
        {activeCategory &&
          activeCategory.genres &&
          activeCategory.genres.length > 0 && (
            <motion.div
              key={activeCategory.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className={`absolute -right-[292px] top-0 flex flex-col w-full min-h-full bg-white px-8 py-6 
            rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)] ${!activeCategory ? "pointer-events-none" : ""}`}
            >
              <ul className="flex flex-col gap-6">
                {activeCategory?.genres.map((sub, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/catalog/${activeCategory.slug}?subcategory=${sub.slug}`}
                      className="flex items-center gap-x-3 text-[18px] font-light leading-[120%] xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
                      onClick={onClose}
                    >
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
