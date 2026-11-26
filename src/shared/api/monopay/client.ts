import "server-only";
import { createVerify } from "crypto";
import { publicEnv } from "@/shared/config/env";
import { serverEnv } from "@/shared/config/serverEnv";

/* MonoPay's merchant API. */
const MONOBANK_API_URL = "https://api.monobank.ua/api/merchant";

/**
 * The two MonoPay merchant accounts: the main one, and the one that accepts
 * ЄКнига / Нацкешбек / ЄПідтримка. Tokens are Production-only, so on preview
 * every invoice fails and the checkout takes its "payment failed" path.
 */
export type MonopayAccount = "main" | "nationalCashback";

/* Variable names per account, for the "not configured" errors. */
const TOKEN_ENV: Record<MonopayAccount, string> = {
  main: "MONOPAY_TOKEN",
  nationalCashback: "MONOPAY_NATIONAL_CASHBACK_TOKEN",
};

/* One basket entry of a MonoPay invoice. */
export type MonopayBasketItem = {
  name: string;
  qty: number;
  /* Kopecks per unit. */
  sum: number;
  /* Kopecks: sum × qty. */
  total: number;
  code: string;
  unit: string;
};

/* What an invoice needs. */
type InvoiceRequest = {
  account: MonopayAccount;
  /* Kopecks; must equal the sum of basket totals. */
  amount: number;
  /* The KeyCRM order id; the webhook gets it back as `reference`. */
  reference: string;
  basket: MonopayBasketItem[];
};

/* Creates an invoice and returns the payment page URL. Throws on failure. */
export const createMonopayInvoice = async ({
  account,
  amount,
  reference,
  basket,
}: InvoiceRequest): Promise<string> => {
  const { token } = serverEnv.monopay[account];
  if (!token) throw new Error(`${TOKEN_ENV[account]} is not configured`);

  const response = await fetch(`${MONOBANK_API_URL}/invoice/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Token": token },
    body: JSON.stringify({
      amount,
      ccy: 980,
      merchantPaymInfo: {
        reference,
        basketOrder: basket,
        destination: "Покупка товару",
        comment: "Покупка товару",
      },
      redirectUrl: `${publicEnv.siteUrl}/confirmation`,
      webHookUrl: `${publicEnv.siteUrl}/api/monopay/webhook`,
      validity: 3600,
      paymentType: "debit",
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.pageUrl) {
    throw new Error(
      `MonoPay invoice failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return data.pageUrl;
};

/* Public keys per account, fetched at most once per server instance. */
const pubkeyCache = new Map<MonopayAccount, Promise<string | null>>();

/**
 * The account's public key: from serverEnv, or fetched with its token; null
 * without either.
 */
const loadPubkey = async (account: MonopayAccount) => {
  const { pubkey, token } = serverEnv.monopay[account];
  if (pubkey) return pubkey;

  if (!token) return null;

  const response = await fetch(`${MONOBANK_API_URL}/pubkey`, {
    headers: { "X-Token": token },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`MonoPay pubkey for ${account}: ${response.status}`);
  }

  const { key } = await response.json();
  return typeof key === "string" ? key : null;
};

/**
 * The cached public key; a failed fetch is forgotten, so the next webhook
 * retries.
 */
const getPubkey = (account: MonopayAccount) => {
  let key = pubkeyCache.get(account);
  if (!key) {
    key = loadPubkey(account).catch((error) => {
      pubkeyCache.delete(account);
      console.error(error);
      return null;
    });
    pubkeyCache.set(account, key);
  }
  return key;
};

/* Whether signature is this key's ECDSA signature of body. */
const verifyWith = (pubkey: string, body: string, signature: string) => {
  try {
    const verify = createVerify("SHA256");
    verify.write(body);
    verify.end();
    return verify.verify(
      Buffer.from(pubkey, "base64"),
      Buffer.from(signature, "base64")
    );
  } catch {
    return false;
  }
};

/**
 * The account whose key signed this webhook body (X-Sign), or null when
 * neither key matches. An account with no key configured is skipped.
 */
export const verifyMonopayWebhook = async (
  body: string,
  signature: string
): Promise<MonopayAccount | null> => {
  for (const account of ["main", "nationalCashback"] as const) {
    const pubkey = await getPubkey(account);
    if (pubkey && verifyWith(pubkey, body, signature)) return account;
  }
  return null;
};
