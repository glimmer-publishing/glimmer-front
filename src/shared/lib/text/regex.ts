/* A phone number as written on the contacts page. */
export const contactsPhoneRegex =
  /^\+38\s?\(?(\d{3})\)?\s?(\d{3})\s?(\d{2})\s?(\d{2})$/;

/**
 * Names: letters (Latin and Ukrainian), spaces, apostrophes, quotes and
 * hyphens.
 */
export const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇґҐєЄ\s'"-]+$/;

/* An email address, as the forms accept it. */
export const emailRegex =
  /^([a-zA-Z0-9]+)([a-zA-Z0-9?'"`#$%&*+_./|^{}~-]+)?@([a-zA-Z0-9_\-.]+)([.][a-zA-Z]{2,3})$/;

/* The checkout phone as phoneMask formats it: +38 (0XX) XXX-XX-XX. */
export const checkoutPhoneRegex = /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

/* react-text-mask mask for the checkout phone. */
export const phoneMask = [
  "+",
  "3",
  "8",
  " ",
  "(",
  /[0-9]/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];
