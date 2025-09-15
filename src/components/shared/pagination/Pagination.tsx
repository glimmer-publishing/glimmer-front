"use client";
import { useState, useEffect, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ArrowIcon from "../icons/ArrowIcon";

interface PaginationProps<T> {
  items: T[];
  renderItems: (items: T[]) => ReactNode;
  useItemsPerPage: () => number;
  maxVisiblePages?: number;
  className?: string;
}

export default function Pagination<T>({
  items,
  renderItems,
  useItemsPerPage,
  maxVisiblePages = 4,
  className = "",
}: PaginationProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const itemsPerPage = useItemsPerPage();
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  return (
    <>
      <div key={currentPage} className={`${className}`}>
        {renderItems(currentItems)}
      </div>
      <div
        className={`${totalPages > 1 ? "flex" : "hidden"}  justify-center items-center gap-3 xl:gap-[35px] mt-8 xl:mt-12 mx-auto`}
      >
        <button
          aria-label="left"
          className={`enabled:cursor-pointer flex justify-center items-center  size-6 lg:size-10 rounded-[6px] transition duration-300 ease-in-out
          enabled:hover:bg-gray/50 enabled:active:scale-95 enabled:focus-visible:bg-gray/50
          ${page === 1 ? "text-black/30" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={page === 1}
        >
          <ArrowIcon className="size-6 lg:size-10 rotate-90" />
        </button>

        <div>
          {pageNumbers.map((page) => (
            <button
              key={page}
              aria-label={page.toString()}
              className={`enabled:cursor-pointer px-1 xl:px-[9px] py-2 text-[12px] lg:text-[16px] font-normal leading-[120%] transition duration-300 ease-in-out
            ${page === currentPage ? "text-main" : " xl:hover:text-main"}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          aria-label="right"
          className={`enabled:cursor-pointer flex justify-center items-center size-6 lg:size-10 rounded-[6px]
             transition duration-300 ease-in-out
           enabled:hover:bg-gray/50 enabled:active:scale-95 enabled:focus-visible:bg-gray/50
          ${currentPage === totalPages ? "text-black/30" : ""}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={page === totalPages}
        >
          <ArrowIcon className="size-6 lg:size-10 -rotate-90" />
        </button>
      </div>
    </>
  );
}
