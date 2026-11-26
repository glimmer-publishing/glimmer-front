import { loadHomeView } from "@/views/home/api/loadHomeView";
import HomeView from "@/views/home/ui/HomeView";

/**
 * /: the home page, from one combined Sanity read.
 */
export default async function HomePage() {
  return <HomeView {...await loadHomeView()} />;
}
