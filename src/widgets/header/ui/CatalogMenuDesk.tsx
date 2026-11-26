"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { catalogMenuVariants } from "@/shared/lib/animationVariants";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import CategoriesListDesk from "./CategoriesListDesk";
import { CatalogItem } from "../model/catalogItem";

interface CatalogMenuDeskProps {
  catalogList: CatalogItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogMenuDesk({
  catalogList,
  isOpen,
  onClose,
}: CatalogMenuDeskProps) {
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
            <CategoriesListDesk onClose={onClose} catalogList={catalogList} />
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
