import "server-only";

/**
 * Every server-only environment variable, in one place. Importing this file
 * from a client component fails the build (server-only), so no secret can
 * reach the browser. A missing value is undefined: each integration decides
 * whether that disables it (Telegram, Resend) or is an error (KeyCRM,
 * MonoPay). CRM_API_KEY and every MONOPAY_* value are Production-scoped in
 * Vercel on purpose; see CLAUDE.md.
 */
export const serverEnv = {
  /* KeyCRM's API key. Production only: preview never writes to KeyCRM. */
  crmApiKey: process.env.CRM_API_KEY,
  /* The two MonoPay merchant accounts. Production only. */
  monopay: {
    main: {
      token: process.env.MONOPAY_TOKEN,
      /* Optional: fetched from MonoPay with the token when unset. */
      pubkey: process.env.MONOPAY_PUBKEY,
    },
    nationalCashback: {
      token: process.env.MONOPAY_NATIONAL_CASHBACK_TOKEN,
      pubkey: process.env.MONOPAY_NATIONAL_CASHBACK_PUBKEY,
    },
  },
  /* The operations bot and group; each environment has its own. */
  telegram: {
    botId: process.env.TELEGRAM_BOT_ID,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },
  /**
   * NEXT_PUBLIC_NOVA_POSHTA_API_KEY is read only as a fallback until
   * NOVA_POSHTA_API_KEY is set everywhere; read here, it is not bundled.
   */
  novaPoshtaApiKey:
    process.env.NOVA_POSHTA_API_KEY ||
    process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY ||
    "",
  /* Resend, shared by every environment: preview sends real email. */
  resendApiKey: process.env.RESEND_API_KEY,
  /* Signs the Sanity publish webhook that calls POST /api/revalidate. */
  sanityRevalidateSecret: process.env.SANITY_REVALIDATE_SECRET,
  /* Vercel Cron's bearer token for GET /api/revalidate. */
  cronSecret: process.env.CRON_SECRET,
} as const;
