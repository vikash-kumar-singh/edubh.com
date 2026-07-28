export async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected a JSON response from ${response.url || "the API"}, but received ${contentType || "an unknown content type"}.`,
    );
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    throw new Error("The API returned an empty response.");
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new Error("The API returned malformed JSON.");
  }
}