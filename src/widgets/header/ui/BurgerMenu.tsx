"use client";
import { Dispatch, SetStateAction } from "react";
import BurgerMenuButton from "./BurgerMenuButton";
import BurgerMenuContent from "./BurgerMenuContent";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import type { MenuCategory } from "@/entities/category/model/types";
import { buildCatalogList } from "../lib/buildCatalogList";

interface BurgerMenuProps {
  categories: MenuCategory[];
  isOpenBurgerMenu: boolean;
  setIsOpenBurgerMenu: Dispatch<SetStateAction<boolean>>;
}

export default function BurgerMenu({
  categories,
  isOpenBurgerMenu,
  setIsOpenBurgerMenu,
}: BurgerMenuProps) {
  const catalogList = buildCatalogList(categories);

  return (
    <>
      <BurgerMenuButton
        onOpen={() => {
          setIsOpenBurgerMenu(true);
        }}
      />
      <BurgerMenuContent
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
