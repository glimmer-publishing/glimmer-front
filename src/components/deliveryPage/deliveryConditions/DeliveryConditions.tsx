import Container from "@/components/shared/container/Container";
import Image from "next/image";
import * as motion from "motion/react-client";
import {
  fadeInAnimation,
  listVariants,
  listItemVariants,
} from "@/utils/animationVariants";

export default function DeliveryConditions() {
  const deliveryCostsUkraine = [
    {
      icon: "/images/deliveryPage/deliveryConditions/novaPost.svg",
      title: "Нова пошта",
      url: "https://novaposhta.ua/shipping-cost/",
    },
    {
      icon: "/images/deliveryPage/deliveryConditions/ukrPost.svg",
      title: "Укрпошта",
      url: "https://calc.ukrposhta.ua/domestic-calculator",
    },
  ];

  const deliveryCostsWorldwide = [
    {
      icon: "/images/deliveryPage/deliveryConditions/novaPost.svg",
      title: "Нова пошта",
      url: "https://novaposhta.ua/send/international-delivery/shipping-cost",
    },
    {
      icon: "/images/deliveryPage/deliveryConditions/ukrPost.svg",
      title: "Укрпошта",
      url: "https://calc.ukrposhta.ua/international-calculator",
    },
  ];

  return (
    <section>
      <Container>
        <div className="py-8 lg:py-10 border-b border-black/60">
          <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-8 pb-8 border-b border-black/10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInAnimation({ scale: 0.95 })}
              className="relative w-full md:w-[calc(50%-16px)] h-[198px] sm:h-[280px] lg:h-[356px] rounded-[12px] overflow-hidden"
            >
              <Image
                src="/images/deliveryPage/deliveryConditions/imageOne.webp"
                alt="parcel"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="md:w-[calc(50%-16px)]">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInAnimation({ y: 20 })}
                className="mb-4 lg:mb-8 text-[18px] lg:text-[24px] font-medium leading-[120%]"
              >
                Доставка
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants({
                  staggerChildren: 0.2,
                  delayChildren: 0.2,
                })}
                className="flex flex-col gap-4 lg:gap-8 mb-4 lg:mb-8"
              >
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                >
                  Доставка здійснюється по всій території України, де працюють
                  відділення поштових перевізників.
                </motion.p>
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                >
                  Вартість доставки залежить від тарифів поштового оператора.
                </motion.p>
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                >
                  Розрахувати вартість доставки можна за наступними посиланнями:
                </motion.p>
              </motion.div>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants({
                  staggerChildren: 0.2,
                  delayChildren: 0.2,
                })}
                className="flex gap-4 lg:gap-8"
              >
                {deliveryCostsUkraine.map(({ title, icon, url }, idx) => (
                  <motion.li
                    viewport={{ once: true, amount: 0.2 }}
                    variants={listItemVariants}
                    key={idx}
                    className="w-[calc(50%-8px)] lg:w-[calc(50%-16px)]"
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      href={url}
                      className="flex items-center gap-2 p-3 rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]
                      xl:hover:-translate-y-0.5 focus-visible:-translate-y-0.5 transition duration-300 ease-in-out active:scale-95"
                    >
                      <div className="relative w-6 h-6">
                        <Image
                          src={icon}
                          alt={title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span>{title}</span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInAnimation({ scale: 0.95 })}
              className="relative w-full md:w-[calc(50%-16px)] h-[198px] sm:h-[280px] lg:h-[356px] rounded-[12px] overflow-hidden"
            >
              <Image
                src="/images/deliveryPage/deliveryConditions/imageTwo.webp"
                alt="parcel"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="md:w-[calc(50%-16px)]">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInAnimation({ y: 20 })}
                className="mb-4 lg:mb-8 text-[18px] lg:text-[24px] font-medium leading-[120%]"
              >
                Міжнародна доставка
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants({
                  staggerChildren: 0.2,
                  delayChildren: 0.2,
                })}
                className="flex flex-col gap-4 lg:gap-8 mb-4 lg:mb-8"
              >
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                >
                  Доставка також проводиться за кордон (крім рф та білорусі).
                </motion.p>
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                >
                  Звертаємо увагу, що при замовленні &quot;міжнародної
                  доставки&quot; клієнт додатково сплачує за доставку після
                  підтвердження замовлення нашими спеціалістами. Доставка
                  здійснюється протягом трьох днів після оплати замовлення
                  операторами “Нова пошта” або “Укрпошта” на вибір.
                </motion.p>
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                >
                  Вартість міжнародної доставки:
                </motion.p>
              </motion.div>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants({
                  staggerChildren: 0.2,
                  delayChildren: 0.2,
                })}
                className="flex gap-4 lg:gap-8"
              >
                {deliveryCostsWorldwide.map(({ title, icon, url }, idx) => (
                  <motion.li
                    viewport={{ once: true, amount: 0.2 }}
                    variants={listItemVariants}
                    key={idx}
                    className="w-[calc(50%-8px)] lg:w-[calc(50%-16px)]"
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      href={url}
                      className="flex items-center gap-2 p-3 rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]
                      xl:hover:-translate-y-0.5 focus-visible:-translate-y-0.5 transition duration-300 ease-in-out active:scale-95"
                    >
                      <div className="relative w-6 h-6">
                        <Image
                          src={icon}
                          alt={title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span>{title}</span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
