"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { catalogMenuVariants } from "@/shared/lib/animation/animationVariants";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import HeaderCategoriesListDesk from "./HeaderCategoriesListDesk";
import { CatalogItem } from "../model/catalogItem";

type HeaderCatalogMenuDeskProps = {
  /* Catalog menu entries, built from the menu categories. */
  catalogList: CatalogItem[];
  /* Whether it is open. */
  isOpen: boolean;
  /* Closes it. */
  onClose: () => void;
};

/**
 * The desktop "Каталог" button and the dropdown of categories it opens.
 */
export default function HeaderCatalogMenuDesk({
  catalogList,
  isOpen,
  onClose,
}: HeaderCatalogMenuDeskProps) {
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }

    return () => body.classList.remove("no-scroll");
  }, [isOpen]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={catalogMenuVariants}
            className={`hidden lg:block absolute z-[100] top-10 left-0 rounded-[12px] bg-white`}
          >
            <HeaderCategoriesListDesk
              onClose={onClose}
              catalogList={catalogList}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Backdrop
        className="hidden lg:block"
        transparent
        isVisible={isOpen}
        onClick={onClose}
      />
    </>
  );
}
