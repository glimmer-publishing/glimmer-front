"use client";

import HeaderCategoryItemDesk from "./HeaderCategoryItemDesk";
import { CatalogItem } from "../model/catalogItem";

type HeaderCategoriesListDeskProps = {
  /* Catalog menu entries, built from the menu categories. */
  catalogList: CatalogItem[];
  /* Closes it. */
  onClose: () => void;
};

/**
 * The desktop catalog dropdown's list of categories.
 */
export default function HeaderCategoriesListDesk({
  catalogList,
  onClose,
}: HeaderCategoriesListDeskProps) {
  return (
    <div className="relative z-10 flex">
      <div className="rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)]">
        <ul className="flex flex-col gap-6 px-8 py-6 w-[301px]">
          {catalogList.map((category, idx) => (
            <li key={idx} className="group">
              <HeaderCategoryItemDesk category={category} onClose={onClose} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
