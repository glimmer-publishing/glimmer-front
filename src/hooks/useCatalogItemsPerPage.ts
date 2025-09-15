"use client";
import { useState, useEffect } from "react";

export const useCatalogItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 1280) {
        setItemsPerPage(12);
      } else {
        setItemsPerPage(24);
      }
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return itemsPerPage;
};
