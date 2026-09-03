import "./App.css";
import { useState, useEffect } from "react";
import destinations from "./data/destinations";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DestinationDetails from "./pages/DestinationDetails";
import Weather from "./components/Weather";
import AIAssistant from "./components/AIAssistant";
import { getDestinationImage } from "./services/imageService";

function App() {
  const [search, setSearch] = useState("");
  const [destinationImages, setDestinationImages] = useState({});
  const filteredDestinations = destinations.filter((destination) =>
    destination.name.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
  const fetchImages = async () => {
    const images = {};

    for (const destination of destinations) {
      const image = await getDestinationImage(destination.name);

      if (image) {
        images[destination.id] = image;
      }
    }

    setDestinationImages(images);
  };
  fetchImages();
}, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <div className="app">
            <nav className="navbar">
              <div className="logo">WANDER</div>

              <div className="nav-links">
                <a href="#destinations">Destinations</a>
                <a href="#weather">Weather</a>
                <a href="#assistant">AI Assistant</a>
              </div>
            </nav>

            <main>
              <section className="hero">
                <video
                  className="hero-video"
                  src="/videos/tropical-landscape.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                ></video>
                <div className="hero-overlay"></div>

                <div className="hero-content">
                  <p className="eyebrow">YOUR NEXT JOURNEY STARTS HERE</p>

                  <h1>
                    Go somewhere
                    <br />
                    you'll remember.
                  </h1>

                  <p className="hero-description">
                    Discover remarkable places, experience local highlights,
                    and plan your next adventure.
                  </p>

                  <a href="#destinations" className="hero-button">
                    Explore destinations
                    <span>→</span>
                  </a>
                </div>

                <div className="scroll-indicator">
                  <span>Scroll to explore</span>
                  <span>↓</span>
                </div>
              </section>

              <section id="destinations" className="section">
                <p className="eyebrow">EXPLORE THE WORLD</p>

                <div className="section-heading">
                  <h2>Find somewhere<br />worth going.</h2>

                  <p>
                    From iconic cities to hidden escapes,
                    discover your next destination.
                  </p>
                </div>

                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <button>Search</button>
                </div>

                {filteredDestinations.length > 0 ? (
                  <div className="destination-grid">
                    {filteredDestinations.map((destination) => (
                      <Link
                        to={`/destination/${destination.id}`}
                        className="destination-card"
                        key={destination.id}
                      >
                        <img
                          src={destinationImages[destination.id] || destination.image}
                          alt={destination.name}
                        />

                        <div className="destination-card-overlay">
                          <div>
                            <p>{destination.country}</p>
                            <h3>{destination.name}</h3>
                          </div>

                          <span>→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="destination-placeholder">
                    <h3>No destinations found</h3>
                    <p>Try searching for another destination.</p>
                  </div>
                )}
              </section>
              <Weather />
              <AIAssistant />
            </main>
          </div>
        }/>
        <Route path='/destination/:id' element={<DestinationDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;