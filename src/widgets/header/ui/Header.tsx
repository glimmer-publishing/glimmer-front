"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import * as motion from "motion/react-client";
import Container from "@/shared/ui/container/Container";
import LogoIcon from "@/shared/ui/icons/LogoIcon";
import HeartIcon from "@/shared/ui/icons/HeartIcon";
import Search from "@/features/search-products/ui/Search";
import NavMenu from "./NavMenu";
import type { MenuCategory } from "@/entities/category/model/types";
import BurgerMenu from "./BurgerMenu";
import { headerVariants, fadeInAnimation } from "@/shared/lib/animationVariants";

interface HeaderProps {
  /* Categories for the catalog and burger menus. */
  categories: MenuCategory[];
  /* The cart button with its modal (widgets/cart HeaderCart). */
  cart: ReactNode;
}

/**
 * The site header: logo, navigation with the catalog menu, search,
 * favorites, the cart slot and the burger menu on mobile. Only the logo is
 * rendered before hydration.
 */
export default function Header({ categories, cart }: HeaderProps) {
  const [isOpenCatalogMenu, setIsOpenCatalogMenu] = useState(false);
  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Активуємо рендер тільки після гідратації
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <motion.header
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.2 }}
        variants={headerVariants}
        className="fixed z-30 top-0 left-0 w-dvw py-6 bg-black"
      >
        <Container className="flex items-center justify-between">
          <Link href="/" className="group">
            <LogoIcon className="text-white" />
          </Link>
        </Container>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={headerVariants}
      className="fixed z-30 top-0 left-0 w-dvw py-6 bg-black"
    >
      <Container className="relative flex items-center justify-between">
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInAnimation({ scale: 0.9, duration: 1 })}
        >
          <Link href="/" className="group">
            <LogoIcon className="text-white xl:group-hover:text-main group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out" />
          </Link>
        </motion.div>
        <div className="flex items-center gap-[72px]">
          <NavMenu
            categories={categories}
            isOpenCatalogMenu={isOpenCatalogMenu}
            setIsOpenCatalogMenu={setIsOpenCatalogMenu}
          />
          <div className="flex items-center gap-[22px]">
            <Search
              isOpen={isOpenSearch}
              setIsOpen={setIsOpenSearch}
            />
            <Link href="/favorites" className="group">
              <HeartIcon className="text-white xl:group-hover:text-main group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out" />
            </Link>
            {/* Opening the cart closes the header's own menus. */}
            <div
              className="contents"
              onClickCapture={() => {
                setIsOpenBurgerMenu(false);
                setIsOpenCatalogMenu(false);
              }}
            >
              {cart}
            </div>
            <BurgerMenu
              categories={categories}
              isOpenBurgerMenu={isOpenBurgerMenu}
              setIsOpenBurgerMenu={setIsOpenBurgerMenu}
            />
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
