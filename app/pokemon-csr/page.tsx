"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PokemonRecord from "../components/PokemonRecord";
import { Loading, PageHeading, Arrow } from "../components/Elements";
import type { Pokemon } from "../lib/pokemon";

export default function PokemonCSR() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState(false);
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchPokemon() {
      try {
        const randomId = Math.floor(Math.random() * 150) + 1;
        const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${randomId}`, { signal: controller.signal, timeout: 15000 });
        if (!controller.signal.aborted) setPokemon(response.data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    fetchPokemon();
    return () => controller.abort();
  }, [request]);

  function refresh() { setPokemon(null); setError(false); setRequest(value => value + 1); }
  const loading = !pokemon && !error;

  return <main className="page">
    <PageHeading title="Pokémon en el navegador" description="El contenido se completa después de cargar la página, mediante una consulta desde tu navegador." label="Ejercicio 1.1 · CSR" />
    <div className="record-toolbar"><span className="status-label"><i />Client-Side Rendering</span><button className="button" onClick={refresh} disabled={loading}>Otro Pokémon <Arrow /></button></div>
    <div aria-live="polite" aria-busy={loading}>{error ? <div role="alert" className="error-state"><h2>No pudimos consultar PokeAPI</h2><p>Comprueba tu conexión y vuelve a intentarlo.</p><button className="button" onClick={refresh}>Reintentar</button></div> : pokemon ? <PokemonRecord pokemon={pokemon} /> : <Loading>Consultando Pokémon en el navegador…</Loading>}</div>
    <aside className="method-note"><h2>Qué está ocurriendo</h2><p><code>useEffect</code> inicia la petición con Axios. El resultado actualiza el estado y React muestra la ficha. En Network puedes observar la consulta a PokeAPI.</p><Link href="/pokemon-ssr" prefetch={false} className="text-link">Comparar con SSR <Arrow /></Link></aside>
  </main>;
}
