"use client";

import Image from "next/image";
import { useState } from "react";

export default function Poster({ src, title, priority = false }: { src: string; title: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [smallerImage, setSmallerImage] = useState(false);
  const valid = /^https?:\/\//.test(src) && src !== "N/A";
  const image = src.replace(/^http:/, "https:").replace("/w500/", smallerImage ? "/w342/" : "/w500/");
  return <div className="film-poster">{valid && !failed ? <Image src={image} alt={`Póster de ${title}`} fill sizes="(max-width:640px) 45vw, (max-width:1000px) 28vw, 230px" priority={priority} onError={() => smallerImage ? setFailed(true) : setSmallerImage(true)} /> : <div className="poster-unavailable"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" aria-hidden="true"><rect x="7" y="5" width="26" height="30" rx="1" /><path d="M12 5v30m16-30v30M7 12h5m16 0h5M7 20h5m16 0h5M7 28h5m16 0h5" /></svg><span>Póster no disponible</span></div>}</div>;
}
