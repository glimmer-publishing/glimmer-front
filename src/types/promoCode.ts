export interface PromoCode {
  code: string;
  discountPercent: number;
  publishers: { id: string; name: string }[];
}
