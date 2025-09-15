import Image from "next/image";
import * as motion from "motion/react-client";
import { listVariants, listItemVariants } from "@/utils/animationVariants";

export default function InfoList() {
  const infoList = [
    "Ми здійснюємо доставку по всій Україні та за кордон, щоб ти міг отримати улюблені книги незалежно від місця проживання.",
    "Замовлення обробляються протягом 1–3 робочих днів після підтвердження оплати.",
    "Доставка відбувається у будні дні, відповідно до графіка обраної служби.",
    "Після відправки ти отримаєш номер ТТН, за яким можна перевірити статус доставки на сайті обраної служби.",
  ];

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={listVariants({
        staggerChildren: 0.2,
        delayChildren: 0.2,
      })}
      className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-8 xl:gap-20"
    >
      {infoList.map((infoItem, idx) => (
        <motion.li
          viewport={{ once: true, amount: 0.2 }}
          variants={listItemVariants}
          key={idx}
          className="flex gap-5 md:items-center md:w-[calc(50%-16px)] xl:w-[calc(50%-40px)]"
        >
          <Image
            src="/images/deliveryPage/deliveryInfo/star.svg"
            alt="star icon"
            width={23}
            height={24}
            className="shrink-0 h-6"
          />
          <p>{infoItem}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
