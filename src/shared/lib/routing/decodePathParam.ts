/**
 * Null for a malformed escape ("%E0%A4%A"), which makes decodeURIComponent
 * throw, or for a blank value, so the page can 404 instead of failing with a
 * 500. Not trimmed: Sanity queries match the stored value exactly.
 */
export const decodePathParam = (value: string): string | null => {
  try {
    const decoded = decodeURIComponent(value);
    return decoded.trim() ? decoded : null;
  } catch {
    return null;
  }
};
