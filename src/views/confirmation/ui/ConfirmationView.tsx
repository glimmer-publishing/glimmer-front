"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DeliveryService } from "@/constants/enums";
import { formatHryvnia, toHryvnia } from "@/entities/cart/lib/money";
import { useOrderStore } from "@/features/checkout/model/orderStore";
import type { OrderSummary } from "@/features/checkout/model/types";
import Container from "@/shared/ui/container/Container";
import MainButton from "@/shared/ui/main-button/MainButton";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { EMAIL_CLIENTS, PHONE } from "@/constants/constants";
import { contactsPhoneRegex } from "@/regex/regex";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import { formatDate } from "@/utils/formatDate";
import { trackPurchaseOnce } from "@/utils/ecommerceTracking";

pdfMake.vfs = pdfFonts.vfs;

const trackOrder = (order: OrderSummary) =>
  trackPurchaseOnce({
    orderNumber: order.orderNumber,
    value: toHryvnia(order.total),
    email: order.email,
    phone: order.phone,
    items: order.lines.map((line) => ({
      id: line.id,
      title: line.title,
      category: line.category,
      price: toHryvnia(line.unitPrice),
      quantity: line.quantity,
    })),
  });

/**
 * The thank-you page with a downloadable receipt. Everything shown comes
 * from the order summary the server returned when the order was placed.
 */
export default function ConfirmationView() {
  return (
    <div className="pt-[85px]">
      <Confirmation />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}

/**
 * The confirmation itself, read from the last order stored in this browser.
 */
function Confirmation() {
  const order = useOrderStore((state) => state.order);

  useEffect(() => {
    if (order) trackOrder(order);
  }, [order]);

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
    lines,
    total,
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
                      ? deliveryService === DeliveryService.NOVA_POSHTA
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
              ...lines.map((line, index) => {
                const shippingDate = line.preOrderShippingDate
                  ? formatDate(line.preOrderShippingDate)
                  : null;
                return [
                  index + 1,
                  `"${line.title}" — ${line.author ?? ""}${shippingDate ? `, відправка з ${shippingDate}` : ""}`,
                  `${line.quantity} шт.`,
                  `${formatHryvnia(line.unitPrice)} грн`,
                  `${formatHryvnia(line.lineTotal)} грн`,
                ];
              }),
            ],
          },
        },
        // Загальна сума
        {
          text: `Разом: ${formatHryvnia(total)} грн`,
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
