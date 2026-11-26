/* Opens MonoPay's payment page with a POST, as MonoPay expects. */
export const openPaymentPage = (url: string) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.style.display = "none";
  document.body.appendChild(form);
  form.submit();
};
