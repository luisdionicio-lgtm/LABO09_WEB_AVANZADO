"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [["/", "Inicio"], ["/pokemon-csr", "Pokémon CSR"], ["/pokemon-ssr", "Pokémon SSR"], ["/weather", "Clima"], ["/cine", "Cine & series"]];

export default function Navigation() {
  const pathname = usePathname();
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="wordmark" aria-label="Cuaderno, inicio"><span className="brand-symbol" aria-hidden="true">c.</span><span>Cuaderno<span className="brand-sub">Desarrollo web · Laboratorio 09</span></span></Link>
    <nav aria-label="Navegación principal">{links.map(([href, label]) => <Link href={href} key={href} prefetch={false} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>
  </div></header>;
}
