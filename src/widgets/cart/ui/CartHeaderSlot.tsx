"use client";
import { useState } from "react";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import CartButton from "./CartButton";
import CartModal from "./CartModal";

/**
 * The header cart: the count button, and the cart modal it opens over a
 * backdrop. The header passes it in as a slot and closes its own menus when
 * it is clicked.
 */
export default function CartHeaderSlot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CartButton onClick={() => setIsOpen(true)} />
      <CartModal isPopUpShown={isOpen} setIsPopUpShown={setIsOpen} />
      <Backdrop isVisible={isOpen} onClick={() => setIsOpen(false)} />
    </>
  );
}
