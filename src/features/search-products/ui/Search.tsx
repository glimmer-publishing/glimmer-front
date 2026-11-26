"use client";
import { useEffect, Dispatch, SetStateAction, useState } from "react";
import SearchIcon from "@/shared/ui/icons/SearchIcon";
import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import { catalogMenuVariants } from "@/shared/lib/animationVariants";
import IconButton from "@/shared/ui/icon-button/IconButton";
import CrossIcon from "@/shared/ui/icons/CrossIcon";
import { Formik, Form } from "formik";
import CustomizedInput from "@/shared/ui/form/CustomizedInput";
import Image from "next/image";
import Link from "next/link";
import type { SearchProduct } from "../model/types";

interface SearchProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

/* One row of /api/search-products (searchProductsQuery). */

type LoadStatus = "idle" | "loading" | "ready" | "error";

export default function Search({ isOpen, setIsOpen }: SearchProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");

  // Loaded on first open rather than embedded in every page. The header lives
  // in the root layout, so the list survives client-side navigation. Not
  // cancelled on close: closing mid-request must not leave it stuck loading.
  // A failed load is retried the next time search is opened.
  useEffect(() => {
    if (!isOpen || status === "loading" || status === "ready") return;

    setStatus("loading");

    fetch("/api/search-products")
      .then((res) => {
        if (!res.ok) throw new Error(`Search data: HTTP ${res.status}`);
        return res.json();
      })
      .then((data: SearchProduct[]) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
    // Runs on open only; status changes must not re-trigger it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const q = query.trim().toLowerCase();
  const results =
    q.length > 0
      ? products.filter(
          (p) =>
            p.title?.toLowerCase().includes(q) ||
            p.author?.toLowerCase().includes(q)
        )
      : [];

  useEffect(() => {
    const body = document.body;
    if (isOpen) body.classList.add("no-scroll");
    else body.classList.remove("no-scroll");
    return () => body.classList.remove("no-scroll");
  }, [isOpen]);

  return (
    <div className="md:relative">
      {/* Кнопка відкриття */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="cursor-pointer group"
      >
        <SearchIcon className="text-white xl:group-hover:text-main transition duration-300 ease-in-out" />
      </button>

      {/* Модалка */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={catalogMenuVariants}
            className="absolute z-[100] top-10 right-5 md:-right-2 rounded-[12px] bg-white w-[320px] md:w-[384px] h-[304px] md:h-[320px] py-4 md:py-6 px-5 md:px-8 shadow-sm"
          >
            {/* Хедер */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <SearchIcon />
                <p className="text-[16px] lg:text-[18px] font-medium">Пошук</p>
              </div>
              <IconButton
                handleClick={() => setIsOpen(false)}
                className="size-6"
              >
                <CrossIcon />
              </IconButton>
            </div>

            {/* Форма пошуку */}
            <Formik initialValues={{ query }} onSubmit={() => {}}>
              {({ handleChange }) => (
                <Form className="flex flex-col gap-6">
                  <CustomizedInput
                    fieldName="query"
                    placeholder="Введи назву або автора"
                    errors={{}}
                    touched={{}}
                    fieldClassName="h-9"
                    onChange={(e) => {
                      handleChange(e);
                      setQuery(e.target.value);
                    }}
                  />

                  {/* Результати пошуку */}
                  <div
                    className="flex flex-col gap-2 py-0.5 pr-1 max-h-[164px] overflow-y-auto scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full 
      scrollbar-track-rounded-full scrollbar-thumb-main/60 scrollbar-track-transparent popup-scroll"
                  >
                    {/* While loading, or if loading failed, the list just
                        stays empty; results appear once the data arrives. */}
                    {q.length > 0 &&
                    status === "ready" &&
                    results.length === 0 ? (
                      <p className="py-2 px-3 text-[12px] font-light text-black/60">
                        Нічого не знайдено
                      </p>
                    ) : null}
                    {results.map((book, idx) => (
                      <Link
                        onClick={() => setIsOpen(false)}
                        href={`/catalog/${book.categorySlug}/${book.slug}`}
                        key={`${book.sku} - ${idx}`}
                        className="flex items-center gap-2 py-2 px-3 rounded-[12px] xl:hover:bg-main/20 cursor-pointer shadow-sm transition duration-300 ease-in-out"
                      >
                        <div className="relative w-6 h-8 shrink-0">
                          {book.mainImage ? (
                            <Image
                              src={book.mainImage}
                              alt={book.title}
                              fill
                              sizes="24px"
                              className="object-contain"
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[12px] font-medium line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-[10px] font-light font-black/60">
                            {book.author}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Бекдроп */}
      <Backdrop
        transparent
        isVisible={isOpen}
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
}
