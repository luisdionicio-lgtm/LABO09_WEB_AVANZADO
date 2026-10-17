import Link from "next/link";
import { Arrow } from "./components/Elements";
import Showcase from "./components/Showcase";
import RenderJourney from "./components/RenderJourney";
import Reveal from "./components/Reveal";

export default function Home() {
  return <main className="page home-page immersive-home">
    <Showcase />
    <div className="edition-line"><span>Un cuaderno de exploración digital</span><span>Next.js · Laboratorio 09</span><a href="#ejercicios" className="edition-scroll">Descubrir los ejercicios <span aria-hidden="true">↓</span></a></div>
    <Reveal><RenderJourney /></Reveal>
    <Reveal><section className="exercise-section" id="ejercicios" aria-labelledby="exercise-title"><div className="section-heading"><h2 id="exercise-title">De la idea a la experiencia.</h2><span>Ejercicios y tarea integradora</span></div>
      {[
        ["1.1", "/pokemon-csr", "Pokémon en el navegador", "La página aparece primero; el navegador consulta los datos después.", "CSR"],
        ["1.1", "/pokemon-ssr", "Pokémon desde el servidor", "El servidor obtiene el Pokémon y entrega su contenido como HTML.", "SSR"],
        ["2.1", "/weather", "Un clima, dos enfoques", "Lima desde el servidor. Cuatro ciudades para consultar sin recargar.", "Híbrido"],
        ["Tarea", "/cine", "Cuaderno cinema", "Películas y series: catálogo SSR, búsqueda y fichas sin recargar.", "TMDB"],
      ].map(([number, href, title, description, mode]) => <Link className="exercise-row" href={href} key={href} prefetch={false}><span className="exercise-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="mode-tag">{mode}</span><Arrow /></Link>)}
    </section></Reveal>
    <Reveal><section className="climate-invitation"><div><h2>De Kanto<br /><em>al resto del mundo.</em></h2><p>Consulta el clima de Lima y explora Tokio, Nueva York, Londres y Sídney en un dashboard híbrido.</p><Link href="/weather" className="button button-green" prefetch={false}>Abrir el observatorio <Arrow /></Link></div><div className="climate-type" aria-hidden="true"><span>LIM</span><span>TYO</span><span>LON</span><span>NYC</span><span>SYD</span></div></section></Reveal>
  </main>;
}
