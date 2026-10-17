import Link from "next/link";
import { Arrow } from "./components/Elements";

export default function Home() {
  return <main className="page home-page">
    <section className="home-intro"><h1>Una página.<br />Dos formas de<br /><em>construirla.</em></h1><div className="home-summary"><p>El mismo contenido puede empezar en el servidor o en tu navegador. Aquí puedes observar la diferencia.</p><Link className="button button-green" href="/pokemon-csr" prefetch={false}>Explorar los ejercicios <Arrow /></Link><span className="home-caption">Pokémon, clima y renderizado con Next.js.</span></div></section>
    <section className="exercise-section" aria-labelledby="exercise-title"><div className="section-heading"><h2 id="exercise-title">Los ejercicios</h2><span>Conceptos y aplicación</span></div>
      {[
        ["1.1", "/pokemon-csr", "Pokémon en el navegador", "La página aparece primero; el navegador consulta los datos después.", "CSR"],
        ["1.1", "/pokemon-ssr", "Pokémon desde el servidor", "El servidor obtiene el Pokémon y entrega su contenido como HTML.", "SSR"],
        ["2.1", "/weather", "Un clima, dos enfoques", "Lima desde el servidor. Cuatro ciudades para consultar sin recargar.", "Híbrido"],
      ].map(([number, href, title, description, mode]) => <Link className="exercise-row" href={href} key={href} prefetch={false}><span className="exercise-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="mode-tag">{mode}</span><Arrow /></Link>)}
    </section>
  </main>;
}
