// API Key and OpenWeatherMap URL
const apiKey = 'abcc84dd4e8abe7add832ce81f3df419'; // Your OpenWeatherMap API key
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geoUrl = 'https://api.openweathermap.org/geo/1.0/direct'; // Geocoding URL for suggestions

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionsDiv = document.getElementById('suggestions');
const locationDiv = document.getElementById('location');
const tempDiv = document.getElementById('temperature');
const descriptionDiv = document.getElementById('description');
const humidityDiv = document.getElementById('humidity');
const windSpeedDiv = document.getElementById('wind-speed');
const errorMessage = document.getElementById('error-message');

// Fetch Weather Data
const fetchWeather = async (city) => {
    try {
        const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === '404') {
            showError('City not found.');
            return;
        }

        // Display Weather Information
        locationDiv.textContent = `Location: ${data.name}, ${data.sys.country}`;
        tempDiv.textContent = `Temperature: ${data.main.temp} °C`;
        descriptionDiv.textContent = `Weather: ${data.weather[0].description}`;
        humidityDiv.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeedDiv.textContent = `Wind Speed: ${data.wind.speed} m/s`;

        // Hide Error Message
        errorMessage.classList.add('hidden');
    } catch (error) {
        showError('Unable to fetch data. Please try again.');
    }
};

// Show Error Message
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
};

// Event Listener for Search Button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city.');
    }
});

// Modal functionality
const aboutModal = document.getElementById('about');
const closeModal = document.querySelector('.close');

document.querySelector('.footer a[href="#about"]').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    aboutModal.classList.remove('hidden'); // Show modal
});

closeModal.addEventListener('click', () => {
    aboutModal.classList.add('hidden'); // Hide modal
});

window.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
        aboutModal.classList.add('hidden'); // Hide modal if clicked outside
    }
});

// Dark/Light Mode Toggle
const toggle = document.getElementById('toggle');
const toggleLabel = document.getElementById('toggle-label');

toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');

    // Change the icon based on the mode
    if (document.body.classList.contains('dark')) {
        toggleLabel.textContent = '🌞'; // Sun icon for light mode
    } else {
        toggleLabel.textContent = '🌙'; // Moon icon for dark mode
    }
});

// Fetch city suggestions
const fetchCitySuggestions = async (input) => {
    const response = await fetch(`${geoUrl}?q=${input}&limit=5&appid=${apiKey}`);
    const cities = await response.json();
    displaySuggestions(cities);
};

// Display city suggestions
const displaySuggestions = (cities) => {
    suggestionsDiv.innerHTML = '';
    if (cities.length === 0) return;
    cities.forEach(city => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.textContent = `${city.name}, ${city.country}`;
        suggestionDiv.addEventListener('click', () => {
            cityInput.value = city.name;
            suggestionsDiv.innerHTML = ''; // Clear suggestions on select
            fetchWeather(city.name); // Fetch weather for selected city
        });
        suggestionsDiv.appendChild(suggestionDiv);
    });
};

// Event Listener for Input to fetch suggestions
cityInput.addEventListener('input', () => {
    const input = cityInput.value.trim();
    if (input.length > 1) {
        fetchCitySuggestions(input);
    } else {
        suggestionsDiv.innerHTML = ''; // Clear suggestions if input is small
    }
});