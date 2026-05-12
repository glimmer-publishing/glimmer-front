import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import Container from "../shared/container/Container";
import { EMAIL_CLIENTS } from "@/constants/constants";

const PHONE_DISPLAY = "+38 (077) 837-84-53";
const PHONE_HREF = "tel:+380778378453";
const ADDRESS = "03179, м. Київ, вул. Ушакова Миколи, буд. 1-Д";

const sections = [
  {
    title: "1. Які персональні дані ми збираємо",
    text: "Ми можемо збирати такі дані: прізвище, ім'я, по батькові, номер телефону, email, адреса доставки (місто/відділення/адреса для кур'єра), IP-адреса та дані про замовлення. Також автоматично збираються технічні дані через файли cookie: тип браузера, тип пристрою, операційна система та час відвідування.",
  },
  {
    title: "2. Мета збору даних",
    text: "Персональні дані використовуються виключно для оформлення та виконання замовлення, доставки придбаних книг, зв'язку з клієнтом щодо статусу замовлення, обробки платежів, надання консультацій та покращення роботи користувацького інтерфейсу сайту.",
  },
  {
    title: "3. Передача персональних даних третім особам",
    text: "Ми передаємо ваші дані виключно для виконання зобов'язань замовлення: службам доставки (Нова Пошта, Укрпошта) для транспортування та вручення посилок; платіжним сервісам та банкам для проведення транзакцій та забезпечення безпеки платежів. Для аналізу роботи сайту використовуються сервіси аналітики (зокрема Google Analytics), які отримують дані у деперсоніфікованому (анонімному) вигляді. Ми не продаємо та не передаємо ваші дані третім особам для маркетингових цілей без вашої згоди.",
  },
  {
    title: "4. Строк зберігання персональних даних",
    text: "Дані зберігаються протягом строку виконання замовлення, а також протягом строків, встановлених законодавством України (зокрема податковим та бухгалтерським), але не довше ніж це необхідно для цілей обробки, якщо інше не передбачено законом.",
  },
  {
    title: "5. Захист персональних даних",
    text: "Ми застосовуємо сучасні технічні заходи для захисту даних від незаконного доступу, зміни або розголошення. Сайт використовує захищене SSL-з'єднання (HTTPS) для безпеки передачі даних та проведення онлайн-транзакцій.",
  },
  {
    title: "6. Файли Cookie та треті сторони",
    text: "Сайт використовує файли cookie для коректної роботи кошика, збереження налаштувань та збору статистики. Cookie сторонніх сервісів можуть використовуватися для аналізу відвідуваності. Користувач може самостійно змінити налаштування або заблокувати cookie у своєму браузері, проте це може вплинути на функціональність певних розділів сайту.",
  },
  {
    title: "7. Права користувача",
    items: [
      "Отримати інформацію про джерела збору та місцезнаходження своїх даних.",
      "Вимагати виправлення, оновлення або видалення персональних даних.",
      "Відкликати згоду на обробку персональних даних.",
      "Подати скаргу на обробку своїх даних до Уповноваженого Верховної Ради України з прав людини або до суду.",
    ],
  },
  {
    title: "8. Зміни до політики",
    text: "ТОВ «ГЛІММЕР» залишає за собою право вносити зміни до цієї Політики. Оновлена редакція набирає чинності з моменту її розміщення на Сайті. Рекомендуємо періодично переглядати цю сторінку.",
  },
];

export default function PrivacyPolicy() {
  return (
    <section>
      <Container>
        <div className="py-8 lg:py-10">
          <motion.h1
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInAnimation({ y: 20 })}
            className="mb-6 lg:mb-10 text-[24px] lg:text-[32px] font-semibold leading-[120%]"
          >
            Політика конфіденційності
          </motion.h1>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Intro */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInAnimation({ y: 20 })}
              className="flex flex-col gap-3"
            >
              <p className="text-[14px] lg:text-[15px] leading-[160%]">
                Ця Політика конфіденційності визначає порядок обробки та захисту
                персональних даних користувачів сайту{" "}
                <a
                  href="https://glimmer.com.ua"
                  className="underline underline-offset-2"
                >
                  https://glimmer.com.ua
                </a>{" "}
                (далі — «Сайт»). Обробка персональних даних здійснюється
                відповідно до Закону України «Про захист персональних даних».
              </p>
              <p className="text-[14px] lg:text-[15px] leading-[160%]">
                Продовження використання Сайту або оформлення замовлення є
                підтвердженням згоди користувача на обробку його персональних
                даних на умовах, викладених у цій Політиці.
              </p>
              <div className="flex flex-col gap-1 mt-2 p-4 rounded-[12px] bg-black/5">
                <p className="text-[14px] lg:text-[15px] font-semibold leading-[160%]">
                  Власник та адміністратор Сайту:
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «ГЛІММЕР» (ТОВ «ГЛІММЕР»)
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  Код ЄДРПОУ: 45591469
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  Email:{" "}
                  <a
                    href={`mailto:${EMAIL_CLIENTS}`}
                    className="underline underline-offset-2"
                  >
                    {EMAIL_CLIENTS}
                  </a>
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  Телефон:{" "}
                  <a href={PHONE_HREF} className="underline underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  Юридична адреса: {ADDRESS}
                </p>
              </div>
            </motion.div>

            {/* Numbered sections */}
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInAnimation({ y: 20 })}
                className="flex flex-col gap-2"
              >
                <h2 className="text-[16px] lg:text-[18px] font-semibold leading-[140%]">
                  {section.title}
                </h2>
                {"text" in section && (
                  <p className="text-[14px] lg:text-[15px] leading-[160%]">
                    {section.text}
                  </p>
                )}
                {"items" in section && section.items && (
                  <ul className="flex flex-col gap-1 pl-4">
                    {section.items.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        className="text-[14px] lg:text-[15px] leading-[160%] list-disc list-inside"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}

            {/* Section 9 — Contact info with links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInAnimation({ y: 20 })}
              className="flex flex-col gap-2"
            >
              <h2 className="text-[16px] lg:text-[18px] font-semibold leading-[140%]">
                9. Контактна інформація
              </h2>
              <p className="text-[14px] lg:text-[15px] leading-[160%]">
                З питань обробки персональних даних або для їх видалення
                звертайтесь до адміністрації:
              </p>
              <div className="flex flex-col gap-1 pl-4">
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  ТОВ «ГЛІММЕР»
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  Email:{" "}
                  <a
                    href={`mailto:${EMAIL_CLIENTS}`}
                    className="underline underline-offset-2"
                  >
                    {EMAIL_CLIENTS}
                  </a>
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  Телефон:{" "}
                  <a href={PHONE_HREF} className="underline underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p className="text-[14px] lg:text-[15px] leading-[160%]">
                  Адреса: {ADDRESS}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
