import { sanityImageUrl } from "@/shared/lib/images/sanityImage";
import type { FeedProduct } from "../model/types";

/* The brand every item is listed under. */
const BRAND = "Glimmer";

const GOOGLE_PRODUCT_CATEGORY = "784"; // Media > Books

/* Wraps free text so XML special characters need no escaping. */
function cdata(value: string): string {
  return `<![CDATA[${value.trim()}]]>`;
}

/* Escapes the five XML special characters. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* Whether a value is a valid EAN-13 / ISBN-13, check digit included. */
function isValidGtin13(value: string): boolean {
  const digits = value.replace(/[-\s]/g, "");
  if (!/^\d{13}$/.test(digits)) return false;
  const sum = digits
    .slice(0, 12)
    .split("")
    .reduce((acc, d, i) => acc + parseInt(d) * (i % 2 === 0 ? 1 : 3), 0);
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(digits[12]);
}

/* A YYYY-MM-DD date as Google's ISO 8601 date-time. */
function formatAvailabilityDate(date: string): string {
  // Sanity stores dates as YYYY-MM-DD; Google requires ISO 8601 with time
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date}T00:00:00Z`;
  }
  return date;
}

/**
 * One book as a Merchant Center <item>: link, image, availability, prices,
 * type and GTIN when known.
 */
function buildItem(product: FeedProduct, siteUrl: string): string {
  const {
    id,
    slug,
    title,
    description,
    price,
    discountPrice,
    status,
    preOrderShippingDate,
    mainImage,
    categorySlug,
    categoryTitle,
    genreTitle,
    features,
  } = product;

  const link = `${siteUrl}/catalog/${encodeURIComponent(categorySlug ?? "")}/${encodeURIComponent(slug)}`;

  const availability =
    status === "inStock"
      ? "in_stock"
      : status === "preOrder"
        ? "preorder"
        : "out_of_stock";

  const productType = [categoryTitle, genreTitle].filter(Boolean).join(" > ");

  const googleCategory = GOOGLE_PRODUCT_CATEGORY;

  // Prefer ISBN from Sanity features; fall back to id if it looks like an ISBN-13
  const isbnFromFeatures = features
    ?.find((f) => f.featureName?.toLowerCase().includes("isbn"))
    ?.value?.replace(/[-\s]/g, "");
  const cleanId = id.replace(/[-\s]/g, "");
  const gtin =
    isbnFromFeatures ?? (isValidGtin13(cleanId) ? cleanId : undefined);

  const lines: string[] = [
    `    <item>`,
    `      <g:id>${escapeXml(id)}</g:id>`,
    `      <g:title>${cdata(title)}</g:title>`,
    `      <g:google_product_category>${googleCategory}</g:google_product_category>`,
  ];

  lines.push(
    `      <g:description>${cdata(description ?? "")}</g:description>`
  );
  lines.push(`      <g:link>${escapeXml(link)}</g:link>`);

  if (mainImage) {
    // 1000px wide is plenty for Merchant Center and keeps its crawler fast.
    lines.push(
      `      <g:image_link>${escapeXml(sanityImageUrl(mainImage, { width: 1000 }))}</g:image_link>`
    );
  }

  lines.push(
    `      <g:condition>new</g:condition>`,
    `      <g:availability>${availability}</g:availability>`
  );

  if (status === "preOrder" && preOrderShippingDate) {
    lines.push(
      `      <g:availability_date>${formatAvailabilityDate(preOrderShippingDate)}</g:availability_date>`
    );
  }

  lines.push(`      <g:price>${price.toFixed(2)} UAH</g:price>`);

  if (discountPrice != null) {
    lines.push(
      `      <g:sale_price>${discountPrice.toFixed(2)} UAH</g:sale_price>`
    );
  }

  if (productType) {
    lines.push(`      <g:product_type>${cdata(productType)}</g:product_type>`);
  }

  lines.push(`      <g:brand>${cdata(BRAND)}</g:brand>`);

  if (gtin) {
    lines.push(`      <g:gtin>${gtin}</g:gtin>`);
  } else {
    lines.push(`      <g:identifier_exists>no</g:identifier_exists>`);
  }

  lines.push(`      <g:adult>no</g:adult>`);
  lines.push(`    </item>`);

  return lines.join("\n");
}

/**
 * The Google Merchant Center RSS feed of these products, with links on
 * siteUrl (the origin, no trailing slash).
 */
export const buildFeedXml = (products: FeedProduct[], siteUrl: string) => {
  const items = products.map((product) => buildItem(product, siteUrl));

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Glimmer</title>
    <link>${siteUrl}</link>
    <description>Glimmer product feed</description>
${items.join("\n")}
  </channel>
</rss>`;
};
