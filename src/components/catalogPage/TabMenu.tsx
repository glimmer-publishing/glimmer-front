"use client";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInAnimation } from "@/utils/animationVariants";
import TabMenuItem from "./TabMenuItem";
import { Product } from "@/types/product";

interface TabMenuProps {
  subcategories: {
    genreSlug: string;
    genreTitle: string;
    products: Product[];
  }[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function TabMenu({ activeTab, subcategories }: TabMenuProps) {
  const router = useRouter();

  const handleTabClick = (menu: { title: string; value: string }) => {
    const params = new URLSearchParams(window.location.search);
    params.set("subcategory", menu.value);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInAnimation({ x: -20 })}
      className="flex flex-wrap items-center gap-2"
    >
      {subcategories.map((subcategory, idx) => (
        <TabMenuItem
          key={idx}
          menuItem={{
            title: subcategory.genreTitle,
            value: subcategory.genreSlug,
          }}
          activeTab={activeTab}
          handleTabClick={() =>
            handleTabClick({
              title: subcategory.genreTitle,
              value: subcategory.genreSlug,
            })
          }
        ></TabMenuItem>
      ))}
    </motion.ul>
  );
}
