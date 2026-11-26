import Container from "@/shared/ui/container/Container";
import PageTitle from "@/shared/ui/titles/PageTitle";
import SectionDescription from "@/shared/ui/section-description/SectionDescription";
import DeliveryInfoList from "./DeliveryInfoList";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";

/**
 * The delivery page heading, intro and general terms.
 */
export default function DeliveryInfo() {
  return (
    <section>
      <Container>
        <div className="pb-8 lg:pb-10 border-b border-black/10">
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-8 lg:mb-12">
            <PageTitle>Доставка та оплата</PageTitle>
            <SectionDescription className="lg:max-w-[363px]">
              Отримай замовлення швидко та зручно! Ми подбали про те, щоб твоя
              улюблена книга потрапила до тебе якнайшвидше.
            </SectionDescription>
          </div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInAnimation({ y: 20 })}
            className="mb-6 lg:mb-8 text-[18px] lg:text-[24px] font-medium leading-[120%]"
          >
            Загальна інформація
          </motion.h2>
          <DeliveryInfoList />
        </div>
      </Container>
    </section>
  );
}
