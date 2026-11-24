import AboutView from "@/views/about/ui/AboutView";
import { loadAboutView } from "@/views/about/api/loadAboutView";

export default async function AboutPage() {
  return <AboutView {...await loadAboutView()} />;
}
