import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import ArrowIcon from "@/shared/ui/icons/ArrowIcon";
import HeaderCatalogMenuDesk from "./HeaderCatalogMenuDesk";
import type { MenuCategory } from "@/entities/category/model/types";
import { buildCatalogList } from "../lib/buildCatalogList";

type HeaderNavMenuProps = {
  /* Categories of the catalog menu. */
  categories: MenuCategory[];
  /* Whether the catalog dropdown is open. */
  isOpenCatalogMenu: boolean;
  /* Opens or closes the catalog dropdown. */
  setIsOpenCatalogMenu: Dispatch<SetStateAction<boolean>>;
};

/* The header's links besides the catalog. */
export const navList = [
  { title: "Про нас", link: "/about" },
  { title: "Контакти", link: "/contacts" },
  { title: "Доставка та оплата", link: "/delivery" },
];

/**
 * The desktop navigation: the catalog dropdown and the info page links.
 */
export default function HeaderNavMenu({
  categories,
  isOpenCatalogMenu,
  setIsOpenCatalogMenu,
}: HeaderNavMenuProps) {
  const catalogList = buildCatalogList(categories);

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-8 xl:gap-14 items-center">
        <li className="relative">
          <button
            type="button"
            onClick={() => setIsOpenCatalogMenu(true)}
            className="group cursor-pointer flex items-center gap-2"
          >
            <span className="text-[18px] text-white group-active:text-main xl:group-hover:text-main group-focus-visible:text-main transition duration-300 ease-in-out">
              Каталог
            </span>
            <ArrowIcon className="text-white group-active:text-main xl:group-hover:text-main group-focus-visible:text-main transition duration-300 ease-in-out" />
          </button>
          <HeaderCatalogMenuDesk
            catalogList={catalogList}
            isOpen={isOpenCatalogMenu}
            onClose={() => setIsOpenCatalogMenu(false)}
          />
        </li>
        {navList.map(({ title, link }, idx) => (
          <li key={idx}>
            <Link
              href={link}
              className="block text-[18px] text-white active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
