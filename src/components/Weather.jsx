import { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocationWeather = () => {
    setError("");
    setWeather(null);
    setLoading(true)

    if (!navigator.geolocation) {
        setError("Location is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );

          if (!response.ok) {
            throw new Error("Unable to get weather");
          }

          const data = await response.json();

          setWeather(data);
          setCity(data.name);
        } catch (error) {
          setError("Unable to get weather for your location");
        } finally {
          setLoading(false);
        }
        },
        () => {
          setLoading(false);
          setError("Location access was denied. You can search for a city instead.");
        }
    );
    };

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }

    setError("");
    setWeather(null);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      setWeather(data);
    } catch (error) {
      setError("Unable to find weather for this city");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="weather" className="weather-section">
      <p className="eyebrow">CHECK THE WEATHER</p>

      <div className="section-heading">
        <h2>Know before<br />you go.</h2>
        <p>Check the current weather at your destination.</p>
      </div>

    <div className="weather-search">
    <input
        type="text"
        placeholder="Enter a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
    />

    <button onClick={getWeather} disabled={loading}>
      Check Weather
    </button>

    <button
      className="location-button"
      onClick={getLocationWeather}
      disabled={loading}
    >
      {loading ? "Checking..." : "Use my location"}
    </button>
    </div>

      {error && (
        <p className="weather-error">{error}</p>
      )}
      {loading && (
        <p className="weather-loading">
          Checking weather...
        </p>
      )}

      {weather && (
        <div className="weather-card">
          <h3>{weather.name}</h3>

          <p className="temperature">
            {Math.round(weather.main.temp)}°C
          </p>

          <p>
            {weather.weather[0].description}
          </p>

          <div className="weather-details">
            <span>
              Feels like: {Math.round(weather.main.feels_like)}°C
            </span>

            <span>
              Humidity: {weather.main.humidity}%
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default Weather;