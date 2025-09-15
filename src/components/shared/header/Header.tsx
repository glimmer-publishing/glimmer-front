"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as motion from "motion/react-client";
import Container from "../container/Container";
import LogoIcon from "../icons/LogoIcon";
import HeartIcon from "../icons/HeartIcon";
import Search from "./Search";
import NavMenu from "./NavMenu";
import { Category } from "@/types/category";
import BurgerMenu from "./burgerMenu/BurgerMenu";
import Cart from "./Cart";
import { headerVariants, fadeInAnimation } from "@/utils/animationVariants";
import { Product } from "@/types/product";

interface HeaderProps {
  categories: Category[];
  products: Product[];
}

export default function Header({ categories, products }: HeaderProps) {
  const [isOpenCatalogMenu, setIsOpenCatalogMenu] = useState(false);
  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false);
  const [isCartModalOpened, setIsCartModalOpened] = useState(false);
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
              products={products}
            />
            <Link href="/favorites" className="group">
              <HeartIcon className="text-white xl:group-hover:text-main group-focus-visible:text-main group-active:text-main transition duration-300 ease-in-out" />
            </Link>
            <Cart
              isCartModalOpened={isCartModalOpened}
              setIsCartModalOpened={setIsCartModalOpened}
              setIsOpenBurgerMenu={setIsOpenBurgerMenu}
              setIsOpenCatalogMenu={setIsOpenCatalogMenu}
            />
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
