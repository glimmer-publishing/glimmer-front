/**
 * The browser's calls to our own route handlers. Unlike axios, fetch does
 * not reject on an error status, so both helpers throw when the response is
 * not 2xx: callers handle every failure in one catch.
 */

/* GET a JSON body. signal lets TanStack Query cancel a stale request. */
export const fetchJson = async <T>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`GET ${url}: status ${response.status}`);

  return response.json();
};

/* POST a JSON body; resolves once the route accepted it. */
export const postJson = async (url: string, body: unknown): Promise<void> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`POST ${url}: status ${response.status}`);
};
