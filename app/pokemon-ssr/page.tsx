import axios from "axios";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import PokemonRecord from "../components/PokemonRecord";
import { Loading, PageHeading, Arrow } from "../components/Elements";
import type { Pokemon } from "../lib/pokemon";

async function getPokemon() {
  const randomId = Math.floor(Math.random() * 150) + 1;
  const { data } = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${randomId}`, { timeout: 15000 });
  return data;
}

async function PokemonSSRContent() {
  await connection();
  const pokemon = await getPokemon();
  return <PokemonRecord pokemon={pokemon} />;
}

export default function PokemonSSR() {
  return <main className="page">
    <PageHeading title="Pokémon desde el servidor" description="El servidor consulta los datos y entrega la ficha renderizada como parte de la respuesta HTML." label="Ejercicio 1.1 · SSR" />
    <div className="record-toolbar"><span className="status-label"><i />Server-Side Rendering</span><a className="button" href="/pokemon-ssr">Otro Pokémon <Arrow /></a></div>
    <Suspense fallback={<Loading>Consultando Pokémon en el servidor…</Loading>}><PokemonSSRContent /></Suspense>
    <aside className="method-note"><h2>Qué está ocurriendo</h2><p>Un componente asíncrono obtiene los datos con Axios en el servidor. La ficha llega como HTML; la petición a PokeAPI no se ejecuta en tu navegador.</p><Link href="/pokemon-csr" prefetch={false} className="text-link">Comparar con CSR <Arrow /></Link></aside>
  </main>;
}
