import "server-only";
import { CRM_API_URL } from "@/shared/config/constants";
import { isProduction } from "@/shared/config/env";
import { serverEnv } from "@/shared/config/serverEnv";

/**
 * KeyCRM has no sandbox. Outside production nothing is sent: writes are
 * logged and return a synthetic order id, so the rest of the checkout flow
 * still runs, and reads return null.
 */

export type KeyCrmPayment = {
  payment_method_id?: number;
  payment_method: string;
  amount: number;
  status: "paid" | "not_paid";
  description?: string;
  payment_date?: string;
};

/* The fields of a KeyCRM order the webhook relies on. */
export type KeyCrmOrder = {
  id: number;
  /* Hryvnia: what the customer owes for the order. */
  grand_total: number;
  payments?: { status: string; amount: number; description?: string | null }[];
};

/* A KeyCRM API call with the key; throws on a non-2xx response. */
const request = async <T>(path: string, init: RequestInit = {}) => {
  const apiKey = serverEnv.crmApiKey;
  if (!apiKey) throw new Error("CRM_API_KEY is not configured");

  const response = await fetch(`${CRM_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `KeyCRM ${init.method ?? "GET"} ${path} responded ${response.status}: ${await response.text()}`
    );
  }

  return (await response.json()) as T;
};

/* Creates the order and returns its KeyCRM id. */
export const createKeyCrmOrder = async (order: object): Promise<number> => {
  if (!isProduction) {
    const id = Date.now();
    console.log(
      `KeyCRM order NOT sent, synthetic id ${id}:`,
      JSON.stringify(order, null, 2)
    );
    return id;
  }

  const { id } = await request<{ id: number }>("/order", {
    method: "POST",
    body: JSON.stringify(order),
  });

  return id;
};

/* The order with its payments, or null outside production. */
export const getKeyCrmOrder = async (
  id: string
): Promise<KeyCrmOrder | null> => {
  if (!isProduction) {
    console.log(`KeyCRM order ${id} NOT read outside production`);
    return null;
  }

  return request<KeyCrmOrder>(
    `/order/${encodeURIComponent(id)}?include=payments`
  );
};

/**
 * Records a payment on a KeyCRM order. Logged, not sent, outside production.
 */
export const addKeyCrmPayment = async (id: string, payment: KeyCrmPayment) => {
  if (!isProduction) {
    console.log(
      `KeyCRM payment NOT sent for order ${id}:`,
      JSON.stringify(payment)
    );
    return;
  }

  await request(`/order/${encodeURIComponent(id)}/payment`, {
    method: "POST",
    body: JSON.stringify(payment),
  });
};
