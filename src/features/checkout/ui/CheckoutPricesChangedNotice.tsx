/**
 * Tells the customer that the cart they saw on opening checkout had older
 * prices, and that the totals below are the current ones.
 */
export default function CheckoutPricesChangedNotice() {
  return (
    <p
      role="status"
      className="mb-4 p-3 rounded-[12px] bg-main/40 text-[12px] lg:text-[14px] font-normal leading-[120%]"
    >
      Ціни або знижки на деякі товари змінились з твого минулого візиту. Ми
      оновили кошик - перевір суму перед оформленням.
    </p>
  );
}
