"use client";
import { useEffect, Dispatch, SetStateAction, useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "../backdrop/Backdrop";
import { catalogMenuVariants } from "@/utils/animationVariants";
import IconButton from "../buttons/IconButton";
import CrossIcon from "../icons/CrossIcon";
import { Formik, Form } from "formik";
import CustomizedInput from "../formComponents/CustomizedInput";
import Image from "next/image";
import { Product } from "@/types/product";
import Link from "next/link";

interface SearchProps {
  products: Product[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface SearchResult {
  id: string;
  title: string;
  author: string;
  image: string;
  categorySlug: string;
  slug: string;
}

export default function Search({ isOpen, setIsOpen, products }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      const filtered = products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.author.toLowerCase().includes(q)
        )
        .map((p) => ({
          id: p.sku,
          title: p.title,
          author: p.author,
          image: p.mainImage,
          categorySlug: p.categorySlug,
          slug: p.slug,
        }));
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, products]);

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
                    {results.map((book, idx) => (
                      <Link
                        onClick={() => setIsOpen(false)}
                        href={`/catalog/${book.categorySlug}/${book.slug}`}
                        key={`${book.id} - ${idx}`}
                        className="flex items-center gap-2 py-2 px-3 rounded-[12px] xl:hover:bg-main/20 cursor-pointer shadow-sm transition duration-300 ease-in-out"
                      >
                        <div className="relative w-6 h-8 shrink-0">
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-contain"
                          />
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
