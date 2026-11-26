import AboutView from "@/views/about/ui/AboutView";
import { loadAboutView } from "@/views/about/api/loadAboutView";

/**
 * /about: the about page with its Instagram section.
 */
export default async function AboutPage() {
  return <AboutView {...await loadAboutView()} />;
}
