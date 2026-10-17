"use client";
import { motion } from "framer-motion";
export default function RatingRing({ value, votes = 1 }: { value: number; votes?: number }) {
  const color = value >= 7 ? "#9ff4cf" : value >= 5 ? "#f8d198" : "#efa0b7";
  return <span className="rating-ring" style={{color}} aria-label={votes ? `Valoración ${value.toFixed(1)} de 10` : "Sin valoraciones"}><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" stroke="currentColor" strokeOpacity=".15" strokeWidth="2" fill="none" /><motion.circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" pathLength={1} strokeDasharray={`${Math.max(0,Math.min(value/10,1))} 1`} transform="rotate(-90 24 24)" /></svg><strong>{votes ? value.toFixed(1) : "—"}</strong></span>;
}
