"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import type { Film, FilmSummary } from "./types";
import RatingRing from "./RatingRing";
import { useMyList } from "./useMyList";

export default function MovieDetails({ selected, token, onClose, onSelect, play = false, initial }: { selected: FilmSummary; token: string; onClose: () => void; onSelect: (film:FilmSummary,token?:string) => void; play?:boolean; initial?:Film }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [data,setData] = useState<Film | null>(initial || null);
  const [error,setError] = useState("");
  const [retry,setRetry] = useState(0);
  const [watch,setWatch] = useState(play);
  const reduced = useReducedMotion();
  const list = useMyList();
  useEffect(() => {
    const node=dialog.current;
    const previous=document.activeElement as HTMLElement | null;
    node?.showModal();
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return () => { node?.close(); document.body.style.overflow=previousOverflow; previous?.focus({preventScroll:true}); };
  },[]);
  useEffect(() => {
    if(initial && !retry) return;
    const controller=new AbortController();
    async function load() { try { const {data:film}=await axios.get<Film>("/api/cine",{params:{id:selected.id,kind:selected.kind},signal:controller.signal,timeout:20000}); if(!controller.signal.aborted) setData(film); } catch(error) { if(!controller.signal.aborted) setError(axios.isAxiosError(error) ? error.response?.data?.error || "No se pudo cargar la ficha." : "No se pudo cargar la ficha."); } }
    load(); return () => controller.abort();
  },[selected.id,selected.kind,retry,initial]);
  const trailer=data?.trailer;
  return <dialog ref={dialog} className="spatial-dialog" aria-labelledby="spatial-detail-title" onCancel={event => {event.preventDefault();onClose();}} onClick={event => { if(event.target===event.currentTarget) { const rect=event.currentTarget.getBoundingClientRect(); if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) onClose(); } }}>
    <motion.div className="spatial-detail-shell" initial={{opacity:0,transform:reduced ? "none" : "translateY(12px)"}} animate={{opacity:1,transform:"translateY(0px)"}} exit={{opacity:0,transform:reduced ? "none" : "translateY(8px)"}} transition={{duration:.22,ease:[.23,1,.32,1]}}>
      <button className="spatial-close" onClick={onClose} aria-label="Cerrar ficha">×</button>
      <motion.div layoutId={reduced || !token ? undefined : token} className="spatial-detail-art" transition={{type:"spring",duration:.45,bounce:.12}}>{selected.backdrop || selected.poster ? <Image src={selected.backdrop || selected.poster} alt={selected.title} fill sizes="(max-width:700px) 100vw, 1100px" priority /> : <span /> }<div className="spatial-detail-fade" />{watch && trailer && <iframe title={`Tráiler de ${selected.title}`} src={`https://www.youtube-nocookie.com/embed/${trailer}?autoplay=1&rel=0&playsinline=1`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />}</motion.div>
      <div className="spatial-detail-copy"><div className="detail-meta"><span>{selected.kind==="tv" ? "Serie" : "Película"}</span><span>{selected.year}</span></div><h2 id="spatial-detail-title">{selected.title}</h2><div className="spatial-detail-actions"><RatingRing value={selected.rating} votes={selected.votes} /><button className="cinema-button primary" disabled={!trailer} onClick={() => setWatch(value=>!value)}>{trailer ? watch ? "Cerrar tráiler" : "Ver tráiler" : data ? "Tráiler no disponible" : "Cargando tráiler…"}</button><motion.button className="cinema-button secondary" whileTap={reduced ? undefined : {scale:.96}} onClick={()=>list.toggle(selected)} aria-pressed={list.has(selected)}>{list.has(selected)?"✓ En mi lista":"+ Mi lista"}</motion.button></div>
      {error ? <div className="cinema-notice" role="alert"><p>{error}</p><button className="cinema-button secondary" onClick={()=>{setError("");setRetry(value=>value+1);}}>Reintentar</button></div> : !data ? <div className="detail-skeleton" role="status" aria-label="Cargando ficha"><span/><span/><span/></div> : <>
        <div className="detail-genres">{data.genres.map(genre=><span key={genre}>{genre}</span>)}</div><p className="detail-tagline">{data.tagline}</p><p className="detail-overview">{data.overview}</p>
        <dl className="detail-facts">{[["Dirección / creación",data.directors.join(", ") || "No disponible"],["Duración",data.runtime?`${data.runtime} min`:"No disponible"],["Estreno",data.released || "No disponible"],["Valoraciones",`${data.votes.toLocaleString("es-PE")} votos`],["Idioma original",data.language.toUpperCase()],["País",data.countries.join(", ") || "No disponible"],["Producción",data.companies.join(", ") || "No disponible"],["Título original",data.originalTitle],...(data.kind==="tv"?[["Temporadas",String(data.seasons)],["Episodios",String(data.episodes)]]:[["Presupuesto",data.budget?new Intl.NumberFormat("es-PE",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(data.budget):"No disponible"],["Recaudación",data.revenue?new Intl.NumberFormat("es-PE",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(data.revenue):"No disponible"]])].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {data.cast.length>0 && <section className="spatial-cast"><h3>Las personas detrás de la historia</h3><div>{data.cast.map((actor,index)=><article key={`${actor.name}-${index}`}><div>{data.castPhotos[index] && <Image src={data.castPhotos[index]} alt={actor.name} fill sizes="90px" />}</div><strong>{actor.name}</strong><span>{actor.character}</span></article>)}</div></section>}
        {data.similar.length>0 && <section className="similar-films"><h3>Si esta historia te llama…</h3><div>{data.similar.map(film=><button key={film.id} onClick={()=>onSelect(film)}><span>{film.backdrop && <Image src={film.backdrop} alt="" fill sizes="220px" />}</span><strong>{film.title}</strong></button>)}</div></section>}
        <a href={`https://www.themoviedb.org/${selected.kind}/${selected.id}`} target="_blank" rel="noopener noreferrer" className="cinema-text-link">Ficha original en TMDB ↗</a>
      </> }</div>
    </motion.div>
  </dialog>;
}
