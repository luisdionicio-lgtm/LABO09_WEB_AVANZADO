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
  return <main className="cinema-page"><Suspense fallback={<div className="cinema-loading" role="status"><span className="loading-line" /><p>Preparando tu próxima historia…</p></div>}><CatalogContent /></Suspense></main>;
}
