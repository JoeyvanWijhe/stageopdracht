<script lang="ts">
    import { getCurrentWeather, getForecast } from '../lib/api.ts';
    import '../styles/style.css';

    let city = 'Apeldoorn';
    let weather: {name:string; main: { temp: number }; weather: { description: string } []; sys: { sunrise: number; sunset: number }} | null = null;
    let forecast: {list: { dt_txt: string; main: { temp: number }; weather: { description: string } [] } [] } | null = null;

    async function fetchWeather() {
        const data = await getCurrentWeather(city);
        data.main.temp = Math.round(data.main.temp); //het afronden van de temperatuur.
        weather = await getCurrentWeather(city);
        forecast = await getForecast(city);
    }

    fetchWeather();
</script>

<main>
    <h1>Het weer en de voorspellingen</h1>
    <input bind:value={city} placeholder="Voer een stad in" />
    <button on:click={fetchWeather}>Zoek</button>

    {#if weather}
        <section>
            <h2>Het weer</h2>
            <p>{weather.name}: {weather.main.temp}°C, {weather.weather[0].description}</p>
            <p>Zonsopkomst: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Zonsondergang: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
        </section>
    {/if}

    {#if forecast}
        <section>
            <h2>Weervoorspelling</h2>
            <ul>
                {#each forecast.list.slice(0.5) as day}
                    <li>
                        <strong>{day.dt_txt}</strong>: {day.main.temp}°C, {day.weather[0].description}
                    </li>
                {/each}
            </ul>
        </section>    
    {/if}
</main>