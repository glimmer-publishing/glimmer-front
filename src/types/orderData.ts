import { CartItem } from "@/types/cartItem";

export interface OrderData {
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  deliveryService: string;
  deliveryType: string;
  city: string;
  branchNumber?: string;
  address?: string;
  payment: string;
  message?: string;
  cart: CartItem[];
  promoCode: string | null;
  promoDiscountPercent: number;
  promoPublishers: { id: string; name: string }[];
  totalOrderSum: number;
}
