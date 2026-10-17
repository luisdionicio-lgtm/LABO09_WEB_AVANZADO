"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow } from "./Elements";

export default function RenderJourney() {
  const [mode, setMode] = useState<"CSR" | "SSR">("CSR");
  const steps = mode === "CSR" ? [["La página llega", "Una interfaz inicial, todavía sin los datos."], ["El navegador consulta", "useEffect inicia la petición a la API."], ["El contenido aparece", "React actualiza la ficha sin recargar."]] : [["El servidor consulta", "La petición a la API ocurre en el servidor."], ["Los datos se renderizan", "El servidor construye el contenido de la ficha."], ["El HTML llega", "El navegador recibe el contenido preparado."]];
  return <section className="journey" aria-labelledby="journey-title"><div className="journey-intro"><h2 id="journey-title">Lo que ves.<br /><em>Lo que ocurre.</em></h2><p>El resultado se parece.<br />El recorrido de los datos cambia.</p><div className="segmented-control" aria-label="Estrategia de renderizado">{(["CSR", "SSR"] as const).map(value => <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value === "CSR" ? "Navegador" : "Servidor"}</button>)}</div></div><div className="journey-content"><ol className="journey-steps">{steps.map(([title, description], index) => <li key={index}><span className="journey-step-number">{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol><Link className="text-link" href={mode === "CSR" ? "/pokemon-csr" : "/pokemon-ssr"} prefetch={false}>Ver {mode} en acción <Arrow /></Link></div></section>;
}
