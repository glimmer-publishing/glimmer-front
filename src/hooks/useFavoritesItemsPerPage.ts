"use client";
import { useState, useEffect } from "react";

export const useFavoritesItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setItemsPerPage(6);
      } else {
        if (width < 1280) {
          setItemsPerPage(8);
        } else {
          setItemsPerPage(10);
        }
      }
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return itemsPerPage;
};
