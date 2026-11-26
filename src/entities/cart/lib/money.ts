/**
 * Money units. Amounts are integer kopecks everywhere in code; hryvnia
 * appear only at the edges (Sanity prices in, KeyCRM and analytics out).
 */

export const toKopecks = (hryvnia: number) => Math.round(hryvnia * 100);

/* Kopecks as hryvnia, for KeyCRM and analytics. */
export const toHryvnia = (kopecks: number) => kopecks / 100;

/* Kopecks as hryvnia for display: whole amounts without decimals. */
export const formatHryvnia = (kopecks: number) => {
  const hryvnia = toHryvnia(kopecks);

  return Number.isInteger(hryvnia) ? String(hryvnia) : hryvnia.toFixed(2);
};
