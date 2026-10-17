"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { WeatherData } from "./types";
import { WeatherSymbol, weatherDescription } from "../components/Elements";

const cities = {
  Tokyo: { label: "Tokio", country: "Japón", lat: 35.6762, lon: 139.6503 },
  "New York": { label: "Nueva York", country: "Estados Unidos", lat: 40.7128, lon: -74.0060 },
  London: { label: "Londres", country: "Reino Unido", lat: 51.5074, lon: -0.1278 },
  Sydney: { label: "Sídney", country: "Australia", lat: -33.8688, lon: 151.2093 },
};
type City = keyof typeof cities;

export default function ClientWeatherWidget() {
  const [city, setCity] = useState<City>("Tokyo");
  const [result, setResult] = useState<{ city: City; data: WeatherData } | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const loading = !error && result?.city !== city;

  useEffect(() => {
    const controller = new AbortController();
    async function fetchWeather() {
      const coords = cities[city];
      try {
        const { data } = await axios.get<WeatherData>("https://api.open-meteo.com/v1/forecast", { params: { latitude: coords.lat, longitude: coords.lon, current_weather: true }, signal: controller.signal, timeout: 15000 });
        if (!controller.signal.aborted) setResult({ city, data });
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    fetchWeather();
    return () => controller.abort();
  }, [city, retry]);

  const current = result?.data.current_weather;
  return <section className="weather-panel world-panel" aria-labelledby="world-title">
    <div className="panel-top"><span className="status-label"><i />Consulta en el navegador</span><span className="mode-tag">CSR</span></div>
    <div className="city-selection"><div><h2 id="world-title">El mundo</h2><p>{cities[city].country}</p></div><div className="select-field"><label htmlFor="city">Seleccionar ciudad</label><select id="city" value={city} onChange={e => { setError(false); setCity(e.target.value as City); }}>{Object.entries(cities).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></div></div>
    <div className="city-shortcuts" aria-label="Ciudades disponibles">{Object.entries(cities).map(([key, value]) => <button key={key} aria-pressed={city === key} onClick={() => { setError(false); setCity(key as City); }}>{value.label}</button>)}</div>
    <div className="world-reading" aria-live="polite" aria-busy={loading}>
      {error ? <div role="alert" className="weather-error"><p>No se pudo consultar esta ciudad.</p><button className="button" onClick={() => { setError(false); setResult(null); setRetry(value => value + 1); }}>Reintentar</button></div> : loading ? <div role="status" className="weather-loading"><span className="loading-line" /><p>Consultando {cities[city].label}…</p></div> : current ? <div className="weather-reading data-reveal" key={city}><div><p className="temperature">{current.temperature}<span>°C</span></p><p className="weather-description">{weatherDescription(current.weathercode)}</p></div><WeatherSymbol code={current.weathercode} /></div> : null}
    </div>
    <div className="weather-detail"><span>Velocidad del viento</span><strong>{!loading && !error && current ? `${current.windspeed} km/h` : "—"}</strong></div>
    <p className="panel-footnote">Cambia de ciudad. Los datos se actualizan sin recargar la página.</p>
  </section>;
}
