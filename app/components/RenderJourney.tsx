"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Arrow } from "./Elements";

export default function RenderJourney() {
  const [mode, setMode] = useState<"CSR" | "SSR">("CSR");
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep(value => Math.min(2, value + 1));
    }, 850);
    const finish = window.setTimeout(() => setPlaying(false), 2700);
    return () => { window.clearInterval(timer); window.clearTimeout(finish); };
  }, [playing]);
  function play() {
    setStep(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStep(2); return; }
    setPlaying(true);
  }
  const steps = mode === "CSR" ? [["La página llega", "Una interfaz inicial, todavía sin los datos."], ["El navegador consulta", "useEffect inicia la petición a la API."], ["El contenido aparece", "React actualiza la ficha sin recargar."]] : [["El servidor consulta", "La petición a la API ocurre en el servidor."], ["Los datos se renderizan", "El servidor construye el contenido de la ficha."], ["El HTML llega", "El navegador recibe el contenido preparado."]];
  return <section className="journey" aria-labelledby="journey-title"><div className="journey-intro"><h2 id="journey-title">Lo que ves.<br /><em>Lo que ocurre.</em></h2><p>El resultado se parece.<br />El recorrido de los datos cambia.</p><div className="segmented-control" aria-label="Estrategia de renderizado">{(["CSR", "SSR"] as const).map(value => <button key={value} aria-pressed={mode === value} onClick={() => { setMode(value); setPlaying(false); setStep(-1); }}>{value === "CSR" ? "Navegador" : "Servidor"}</button>)}</div><button className="journey-play" onClick={playing ? () => setPlaying(false) : play}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{playing ? <path d="M8 5v14M16 5v14" /> : <path d="m8 5 11 7-11 7Z" />}</svg>{playing ? "Detener recorrido" : step === 2 ? "Repetir recorrido" : "Reproducir recorrido"}</button></div><div className="journey-content"><ol className="journey-steps">{steps.map(([title, description], index) => <li key={index} className={step >= index ? "step-complete" : ""} aria-current={step === index ? "step" : undefined}><span className="journey-step-number">{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol><div className="journey-result" role="status">{step < 0 ? "Elige una estrategia y sigue el recorrido." : step === 2 ? "Contenido disponible en la página." : `Paso ${step + 1}: ${steps[step][0]}.`}</div><Link className="text-link" href={mode === "CSR" ? "/pokemon-csr" : "/pokemon-ssr"} prefetch={false}>Ver {mode} en acción <Arrow /></Link></div></section>;
}
