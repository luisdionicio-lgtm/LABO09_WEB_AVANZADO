"use client";
import type { FilmSummary } from "./types";
import MovieCard from "./MovieCard";
export default function CinemaBento({ films, open }: { films:FilmSummary[]; open:(film:FilmSummary,token?:string)=>void }) {
  if(!films.length) return null;
  return <section className="cinema-bento"><div className="shelf-heading"><div><h2>Sal de lo que ya conoces.</h2><p>Recomendaciones destacadas de nuestra selección TMDB.</p></div><span className="bento-note">OTRAS MIRADAS</span></div><div className="bento-grid">{films.slice(0,5).map(film=><MovieCard key={`${film.kind}-${film.id}`} film={film} open={open} landscape/>)}</div></section>;
}
