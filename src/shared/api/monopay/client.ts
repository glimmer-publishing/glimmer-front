import "server-only";
import { createVerify } from "crypto";
import { siteUrl } from "@/shared/lib/siteUrl";

const MONOBANK_API_URL = "https://api.monobank.ua/api/merchant";

/**
 * The two MonoPay merchant accounts: the main one, and the one that accepts
 * ЄКнига / Нацкешбек / ЄПідтримка. Tokens are Production-only, so on preview
 * every invoice fails and the checkout takes its "payment failed" path.
 */
export type MonopayAccount = "main" | "nationalCashback";

const TOKEN_ENV: Record<MonopayAccount, string> = {
  main: "MONOPAY_TOKEN",
  nationalCashback: "MONOPAY_NATIONAL_CASHBACK_TOKEN",
};

const PUBKEY_ENV: Record<MonopayAccount, string> = {
  main: "MONOPAY_PUBKEY",
  nationalCashback: "MONOPAY_NATIONAL_CASHBACK_PUBKEY",
};

export interface MonopayBasketItem {
  name: string;
  qty: number;
  /* Kopecks per unit. */
  sum: number;
  /* Kopecks: sum × qty. */
  total: number;
  code: string;
  unit: string;
}

interface InvoiceRequest {
  account: MonopayAccount;
  /* Kopecks; must equal the sum of basket totals. */
  amount: number;
  /* The KeyCRM order id; the webhook gets it back as `reference`. */
  reference: string;
  basket: MonopayBasketItem[];
}

/* Creates an invoice and returns the payment page URL. Throws on failure. */
export const createMonopayInvoice = async ({
  account,
  amount,
  reference,
  basket,
}: InvoiceRequest): Promise<string> => {
  const token = process.env[TOKEN_ENV[account]];
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
      redirectUrl: `${siteUrl()}/confirmation`,
      webHookUrl: `${siteUrl()}/api/monopay/webhook`,
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

const loadPubkey = async (account: MonopayAccount) => {
  const fromEnv = process.env[PUBKEY_ENV[account]];
  if (fromEnv) return fromEnv;

  const token = process.env[TOKEN_ENV[account]];
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
