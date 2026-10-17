"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="page"><div className="error-state"><h1>La consulta no pudo completarse</h1><p>El servicio no respondió. Comprueba tu conexión y vuelve a intentarlo.</p><button onClick={reset} className="button button-green">Reintentar consulta</button></div></main>;
}
