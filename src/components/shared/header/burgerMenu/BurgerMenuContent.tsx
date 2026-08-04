"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IconButton from "../../buttons/IconButton";
import ArrowIcon from "../../icons/ArrowIcon";
import CrossIcon from "../../icons/CrossIcon";
import Link from "next/link";
import { navList } from "../NavMenu";
import { CatalogItem } from "@/types/catalogItem";
import {
  burgerMenuVariants,
  burgerListVariants,
} from "@/utils/animationVariants";

interface BurgerMenuContentProps {
  catalogList: CatalogItem[];
  isOpen: boolean;
  onClose: () => void;
}

type MenuLevel = "main" | "catalog";

export default function BurgerMenuContent({
  catalogList,
  isOpen,
  onClose,
}: BurgerMenuContentProps) {
  const [menuLevel, setMenuLevel] = useState<MenuLevel>("main");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMenuLevel("main");

      const t = setTimeout(() => setShowList(true), 400);
      return () => clearTimeout(t);
    } else {
      setShowList(false);
    }
  }, [isOpen]);

  const handleBack = () => {
    if (menuLevel === "catalog") {
      setMenuLevel("main");
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lg:hidden fixed right-0 top-0 z-[70] w-[280px] h-dvh max-h-dvh
          px-5 py-[30px] overflow-y-auto bg-white scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full 
          scrollbar-track-rounded-full scrollbar-thumb-transparent scrollbar-track-main popup-scroll"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={burgerMenuVariants}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4">
            <IconButton handleClick={handleBack} className="size-6">
              <ArrowIcon className="rotate-90" />
            </IconButton>
            <IconButton handleClick={onClose} className="size-6">
              <CrossIcon />
            </IconButton>
          </div>

          {/* Меню */}
          <AnimatePresence mode="wait">
            {isOpen && showList && menuLevel === "main" && (
              <motion.ul
                key={`main-${isOpen}`}
                variants={burgerListVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-10 pt-10"
              >
                <li>
                  <button
                    type="button"
                    onClick={() => setMenuLevel("catalog")}
                    className="group cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-[18px] font-light leading-[120%] border-b border-transparent group-active:border-main group-active:text-main group-focus-visible:text-main transition duration-300 ease-in-out">
                      Каталог
                    </span>
                    <ArrowIcon className="-rotate-90 group-active:text-main xl:group-hover:text-main group-focus-visible:text-main transition duration-300 ease-in-out" />
                  </button>
                </li>
                {navList.map(({ title, link }, idx) => (
                  <li key={idx}>
                    <Link
                      onClick={onClose}
                      href={link}
                      className="block text-[18px] font-light leading-[120%] active:text-main focus-visible:text-main transition duration-300 ease-in-out"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}

            {menuLevel === "catalog" && (
              <motion.ul
                key="catalog"
                variants={burgerListVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-10 pt-10"
              >
                {catalogList.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      onClick={onClose}
                      href={item.href}
                      className="group flex items-center gap-2 w-full text-[18px] font-light leading-[120%] active:text-main focus-visible:text-main transition duration-300 ease-in-out"
                    >
                      <span className="border-b border-transparent group-active:border-main transition duration-300 ease-in-out">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
