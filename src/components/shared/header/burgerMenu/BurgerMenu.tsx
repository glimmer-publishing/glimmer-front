"use client";
import { Dispatch, SetStateAction } from "react";
import BurgerMenuButton from "./BurgerMenuButton";
import BurgerMenuContent from "./BurgerMenuContent";
import Backdrop from "../../backdrop/Backdrop";
import { Category } from "@/types/category";
import { buildCatalogList } from "@/utils/buildCatalogList";

interface BurgerMenuProps {
  categories: Category[];
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
