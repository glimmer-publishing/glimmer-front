import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import { getImageProps } from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import {
  BANNER_IMAGE_QUALITY,
  sanityImageAspectRatio,
  sanityImageLoader,
} from "@/utils/sanityImage";

/* The image fills the slide with object-cover. When the slide is
   proportionally taller than the image, cover scales the image to the slide's
   height, so it is drawn wider than the viewport. `sizes` must declare that
   drawn width, or the browser fetches a file too small and upscales it.
   Heights are the tallest the slide gets per breakpoint (padding + text +
   button), generous on purpose: overshooting costs bytes, undershooting
   costs sharpness. */
const MAX_SLIDE_HEIGHT = { mob: 700, tab: 650, desk: 650 };

const coverSizes = (url: string, maxSlideHeight: number) => {
  const ratio = sanityImageAspectRatio(url);
  return ratio ? `max(100vw, ${Math.ceil(maxSlideHeight * ratio)}px)` : "100vw";
};

interface HeroSlideProps {
  banner: {
    title: string;
    description: string;
    imageMob: string;
    imageTab: string;
    imageDesk: string;
    button: {
      label: string;
      link: string;
      position: string;
    };
    order: number;
  };
  /* First banner on the page: fetched eagerly at high priority. */
  isPriority?: boolean;
  /* The slide on screen or next to it: fetched now rather than lazily, so
     autoplay or a swipe never lands on a blank slide. */
  isEager?: boolean;
}

export default function HeroSlide({
  banner,
  isPriority = false,
  isEager = false,
}: HeroSlideProps) {
  const { title, description, imageMob, imageTab, imageDesk, button } = banner;

  /* One <picture>, never three CSS-toggled <Image>s: the browser downloads
     only the variant whose media query matches. Do not use `priority` on
     <Image> here - its preload carries no media query and fetches every
     variant regardless of viewport. */
  const deskSizes = coverSizes(imageDesk, MAX_SLIDE_HEIGHT.desk);
  const tabSizes = coverSizes(imageTab, MAX_SLIDE_HEIGHT.tab);
  const mobSizes = coverSizes(imageMob, MAX_SLIDE_HEIGHT.mob);

  const common = {
    alt: "hero banner",
    fill: true,
    loader: sanityImageLoader,
    quality: BANNER_IMAGE_QUALITY,
    // getImageProps does not turn `priority` into a fetch priority on its own.
    fetchPriority: isPriority ? ("high" as const) : undefined,
    loading: isPriority || isEager ? ("eager" as const) : ("lazy" as const),
  };
  const {
    props: { srcSet: deskSrcSet },
  } = getImageProps({ ...common, src: imageDesk, sizes: deskSizes });
  const {
    props: { srcSet: tabSrcSet },
  } = getImageProps({ ...common, src: imageTab, sizes: tabSizes });
  const { props: mobProps } = getImageProps({
    ...common,
    src: imageMob,
    sizes: mobSizes,
  });

  return (
    <div className="relative flex z-10 w-dvw pt-[235px] lg:pt-[155px] pb-[116px] lg:pb-[103px] overflow-hidden h-full min-h-[500px] lg:min-h-[550px]">
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet={deskSrcSet}
          sizes={deskSizes}
        />
        <source
          media="(min-width: 640px)"
          srcSet={tabSrcSet}
          sizes={tabSizes}
        />
        {/* src, srcSet and fill styles come from getImageProps. */}
        <img {...mobProps} alt={mobProps.alt} className="-z-10 object-cover" />
      </picture>
      <Container
        className={`flex min-h-full flex-1 ${button.position === "bottomLeft" ? "flex-col justify-between" : button.position === "bottomRight" ? "flex-col justify-between" : "flex-col-reverse justify-between"}`}
      >
        {title || description ? (
          <div
            className={`flex flex-col gap-10  mb-10 lg:mb-9 text-white ${button.position === "bottomLeft" ? "md:flex-row md:gap-20 lg:gap-50" : ""}`}
          >
            {title ? (
              <motion.h1
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInAnimation({ scale: 0.95 })}
                className="max-w-[320px] lg:max-w-[380px] text-[24px] lg:text-[40px] font-normal leading-[120%] uppercase"
              >
                {title}
              </motion.h1>
            ) : null}
            {description ? (
              <motion.p
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInAnimation({ scale: 0.95 })}
                className={`text-[14px] lg:text-[18px] font-light leading-[120%] ${button.position === "bottomLeft" ? "max-w-[250px] lg:max-w-[290px]" : "max-w-[300px] lg:max-w-[380px]"}`}
              >
                {description}
              </motion.p>
            ) : null}
          </div>
        ) : null}
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInAnimation({ scale: 0.95 })}
          className={`${button.position === "bottomRight" ? "ml-auto lg:mb-16" : button.position === "bottomLeft" ? "mt-auto" : "ml-auto mb-8"}`}
        >
          <Link href={button?.link} className={`w-fit`}>
            <MainButton variant="secondary" className="w-[230px] h-[53px]">
              {button?.label}
            </MainButton>
          </Link>
        </motion.div>
      </Container>
    </div>
  );
}
