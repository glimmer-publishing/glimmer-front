import type { InstagramPost } from "@/types/instagram";
import Container from "@/shared/ui/container/Container";
import Section from "@/shared/ui/section/Section";
import SectionDescription from "@/shared/ui/section-description/SectionDescription";
import SectionTitle from "@/shared/ui/titles/SectionTitle";
import InstagramPostsList from "./InstagramPostsList";

interface InstagramProps {
  /* Posts from the Instagram document in Studio. */
  instagramPosts: InstagramPost[];
}

/**
 * "Наш Instagram" section: heading and a row of linked posts. Nothing
 * renders when there are no posts.
 */
export default function Instagram({ instagramPosts }: InstagramProps) {
  if (!instagramPosts.length) return null;

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
