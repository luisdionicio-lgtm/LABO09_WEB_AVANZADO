export type FilmKind = "movie" | "tv";
export interface FilmSummary {
  id: number;
  kind: FilmKind;
  title: string;
  originalTitle: string;
  year: string;
  poster: string;
  backdrop: string;
  overview: string;
  rating: number;
  votes: number;
}
export interface Film extends FilmSummary {
  genres: string[];
  runtime: number;
  seasons: number;
  episodes: number;
  status: string;
  tagline: string;
  released: string;
  language: string;
  countries: string[];
  companies: string[];
  directors: string[];
  cast: { name: string; character: string }[];
  budget: number;
  revenue: number;
  homepage: string;
}
export interface SearchResult { films: FilmSummary[]; total: number; pages: number; }
export interface Catalog { popular: FilmSummary[]; series: FilmSummary[]; classics: FilmSummary[]; }
