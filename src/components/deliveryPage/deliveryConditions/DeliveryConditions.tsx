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

  const domesticMethods = [
    {
      carrier: "Нова пошта",
      methods: [
        "У відділення «Нової пошти»",
        "У поштомат «Нової пошти»",
        "Доставка кур'єром за адресою («Нова пошта»)",
      ],
    },
    {
      carrier: "Укрпошта",
      methods: [
        "У відділення «Укрпошти»",
        "У поштомат «Укрпошти»",
        "Доставка кур'єром за адресою («Укрпошта»)",
      ],
    },
  ];

  return (
    <section>
      <Container>
        <div className="py-8 lg:py-10 border-b border-black/10">
          {/* Доставка по Україні */}
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
                Способи доставки по Україні
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants({
                  staggerChildren: 0.15,
                  delayChildren: 0.1,
                })}
                className="flex flex-col gap-3 lg:gap-5 mb-4 lg:mb-6"
              >
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                  className="text-[14px] lg:text-[15px] leading-[150%]"
                >
                  Доставка здійснюється по всій території України, де працюють
                  відділення поштових перевізників. Вартість доставки
                  розраховується згідно з тарифами транспортних компаній та
                  оплачується отримувачем при врученні.
                </motion.p>

                {domesticMethods.map((item, idx) => (
                  <motion.div
                    key={idx}
                    viewport={{ once: true, amount: 0.2 }}
                    variants={listItemVariants}
                  >
                    <p className="text-[14px] lg:text-[15px] font-semibold leading-[150%] mb-1">
                      {idx + 1}. Доставка компанією &quot;{item.carrier}&quot;:
                    </p>
                    <ul className="flex flex-col gap-1 pl-4">
                      {item.methods.map((method, mIdx) => (
                        <li
                          key={mIdx}
                          className="text-[13px] lg:text-[14px] leading-[150%] list-disc list-inside"
                        >
                          {method}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}

                <motion.div
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                  className="flex flex-col gap-2"
                >
                  <p className="text-[14px] lg:text-[15px] font-semibold leading-[150%]">
                    Перевірка товару при отриманні
                  </p>
                  <p className="text-[13px] lg:text-[14px] leading-[150%]">
                    Перед відправкою всі товари проходять перевірку та
                    страхуються на повну вартість. Під час отримання замовлення
                    (у відділенні або у присутності кур&apos;єра) ми наполегливо
                    рекомендуємо перевірити зовнішній вигляд посилки та її
                    вміст.
                  </p>
                  <p className="text-[13px] lg:text-[14px] leading-[150%]">
                    У разі виявлення пошкоджень, деформації пакування або
                    нестачі товару, вам необхідно відмовитися від отримання та
                    скласти акт претензії разом зі співробітником поштової
                    служби. Після цього обов&apos;язково повідомте про ситуацію
                    наших менеджерів. У разі пошкоджень під час транспортування,
                    відповідальність за компенсацію несе логістична компанія.
                  </p>
                  <p className="text-[13px] lg:text-[14px] leading-[150%]">
                    У випадку заводського браку дії здійснюються відповідно до
                    розділу &quot;Обмін та повернення&quot;.
                  </p>
                </motion.div>

                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                  className="text-[14px] lg:text-[15px] leading-[150%]"
                >
                  Розрахувати вартість доставки по Україні:
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

          {/* Міжнародна доставка */}
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
                className="flex flex-col gap-4 lg:gap-6 mb-4 lg:mb-8"
              >
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                  className="text-[14px] lg:text-[15px] leading-[150%]"
                >
                  Доставка також проводиться за кордон (крім рф та білорусі).
                </motion.p>
                <motion.p
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                  className="text-[14px] lg:text-[15px] leading-[150%]"
                >
                  Звертаємо увагу, що при замовленні &quot;міжнародної
                  доставки&quot; клієнт додатково сплачує за доставку. Доставка
                  здійснюється протягом трьох днів після оплати замовлення.
                </motion.p>
              </motion.div>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
