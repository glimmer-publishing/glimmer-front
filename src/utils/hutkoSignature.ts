import { createHash } from "crypto";

/**
 * Builds the Fondy/Hutko signature base string.
 *
 * Algorithm:
 * 1. Convert all values to strings
 * 2. Filter out empty values
 * 3. Sort params alphabetically by key
 * 4. Take values only
 * 5. Prepend password
 * 6. Join with '|'
 */
function buildSignatureString(
  password: string,
  params: Record<string, string | number>
): string {
  const filtered = Object.entries(params)
    .map(([key, value]) => [key, String(value)] as [string, string])
    .filter(([, value]) => value.length > 0);

  const sortedValues = filtered
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, value]) => value);

  return [password, ...sortedValues].join("|");
}

/**
 * Generates SHA1 signature for Hutko payment gateway.
 * `params` must already include merchant_id (and any other fields to sign).
 */
export function generateHutkoSignature(
  password: string,
  params: Record<string, string | number>
): string {
  const signatureString = buildSignatureString(password, params);
  return createHash("sha1").update(signatureString, "utf8").digest("hex");
}

/**
 * Verifies the signature from a Hutko callback response.
 * Signs the response params exactly as received (merchant_id included),
 * excluding only `signature` and `response_signature_string`.
 *
 * Returns the boolean result plus debug info to log on mismatch.
 */
export function verifyHutkoSignature(
  password: string,
  response: Record<string, string | number>
): { isValid: boolean; expected: string; received: string; base: string } {
  const {
    signature,
    response_signature_string,
    ...params
  } = response as Record<string, string>;

  const base = buildSignatureString(password, params);
  const expected = createHash("sha1").update(base, "utf8").digest("hex");
  const received = String(signature ?? "");

  return {
    isValid: Boolean(signature) && expected === received,
    expected,
    received,
    base,
  };
}
