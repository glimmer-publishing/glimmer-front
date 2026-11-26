import Image from "next/image";
import * as motion from "motion/react-client";
import type { InstagramPost } from "@/entities/instagram-post/model/types";
import {
  listVariants,
  listItemVariants,
} from "@/shared/lib/animation/animationVariants";
import Container from "@/shared/ui/container/Container";
import Section from "@/shared/ui/section/Section";
import SectionDescription from "@/shared/ui/section-description/SectionDescription";
import SectionTitle from "@/shared/ui/titles/SectionTitle";

type InstagramProps = {
  /* Posts from the Instagram document in Studio. */
  instagramPosts: InstagramPost[];
};

/**
 * "Наш Instagram" section: heading and a horizontally scrolling row of
 * linked posts that stagger in. Nothing renders when there are no posts.
 */
export default function Instagram({ instagramPosts }: InstagramProps) {
  if (!instagramPosts.length) return null;

  return (
    <Section>
      <Container className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-6 lg:mb-12">
        <SectionTitle>Наш Instagram</SectionTitle>
        <SectionDescription>
          Залишайся ближче до натхнення.
          <br /> Ми поруч — в Instagram.
        </SectionDescription>
      </Container>
      <div className="xs:max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] sm:px-5 lg:px-[50px] mx-auto">
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
                    sizes="(min-width: 640px) 25vw, 140px"
                    className="object-cover xl:group-hover:scale-105 transition duration-1000 ease-in-out"
                  />
                </div>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}
