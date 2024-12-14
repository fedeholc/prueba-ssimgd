
export async function getSubPages(apiEndPoint: string, sourceUrl: string) {
  const sanitizedUrl =
    sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://")
      ? sourceUrl
      : "https://" + sourceUrl;
  const response = await fetch(apiEndPoint, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ url: sanitizedUrl }),
  });
  const data = await response.json();
  return data;
}

export async function getImages(apiEndPoint: string, pageUrl: string) {
  const response = await fetch(apiEndPoint, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ url: pageUrl }),
  });
  const data = await response.json();
  return data;
}