import { loadHomeView } from "@/views/home/api/loadHomeView";
import HomeView from "@/views/home/ui/HomeView";

export default async function HomePage() {
  return <HomeView {...await loadHomeView()} />;
}
