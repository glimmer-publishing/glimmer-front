import Section from "@/components/shared/section/Section";
import SectionDescription from "@/components/shared/sectionDescription/SectionDescription";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import InstagramPostsList from "./InstagramPostsList";
import Container from "@/components/shared/container/Container";

interface InstagramProps {
  instagramPosts: { image: string; alt?: string; url: string }[];
}

export default function Instagram({ instagramPosts }: InstagramProps) {
  if (!instagramPosts || !instagramPosts?.length) return null;

  return (
    <Section>
      <Container className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-6 lg:mb-12">
        <SectionTitle>Наш Instagram</SectionTitle>
        <SectionDescription>
          Залишайся ближче до натхнення.
          <br /> Ми поруч — в Instagram.
        </SectionDescription>
      </Container>
      <div className="xs:max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] sm:px-5 lg:px-[50px] mx-auto">
        <InstagramPostsList instagramPosts={instagramPosts} />
      </div>
    </Section>
  );
}
