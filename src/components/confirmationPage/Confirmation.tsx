"use client";

import Link from "next/link";
import MainButton from "../shared/buttons/MainButton";
import Container from "../shared/container/Container";
import Image from "next/image";
import { useOrderStore } from "@/store/orderStore";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { EMAIL_CLIENTS, PHONE } from "@/constants/constants";
import { contactsPhoneRegex } from "@/regex/regex";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import { formatDate } from "@/utils/formatDate";

pdfMake.vfs = pdfFonts.vfs;

export default function Confirmation() {
  const { order } = useOrderStore();

  if (!order) return null;

  const {
    orderNumber,
    orderDate,
    name,
    surname,
    phone,
    city,
    branchNumber,
    address,
    cart,
    totalOrderSum,
    deliveryService,
  } = order;

  const handleDownloadPDF = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docDefinition: any = {
      content: [
        // Заголовок квитанції
        {
          text: `Квитанція № ${orderNumber} від ${orderDate}`,
          style: "header",
          margin: [0, 0, 0, 20], // відстань до підкреслення
        },
        // Підкреслення
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515, // приблизна ширина сторінки A4 без бокових полів
              y2: 0,
              lineWidth: 2,
              lineColor: "#000000",
            },
          ],
          margin: [0, 0, 0, 30], // відстань після підкреслення до наступного блоку
        },
        // Виконавець
        {
          columns: [
            {
              width: "auto",
              text: [{ text: "Виконавець:\n" }],
              margin: [0, 0, 58, 0],
            },
            {
              width: "*",
              text: [
                {
                  text: "Glimmer. Publishing house\n",
                  bold: true,
                  lineHeight: 1.5,
                },
                {
                  text: `Email: ${EMAIL_CLIENTS}\n`,
                  bold: true,
                  lineHeight: 1.5,
                },
                {
                  text: `Тел.: ${PHONE.replace(contactsPhoneRegex, "+38 ($1) $2 $3 $4")}\n`,
                  bold: true,
                  lineHeight: 1.5,
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },
        // Замовник
        {
          columns: [
            {
              width: "auto",
              text: [{ text: "Замовник:\n" }],
              margin: [0, 0, 70, 0],
            },
            {
              width: "*",
              text: [
                { text: `${name} ${surname}\n`, bold: true, lineHeight: 1.5 },
                { text: `Тел.: ${phone}\n`, bold: true },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },
        // Адреса доставки
        {
          columns: [
            {
              width: "auto",
              text: [{ text: "Адреса доставки:\n" }],
              margin: [0, 0, 30, 0],
            },
            {
              width: "*",
              text: [
                {
                  text: `${city}, ${
                    branchNumber
                      ? deliveryService === "Нова пошта"
                        ? branchNumber
                        : "відділення №" + branchNumber
                      : address
                  }\n`,
                  bold: true,
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },
        // Таблиця товарів
        {
          table: {
            widths: ["auto", "*", "auto", 70, 70],
            body: [
              [
                {
                  text: "№",
                  bold: true,
                  fillColor: "#E0E0E0",
                  alignment: "center",
                },
                {
                  text: "Товари",
                  bold: true,
                  fillColor: "#E0E0E0",
                  alignment: "center",
                },
                {
                  text: "Кількість",
                  bold: true,
                  fillColor: "#E0E0E0",
                  alignment: "center",
                },
                {
                  text: "Ціна",
                  bold: true,
                  fillColor: "#E0E0E0",
                  alignment: "center",
                },
                {
                  text: "Сума",
                  bold: true,
                  fillColor: "#E0E0E0",
                  alignment: "center",
                },
              ],
              ...cart.map((item, index) => {
                const price = item.product.discountPrice ?? item.product.price;
                const formattedPreOrderShippingDate =
                  item.product?.status === "preOrder" &&
                  item.product?.preOrderShippingDate
                    ? formatDate(item.product?.preOrderShippingDate)
                    : null;
                return [
                  index + 1,
                  `"${item.product.title}" — ${item.product.author}${formattedPreOrderShippingDate ? `, відправка з ${formattedPreOrderShippingDate}` : ""}`,
                  `${item.quantity} шт.`,
                  `${price} грн`,
                  `${price * item.quantity} грн`,
                ];
              }),
            ],
          },
        },
        // Загальна сума
        {
          text: `Разом: ${totalOrderSum} грн`,
          style: "total",
          alignment: "right",
          margin: [0, 20, 0, 0],
        },
      ],
      styles: {
        header: { fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
        total: { bold: true, fontSize: 14 },
      },
    };

    pdfMake.createPdf(docDefinition).download(`order_${orderNumber}.pdf`);
  };

  return (
    <section className="relative py-[116px] lg:py-50">
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ scale: 0.9 })}
        className="lg:hidden absolute top-0 left-0"
      >
        <Image
          src="/images/confirmationPage/bgTopMob.svg"
          alt="background"
          width="105"
          height="62"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ scale: 0.9 })}
        className="lg:hidden absolute bottom-0 right-0"
      >
        <Image
          src="/images/confirmationPage/bgBottomMob.svg"
          alt="background"
          width="91"
          height="96"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ scale: 0.9 })}
        className="hidden lg:block absolute top-[-70px] left-0"
      >
        <Image
          src="/images/confirmationPage/bgTopDesk.svg"
          alt="background"
          width="250"
          height="247"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ scale: 0.9 })}
        className="hidden lg:block absolute bottom-[-104px] right-0"
      >
        <Image
          src="/images/confirmationPage/bgBottomDesk.svg"
          alt="background"
          width="320"
          height="344"
        />
      </motion.div>

      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInAnimation({ y: 20 })}
        >
          <h1 className="mb-4 text-[24px] lg:text-[32px] leading-[120%] font-semibold uppercase text-main text-center">
            Дякуємо за замовлення!
          </h1>
          <p className="mb-8 text-[12px] lg:text-[15px] font-medium leading-[120%] text-center">
            {`Ваше замовлення №${orderNumber} прийнято в обробку.`}
          </p>
          <p className="max-w-[497px] mb-10 mx-auto text-center">
            Ми вже надіслали квитанцію на вашу електронну пошту. Якщо бажаєте,
            ви можете також завантажити її зараз.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-[199px] sm:w-[540px] mx-auto">
            <MainButton
              onClick={handleDownloadPDF}
              variant="bordered"
              className="sm:w-[calc(50%-6px)] h-[45px] text-[12px] lg:text-[14px] font-normal"
            >
              Завантажити квитанцію
            </MainButton>
            <Link href="/" className="sm:w-[calc(50%-6px)]">
              <MainButton className="h-[45px] text-[12px] lg:text-[14px] font-normal">
                На головну
              </MainButton>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
