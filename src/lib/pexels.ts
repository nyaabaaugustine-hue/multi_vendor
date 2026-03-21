
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function getPexelsImage(query: string) {
  if (!PEXELS_API_KEY) {
    console.warn('PEXELS_API_KEY is not set');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.photos[0]?.src?.large || null;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
}
