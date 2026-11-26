/* Kopecks as hryvnia for display: whole amounts without decimals. */
export const formatHryvnia = (kopecks: number) => {
  const hryvnia = kopecks / 100;

  return Number.isInteger(hryvnia) ? String(hryvnia) : hryvnia.toFixed(2);
};
