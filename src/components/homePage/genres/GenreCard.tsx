import { Genre } from "@/types/genre";
import Image from "next/image";
import Link from "next/link";

interface GenreCardProps {
  genre: Genre;
}

export default function GenreCard({ genre }: GenreCardProps) {
  const { image, name, slug } = genre;

  return (
    <div className="w-[180px] h-[212px]">
      <Link
        href={`/catalog/khudozhnya-literatura?subcategory=${slug}`}
        className="block px-2.5 pt-6 pb-5 shadow-md rounded-[8px] xl:hover:-translate-y-1 transition duration-300 ease-in-out"
      >
        <div className="relative w-[160px] h-[120px] mb-6">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <h3 className="text-[20px] font-normal leading-none uppercase text-center">
          {name}
        </h3>
      </Link>
    </div>
  );
}
