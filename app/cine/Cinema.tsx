"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Poster from "./Poster";
import type { Catalog, Film, FilmKind, FilmSummary, SearchResult } from "./types";
import { Arrow } from "../components/Elements";

function SearchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>; }
function score(film: FilmSummary) { return film.votes ? film.rating.toFixed(1) : "Sin votos"; }
function money(value: number) { return value ? new Intl.NumberFormat("es-PE", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value) : "No disponible"; }
function errorMessage(error: unknown) { return axios.isAxiosError(error) && typeof error.response?.data?.error === "string" ? error.response.data.error : "No se pudo completar la consulta. Inténtalo de nuevo."; }

function FilmCard({ film, open }: { film: FilmSummary; open: (film: FilmSummary) => void }) {
  return <button className="film-card group text-left" onClick={() => open(film)} aria-label={`Ver ficha de ${film.title}`}><div className="film-card-image"><Poster src={film.poster} title={film.title} /><span className="film-card-action">Ver ficha <Arrow /></span>{film.votes > 0 && <span className="film-card-score">{score(film)}<small> / 10</small></span>}</div><h3>{film.title}</h3><p>{film.year || "Sin fecha"}<span>·</span>{film.kind === "tv" ? "Serie" : "Película"}</p></button>;
}
function Shelf({ title, subtitle, films, open }: { title: string; subtitle: string; films: FilmSummary[]; open: (film: FilmSummary) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  function move(direction: number) { const node = rail.current; node?.scrollBy({ left: direction * node.clientWidth * .8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }
  if (!films.length) return null;
  return <section className="cinema-shelf"><div className="shelf-heading flex items-center justify-between"><div><h2>{title}</h2><p>{subtitle}</p></div><div className="shelf-controls"><button onClick={() => move(-1)} aria-label={`Desplazar ${title} hacia atrás`} className="previous"><Arrow /></button><button onClick={() => move(1)} aria-label={`Desplazar ${title} hacia adelante`}><Arrow /></button></div></div><div className="film-rail" ref={rail} tabIndex={0} aria-label={title}>{films.map(film => <FilmCard key={`${film.kind}-${film.id}`} film={film} open={open} />)}</div></section>;
}

export default function Cinema({ initialCatalog, initialError }: { initialCatalog: Catalog; initialError: string }) {
  const [filters, setFilters] = useState<{ query: string; kind: FilmKind | ""; page: number }>({ query: "", kind: "", page: 1 });
  const [search, setSearch] = useState<{ key: string; data?: SearchResult; error?: string } | null>(null);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<FilmSummary | null>(null);
  const [detail, setDetail] = useState<{ key: string; data?: Film; error?: string } | null>(null);
  const [detailRetry, setDetailRetry] = useState(0);
  const detailCache = useRef(new Map<string, Film>());
  const detailPanel = useRef<HTMLElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const query = filters.query.trim();
  const searchKey = `${query}|${filters.kind}|${filters.page}|${retry}`;
  const selectedKey = selected ? `${selected.kind}-${selected.id}` : "";
  const activeSearch = query.length >= 2;
  const busy = activeSearch && search?.key !== searchKey;
  const currentSearch = search?.key === searchKey ? search : null;

  useEffect(() => {
    if (!activeSearch) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const { data } = await axios.get<SearchResult>("/api/cine", { params: { q: query, kind: filters.kind, page: filters.page }, signal: controller.signal, timeout: 20000 });
        if (!controller.signal.aborted) setSearch({ key: searchKey, data });
      } catch (error) { if (!controller.signal.aborted) setSearch({ key: searchKey, error: errorMessage(error) }); }
    }, 450);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [activeSearch, query, filters.kind, filters.page, searchKey]);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    async function load() {
      try {
        const cached = detailCache.current.get(selectedKey);
        if (cached) { setDetail({ key: selectedKey, data: cached }); return; }
        const { data } = await axios.get<Film>("/api/cine", { params: { id: selected!.id, kind: selected!.kind }, signal: controller.signal, timeout: 20000 });
        if (!controller.signal.aborted) { detailCache.current.set(selectedKey, data); setDetail({ key: selectedKey, data }); }
      } catch (error) { if (!controller.signal.aborted) setDetail({ key: selectedKey, error: errorMessage(error) }); }
    }
    load();
    detailPanel.current?.focus({ preventScroll: true });
    detailPanel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    return () => controller.abort();
  }, [selected, selectedKey, detailRetry]);

  function open(film: FilmSummary) { setSelected(film); setDetail(null); }
  function updateQuery(value: string) { setFilters(current => ({ ...current, query: value, page: 1 })); }
  const featured = initialCatalog.popular[0];
  const full = detail?.key === selectedKey ? detail.data : null;
  const detailError = detail?.key === selectedKey ? detail.error : null;

  return <>
    <div className="cinema-topline"><a href="/cine" className="cinema-wordmark">Cuaderno<span>cinema.</span></a><span>Películas. Series. Nuevas miradas.</span><a href="#catalogo" className="cinema-explore">Explorar catálogo <Arrow /></a></div>
    <section className="cinema-hero" aria-label="Película destacada">
      {featured?.backdrop && <Image src={featured.backdrop} alt="" fill priority className="cinema-backdrop" sizes="100vw" />}
      <div className="cinema-hero-shade" />
      <div className="cinema-hero-copy"><span className="cinema-featured-label">La selección de hoy <span /> Cine popular</span><h1>{featured?.title || "Tu próxima historia empieza aquí."}</h1><div className="cinema-hero-meta">{featured && <><span className="cinema-score">{score(featured)} <small>/ 10</small></span><span>{featured.year}</span><span>Película</span></>}</div><p>{featured?.overview || "Un espacio para descubrir películas y series, encontrar historias y conocer a quienes las hacen posibles."}</p><div className="cinema-hero-buttons">{featured && <button className="cinema-button primary" onClick={() => open(featured)}>Ver ficha completa <Arrow /></button>}<button className="cinema-button secondary" onClick={() => { document.getElementById("catalogo")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); searchInput.current?.focus({ preventScroll: true }); }}><SearchIcon /> Buscar una historia</button></div></div><div className="cinema-hero-bottom"><span>Una selección para mirar más allá.</span><span>Catálogo de TMDB</span></div>
    </section>
    <div className="cinema-body mx-auto">
      {selected && <section className="film-detail" ref={detailPanel} tabIndex={-1} aria-labelledby="detail-title"><div className="detail-heading"><span>La ficha de la historia</span><button onClick={() => { const origin = document.querySelector<HTMLButtonElement>(`button[aria-label="Ver ficha de ${CSS.escape(selected.title)}"]`); setSelected(null); origin?.focus({ preventScroll: true }); }} aria-label="Cerrar ficha">Cerrar <span aria-hidden="true">×</span></button></div><div className="detail-layout grid items-start"><Poster key={selected.poster} src={selected.poster} title={selected.title} /><div className="detail-copy min-w-0"><div className="detail-meta"><span>{selected.kind === "tv" ? "Serie" : "Película"}</span><span>{selected.year}</span></div><h2 id="detail-title">{selected.title}</h2>{detailError ? <div className="cinema-notice" role="alert"><p>{detailError}</p><button className="cinema-button secondary" onClick={() => { setDetail(null); setDetailRetry(value => value + 1); }}>Reintentar</button></div> : !full ? <div className="detail-loading" role="status"><span className="loading-line" /><p>Consultando sinopsis, reparto y detalles…</p></div> : <><p className="detail-tagline">{full.tagline}</p><div className="detail-genres">{full.genres.map(genre => <span key={genre}>{genre}</span>)}</div><p className="detail-overview">{full.overview}</p><dl className="detail-facts">{[
        ["Valoración TMDB", full.votes ? `${score(full)} / 10 · ${full.votes.toLocaleString("es-PE")} votos` : "Sin votos"],
        [full.kind === "tv" ? "Creación" : "Dirección", full.directors.join(", ") || "No disponible"],
        ["Estreno", full.released || "No disponible"], ["Duración", full.runtime ? `${full.runtime} min` : "No disponible"],
        ...(full.kind === "tv" ? [["Temporadas", String(full.seasons)], ["Episodios", String(full.episodes)]] : [["Presupuesto", money(full.budget)], ["Recaudación", money(full.revenue)]]),
        ["Idioma original", full.language.toUpperCase() || "No disponible"], ["País", full.countries.join(", ") || "No disponible"], ["Estado", ({ Released: "Estrenada", "Returning Series": "En emisión", Ended: "Finalizada", Canceled: "Cancelada", "In Production": "En producción", "Post Production": "En posproducción", Planned: "Planificada", Pilot: "Piloto", Rumored: "Por confirmar" } as Record<string, string>)[full.status] || full.status || "No disponible"], ["Producción", full.companies.join(", ") || "No disponible"],
      ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{full.cast.length > 0 && <div className="detail-cast"><h3>Reparto principal</h3><div>{full.cast.map((actor,index) => <p key={`${actor.name}-${index}`}><strong>{actor.name}</strong><span>{actor.character || ""}</span></p>)}</div></div>}<a className="cinema-text-link" href={`https://www.themoviedb.org/${full.kind}/${full.id}`} target="_blank" rel="noopener noreferrer">Ver en TMDB <Arrow /></a></>}</div></div></section>}
      <section className="cinema-search" id="catalogo" aria-labelledby="search-title"><div className="cinema-section-heading"><div><h2 id="search-title">Encuentra tu próxima historia.</h2><p>Explora el catálogo o busca ese título que tienes en mente.</p></div><span className="cinema-mode">Búsqueda interactiva · CSR</span></div><div className="cinema-searchbar flex items-center"><SearchIcon /><label className="sr-only" htmlFor="cinema-query">Buscar películas o series</label><input id="cinema-query" ref={searchInput} value={filters.query} onChange={event => updateQuery(event.target.value)} maxLength={100} placeholder="Busca películas, series o un universo…" autoComplete="off" />{filters.query && <button aria-label="Limpiar búsqueda" onClick={() => { updateQuery(""); searchInput.current?.focus(); }}>×</button>}<span>TMDB</span></div><div className="cinema-search-options"><div className="cinema-tabs" aria-label="Tipo de contenido">{([["", "Todo"], ["movie", "Películas"], ["tv", "Series"]] as const).map(([kind, label]) => <button key={kind} aria-pressed={filters.kind === kind} onClick={() => setFilters(current => ({ ...current, kind, page: 1 }))}>{label}</button>)}</div><div className="cinema-suggestions"><span>Prueba con</span>{["Dune", "Interstellar", "Breaking Bad"].map(value => <button key={value} onClick={() => updateQuery(value)}>{value}</button>)}</div></div></section>
      {activeSearch ? <section className="cinema-results" aria-busy={busy} aria-label="Resultados de búsqueda"><div className="results-status" role="status">{busy ? `Buscando «${query}»…` : currentSearch?.error ? "La consulta no pudo completarse" : `Resultados para «${query}» · página ${filters.page}`}</div>{busy ? <div className="cinema-skeletons" aria-hidden="true">{[0,1,2,3,4,5].map(index => <div key={index} />)}</div> : currentSearch?.error ? <div className="cinema-notice" role="alert"><h3>No pudimos consultar el catálogo</h3><p>{currentSearch.error}</p><button className="cinema-button secondary" onClick={() => setRetry(value => value + 1)}>Reintentar búsqueda</button></div> : !currentSearch?.data?.films.length ? <div className="cinema-empty"><SearchIcon /><h3>No encontramos esa historia.</h3><p>Prueba con otro título o cambia el tipo de contenido.</p><button className="cinema-button secondary" onClick={() => setFilters({ query: "", kind: "", page: 1 })}>Volver al catálogo</button></div> : <><div className="film-grid">{currentSearch.data.films.map(film => <FilmCard key={`${film.kind}-${film.id}`} film={film} open={open} />)}</div>{currentSearch.data.pages > 1 && <div className="cinema-pagination"><button className="cinema-button secondary" disabled={filters.page === 1} onClick={() => setFilters(current => ({ ...current, page: current.page - 1 }))}>Anterior</button><span>{filters.page} / {currentSearch.data.pages}</span><button className="cinema-button secondary" disabled={filters.page >= currentSearch.data.pages} onClick={() => setFilters(current => ({ ...current, page: current.page + 1 }))}>Siguiente <Arrow /></button></div>}</>}</section> : <>{query.length === 1 && <p className="cinema-input-hint" role="status">Escribe al menos dos caracteres para buscar.</p>}{initialError && <div className="cinema-notice" role="alert"><h3>El catálogo no está disponible</h3><p>{initialError}</p><a href="/cine" className="cinema-button secondary">Volver a cargar</a></div>}{filters.kind !== "tv" && <Shelf title="En el centro de la conversación" subtitle="Películas populares · selección obtenida en el servidor" films={initialCatalog.popular} open={open} />}{filters.kind !== "movie" && <Shelf title="Una historia no siempre termina" subtitle="Series populares para descubrir, episodio a episodio" films={initialCatalog.series} open={open} />}{filters.kind !== "tv" && <Shelf title="Historias que dejan huella" subtitle="Películas mejor valoradas por la comunidad de TMDB" films={initialCatalog.classics} open={open} />}</>}
      <section className="cinema-method"><div><span>Servidor + navegador</span><h2>La experiencia es una.<br /><em>El renderizado, híbrido.</em></h2></div><div><h3>Un catálogo que llega preparado.</h3><p>Las películas y series populares se consultan en el servidor y llegan como HTML. La búsqueda usa el estado del navegador para actualizar resultados sin recargar; cada ficha se obtiene al seleccionarla.</p><Link href="/" className="cinema-text-link">Volver a los ejercicios del laboratorio <Arrow /></Link></div></section>
      <footer className="cinema-credits"><div><strong>Cuaderno cinema.</strong><p>Un espacio para descubrir. No ofrece reproducción de películas ni series.</p></div><div><a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="tmdb-credit"><Image src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" width={110} height={15} unoptimized /></a><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div></footer>
    </div>
  </>;
}
