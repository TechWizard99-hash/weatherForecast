import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherApp.css";

const API_KEY = "6f5028267fd74698b0e21d90f2b482ef";

function WeatherApp() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);


    useEffect(() => {
        const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setRecentSearches(savedSearches);
    }, []);

  
    const fetchWeather = async (searchCity) => {
        const cityName = searchCity || city; 
        if (!cityName) {
            setError("Please enter a city name.");
            return;
        }

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            
            setError(null);

          
            updateRecentSearches(cityName);
        } catch (err) {
            setError("City not found. Please try again.");
            setWeather(null);
        }
    };

    const updateRecentSearches = (newCity) => {
        let updatedSearches = [newCity, ...recentSearches.filter(c => c !== newCity)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    };

    return (
        <div className="weather-app">
            <br/>
            <SearchBar city={city} setCity={setCity} fetchWeather={fetchWeather} />
            {error && <p className="error">{error}</p>}
            {weather && <WeatherDisplay weather={weather} />}

            {/* Display Recent Searches */}
            <RecentSearches recentSearches={recentSearches} fetchWeather={fetchWeather} />
        </div>
    );
}

function SearchBar({ city, setCity, fetchWeather }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={() => fetchWeather()}>Get Weather</button>
        </div>
    );
}

function WeatherDisplay({ weather }) {
    return (
        <div className="weather-container">
            <h2 className="city-name">{weather.name}, {weather.sys.country}</h2>
            <div className="weather-details">
                <p><strong>🌡 Temperature:</strong> {weather.main.temp}°C</p>
                <p><strong>💧 Humidity:</strong> {weather.main.humidity}%</p>
                <p><strong>💨 Wind Speed:</strong> {weather.wind.speed} m/s</p>
                <p><strong>☁ Condition:</strong> {weather.weather[0].description}</p>
            </div>
        </div>
    );
}

// Component to Show Recent Searches
function RecentSearches({ recentSearches, fetchWeather }) {
    return (
        <div className="recent-searches">
            <h3>Recent Searches</h3>
            {recentSearches.length > 0 ? (
                <ul>
                    {recentSearches.map((city, index) => (
                        <li key={index} onClick={() => fetchWeather(city)}>
                            {city}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recent searches</p>
            )}
        </div>
    );
}

export default WeatherApp;
