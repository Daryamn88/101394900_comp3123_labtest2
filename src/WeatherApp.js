import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherApp = () => {
  const [city, setCity] = useState('Toronto');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '59f1067215928a77b96e1be0e61a0dba';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      setWeatherData({
        current: currentWeatherResponse.data,
        forecast: forecastResponse.data,
      });

      setError(null);
    } catch (err) {
      setError('City not found');
      setWeatherData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = () => {
    fetchWeather(city);
  };

  return (
    <div className="weather-app">
      {/* Header */}
      <header className="header">
        <h1>Weather Forecast</h1>
      </header>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Current Weather */}
      {weatherData && (
        <div className="current-weather">
          <h2>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h2>
          <p>{new Date().toLocaleDateString()}</p>
          <h3>{weatherData.current.name}</h3>
          <p>{weatherData.current.weather[0].description}</p>
          <h1>{weatherData.current.main.temp}°C</h1>
        </div>
      )}

      {/* Weather Details */}
      {weatherData && (
        <div className="weather-details">
          <div>Humidity: {weatherData.current.main.humidity}%</div>
          <div>Wind: {weatherData.current.wind.speed} km/h</div>
          <div>Air Pressure: {weatherData.current.main.pressure} mb</div>
          <div>Max Temp: {weatherData.current.main.temp_max}°C</div>
          <div>Min Temp: {weatherData.current.main.temp_min}°C</div>
        </div>
      )}

      {/* Weekly Forecast */}
      {weatherData && (
        <div className="forecast-container">
          {weatherData.forecast.list
            .filter((_, index) => index % 8 === 0)
            .map((day, idx) => (
              <div key={idx} className="forecast-item">
                <p>{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p>{day.main.temp}°C</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
