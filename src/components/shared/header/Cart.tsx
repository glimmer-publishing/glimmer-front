"use client";
import { Dispatch, SetStateAction } from "react";
import CartButton from "../buttons/CartButton";
import Backdrop from "../backdrop/Backdrop";
import CartModal from "../cartModal/CartModal";

interface CartProps {
  isCartModalOpened: boolean;
  setIsOpenBurgerMenu: Dispatch<SetStateAction<boolean>>;
  setIsOpenCatalogMenu: Dispatch<SetStateAction<boolean>>;
  setIsCartModalOpened: Dispatch<SetStateAction<boolean>>;
}

export default function Cart({
  isCartModalOpened,
  setIsCartModalOpened,
  setIsOpenBurgerMenu,
  setIsOpenCatalogMenu,
}: CartProps) {
  return (
    <>
      <CartButton
        onClick={() => {
          setIsCartModalOpened(true);
          setIsOpenBurgerMenu(false);
          setIsOpenCatalogMenu(false);
        }}
      />
      <CartModal
        isPopUpShown={isCartModalOpened}
        setIsPopUpShown={setIsCartModalOpened}
      />
      <Backdrop
        isVisible={isCartModalOpened}
        onClick={() => setIsCartModalOpened(false)}
      />
    </>
  );
}
