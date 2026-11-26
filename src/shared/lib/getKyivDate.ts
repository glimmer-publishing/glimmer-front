// Today's date as a YYYY-MM-DD string in the shop's own timezone.
//
// Vercel runs in UTC, so comparing a date-only field against the server's own
// date would end a sale 2-3 hours early for Ukrainian customers. Everything
// date-based on the storefront is a Kyiv calendar day instead.
//
// Assembled from parts rather than from a locale's formatted string, so the
// result is guaranteed to be YYYY-MM-DD - the shape that sorts chronologically
// as a plain string, which the GROQ window comparison in
// src/shared/api/sanity/fragments.ts relies on.
export const getKyivDate = (): string => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
};

/**
 * The current Kyiv date and time, for order and payment timestamps:
 * `date` as DD.MM.YYYY, `time` as HH:MM:SS, `sortable` as YYYY-MM-DD HH:MM:SS.
 * Correct in winter (UTC+2) and summer (UTC+3) alike.
 */
export const getKyivDateTime = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;
  const time = `${part("hour")}:${part("minute")}:${part("second")}`;

  return {
    date: `${part("day")}.${part("month")}.${part("year")}`,
    time,
    sortable: `${part("year")}-${part("month")}-${part("day")} ${time}`,
  };
};
