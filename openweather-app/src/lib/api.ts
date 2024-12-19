import axios from 'axios';

const API_KEY = '5a533f44a3fa8949d5548a15905542be';
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