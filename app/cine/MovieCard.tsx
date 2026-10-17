"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionTemplate, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Poster from "./Poster";
import RatingRing from "./RatingRing";
import type { Film, FilmSummary } from "./types";
import axios from "axios";

export default function MovieCard({ film, open, rank, landscape = false }: { film: FilmSummary; open:(film:FilmSummary,token?:string)=>void; rank?:number; landscape?:boolean }) {
  const token=useId();
  const [preview,setPreview]=useState(false);
  const [bounds,setBounds]=useState<{top:number;left:number;width:number}|null>(null);
  const [trailer,setTrailer]=useState("");
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const reduced=useReducedMotion();
  const rx=useSpring(0,{stiffness:150,damping:22});
  const ry=useSpring(0,{stiffness:150,damping:22});
  const transform=useMotionTemplate`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  useEffect(()=>{
    if(!preview || reduced)return;
    const controller=new AbortController();
    axios.get<Film>("/api/cine",{params:{id:film.id,kind:film.kind},signal:controller.signal}).then(({data})=>{if(!controller.signal.aborted)setTrailer(data.trailer);}).catch(()=>{});
    const cancel=()=>setPreview(false);
    window.addEventListener("scroll",cancel,true);window.addEventListener("resize",cancel);
    return()=>{controller.abort();window.removeEventListener("scroll",cancel,true);window.removeEventListener("resize",cancel);};
  },[preview,reduced,film.id,film.kind]);
  function leave(){if(timer.current)clearTimeout(timer.current);setPreview(false);rx.set(0);ry.set(0);}
  return <>
    <motion.button className={`film-card spatial-card group text-left${rank?" ranked-film":""}${landscape?" landscape-film":""}`} style={reduced?undefined:{transform}} onPointerEnter={event=>{if(event.pointerType!=="mouse" || reduced)return;const node=event.currentTarget;timer.current=setTimeout(()=>{const rect=node.getBoundingClientRect();const width=Math.min(365,window.innerWidth-32);setBounds({width,left:Math.max(16,Math.min(rect.left+rect.width/2-width/2,window.innerWidth-width-16)),top:Math.max(16,Math.min(rect.top+rect.height*.12,window.innerHeight-285))});setPreview(true);},400);}} onPointerLeave={leave} onPointerMove={event=>{if(reduced || event.pointerType!=="mouse")return;const rect=event.currentTarget.getBoundingClientRect();rx.set(-((event.clientY-rect.top)/rect.height-.5)*5);ry.set(((event.clientX-rect.left)/rect.width-.5)*5);}} onClick={()=>{leave();open(film,token);}} aria-label={`Ver ficha de ${film.title}`}>
      {rank && <span className="film-rank" aria-hidden="true">{rank}</span>}
      <motion.div layoutId={reduced?undefined:token} className="film-card-image" transition={{type:"spring",duration:.4,bounce:.1}}>{landscape && film.backdrop?<div className="landscape-art"><Image src={film.backdrop} alt={`Imagen de ${film.title}`} fill sizes="(max-width:640px) 75vw, 360px"/></div>:<Poster src={film.poster} title={film.title}/>}<span className="film-card-score">{film.votes?film.rating.toFixed(1):"—"}<small> / 10</small></span><span className="film-type-label">{film.kind==="tv"?"SERIE":"PELÍCULA"}</span></motion.div><h3>{film.title}</h3><p>{film.year||"Sin fecha"}<span>·</span>{film.kind==="tv"?"Serie":"Película"}</p>
    </motion.button>
    {typeof document!=="undefined" && createPortal(<AnimatePresence>{preview && bounds && <motion.div className="spatial-hover-preview" style={bounds} layoutId={token} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{type:"spring",duration:.35,bounce:.12}} aria-hidden="true"><div className="hover-preview-art">{film.backdrop && <Image src={film.backdrop} alt="" fill sizes="365px"/>}{trailer && <iframe title={`Vista previa muda de ${film.title}`} src={`https://www.youtube-nocookie.com/embed/${trailer}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer}&playsinline=1&rel=0`} allow="autoplay; encrypted-media" tabIndex={-1}/>}<span className="preview-sheen"/></div><motion.div className="hover-preview-meta" initial="hidden" animate="shown" variants={{shown:{transition:{staggerChildren:.04}}}}><motion.strong variants={{hidden:{opacity:0},shown:{opacity:1}}}>{film.title}</motion.strong><motion.div variants={{hidden:{opacity:0},shown:{opacity:1}}}><RatingRing value={film.rating} votes={film.votes}/><span>{film.genreNames.slice(0,2).join(" · ")||film.year}</span><span className="hover-detail-affordance">Ver ficha ↗</span></motion.div></motion.div></motion.div>}</AnimatePresence>,document.body)}
  </>;
}
