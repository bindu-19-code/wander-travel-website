import { useParams } from "react-router-dom";
import destinations from "../data/destinations";

function DestinationDetails() {
  const { id } = useParams();

  const destination = destinations.find(
    (item) => item.id === Number(id)
  );

  if (!destination) {
    return <h2>Destination not found</h2>;
  }

  return (
    <div className="destination-details">
      <img
        src={destination.image}
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
                src={place.image}
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