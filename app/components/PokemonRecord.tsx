import Image from "next/image";
import type { Pokemon } from "@/app/lib/pokemon";

const typeNames: Record<string, string> = { normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico", grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho", rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro", steel: "Acero", fairy: "Hada" };

export default function PokemonRecord({ pokemon }: { pokemon: Pokemon }) {
  const artwork = pokemon.sprites.other?.["official-artwork"]?.front_default;
  const image = artwork || pokemon.sprites.front_default;
  return <article className="pokemon-record data-reveal">
    <div className="specimen"><span className="specimen-id">N.º {String(pokemon.id).padStart(3, "0")}</span>
      <span className="specimen-watermark" aria-hidden="true">{String(pokemon.id).padStart(3, "0")}</span>
      {image ? <Image src={image} alt={pokemon.name} width={380} height={380} unoptimized className={`pokemon-image${artwork ? " official-artwork" : ""}`} /> : <p>Imagen no disponible</p>}
      <span className="specimen-caption">Registro de la región de Kanto</span>
    </div>
    <div className="specimen-details"><span className="record-label">Ficha de Pokémon</span><h2 className="pokemon-name">{pokemon.name}</h2><div className="type-list">{pokemon.types.map(({ type }) => <span key={type.name}>{typeNames[type.name] ?? type.name}</span>)}</div>
      <dl className="measurements"><div><dt>Altura</dt><dd>{pokemon.height / 10}<small> m</small></dd></div><div><dt>Peso</dt><dd>{pokemon.weight / 10}<small> kg</small></dd></div></dl>
      <p className="source-note">Información consultada en PokeAPI.</p>
    </div>
  </article>;
}
