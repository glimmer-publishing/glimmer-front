import Image from "next/image";
import Container from "../container/Container";
import NavMenu from "./NavMenu";
import Info from "./Info";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function Footer() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInAnimation({})}
      className="relative w-dvw bg-black py-8 lg:pt-[72px] lg:pb-[67px] overflow-hidden"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeInAnimation({ scale: 0.9 })}
        className="hidden xl:block absolute left-0 top-8"
      >
        <Image
          src="/images/footer/logoDesk.svg"
          alt="logo"
          width="219"
          height="312"
          className="w-[186px] h-auto"
        />
      </motion.div>
      <Container className="flex flex-col gap-8 justify-between xl:gap-22 md:flex-row xl:pl-[310px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInAnimation({ scale: 0.9 })}
          className="w-[267px] md:order-3"
        >
          <Image
            src="/images/footer/logo.svg"
            alt="logo"
            width={267}
            height={76}
            className="mb-8 lg:mb-[58px]"
          />
        </motion.div>
        <NavMenu />
        <Info />
      </Container>
    </motion.footer>
  );
}
