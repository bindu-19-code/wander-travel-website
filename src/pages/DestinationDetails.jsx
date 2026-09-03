import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import destinations from "../data/destinations";
import {
  getDestinationImage,
  getPlaceImage,
} from "../services/imageService";

function DestinationDetails() {
  const { id } = useParams();

  const destination = destinations.find(
    (item) => item.id === Number(id)
  );

  const [destinationImage, setDestinationImage] = useState(null);
  const [placeImages, setPlaceImages] = useState({});

  useEffect(() => {
    if (!destination) return;

    const fetchImages = async () => {
      // Fetch main destination image
      const mainImage = await getDestinationImage(destination.name);
      setDestinationImage(mainImage);

      // Fetch images for all places
      const images = {};

      for (const place of destination.places) {
        const image = await getPlaceImage(
          place.name,
          destination.name
        );

        if (image) {
          images[place.name] = image;
        }
      }

      setPlaceImages(images);
    };

    fetchImages();
  }, [destination]);

  if (!destination) {
    return <h2>Destination not found</h2>;
  }

  return (
    <div className="destination-details">
      <img
        src={destinationImage || destination.image}
        alt={destination.name}
        className="details-image"
      />

      <div className="details-content">
        <p>{destination.country}</p>
        <h1>{destination.name}</h1>

        <h3>Popular Places</h3>

        <div className="places-grid">
          {destination.places.map((place) => (
            <div className="place-card" key={place.name}>
              <img
                src={placeImages[place.name] || place.image}
                alt={place.name}
              />

              <div className="place-info">
                <h3>{place.name}</h3>
                <p>{place.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;