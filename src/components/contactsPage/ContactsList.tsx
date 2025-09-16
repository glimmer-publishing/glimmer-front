import { contactsPhoneRegex } from "@/regex/regex";
import ContactItem from "./ContactItem";
import {
  EMAIL_AUTHORS,
  EMAIL_CLIENTS,
  EMAIL_COOPERATION,
  PHONE,
  TELEGRAM_NAME,
  TELEGRAM_URL,
  WORKING_HOURS,
} from "@/constants/constants";
import * as motion from "motion/react-client";
import { listVariants } from "@/utils/animationVariants";

export default function ContactsList() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={listVariants({
        staggerChildren: 0.15,
        delayChildren: 0.15,
      })}
      className="flex flex-col xl:flex-row gap-5 lg:gap-8"
    >
      <div className="flex flex-col gap-5 xl:w-[calc(50%-16px)]">
        <div className="flex gap-5 lg:gap-8">
          <ContactItem
            title="Телефон"
            description={
              <a
                href={`tel:${PHONE}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
              >
                {PHONE.replace(contactsPhoneRegex, "+38 ($1) $2 $3 $4")}
              </a>
            }
            className="w-[calc(50%-10px)] lg:[calc(50%-16px)]"
          />
          <ContactItem
            title="Telegram"
            description={
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
              >
                {TELEGRAM_NAME}
              </a>
            }
            className="w-[calc(50%-10px)] lg:[calc(50%-16px)]"
          />
        </div>
        <ContactItem
          title="Робочі години"
          description={<p className="lowercase">{WORKING_HOURS}</p>}
          className="xl:hidden"
        />
        <ContactItem
          title="Якщо ти автор, надсилай нам свій рукопис на пошту:"
          description={
            <a
              href={`mailto:${EMAIL_AUTHORS}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              {EMAIL_AUTHORS}
            </a>
          }
          className="hidden xl:block"
        />
      </div>
      <div className="flex flex-col gap-5 xl:w-[calc(50%-16px)]">
        <div className="flex flex-col md:flex-row gap-5 lg:gap-8">
          <ContactItem
            title="Email для клієнтів"
            description={
              <a
                href={`mailto:${EMAIL_CLIENTS}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
              >
                {EMAIL_CLIENTS}
              </a>
            }
            className="md:w-[calc(50%-10px)] lg:[calc(50%-16px)]"
          />
          <ContactItem
            title="Якщо ти автор, надсилай нам свій рукопис на пошту:"
            description={
              <a
                href={`mailto:${EMAIL_AUTHORS}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
              >
                {EMAIL_AUTHORS}
              </a>
            }
            className="xl:hidden md:w-[calc(50%-10px)] lg:w-[calc(50%-16px)]"
          />
          <ContactItem
            title="Робочі години"
            description={<p className="lowercase">{WORKING_HOURS}</p>}
            className="hidden xl:block w-[calc(50%-16px)]"
          />
        </div>
        <ContactItem
          title="Для співпраці щодо реалізації книг:"
          description={
            <a
              href={`mailto:${EMAIL_COOPERATION}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              {EMAIL_COOPERATION}
            </a>
          }
        />
      </div>
    </motion.div>
  );
}
