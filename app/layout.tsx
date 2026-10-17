import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import { Suspense } from "react";
import Navigation from "./components/Navigation";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const editorial = Libre_Baskerville({ variable: "--font-editorial", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: { default: "Cuaderno | Laboratorio de renderizado", template: "%s | Cuaderno" },
  description: "Ejercicios de renderizado cliente y servidor: Pokémon y observación del clima.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable}`}><body>
    <div className="reading-progress" aria-hidden="true" />
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Suspense fallback={<header className="site-header">Cuaderno</header>}><Navigation /></Suspense>
    <div id="contenido" className="site-content">{children}</div>
    <footer className="site-footer"><span>Cuaderno <span className="footer-divider">/</span> Laboratorio 09</span><span>Next.js · CSR & SSR</span></footer>
  </body></html>;
}
