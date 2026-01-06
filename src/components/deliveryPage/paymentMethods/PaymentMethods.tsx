import Container from "@/components/shared/container/Container";
import Image from "next/image";
import * as motion from "motion/react-client";
import {
  fadeInAnimation,
  listVariants,
  listItemVariants,
} from "@/utils/animationVariants";

export default function PaymentMethods() {
  const paymentMethods = [
    {
      title: "Банківською карткою онлайн",
      description: "Оплата Visa або MasterCard безпосередньо на сайті.",
      icon: "/images/deliveryPage/paymentMethods/card.svg",
    },
    {
      title: "Карткою Національний кешбек",
      description: "Оплата Національний кешбек, єКнига безпосередньо на сайті.",
      icon: "/images/deliveryPage/paymentMethods/card.svg",
    },
    // {
    //   title: "Оплата частинами",
    //   description: "Розстрочка без переплат через monobank — швидко та зручно.",
    //   icon: "/images/deliveryPage/paymentMethods/bill.svg",
    // },
    {
      title: "Післяоплата під час отримання",
      description: "Розрахунок готівкою або карткою при отриманні замовлення.",
      icon: "/images/deliveryPage/paymentMethods/banknote.svg",
    },
  ];

  return (
    <section>
      <Container className="py-8 lg:py-10">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInAnimation({ y: 20 })}
          className="mb-4 lg:mb-8 text-[18px] lg:text-[24px] font-medium leading-[120%]"
        >
          Способи оплати
        </motion.h2>
        <motion.ul
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={listVariants({
            staggerChildren: 0.2,
            delayChildren: 0.2,
          })}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {paymentMethods.map(({ title, description, icon }, idx) => (
            <motion.li
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              key={idx}
              className="p-2 lg:p-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] rounded-[12px]"
            >
              <div className="flex justify-between gap-3 mb-6">
                <h3>{title}</h3>
                <Image
                  src={icon}
                  alt={title}
                  width={24}
                  height={24}
                  className="shrink-0"
                />
              </div>
              <p className="text-[14px] lg:text-[18px] font-medium leading-[120%]">
                {description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
