import Container from "@/components/shared/container/Container";
import * as motion from "motion/react-client";
import { fadeInAnimation, listVariants, listItemVariants } from "@/utils/animationVariants";
import { EMAIL_CLIENTS } from "@/constants/constants";

const PHONE_DISPLAY = "+380 (77) 837-84-53";
const RETURN_ADDRESS = "м. Київ, Нова Пошта, відділення №377, Кальницька Ольга, +380 (77) 837-84-53";

export default function ReturnPolicy() {
  return (
    <section>
      <Container>
        <div className="py-8 lg:py-10 border-t border-black/10">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInAnimation({ y: 20 })}
          className="mb-6 lg:mb-10 text-[18px] lg:text-[24px] font-medium leading-[120%]"
        >
          Повернення і обмін
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariants({ staggerChildren: 0.15, delayChildren: 0.1 })}
          className="flex flex-col gap-8 lg:gap-10"
        >
          {/* Повернення товарів належної якості */}
          <motion.div variants={listItemVariants} className="flex flex-col gap-3">
            <h3 className="text-[16px] lg:text-[20px] font-medium leading-[120%]">
              Повернення товарів належної якості
            </h3>
            <p className="text-[14px] lg:text-[15px] leading-[150%]">
              Відповідно до ст. 9 Закону України «Про захист прав споживачів» та
              згідно з Постановою Кабінету Міністрів України від 19 березня 1994 р.
              № 172 (Додаток № 3), друковані видання належної якості не підлягають
              обміну та поверненню.
            </p>
            <p className="text-[14px] lg:text-[15px] leading-[150%]">
              До друкованих видань належать: книги, журнали, брошури, комікси,
              плакати тощо.
            </p>
          </motion.div>

          {/* Повернення товарів неналежної якості */}
          <motion.div variants={listItemVariants} className="flex flex-col gap-3">
            <h3 className="text-[16px] lg:text-[20px] font-medium leading-[120%]">
              Повернення товарів неналежної якості (друкарський брак, помилка
              комплектації)
            </h3>
            <p className="text-[14px] lg:text-[15px] leading-[150%]">
              До товарів неналежної якості належать: книги з типографським браком
              (перевернуті, пропущені або нероздруковані сторінки, дефекти склейки),
              а також випадки, коли вам надіслали не те видання, яке ви замовляли.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-[14px] lg:text-[15px] font-semibold leading-[150%]">
                Оплата доставки:
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[150%]">
                Витрати на зворотну доставку такого товару повністю оплачує магазин.
                Ми запропонуємо безкоштовний обмін на книгу належної якості або повне
                повернення коштів.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[14px] lg:text-[15px] font-semibold leading-[150%]">
                Процедура повернення товару та коштів:
              </p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="text-[14px] lg:text-[15px] leading-[150%] list-disc list-inside">
                  Щоб ми могли швидко обробити ваше повернення та повернути кошти,
                  будь ласка, попередьте менеджера про ситуацію та відправку товару
                  (не є обов&apos;язковою умовою для прийняття повернення) на email:{" "}
                  <a
                    href={`mailto:${EMAIL_CLIENTS}`}
                    className="underline underline-offset-2"
                  >
                    {EMAIL_CLIENTS}
                  </a>{" "}
                  або за телефоном{" "}
                  <a
                    href={`tel:${PHONE_DISPLAY.replace(/\s|\(|\)|-/g, "")}`}
                    className="underline underline-offset-2"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  .
                </li>
                <li className="text-[14px] lg:text-[15px] leading-[150%] list-disc list-inside">
                  Надішліть товар за вказаними реквізитами: {RETURN_ADDRESS}.
                </li>
                <li className="text-[14px] lg:text-[15px] leading-[150%] list-disc list-inside">
                  Процес перевірки та повернення коштів на ваш рахунок відбувається
                  не пізніше, ніж протягом 7 днів з моменту отримання нами
                  повернутого товару, відповідно до Закону України «Про захист прав
                  споживачів».
                </li>
                <li className="text-[14px] lg:text-[15px] leading-[150%] list-disc list-inside">
                  Повернення коштів здійснюється за вашими реквізитами. Будь ласка,
                  надішліть ваш номер IBAN та ПІБ власника рахунку на нашу пошту{" "}
                  <a
                    href={`mailto:${EMAIL_CLIENTS}`}
                    className="underline underline-offset-2"
                  >
                    {EMAIL_CLIENTS}
                  </a>{" "}
                  або повідомте менеджеру за телефоном{" "}
                  <a
                    href={`tel:${PHONE_DISPLAY.replace(/\s|\(|\)|-/g, "")}`}
                    className="underline underline-offset-2"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  .
                </li>
              </ul>
            </div>

            <p className="text-[14px] lg:text-[15px] leading-[150%] border-l-2 border-black/20 pl-3">
              <span className="font-semibold">Важливо:</span> Будь ласка, оглядайте
              товар при отриманні у відділенні пошти. Якщо ви помітили пошкодження
              упаковки або товару, складіть Акт прийому-передачі разом із
              працівником служби доставки та одразу зв&apos;яжіться з нами.
            </p>
          </motion.div>
        </motion.div>
        </div>
      </Container>
    </section>
  );
}
