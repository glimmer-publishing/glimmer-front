import { useCartStore } from "../store/cartStore";

export interface BasketOrderItem {
  name: string;
  qty: number;
  sum: number;
  total: number;
  icon: string | null;
  unit: string;
  code: string;
  barcode: string | null;
  header: string | null;
  footer: string | null;
  tax: unknown[];
  uktzed: string | null;
  discounts?: Array<{
    type: "percent" | null;
    mode: "manual" | null;
    value: number | null;
  }>;
}

export type BasketOrder = BasketOrderItem[];

export const useMonopayBasketOrder = (): BasketOrder => {
  const {
    cart,

    getItemFinalPrice,
  } = useCartStore.getState();

  const basketFromCartItems = cart.map((item) => {
    const itemBasePrice = getItemFinalPrice(item.product.id);
    const sum = itemBasePrice * 100;
    const total = sum * item.quantity;

    return {
      name: item.product.title,
      qty: item.quantity,
      sum,
      total,
      icon: null,
      unit: "шт.",
      code: item.product.id,
      barcode: null,
      header: null,
      footer: null,
      tax: [],
      uktzed: null,
    };
  });

  return basketFromCartItems;
};
