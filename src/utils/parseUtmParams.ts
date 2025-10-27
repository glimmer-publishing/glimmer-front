import { UtmData } from "@/store/utmStore";

/**
 * Парсить UTM-параметри з URL
 * @param url - URL для парсингу (за замовчуванням window.location.href)
 * @returns Об'єкт з UTM-даними або null, якщо UTM-параметрів немає
 */
export function parseUtmParams(url?: string): UtmData | null {
  // Якщо ми на сервері, повертаємо null
  if (typeof window === "undefined") {
    return null;
  }

  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  const searchParams = urlObj.searchParams;

  const utmData: UtmData = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  };

  // Перевіряємо наявність UTM-параметрів
  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");
  const utmCampaign = searchParams.get("utm_campaign");
  const utmTerm = searchParams.get("utm_term");
  const utmContent = searchParams.get("utm_content");

  // Завжди додаємо всі UTM-поля, навіть якщо вони пусті
  utmData.utm_source = utmSource || "";
  utmData.utm_medium = utmMedium || "";
  utmData.utm_campaign = utmCampaign || "";
  utmData.utm_term = utmTerm || "";
  utmData.utm_content = utmContent || "";

  // Перевіряємо, чи є хоча б одне непусте значення
  const hasAnyValue =
    utmSource || utmMedium || utmCampaign || utmTerm || utmContent;

  // Повертаємо UTM-дані тільки якщо є хоча б одне значення
  return hasAnyValue ? utmData : null;
}

/**
 * Перевіряє, чи містить URL UTM-параметри
 * @param url - URL для перевірки (за замовчуванням window.location.href)
 * @returns true, якщо є UTM-параметри
 */
export function hasUtmParams(url?: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  const searchParams = urlObj.searchParams;

  return (
    searchParams.has("utm_source") ||
    searchParams.has("utm_medium") ||
    searchParams.has("utm_campaign") ||
    searchParams.has("utm_term") ||
    searchParams.has("utm_content")
  );
}
