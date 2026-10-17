"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FilmKind, FilmSummary } from "./types";
import { Arrow } from "../components/Elements";

export default function CinemaHero({ films, open, browse, kind }: { films: FilmSummary[]; open: (film: FilmSummary) => void; browse: (kind: FilmKind | "", focus?: boolean) => void; kind: FilmKind | "" }) {
  const [index, setIndex] = useState(0);
  const picks = films.slice(0, 4);
  const film = picks[index];
  return <>
    <div className="cinema-topline"><Link href="/cine" className="cinema-wordmark"><span className="cinema-brand-icon" aria-hidden="true"><i /><i /><i /></span>cuaderno<span>cinema.</span></Link><nav className="cinema-local-nav" aria-label="Catálogo de cine">{([["", "Descubrir"], ["movie", "Películas"], ["tv", "Series"]] as const).map(([value, label]) => <button key={value} aria-pressed={kind === value} onClick={() => browse(value)}>{label}</button>)}</nav><button className="cinema-nav-search" onClick={() => browse(kind,true)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>Buscar</button></div>
    <section className="cinema-hero" aria-label="Cartelera destacada">
      {film?.backdrop && <Image key={film.id} src={film.backdrop} alt="" fill priority={index === 0} className="cinema-backdrop" sizes="100vw" />}
      <div className="cinema-hero-shade" />
      <div className="cinema-hero-copy"><div className="cinema-featured-label"><span className="featured-emblem">C</span><span>EN NUESTRA CARTELERA</span></div><h1>{film?.title || "Cada historia merece su gran pantalla."}</h1><div className="cinema-hero-meta">{film && <><span className="cinema-score"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 1-5 5 1.2 7-6.2-3.3L5.8 22 7 14.5 2 9.5l7-1Z" /></svg>{film.votes ? film.rating.toFixed(1) : "Sin votos"}<small>TMDB</small></span><span>{film.year}</span><span className="hero-kind">PELÍCULA</span></>}</div><p>{film?.overview || "Películas que se quedan contigo. Series que abren nuevos mundos. Descubre qué historia vas a elegir hoy."}</p><div className="cinema-hero-buttons">{film && <button className="cinema-button primary" onClick={() => open(film)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v1" /></svg>Explorar película</button>}<button className="cinema-button secondary" onClick={() => browse("",true)}>Ver la cartelera <Arrow /></button></div></div>
      {picks.length > 1 && <div className="featured-selector"><div className="featured-selector-heading"><span>En el foco</span><span>0{index+1}<i> / 0{picks.length}</i></span></div><div className="featured-picks">{picks.map((pick,pickIndex) => <button key={pick.id} onClick={() => setIndex(pickIndex)} aria-label={`Destacar ${pick.title}`} aria-pressed={index === pickIndex}><span className="featured-thumb">{pick.backdrop ? <Image src={pick.backdrop} alt="" fill sizes="130px" /> : <span>{pickIndex+1}</span>}<span className="featured-thumb-scrim" /></span><strong>{pick.title}</strong><span className="featured-pick-line" /></button>)}</div></div>}
      <div className="cinema-hero-bottom"><span><i /> Una cartelera para descubrir, no para conformarse.</span><span>PELÍCULAS & SERIES · TMDB</span></div>
    </section>
  </>;
}
