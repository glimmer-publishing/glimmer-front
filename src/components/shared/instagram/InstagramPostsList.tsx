import Image from "next/image";
import * as motion from "motion/react-client";
import { listVariants, listItemVariants } from "@/utils/animationVariants";

interface InstagramPostsListProps {
  instagramPosts: { image: string; alt?: string; url: string }[];
}

export default function InstagramPostsList({
  instagramPosts,
}: InstagramPostsListProps) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={listVariants({
        staggerChildren: 0.3,
        delayChildren: 0.3,
      })}
      className="flex gap-3 sm:gap-5 overflow-x-auto px-5 sm:px-0 overflow-hidden scrollbar scrollbar-h-[0px] scrollbar-thumb-rounded-full 
      scrollbar-track-rounded-full scrollbar-thumb-transparent scrollbar-track-main"
    >
      {instagramPosts.map(({ url, image, alt }, idx) => (
        <motion.li
          viewport={{ once: true, amount: 0.2 }}
          variants={listItemVariants}
          key={idx}
          className="shrink-0 w-[140px] sm:w-[calc(25%-15px)] h-auto aspect-[140/157] rounded-[8px] overflow-hidden"
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group block w-[140px] sm:w-full h-auto aspect-[140/157]"
          >
            <div className="relative w-[140px] sm:w-full h-auto aspect-[140/157]">
              <Image
                src={image}
                alt={alt || "instagram post"}
                fill
                className="object-cover xl:group-hover:scale-105 transition duration-1000 ease-in-out"
              />
            </div>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
