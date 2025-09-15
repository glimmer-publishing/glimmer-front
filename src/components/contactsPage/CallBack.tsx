import Image from "next/image";
import Container from "../shared/container/Container";
import CallBackFormWithNotifications from "./CallbackFormWIthNotifications";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function CallBack() {
  return (
    <section className="py-8 lg:py-10">
      <Container className="md:flex justify-between items-center">
        <div className="flex flex-col gap-5 md:w-[calc(50%-35px)]">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInAnimation({ y: 20 })}
            className="text-[14px] lg:text-[18px] font-medium leading-[120%]"
          >
            Залишились питання?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInAnimation({ y: 20, delay: 0.2 })}
          >
            Заповни форму — ми відповімо якнайшвидше:
          </motion.p>
          <CallBackFormWithNotifications />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInAnimation({ scale: 0.95, delay: 0.4 })}
          className="hidden md:block"
        >
          <Image
            src="/images/contactsPage/callback/logoFull.svg"
            alt="logo"
            width="425"
            height="426"
            className="w-[365px] lg:w-[425px] h-auto"
          />
        </motion.div>
      </Container>
    </section>
  );
}
