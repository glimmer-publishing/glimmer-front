import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

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
}

export default function HeroSlide({ banner }: HeroSlideProps) {
  const { title, description, imageMob, imageTab, imageDesk, button } = banner;
  return (
    <div className="relative flex z-10 w-dvw pt-[235px] lg:pt-[155px] pb-[116px] lg:pb-[103px] overflow-hidden h-full min-h-[500px] lg:min-h-[550px]">
      <Image
        src={imageMob}
        alt="hero banner"
        fill
        sizes="100vw"
        unoptimized
        priority
        className="sm:hidden -z-10 object-cover"
      />
      <Image
        src={imageTab}
        alt="hero banner"
        fill
        sizes="100vw"
        unoptimized
        priority
        className="hidden sm:block lg:hidden -z-10 object-cover"
      />
      <Image
        src={imageDesk}
        alt="hero banner"
        fill
        sizes="100vw"
        unoptimized
        priority
        className="hidden lg:block -z-10 object-cover"
      />
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
