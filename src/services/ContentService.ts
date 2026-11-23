import { allInstagramPostsQuery } from "@/lib/queries";
import { InstagramPost } from "@/types/instagram";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";

interface InstagramData {
  posts?: InstagramPost[] | null;
}

export class ContentService {
  static async getInstagramPosts(): Promise<InstagramPost[]> {
    const data: InstagramData | null | undefined = await fetchSanityDataServer(
      allInstagramPostsQuery,
      {},
      { throwError: false }
    );

    return data?.posts ?? [];
  }
}
