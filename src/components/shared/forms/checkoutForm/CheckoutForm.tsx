"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { listVariants, listItemVariants } from "@/utils/animationVariants";
import { useRouter } from "next/navigation";
import { checkoutValidation } from "@/schemas/checkoutValidation";
import { handleSubmitForm } from "@/utils/handleSubmitForm";
import { useCartStore } from "@/store/cartStore";
import { useMonopayBasketOrder } from "@/hooks/useMonopayBasletOrder";
import CustomizedInput from "../../formComponents/CustomizedInput";
import CheckoutSubTitle from "./CheckoutSubtitle";
import { promocodeByCodeQuery } from "@/lib/queries";
import CartList from "../../cartModal/CartList";
import RecommendedProducts from "./RecommendedProducts";
import CartTotal from "../../cartModal/CartTotal";
import DeliveryBlock from "./DeliveryBlock";
import PaymentBlock from "./PaymentBlock";
import ContactsBlock from "./ContactsBlock";
import { fetchSanityDataClient } from "@/utils/fetchSanityDataClient";
import { City } from "@/types/city";

export interface ValuesCheckoutFormType {
  name: string;
  surname: string;
  phone: string;
  email: string;
  deliveryService: string;
  deliveryType: string;
  city: string;
  branchNumber: string;
  address: string;
  payment: string;
  message: string;
  promocode: string;
}

interface CheckoutFormProps {
  citiesNovaPost: City[];
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsUnavailable: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;

  className?: string;
}

export default function CheckoutForm({
  setIsError,
  setIsUnavailable,
  setIsNotificationShown,
  citiesNovaPost,
  className = "",
}: CheckoutFormProps) {
  const {
    getCartTotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    cart,
    hydrated,
  } = useCartStore();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPromocode, setIsLoadingPromocode] = useState(false);

  const basketOrder = useMonopayBasketOrder();

  if (!hydrated) return null;

  const initialValues = {
    name: "",
    surname: "",
    phone: "",
    email: "",
    deliveryService: "Нова пошта",
    deliveryType: "Відділення",
    city: "",
    branchNumber: "",
    address: "",
    payment: "Оплата картою онлайн Visa, Mastercard",
    message: "",
    promocode: promoCode || "",
  };

  const validationSchema = checkoutValidation();

  const verifyPromo = async (
    values: ValuesCheckoutFormType,
    setFieldError: (
      field: keyof ValuesCheckoutFormType,
      message: string
    ) => void,
    setFieldTouched: (
      field: keyof ValuesCheckoutFormType,
      isTouched?: boolean,
      shouldValidate?: boolean
    ) => void
  ) => {
    try {
      setIsLoadingPromocode(true);
      const promocode = await fetchSanityDataClient(promocodeByCodeQuery, {
        promocode: values.promocode,
      });

      if (promocode) {
        const now = new Date();
        const expirationDate = promocode.expirationDate
          ? new Date(promocode.expirationDate)
          : null;

        if (expirationDate && expirationDate < now) {
          removePromoCode();
          setFieldError("promocode", "Термін дії промокоду вичерпано");
          setFieldTouched("promocode", true, false);
          return;
        }
        const discount = promocode.discountPercent;
        const publishers = promocode.publishers;

        applyPromoCode(values.promocode, discount, publishers);
      } else {
        setFieldError("promocode", "Промокод не знайдений");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFieldError("promocode", "Сталася помилка. Спробуйте ще раз");
    } finally {
      setIsLoadingPromocode(false);
    }
  };

  const removePromo = async (
    setFieldValue: (
      field: keyof ValuesCheckoutFormType,
      message: string
    ) => void
  ) => {
    removePromoCode();
    setFieldValue("promocode", "");
  };

  const submitForm = async (
    values: ValuesCheckoutFormType,
    formikHelpers: FormikHelpers<ValuesCheckoutFormType>
  ) => {
    await handleSubmitForm<ValuesCheckoutFormType>(
      formikHelpers,
      setIsLoading,
      setIsError,
      setIsUnavailable,
      setIsNotificationShown,
      values,
      router,
      basketOrder
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={validationSchema}
    >
      {({
        errors,
        touched,
        dirty,
        isValid,
        values,
        setFieldError,
        setFieldValue,
        setFieldTouched,
      }) => (
        <Form
          className={`relative flex flex-col md:flex-row md:gap-8 w-full ${className}`}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.2 }}
            variants={listVariants({
              staggerChildren: 0.2,
              delayChildren: 0.4,
            })}
            className="flex flex-col md:gap-8 w-full md:w-[calc(50%-16px)]"
          >
            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-9 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
            >
              <CheckoutSubTitle>Контактна інформація</CheckoutSubTitle>
              <ContactsBlock />
            </motion.div>

            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-9 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
            >
              <CheckoutSubTitle>Доставка</CheckoutSubTitle>
              <DeliveryBlock citiesNovaPost={citiesNovaPost} />
            </motion.div>

            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-9 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
            >
              <CheckoutSubTitle>Оплата</CheckoutSubTitle>
              <PaymentBlock />
            </motion.div>

            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-9 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
            >
              <CheckoutSubTitle>Додати коментар</CheckoutSubTitle>
              <CustomizedInput
                fieldName="message"
                as="textarea"
                placeholder={"Повідомлення"}
                errors={errors}
                touched={touched}
                fieldClassName="h-[120px] lg:h-[160px] py-4 rounded-[12px]"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.2 }}
            variants={listVariants({
              staggerChildren: 0.2,
              delayChildren: 0.4,
            })}
            className="flex flex-col md:gap-6 w-full md:w-[calc(50%-16px)] h-fit md:p-8 md:rounded-[12px] md:shadow-sm md:overflow-hidden border-t md:border-none border-black/10"
          >
            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-4 md:p-0"
            >
              <CheckoutSubTitle>Інформація про замовлення</CheckoutSubTitle>
              <CartList
                variant="checkout"
                className="max-h-[201px] lg:max-h-[234px]"
              />
              <RecommendedProducts />
            </motion.div>
            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-6 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
            >
              <CheckoutSubTitle>Промокод</CheckoutSubTitle>
              <CustomizedInput
                fieldName="promocode"
                placeholder={"Введи свій промокод"}
                isLoading={isLoadingPromocode}
                errors={errors}
                touched={touched}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (promoCode) {
                    removePromo(setFieldValue);
                  } else {
                    verifyPromo(values, setFieldError, setFieldTouched);
                  }
                }}
                type="button"
                disabled={!values.promocode}
                className="mt-1.5 block w-fit ml-auto enabled:cursor-pointer text-[10px] xl:text-[12px] font-medium leading-[120%] disabled:opacity-60 text-black/60 xl:enabled:hover:text-main 
                enabled:focus-visible:text-main enabled:active:text-main transition duration-300 ease-in-out"
              >
                {promoCode ? "Видалити промокод" : "Застосувати промокод"}
              </button>
            </motion.div>

            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-6 md:p-0 border-t md:border-none border-black/10"
            >
              <CartTotal
                variant="checkout"
                disabled={
                  !(
                    dirty &&
                    isValid &&
                    !!cart?.length &&
                    getCartTotal() !== 0
                  ) || isLoading
                }
                isLoading={isLoading}
              />
            </motion.div>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
}
