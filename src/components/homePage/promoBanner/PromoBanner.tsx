"use client";
import { HomepageBanner } from "@/types/promoBanner";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface PromoBanner {
  banner: HomepageBanner;
  className?: string;
  idx: string;
}

export default function PromoBanner({
  banner,
  className = "",
  idx,
}: PromoBanner) {
  const { imageSmall, imageLarge, link } = banner;

  const content = (
    <>
      <Image
        src={imageSmall}
        alt="promo banner"
        width={320}
        height={268}
        unoptimized
        className="w-full h-auto xs:hidden"
      />
      <Image
        src={imageLarge}
        alt="promo banner"
        width={320}
        height={268}
        unoptimized
        className="w-full h-auto hidden xs:block"
      />
    </>
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ x: idx === "first" ? -30 : 30 })}
      className={`${className} md:w-[calc(50%-8px)]`}
    >
      {link ? (
        <Link href={link} className={`${className} block`}>
          {content}
        </Link>
      ) : (
        <>{content}</>
      )}
    </motion.div>
  );
}
