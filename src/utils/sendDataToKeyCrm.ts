import axios from "axios";
import { OrderData } from "@/types/orderData";
import { useCartStore } from "@/store/cartStore";
import { useUtmStore } from "@/store/utmStore";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function sendDataToKeyCrm(data: OrderData) {
  const { getItemFinalPrice } = useCartStore.getState();
  const { utmData } = useUtmStore.getState();

  const {
    orderDate,
    orderNumber,
    orderTime,
    name,
    surname,
    phone,
    email,
    city,
    branchNumber,
    address,
    deliveryService,
    message,
    promoCode,
    payment,
    totalOrderSum,
    cart,
  } = data;

  const products = cart.map((item) => ({
    price: getItemFinalPrice(item.product.id),
    quantity: item.quantity,
    name: `'${item.product.title}' - ${item.product?.author}`,
    sku: item.product.sku,
  }));

  // Базовий об'єкт замовлення
  const baseOrderData = {
    source_id: 1,
    source_uuid: orderNumber,
    orderedAt: `${orderDate} ${orderTime}`,
    promocode: promoCode,
    buyer_comment: message,
    buyer: { full_name: `${name} ${surname}`, phone, email },
    shipping: {
      delivery_service_id: deliveryService === "Нова пошта" ? 6 : 5,
      shipping_service: deliveryService,
      shipping_address_city: city,
      shipping_secondary_line: address,
      shipping_receive_point: branchNumber,
    },
    products,
    // Додаємо UTM-дані, якщо вони є
    ...(utmData && { marketing: utmData }),
  };

  const crmOrderData =
    payment !== "Оплата картою онлайн Visa, Mastercard"
      ? {
          ...baseOrderData,
          payments: [
            {
              payment_method: payment,
              amount: totalOrderSum,
              status: "not_paid",
            },
          ],
        }
      : baseOrderData;

  try {
    const response = await axios({
      method: "post",
      url: `${baseUrl}/api/keycrm`,
      data: crmOrderData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Помилка при відправці замовлення:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error || "Не вдалося створити замовлення"
      );
    }
    console.error("Невідома помилка:", error);
    throw new Error("Сталася невідома помилка");
  }
}
