import Link from "next/link";
import * as motion from "motion/react-client";
import MainButton from "@/shared/ui/main-button/MainButton";
import { fadeInAnimation } from "@/utils/animationVariants";

/**
 * Shown when nothing is saved, or none of the saved products exists any more.
 */
export default function FavoritesEmpty() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInAnimation({ y: 20, delay: 0.2 })}
      className="flex flex-col items-center gap-[30px] py-20 lg:py-30"
    >
      <h2 className="text-[18px] lg:text-[24px] font-medium leading-[120%] text-center">
        Список обраного порожній
      </h2>
      <p className="max-w-[320px] lg:max-w-[416px] text-center">
        Зберігайте книги, які вас зацікавили — натисніть сердечко біля товару.
        Ми збережемо їх тут для вас.
      </p>
      <Link href="/">
        <MainButton className="w-[262px] h-[45px]">
          Повернутись на головну
        </MainButton>
      </Link>
    </motion.div>
  );
}
