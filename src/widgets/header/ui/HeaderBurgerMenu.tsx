"use client";
import { Dispatch, SetStateAction } from "react";
import HeaderBurgerMenuButton from "./HeaderBurgerMenuButton";
import HeaderBurgerMenuContent from "./HeaderBurgerMenuContent";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import type { MenuCategory } from "@/entities/category/model/types";
import { buildCatalogList } from "../lib/buildCatalogList";

type HeaderBurgerMenuProps = {
  /* Categories of the catalog menu. */
  categories: MenuCategory[];
  /* Whether the mobile menu is open. */
  isOpenBurgerMenu: boolean;
  /* Opens or closes the mobile menu. */
  setIsOpenBurgerMenu: Dispatch<SetStateAction<boolean>>;
};

/**
 * The mobile menu: the burger button and the panel it slides in.
 */
export default function HeaderBurgerMenu({
  categories,
  isOpenBurgerMenu,
  setIsOpenBurgerMenu,
}: HeaderBurgerMenuProps) {
  const catalogList = buildCatalogList(categories);

  return (
    <>
      <HeaderBurgerMenuButton
        onOpen={() => {
          setIsOpenBurgerMenu(true);
        }}
      />
      <HeaderBurgerMenuContent
        catalogList={catalogList}
        isOpen={isOpenBurgerMenu}
        onClose={() => setIsOpenBurgerMenu(false)}
      />
      <Backdrop
        isVisible={isOpenBurgerMenu}
        onClick={() => setIsOpenBurgerMenu(false)}
      />
    </>
  );
}
