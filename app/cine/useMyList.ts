"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { FilmSummary } from "./types";
const KEY = "cuaderno.cinema.my-list.v1";
function subscribe(callback: () => void) { window.addEventListener("storage",callback); window.addEventListener("cuaderno-list",callback); return () => { window.removeEventListener("storage",callback); window.removeEventListener("cuaderno-list",callback); }; }
function snapshot() { try { return localStorage.getItem(KEY) || "[]"; } catch { return "[]"; } }
export function useMyList() {
  const raw = useSyncExternalStore(subscribe,snapshot,() => "[]");
  const films = useMemo<FilmSummary[]>(() => { try { const items = JSON.parse(raw); return Array.isArray(items) ? items.filter(item => item && Number.isInteger(item.id) && ["movie","tv"].includes(item.kind) && typeof item.title === "string") : []; } catch { return []; } },[raw]);
  function has(film: FilmSummary) { return films.some(value => value.id === film.id && value.kind === film.kind); }
  function toggle(film: FilmSummary) { try { localStorage.setItem(KEY,JSON.stringify(has(film) ? films.filter(value => !(value.id === film.id && value.kind === film.kind)) : [...films,film].slice(-100))); window.dispatchEvent(new Event("cuaderno-list")); } catch { /* Storage can be unavailable in private browsing. */ } }
  return { films, has, toggle };
}
