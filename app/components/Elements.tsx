import type { ReactNode } from "react";

export function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}

export function PageHeading({ title, description, label }: { title: string; description: string; label: string }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div><span className="page-label">{label}</span></div>;
}

export function Loading({ children }: { children: ReactNode }) {
  return <div role="status" className="loading-state"><span className="loading-line" aria-hidden="true" /><p>{children}</p></div>;
}

export function WeatherSymbol({ code }: { code: number }) {
  const sun = code <= 1;
  return <svg className="weather-symbol" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    {sun ? <><circle cx="50" cy="50" r="21" /><path d="M50 8v12m0 60v12M8 50h12m60 0h12M20 20l9 9m42 42 9 9M20 80l9-9m42-42 9-9" /></> : <><path d="M24 69a17 17 0 0 1-1-34 26 26 0 0 1 50-1 18 18 0 1 1 3 35Z" />{code >= 51 && <path d="m32 79-4 10m23-10-4 10m23-10-4 10" />}</>}
  </svg>;
}

export function weatherDescription(code: number) {
  if (code === 0) return "Cielo despejado";
  if (code <= 3) return "Parcialmente nublado";
  if (code <= 48) return "Niebla";
  if (code <= 67) return "Lluvia";
  if (code <= 77) return "Nieve";
  if (code <= 82) return "Chubascos";
  if (code <= 86) return "Chubascos de nieve";
  return "Tormenta";
}
