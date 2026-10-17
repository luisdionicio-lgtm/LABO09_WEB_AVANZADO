"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import MovieCard from "./MovieCard";
import MovieDetails from "./MovieDetails";
import { useMyList } from "./useMyList";
import { AnimatePresence, LayoutGroup, MotionConfig } from "framer-motion";
import CinemaHero from "./CinemaHero";
import CinemaBento from "./CinemaBento";
import type { Catalog, FilmKind, FilmSummary, SearchResult } from "./types";
import { Arrow } from "../components/Elements";

function SearchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>; }
function errorMessage(error: unknown) { return axios.isAxiosError(error) && typeof error.response?.data?.error === "string" ? error.response.data.error : "No se pudo completar la consulta. Inténtalo de nuevo."; }

function Shelf({ title, subtitle, films, open, ranked = false, landscape = false }: { title: string; subtitle: string; films: FilmSummary[]; open: (film: FilmSummary, token?:string) => void; ranked?: boolean; landscape?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });
  function move(direction: number) { const node = rail.current; node?.scrollBy({ left: direction * node.clientWidth * .8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }
  if (!films.length) return null;
  return <section className={`cinema-shelf${ranked ? " ranked-shelf" : ""}${landscape ? " landscape-shelf" : ""}`}><div className="shelf-heading flex items-center justify-between"><div><h2>{title}</h2><p>{subtitle}</p></div><div className="shelf-controls"><button disabled={position.start} onClick={() => move(-1)} aria-label={`Desplazar ${title} hacia atrás`} className="previous"><Arrow /></button><button disabled={position.end} onClick={() => move(1)} aria-label={`Desplazar ${title} hacia adelante`}><Arrow /></button></div></div><div className="film-rail" ref={rail} tabIndex={0} aria-label={title} onScroll={event => { const node = event.currentTarget; setPosition({ start: node.scrollLeft < 5, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 5 }); }}>{films.map((film,index) => <MovieCard key={`${film.kind}-${film.id}`} film={film} open={open} rank={ranked ? index+1 : undefined} landscape={landscape} />)}</div></section>;
}
export default function Cinema({ initialCatalog, initialError }: { initialCatalog: Catalog; initialError: string }) {
  const [filters, setFilters] = useState<{ query: string; kind: FilmKind | ""; page: number }>({ query: "", kind: "", page: 1 });
  const [search, setSearch] = useState<{ key: string; data?: SearchResult; error?: string } | null>(null);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<FilmSummary | null>(null);
  const [selectionToken,setSelectionToken] = useState("");
  const [selectedPlay,setSelectedPlay] = useState(false);
  const [genre,setGenre] = useState(0);
  const [showList,setShowList] = useState(false);
  const myList=useMyList();



  const searchInput = useRef<HTMLInputElement>(null);
  const query = filters.query.trim();
  const searchKey = `${query}|${filters.kind}|${filters.page}|${genre}|${retry}`;
  const selectedKey = selected ? `${selected.kind}-${selected.id}` : "";
  const activeSearch = query.length >= 2;
  const busy = activeSearch && search?.key !== searchKey;
  const currentSearch = search?.key === searchKey ? search : null;

  useEffect(() => {
    if (!activeSearch) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const { data } = await axios.get<SearchResult>("/api/cine", { params: { q: query, kind: filters.kind, page: filters.page, genre }, signal: controller.signal, timeout: 20000 });
        if (!controller.signal.aborted) setSearch({ key: searchKey, data });
      } catch (error) { if (!controller.signal.aborted) setSearch({ key: searchKey, error: errorMessage(error) }); }
    }, 450);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [activeSearch, query, filters.kind, filters.page, searchKey, genre]);

  function open(film: FilmSummary, token = "", play = false) { setSelected(film); setSelectionToken(token); setSelectedPlay(play); }
  function updateQuery(value: string) { setShowList(false); setFilters(current => ({ ...current, query: value, page: 1 })); }
  function browse(kind: FilmKind | "", focus = false) { setShowList(false); setFilters({ query: "", kind, page: 1 }); document.getElementById("catalogo")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); if (focus) searchInput.current?.focus({ preventScroll: true }); }
  const visible = (films:FilmSummary[]) => genre ? films.filter(item=>item.genreIds.includes(genre)) : films;


  return <MotionConfig reducedMotion="user"><LayoutGroup id="cinema">
    <CinemaHero films={initialCatalog.featured?.length ? initialCatalog.featured : initialCatalog.popular} open={open} browse={browse} kind={filters.kind} query={filters.query} onQuery={updateQuery} suggestions={currentSearch?.data?.films || []} genres={initialCatalog.genres || []} genre={genre} onGenre={value=>{setGenre(value);setFilters(current=>({...current,page:1}));}} showList={showList} onList={()=>{setShowList(value=>!value);setFilters({query:"",kind:"",page:1});document.getElementById("catalogo")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}} />
    <AnimatePresence>{selected && <MovieDetails key={selectedKey} selected={selected} token={selectionToken} play={selectedPlay} initial={initialCatalog.featured?.find(item=>item.id===selected.id && item.kind===selected.kind)} onClose={()=>setSelected(null)} onSelect={open}/>}</AnimatePresence>
    <div className="cinema-body mx-auto">
      <section className="cinema-search" id="catalogo" aria-labelledby="search-title"><div className="cinema-section-heading"><div><h2 id="search-title">Tu próxima gran historia.</h2><p>Una cartelera abierta a todas las formas de contar.</p></div><span className="cinema-mode">Búsqueda interactiva · CSR</span></div><div className="cinema-searchbar flex items-center"><SearchIcon /><label className="sr-only" htmlFor="cinema-query">Buscar películas o series</label><input id="cinema-query" ref={searchInput} value={filters.query} onChange={event => updateQuery(event.target.value)} maxLength={100} placeholder="Busca películas, series o un universo…" autoComplete="off" />{filters.query && <button aria-label="Limpiar búsqueda" onClick={() => { updateQuery(""); searchInput.current?.focus(); }}>×</button>}<span>TMDB</span></div><div className="cinema-search-options"><div className="cinema-tabs" aria-label="Tipo de contenido">{([["", "Todo"], ["movie", "Películas"], ["tv", "Series"]] as const).map(([kind, label]) => <button key={kind} aria-pressed={filters.kind === kind} onClick={() => setFilters(current => ({ ...current, kind, page: 1 }))}>{label}</button>)}</div><div className="cinema-suggestions"><span>Prueba con</span>{["Dune", "Interstellar", "Breaking Bad"].map(value => <button key={value} onClick={() => updateQuery(value)}>{value}</button>)}</div></div></section>
      {showList ? <section className="saved-cinema"><h2>Tu colección, a tu manera.</h2><p>Las historias que guardaste en este navegador.</p>{myList.films.length ? <div className="film-grid">{visible(myList.films).map(film=><MovieCard key={`${film.kind}-${film.id}`} film={film} open={open}/>)}</div> : <div className="cinema-empty"><h3>Una colección por empezar.</h3><p>Guarda películas y series desde la portada o su ficha.</p><button className="cinema-button secondary" onClick={()=>setShowList(false)}>Explorar la cartelera</button></div>}</section> : activeSearch ? <section className="cinema-results" aria-busy={busy} aria-label="Resultados de búsqueda"><div className="results-status" role="status">{busy ? `Buscando «${query}»…` : currentSearch?.error ? "La consulta no pudo completarse" : `Resultados para «${query}» · página ${filters.page}`}</div>{busy ? <div className="cinema-skeletons" aria-hidden="true">{[0,1,2,3,4,5].map(index => <div key={index} />)}</div> : currentSearch?.error ? <div className="cinema-notice" role="alert"><h3>No pudimos consultar el catálogo</h3><p>{currentSearch.error}</p><button className="cinema-button secondary" onClick={() => setRetry(value => value + 1)}>Reintentar búsqueda</button></div> : !currentSearch?.data?.films.length ? <div className="cinema-empty"><SearchIcon /><h3>No encontramos esa historia.</h3><p>Prueba con otro título o cambia el tipo de contenido.</p><button className="cinema-button secondary" onClick={() => setFilters({ query: "", kind: "", page: 1 })}>Volver al catálogo</button></div> : <><div className="film-grid">{currentSearch.data.films.map(film => <MovieCard key={`${film.kind}-${film.id}`} film={film} open={open} />)}</div>{currentSearch.data.pages > 1 && <div className="cinema-pagination"><button className="cinema-button secondary" disabled={filters.page === 1} onClick={() => setFilters(current => ({ ...current, page: current.page - 1 }))}>Anterior</button><span>{filters.page} / {currentSearch.data.pages}</span><button className="cinema-button secondary" disabled={filters.page >= currentSearch.data.pages} onClick={() => setFilters(current => ({ ...current, page: current.page + 1 }))}>Siguiente <Arrow /></button></div>}</>}</section> : <>{query.length === 1 && <p className="cinema-input-hint" role="status">Escribe al menos dos caracteres para buscar.</p>}{initialError && <div className="cinema-notice" role="alert"><h3>El catálogo no está disponible</h3><p>{initialError}</p><a href="/cine" className="cinema-button secondary">Volver a cargar</a></div>}{filters.kind !== "tv" && <Shelf title="Top 10 · Las películas del momento" subtitle="Por popularidad en TMDB · el orden de la conversación" films={visible(initialCatalog.popular).slice(0,10)} open={open} ranked />}{filters.kind !== "movie" && <Shelf title="Un episodio más. Otro mundo." subtitle="Series populares para descubrir, episodio a episodio" films={visible(initialCatalog.series)} open={open} landscape />}{filters.kind !== "tv" && <Shelf title="Imprescindibles en tu cartelera" subtitle="Películas mejor valoradas por la comunidad de TMDB" films={visible(initialCatalog.classics)} open={open} />}</>}
      {!activeSearch && !showList && <CinemaBento films={visible([...initialCatalog.classics.slice(0,3),...initialCatalog.series.slice(2,4)])} open={open}/>}
      <section className="cinema-method"><div><span>Servidor + navegador</span><h2>La experiencia es una.<br /><em>El renderizado, híbrido.</em></h2></div><div><h3>Un catálogo que llega preparado.</h3><p>Las películas y series populares se consultan en el servidor y llegan como HTML. La búsqueda usa el estado del navegador para actualizar resultados sin recargar; cada ficha se obtiene al seleccionarla.</p><Link href="/" className="cinema-text-link">Volver a los ejercicios del laboratorio <Arrow /></Link></div></section>
      <footer className="cinema-credits"><div><strong>Cuaderno cinema.</strong><p>Un espacio para descubrir. No ofrece reproducción de películas ni series.</p></div><div><a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="tmdb-credit"><Image src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" width={110} height={15} unoptimized /></a><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div></footer>
    </div>
  </LayoutGroup></MotionConfig>;
}
