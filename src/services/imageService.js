export const getDestinationImage = async (destination) => {
  try {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        destination + " travel"
      )}&per_page=5`,
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

    const photos = data.photos || [];

    if (photos.length === 0) {
      return null;
    }

    const selectedPhoto = photos[Math.min(1, photos.length - 1)];

    return selectedPhoto.src.large2x || selectedPhoto.src.large || null;
  } catch (error) {
    console.error("Unable to fetch image:", error);
    return null;
  }
};

export const getPlaceImage = async (place, destination) => {
  try {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

    const query = `${place} ${destination}`;

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&orientation=landscape&per_page=5`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Place image API failed");
    }

    const data = await response.json();

    const photos = data.photos || [];

    if (photos.length === 0) {
      return null;
    }

    const selectedPhoto = photos[0];

    return selectedPhoto.src.large2x || selectedPhoto.src.large || null;
  } catch (error) {
    console.error("Unable to fetch place image:", error);
    return null;
  }
};