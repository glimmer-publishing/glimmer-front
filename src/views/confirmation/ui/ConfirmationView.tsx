"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toHryvnia } from "@/entities/cart/lib/money";
import { useOrderStore } from "@/features/checkout/model/orderStore";
import type { OrderSummary } from "@/features/checkout/model/types";
import Container from "@/shared/ui/container/Container";
import MainButton from "@/shared/ui/main-button/MainButton";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import { downloadReceiptPdf } from "../lib/downloadReceiptPdf";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";
import { trackPurchaseOnce } from "@/shared/lib/analytics/ecommerceTracking";

/* Reports the purchase to analytics, once per order number. */
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

  const { orderNumber } = order;

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
              onClick={() => downloadReceiptPdf(order)}
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
