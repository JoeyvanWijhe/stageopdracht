<script lang="ts">
    import { getCurrentWeather, getForecast } from '../lib/api.ts';
    import '../styles/style.css';

    // Variabelen om stad, huidig weer, en voorspelling op te slaan
    let city = 'Apeldoorn';
    let weather: { name: string; main: { temp: number }; weather: { description: string }[]; sys: { sunrise: number; sunset: number }; timezone: number } | null = null;
    let forecast: { date: string; temps: string }[] = [];

    // Functie om het weer en de voorspelling op te halen
    async function fetchWeather() {
        const currentWeather = await getCurrentWeather(city);
        currentWeather.main.temp = Math.round(currentWeather.main.temp); // Rond de temperatuur af
        weather = currentWeather;

        const weatherForecast = await getForecast(city);
        forecast = processForecast(weatherForecast.list);
    }

    // Verwerkt de 5-daagse weersvoorspelling en haalt de hoogste en laagste temperaturen per dag
    function processForecast(data: any[]) {
        const dailyData: { [key: string]: { temps: number[] } } = {};

        data.forEach((entry) => {
            const date = entry.dt_txt.split(' ')[0]; // Extracteer de datum (YYYY-MM-DD)
            const temp = Math.round(entry.main.temp);

            if (!dailyData[date]) {
                dailyData[date] = { temps: [] };
            }
            dailyData[date].temps.push(temp);
        });

        // Bepaal de hoogste en laagste temperaturen en formatteer ze
        return Object.entries(dailyData)
            .map(([date, { temps }]) => {
                const high = Math.max(...temps);
                const low = Math.min(...temps);
                return {
                    date,
                    temps: `${high}°C / ${low}°C`, // Combineer hoge/lage temperaturen
                };
            })
            .slice(0, 7); // Beperk tot de aankomende 7 dagen
    }

    // Converteer tijd naar de lokale tijd van de stad
    function convertToLocalTime(unixTime: number, timezone: number) {
        const date = new Date((unixTime + timezone) * 1000); // Pas tijdzonecorrectie toe
        return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', hour12: false }); // 24-uurs notatie
    }

    fetchWeather();
</script>

<main>
    <header>
        <h1>Het Weer</h1>
        <div class="search">
            <input bind:value={city} placeholder="Voer een stad in" />
            <button on:click={fetchWeather}>Zoek</button>
        </div>
    </header>

    <section class="current-weather">
        {#if weather}
            <div class="weather-card">
                <h2>{weather.name}</h2>
                <p>{weather.main.temp}°C</p>
                <p>{weather.weather[0].description}</p>
                <p>Zonsopkomst: {convertToLocalTime(weather.sys.sunrise, weather.timezone)}</p>
                <p>Zonsondergang: {convertToLocalTime(weather.sys.sunset, weather.timezone)}</p>
            </div>
        {/if}
    </section>

    <section class="forecast">
        {#if forecast.length > 0}
            <h2>Voorspelling (7 dagen)</h2>
            <div class="forecast-grid">
                {#each forecast as day}
                    <div class="forecast-card">
                        <strong>{day.date}</strong>
                        <p>{day.temps}</p>
                    </div>
                {/each}
            </div>
        {/if}
    </section>
</main>