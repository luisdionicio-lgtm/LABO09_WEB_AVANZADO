"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Arrow } from "./Elements";

const collection = [
  { id: 1, name: "Bulbasaur", type: "Planta · Veneno", color: "fern", title: "Todo empieza\ncon una elección.", description: "Tres Pokémon iniciales. Dos formas de renderizar. Una nueva manera de observar lo que ocurre detrás de una página." },
  { id: 4, name: "Charmander", type: "Fuego", color: "ember", title: "El contenido\ncobra vida.", description: "Primero la interfaz. Después los datos. Descubre cómo el navegador completa una página sin tener que recargarla." },
  { id: 7, name: "Squirtle", type: "Agua", color: "tide", title: "Otra perspectiva.\nEl mismo mundo.", description: "El servidor también puede preparar el contenido. Compara ambos enfoques y encuentra el origen de cada consulta." },
];

export default function Showcase() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const target = track.current;
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollTo({ left: index * target.clientWidth, behavior: reduced ? "instant" : "smooth" });
  }
  return <section className="showcase" aria-roledescription="carrusel" aria-label="Los Pokémon iniciales de Kanto">
    <div className="showcase-track" ref={track} tabIndex={0} aria-label="Desliza para explorar los Pokémon" onScroll={e => { const node = e.currentTarget; setActive(Math.round(node.scrollLeft / node.clientWidth)); }} onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); go(Math.min(2, Math.max(0, active + (e.key === "ArrowRight" ? 1 : -1)))); } }}>
      {collection.map((pokemon, index) => <article key={pokemon.id} className={`showcase-slide ${pokemon.color}`} aria-roledescription="diapositiva" aria-label={`${index + 1} de 3: ${pokemon.name}`} inert={active !== index}>
        <div className="showcase-copy"><h1>{pokemon.title.split("\n").map((line, i) => <span key={line}>{i === 1 ? <em>{line}</em> : line}</span>)}</h1><p>{pokemon.description}</p><Link href={index === 2 ? "/pokemon-ssr" : "/pokemon-csr"} prefetch={false} className="button showcase-cta">{index === 2 ? "Explorar en el servidor" : "Explorar en el navegador"}<Arrow /></Link></div>
        <div className="showcase-art"><span className="art-number" aria-hidden="true">{String(pokemon.id).padStart(3,"0")}</span><div className="art-orbit" aria-hidden="true" /><Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} alt={`Ilustración oficial de ${pokemon.name}`} width={475} height={475} unoptimized priority={index === 0} className="showcase-pokemon" /><div className="art-caption"><strong>{pokemon.name}</strong><span>{pokemon.type}</span></div></div>
      </article>)}
    </div>
    <div className="showcase-controls"><div className="collection-caption"><span className="collection-dot" />Colección Kanto<span className="collection-separator">/</span><span>Pokémon iniciales</span></div><div className="carousel-navigation"><span className="carousel-count" aria-live="polite">0{active + 1}<span> / 03</span></span><div className="carousel-dots">{collection.map((item,index) => <button key={item.id} className={index === active ? "active" : ""} aria-label={`Ver ${item.name}`} aria-pressed={index === active} onClick={() => go(index)} />)}</div><button className="circle-button previous" aria-label="Pokémon anterior" disabled={active === 0} onClick={() => go(active - 1)}><Arrow /></button><button className="circle-button" aria-label="Pokémon siguiente" disabled={active === 2} onClick={() => go(active + 1)}><Arrow /></button></div></div>
  </section>;
}
