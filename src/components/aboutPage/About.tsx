import Container from "../shared/container/Container";
import AboutInfo from "./AboutInfo";

export default function About() {
  return (
    <section>
      <Container>
        <div className="py-8 lg:py-10 border-t border-b border-black/60">
          <AboutInfo />
        </div>
      </Container>
    </section>
  );
}
