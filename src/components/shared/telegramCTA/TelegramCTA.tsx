import Image from "next/image";
import TelegramButton from "../buttons/TelegramButton";
import Container from "../container/Container";
import SectionTitle from "../titles/SectionTitle";
import { TELEGRAM_URL_CHANNEL } from "@/constants/constants";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function TelegramCTA() {
  return (
    <section className="pt-[30px] lg:pt-[62px] pb-[117px] lg:pb-[132px]">
      <Container className="flex flex-col md:flex-row md:justify-between md:items-end gap-y-[22px]">
        <SectionTitle className="max-w-[332px] md:max-w-[327px] lg:max-w-[427px] xl:max-w-[527px]">
          Підпишись на наш телеграм канал, щоб бути в курсі всіх новинок!
        </SectionTitle>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInAnimation({ x: 30 })}
          className="relative ml-auto lg:mb-2"
        >
          <Image
            src="/images/telegramCTA/booksMob.svg"
            alt="books"
            width="144"
            height="145"
            className="lg:hidden absolute top-[14px] left-[-123px]"
          />
          <Image
            src="/images/telegramCTA/booksDesk.svg"
            alt="books"
            width="297"
            height="234"
            className="hidden lg:block absolute top-[-32px] left-[-258px]"
          />
          <a
            href={TELEGRAM_URL_CHANNEL}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <TelegramButton />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
