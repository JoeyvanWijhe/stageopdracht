import axios from 'axios';

// VITE_prefix wordt hier gebruikt voor de compatibiliteit met Vite
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

export async function getCurrentWeather(city: string) {
    const response = await axios.get(`${BASE_URL}weather`,
        {
        params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
        },
        
    });
    return response.data;
}

export async function getForecast(city: string) {
    const response = await axios.get(`${BASE_URL}forecast`, {
        params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
        },
    });
    return response.data;
}