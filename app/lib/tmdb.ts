import "server-only";
import axios from "axios";
import type { Catalog, Film, FilmKind, FilmSummary, SearchResult } from "../cine/types";

interface TmdbTitle {
  id: number; media_type?: string; title?: string; name?: string; original_title?: string; original_name?: string;
  release_date?: string; first_air_date?: string; poster_path?: string; backdrop_path?: string; overview?: string;
  vote_average?: number; vote_count?: number; adult?: boolean;
}
interface TmdbList { results: TmdbTitle[]; total_results: number; total_pages: number; }
interface TmdbDetail extends TmdbTitle {
  genres?: { name: string }[]; runtime?: number; episode_run_time?: number[]; number_of_seasons?: number; number_of_episodes?: number;
  status?: string; tagline?: string; original_language?: string; production_countries?: { name: string }[];
  production_companies?: { name: string }[]; created_by?: { name: string }[]; budget?: number; revenue?: number; homepage?: string;
  credits?: { crew: { name: string; job: string }[]; cast: { name: string; character: string }[] };
}
export class CinemaError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
const cache = new Map<string, { value: unknown; expires: number }>();
async function request<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = process.env.TMDB_API_KEY?.trim();
  if (!key) throw new CinemaError("El catálogo necesita una clave de TMDB configurada en el servidor.", 503);
  const cacheKey = path + JSON.stringify(params);
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value as T;
  try {
    const { data } = await axios.get<T>(`https://api.themoviedb.org/3/${path}`, { params: { api_key: key, language: "es-ES", ...params }, timeout: 15000 });
    if (cache.size >= 128) cache.delete(cache.keys().next().value!);
    cache.set(cacheKey, { value: data, expires: Date.now() + 900000 });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new CinemaError("TMDB no acepta la clave configurada en el servidor.", 503);
      if (error.response?.status === 404) throw new CinemaError("No encontramos la ficha de este título.", 404);
      if (error.response?.status === 429) throw new CinemaError("Hay demasiadas consultas. Espera unos segundos e inténtalo de nuevo.", 429);
    }
    throw new CinemaError("No pudimos conectar con el catálogo. Inténtalo de nuevo.", 502);
  }
}
function summary(item: TmdbTitle, kind: FilmKind): FilmSummary {
  return { id: item.id, kind, title: item.title || item.name || "Sin título", originalTitle: item.original_title || item.original_name || "", year: (item.release_date || item.first_air_date || "").slice(0, 4), poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "", backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "", overview: item.overview || "Sin sinopsis disponible en español.", rating: item.vote_average || 0, votes: item.vote_count || 0 };
}
export async function getFilm(id: number, kind: FilmKind): Promise<Film> {
  const item = await request<TmdbDetail>(`${kind}/${id}`, { append_to_response: "credits" });
  return { ...summary(item, kind), genres: (item.genres || []).map(value => value.name), runtime: item.runtime || item.episode_run_time?.[0] || 0, seasons: item.number_of_seasons || 0, episodes: item.number_of_episodes || 0, status: item.status || "", tagline: item.tagline || "", released: item.release_date || item.first_air_date || "", language: item.original_language || "", countries: (item.production_countries || []).map(value => value.name), companies: (item.production_companies || []).map(value => value.name), directors: kind === "tv" ? (item.created_by || []).map(value => value.name) : [...new Set((item.credits?.crew || []).filter(value => value.job === "Director").map(value => value.name))], cast: (item.credits?.cast || []).slice(0, 12).map(({ name, character }) => ({ name, character })), budget: item.budget || 0, revenue: item.revenue || 0, homepage: item.homepage || "" };
}
export async function searchFilms(query: string, kind: FilmKind | "", page: number): Promise<SearchResult> {
  const data = await request<TmdbList>(`search/${kind || "multi"}`, { query, page: String(page), include_adult: "false" });
  const films = data.results.filter(item => !item.adult && (kind || item.media_type === "movie" || item.media_type === "tv")).map(item => summary(item, kind || item.media_type as FilmKind));
  return { films, total: data.total_results, pages: Math.min(data.total_pages, 500) };
}
export async function getCatalog(): Promise<Catalog> {
  const lists = await Promise.all([request<TmdbList>("movie/popular"), request<TmdbList>("tv/popular"), request<TmdbList>("movie/top_rated")]);
  return { popular: lists[0].results.filter(item => !item.adult).slice(0, 12).map(item => summary(item, "movie")), series: lists[1].results.filter(item => !item.adult).slice(0, 12).map(item => summary(item, "tv")), classics: lists[2].results.filter(item => !item.adult).slice(0, 12).map(item => summary(item, "movie")) };
}
