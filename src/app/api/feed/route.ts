import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { allProductsForFeedQuery } from "@/lib/queries";

export const revalidate = 3600;

const SITE_URL = "https://www.glimmer.com.ua";
const BRAND = "Glimmer";

const GOOGLE_PRODUCT_CATEGORY = "784"; // Media > Books

type FeedProduct = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number;
  status: "inStock" | "preOrder";
  preOrderShippingDate?: string;
  mainImage?: string;
  categorySlug?: string;
  categoryTitle?: string;
  genreTitle?: string;
  features?: { featureName: string; value: string }[];
};

function cdata(value: string): string {
  return `<![CDATA[${value.trim()}]]>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

function formatAvailabilityDate(date: string): string {
  // Sanity stores dates as YYYY-MM-DD; Google requires ISO 8601 with time
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date}T00:00:00Z`;
  }
  return date;
}

function buildItem(product: FeedProduct): string {
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

  const link = `${SITE_URL}/catalog/${categorySlug ?? ""}/${slug}`;

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

  lines.push(`      <g:description>${cdata(description ?? "")}</g:description>`);
  lines.push(`      <g:link>${escapeXml(link)}</g:link>`);

  if (mainImage) {
    lines.push(`      <g:image_link>${escapeXml(mainImage)}</g:image_link>`);
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

export async function GET() {
  const products: FeedProduct[] | undefined =
    await fetchSanityDataServer(allProductsForFeedQuery);

  if (!products) {
    return new Response("Failed to fetch products", { status: 500 });
  }

  const items = products.map(buildItem).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Glimmer</title>
    <link>${SITE_URL}</link>
    <description>Glimmer product feed</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
