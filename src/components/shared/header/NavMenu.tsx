import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import ArrowIcon from "../icons/ArrowIcon";
import CatalogMenuDesk from "./catalogMenu/CatalogMenuDesk";
import { Category } from "@/types/category";

interface NavMenuProps {
  categories: Category[];
  isOpenCatalogMenu: boolean;
  setIsOpenCatalogMenu: Dispatch<SetStateAction<boolean>>;
}

export const navList = [
  { title: "Про нас", link: "/about" },
  { title: "Контакти", link: "/contacts" },
  { title: "Доставка та оплата", link: "/delivery" },
];

export default function NavMenu({
  categories,
  isOpenCatalogMenu,
  setIsOpenCatalogMenu,
}: NavMenuProps) {
  const sortedCategories = categories.sort((a, b) => a.order - b.order);

  const catalogList = [{ title: "Акції", slug: "promo" }, ...sortedCategories];

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
          <CatalogMenuDesk
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
