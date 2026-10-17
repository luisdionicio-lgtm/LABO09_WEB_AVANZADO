import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { CinemaError, getCatalog } from "../lib/tmdb";
import Cinema from "./Cinema";
import "./cine.css";

export const metadata: Metadata = { title: "Cine & series", description: "Encuentra tu próxima historia. Películas populares, series y fichas completas con TMDB." };
async function CatalogContent() {
  await connection();
  const result = await getCatalog().then(catalog => ({ catalog, error: "" })).catch(error => ({ catalog: { popular: [], series: [], classics: [] }, error: error instanceof CinemaError ? error.message : "El catálogo no está disponible temporalmente." }));
  return <Cinema initialCatalog={result.catalog} initialError={result.error} />;
}
export default function CinemaPage() {
  return <main className="cinema-page"><Suspense fallback={<div className="cinema-loading cinema-loading-catalog" role="status"><p>Preparando tu próxima historia…</p><div className="cinema-loading-hero" aria-hidden="true"/><div className="cinema-skeletons" aria-hidden="true">{[0,1,2,3,4,5].map(item=><div key={item}/>)}</div></div>}><CatalogContent /></Suspense></main>;
}
