import PageTitle from "@/shared/ui/titles/PageTitle";
import SectionDescription from "@/shared/ui/section-description/SectionDescription";
import Container from "@/shared/ui/container/Container";
import ContactsList from "./ContactsList";

/**
 * The contacts page heading, intro and contact list.
 */
export default function ContactsInfo() {
  return (
    <section className="pb-8 lg:pb-10">
      <Container>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-8 lg:mb-12">
          <PageTitle>Контакти</PageTitle>
          <SectionDescription className="lg:max-w-[440px]">
            З нами легко звʼязатися! Якщо у тебе виникли питання щодо
            замовлення, доставки чи асортименту — дзвони або пиши у зручному для
            тебе форматі. Ми поруч!
          </SectionDescription>
        </div>
        <ContactsList />
      </Container>
    </section>
  );
}
