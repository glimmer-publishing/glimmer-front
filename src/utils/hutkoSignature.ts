import { createHash } from "crypto";

/**
 * Generates SHA1 signature for Hutko payment gateway.
 *
 * Algorithm:
 * 1. Add merchant_id to params
 * 2. Filter out empty values
 * 3. Sort params alphabetically by key
 * 4. Take values only
 * 5. Prepend password
 * 6. Join with '|'
 * 7. SHA1 hash (lowercase)
 */
export function generateHutkoSignature(
  merchantId: string,
  password: string,
  params: Record<string, string | number>
): string {
  const allParams: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
    merchant_id: merchantId,
  };

  // Filter out empty values
  const filtered = Object.fromEntries(
    Object.entries(allParams).filter(([, value]) => value.length > 0)
  );

  // Sort by key alphabetically
  const sortedKeys = Object.keys(filtered).sort();
  const sortedValues = sortedKeys.map((key) => filtered[key]);

  // Prepend password and join with |
  const signatureString = [password, ...sortedValues].join("|");

  // SHA1 hash, lowercase
  return createHash("sha1").update(signatureString, "utf8").digest("hex");
}

/**
 * Verifies the signature from a Hutko callback response.
 */
export function verifyHutkoSignature(
  merchantId: string,
  password: string,
  response: Record<string, string | number>
): boolean {
  const { signature, response_signature_string, ...params } = response as Record<string, string>;

  if (!signature) return false;

  const expectedSignature = generateHutkoSignature(merchantId, password, params);
  return expectedSignature === signature;
}
