import axios from "axios";
import { connection } from "next/server";
import { Suspense } from "react";
import ClientWeatherWidget from "./ClientWeatherWidget";
import type { WeatherData } from "./types";
import { Loading, PageHeading, WeatherSymbol, weatherDescription } from "../components/Elements";

async function getLimaWeather(): Promise<WeatherData | null> {
  try {
    const { data } = await axios.get<WeatherData>("https://api.open-meteo.com/v1/forecast", { params: { latitude: -12.04, longitude: -77.03, current_weather: true }, timeout: 15000 });
    return data;
  } catch {
    return null;
  }
}

async function LimaWeather() {
  await connection();
  const data = await getLimaWeather();
  if (!data) return <div className="weather-error" role="alert"><p>El servicio del clima no está disponible temporalmente.</p><a className="button" href="/weather">Volver a consultar Lima</a></div>;
  const current = data.current_weather;
  return <div className="data-reveal"><div className="weather-reading"><div><p className="temperature">{current.temperature}<span>°C</span></p><p className="weather-description">{weatherDescription(current.weathercode)}</p></div><WeatherSymbol code={current.weathercode} /></div><div className="weather-detail"><span>Velocidad del viento</span><strong>{current.windspeed} km/h</strong></div></div>;
}
const comparison = [
  ["Obtención de datos", "En el servidor", "En el navegador"],
  ["Contenido inicial", "HTML con los datos del servidor", "Interfaz inicial y posterior consulta"],
  ["Interacción", "Puede combinarse con componentes cliente", "Actualización mediante estado y eventos"],
  ["Visibilidad de la consulta", "En el servidor de la aplicación", "En Network del navegador"],
];

export default function WeatherDashboard() {
  return <main className="page weather-page">
    <PageHeading title="El clima, en perspectiva" description="Una observación local y una ventana al mundo. Dos estrategias de renderizado en una misma página." label="Ejercicio 2.1 · Híbrido" />
    <div className="weather-grid">
      <section className="weather-panel lima-panel" aria-labelledby="lima-title"><div className="panel-top"><span className="status-label"><i />Consulta en el servidor</span><span className="mode-tag">SSR</span></div><div className="city-selection"><div><h2 id="lima-title">Lima</h2><p>Perú · 12.04° S, 77.03° O</p></div><span className="local-label">Observación local</span></div><Suspense fallback={<Loading>Consultando el clima de Lima…</Loading>}><LimaWeather /></Suspense><p className="panel-footnote">Los datos se obtienen en el servidor al visitar esta página.</p></section>
      <ClientWeatherWidget />
    </div>
    <section className="comparison" aria-labelledby="comparison-title"><div className="section-heading"><h2 id="comparison-title">La diferencia está en el origen</h2><span>SSR frente a CSR</span></div><div className="table-scroll"><table><thead><tr><th scope="col">Aspecto</th><th scope="col">Servidor · SSR</th><th scope="col">Navegador · CSR</th></tr></thead><tbody>{comparison.map(([label, ssr, csr]) => <tr key={label}><th scope="row">{label}</th><td>{ssr}</td><td>{csr}</td></tr>)}</tbody></table></div></section>
    <p className="source-note weather-source">Fuente: Open-Meteo. Temperatura en grados Celsius y viento en kilómetros por hora.</p>
  </main>;
}

