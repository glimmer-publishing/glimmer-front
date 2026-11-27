import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { formatHryvnia } from "@/entities/cart/lib/money";
import type { OrderSummary } from "@/features/checkout/model/types";
import { EMAIL_CLIENTS, PHONE } from "@/shared/config/constants";
import { DeliveryService } from "@/shared/config/enums";
import { formatDate } from "@/shared/lib/date/formatDate";
import { contactsPhoneRegex } from "@/shared/lib/text/regex";

pdfMake.vfs = pdfFonts.vfs;

/**
 * Builds the order's receipt as an A4 PDF (seller, customer, delivery
 * address, products, total) and downloads it as order_<number>.pdf.
 */
export const downloadReceiptPdf = (order: OrderSummary) => {
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

  const docDefinition: TDocumentDefinitions = {
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
