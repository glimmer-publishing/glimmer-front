/* A Ukrainian noun's three count forms: 1 відгук, 2 відгуки, 5 відгуків. */
export type UkPluralForms = [one: string, few: string, many: string];

/**
 * The form of a noun that agrees with count in Ukrainian: "one" for 1, 21,
 * 31…; "few" for 2–4, 22–24…; "many" for everything else, including 11–14.
 */
export const pluralizeUk = (
  count: number,
  [one, few, many]: UkPluralForms
): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
};
