import { Genre } from "../model/types";
import Image from "next/image";
import Link from "next/link";
import { categoryPageHref } from "@/shared/lib/searchParams/categoryParams";

/* Home genres all belong to fiction. */
const FICTION_CATEGORY = "khudozhnya-literatura";

type HomeGenreCardProps = {
  /* The genre shown. */
  genre: Genre;
};

/**
 * One genre: its image and name, linking to its tab of the fiction category.
 */
export default function HomeGenreCard({ genre }: HomeGenreCardProps) {
  const { image, name, slug } = genre;

  return (
    <div className="w-[180px] h-[240px]">
      <Link
        href={categoryPageHref(FICTION_CATEGORY, slug)}
        className="block min-h-[228px] px-2.5 pt-6 pb-5 shadow-md rounded-[8px] xl:hover:-translate-y-1 transition duration-300 ease-in-out"
      >
        <div className="relative w-[160px] h-[120px] mb-6">
          <Image
            src={image}
            alt={name}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
        <h3 className="text-[20px] font-normal leading-none uppercase text-center">
          {name}
        </h3>
      </Link>
    </div>
  );
}
