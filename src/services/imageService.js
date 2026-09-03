export const getDestinationImage = async (destination) => {
  try {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        destination + " travel"
      )}&per_page=1`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Image API failed");
    }

    const data = await response.json();

    return data.photos[0]?.src?.large || null;
  } catch (error) {
    console.error("Unable to fetch image:", error);
    return null;
  }
};