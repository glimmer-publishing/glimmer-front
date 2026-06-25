import axios from "axios";

export const fetchSanityDataClient = async (
  query: string,
  params: Record<string, unknown> = {}
) => {
  try {
    const response = await axios.post(
      `/api/sanity`,
      {
        query,
        params,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch Sanity data");
  }
};
