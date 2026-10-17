import { CinemaError, getFilm, searchFilms } from "../../lib/tmdb";
import type { FilmKind } from "../../cine/types";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind") || "";
  if (!["", "movie", "tv"].includes(kind)) return Response.json({ error: "El tipo de título no es válido." }, { status: 400 });
  try {
    if (params.has("id")) {
      const id = Number(params.get("id"));
      if (!Number.isSafeInteger(id) || id <= 0 || !kind) return Response.json({ error: "El identificador no es válido." }, { status: 400 });
      return Response.json(await getFilm(id, kind as FilmKind));
    }
    const query = (params.get("q") || "").trim();
    const page = Number(params.get("page") || 1);
    const genre = Number(params.get("genre") || 0);
    if (!Number.isInteger(genre) || genre < 0) return Response.json({error:"Género inválido."},{status:400});
    if (query.length < 2 || query.length > 100 || !Number.isInteger(page) || page < 1 || page > 500) return Response.json({ error: "Escribe entre 2 y 100 caracteres para buscar." }, { status: 400 });
    return Response.json(await searchFilms(query, kind as FilmKind | "", page, genre));
  } catch (error) {
    return Response.json({ error: error instanceof CinemaError ? error.message : "No se pudo consultar el catálogo." }, { status: error instanceof CinemaError ? error.status : 500 });
  }
}
