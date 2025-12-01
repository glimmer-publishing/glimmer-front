import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

type CartItem = {
  product: {
    title: string;
    author?: string;
    price: number;
    discountPrice?: number;
    mainImage?: string;
    preOrderShippingDate?: string;
    status?: "inStock" | "preOrder";
  };
  quantity: number;
};

type OrderEmailProps = {
  orderNumber: string;
  orderDate: string;
  name: string;
  phone: string;
  city: string;
  branchNumber?: string;
  address?: string;
  cart: CartItem[];
  totalOrderSum: number;
  deliveryService: string;
  paymentMethod: string;
  deliveryType: string;
};

export function OrderConfirmationEmail({
  orderNumber,
  orderDate,
  name,
  phone,
  city,
  branchNumber,
  address,
  cart,
  totalOrderSum,
  deliveryService,
  paymentMethod,
  deliveryType,
}: OrderEmailProps) {
  const deliveryCost =
    totalOrderSum >= 1500 ? "Безкоштовно" : "За тарифами перевізника";

  return (
    <Html>
      <Head />
      <Preview>Ваше замовлення №{orderNumber} підтверджено</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ textAlign: "center", marginBottom: "40px" }}>
            <Img
              src="https://glimmer-frontend.vercel.app/images/icons/logoBlue.png"
              width="267"
              alt="Glimmer"
              style={logo}
            />
          </Section>

          <Text style={h1}>Вітаємо, {name}!</Text>
          <Text style={description}>
            Дякуємо за покупку в Glimmer.
            <br />
            Ваше замовлення <b>№{orderNumber}</b> від {orderDate} прийнято в
            обробку, наш менеджер скоро зв&apos;яжеться з вами.
          </Text>

          <Hr style={hr} />

          {/* Товари */}
          {cart.map((item, index) => {
            const {
              title,
              author,
              price,
              discountPrice,
              mainImage,
              preOrderShippingDate,
              status,
            } = item.product;

            // мінімальна логіка знижки без oldPrice:
            const hasDiscount =
              typeof discountPrice === "number" && discountPrice < price;
            const finalPrice = hasDiscount ? discountPrice! : price;
            const discountPercent = hasDiscount
              ? Math.round(((price - finalPrice) / price) * 100)
              : null;

            return (
              <Section key={index} style={{ marginBottom: "15px" }}>
                <Row>
                  {mainImage && (
                    <Column style={{ width: "80px" }}>
                      <Img
                        src={mainImage}
                        alt={title}
                        width="80"
                        height="80"
                        style={productImage}
                      />
                    </Column>
                  )}
                  <Column>
                    <Text style={productTitle}>
                      {title}
                      {author ? ` — ${author}` : ""}
                      {status === "preOrder" && preOrderShippingDate
                        ? `, віправка з ${preOrderShippingDate}`
                        : ""}
                    </Text>

                    {/* ЦІНА / ЗНИЖКА */}
                    {hasDiscount ? (
                      <Text style={productPrice}>
                        <span style={oldPrice}>{price} ₴</span>{" "}
                        <span style={discountedPrice}>{finalPrice} ₴</span>
                        {discountPercent !== null && (
                          <span style={discountBadge}>-{discountPercent}%</span>
                        )}{" "}
                        × {item.quantity} шт.
                      </Text>
                    ) : (
                      <Text style={productPrice}>
                        {finalPrice} ₴ × {item.quantity} шт.
                      </Text>
                    )}
                  </Column>
                </Row>
              </Section>
            );
          })}

          {/* Підсумок */}
          <Section style={summaryContainer}>
            <Row>
              <Column>
                <Text style={summaryLabel}>Сума замовлення</Text>
              </Column>
              <Column align="right">
                <Text style={summaryValue}>{totalOrderSum} ₴</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={summaryLabel}>Доставка</Text>
              </Column>
              <Column align="right">
                <Text style={summaryValue}>{deliveryCost}</Text>
              </Column>
            </Row>
            <Hr style={hrThin} />
            <Row>
              <Column>
                <Text style={summaryLabelBold}>Всього до сплати</Text>
              </Column>
              <Column align="right">
                <Text style={summaryValueBold}>{totalOrderSum} ₴</Text>
              </Column>
            </Row>
          </Section>

          {/* Доставка */}
          <Section style={{ marginTop: "20px" }}>
            <Text style={subtitle}>Доставка</Text>
            <Text style={p}>
              Спосіб доставки: <b>{deliveryService}</b>
              <br />
              Адреса:{" "}
              <b>
                {branchNumber
                  ? deliveryService === "Нова пошта"
                    ? `${branchNumber}, `
                    : deliveryType === "Відділення"
                      ? `Відділення №${branchNumber}, `
                      : deliveryType === "Поштомат"
                        ? `Поштомат №${branchNumber}, `
                        : `${branchNumber}, `
                  : ""}
              </b>
              <b>
                {deliveryType === "Доставка кур’єром"
                  ? `${city}, ${address}`
                  : city}
              </b>
              <br />
              Телефон отримувача: <b>{phone}</b>
            </Text>
          </Section>

          {/* Оплата */}
          <Section style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Text style={subtitle}>Оплата</Text>
            <Text style={p}>
              Спосіб оплати: <b>{paymentMethod}</b>
            </Text>
          </Section>

          {/* Кнопка "Перейти на сайт" */}
          <Section
            style={{
              textAlign: "center",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          >
            <Button
              style={buttonStyle}
              href="https://glimmer-frontend.vercel.app"
            >
              Перейти на сайт
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// === Styles ===

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "1000px",
  borderRadius: "12px",
};

const logo = {
  display: "block",
  margin: "0 auto",
};

const h1 = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#222",
  textAlign: "center" as const,
  marginBottom: "10px",
};

const description = {
  fontSize: "14px",
  color: "#333",
  margin: "0 0 20px 0",
  lineHeight: "1.4",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#eee",
  margin: "20px 0",
};

const subtitle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#94c5e8",
  marginBottom: "6px",
};

const p = {
  fontSize: "14px",
  color: "#333",
  margin: "0 0 10px 0",
  lineHeight: "1.4",
};

const productImage = {
  marginRight: "12px",
  borderRadius: "6px",
  objectFit: "contain" as const,
};

const productTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#222",
};

const productPrice = {
  fontSize: "14px",
  color: "#333",
};

const oldPrice = {
  textDecoration: "line-through",
  color: "#999",
  marginRight: "6px",
};

const discountedPrice = {
  color: "#94c5e8",
  fontWeight: "bold",
};

const discountBadge = {
  display: "inline-block",
  padding: "2px 6px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#fff",
  backgroundColor: "#94c5e8",
  borderRadius: "6px",
  marginLeft: "8px",
};

const summaryContainer = {
  backgroundColor: "rgba(148, 197, 232, 0.40)",
  padding: "10px 15px",
  borderRadius: "6px",
  marginTop: "20px",
};

const summaryLabel = {
  fontSize: "14px",
  color: "#333",
};

const summaryValue = {
  fontSize: "14px",
  color: "#333",
  fontWeight: "bold",
};

const summaryLabelBold = {
  fontSize: "16px",
  color: "#222",
  fontWeight: "bold",
};

const summaryValueBold = {
  fontSize: "16px",
  color: "#222",
  fontWeight: "bold",
};

const hrThin = {
  borderColor: "#ccc",
  margin: "5px 0",
};

const buttonStyle = {
  backgroundColor: "#94c5e8",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  borderRadius: "999px",
  textDecoration: "none",
  display: "inline-block",
  width: "200px",
  height: "40px",
  lineHeight: "40px",
  // textAlign: "center",
};
