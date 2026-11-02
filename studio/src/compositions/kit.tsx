import React from "react";
import { useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Base, Simbolo } from "../components";
import { progress, springs, useScale, useSpring } from "../lib/motion";

// fontes da "marca improvisada" (cena de dor)
import "@fontsource/lobster/latin-400.css";
import "@fontsource/comic-neue/latin-700.css";
import "@fontsource/pacifico/latin-400.css";
import "@fontsource/bungee/latin-400.css";

export const ITENS = [
  { nome: "Logotipo" },
  { nome: "Manual de identidade" },
  { nome: "Paleta de cores" },
  { nome: "Tipografia" },
  { nome: "Destaques do Instagram" },
  { nome: "Manual de aplicação" },
  { nome: "Arte do cartão de visita" },
];

/** Mockup do item atual do pacote, desenhado com a marca de exemplo "JU". */
export const Kit: React.FC<{ atual: number; desde: number; altura: number }> = ({ atual, desde, altura }) => {
  const { u } = useScale();
  const f = useCurrentFrame();
  const s = useSpring(desde, springs.pop);
  const p = progress(f, desde, desde + 14);
  const box: React.CSSProperties = { width: u * 84, height: u * altura, borderRadius: u * 4, background: C.grafite, border: `1px solid ${C.linha}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", transform: `scale(${0.92 + 0.08 * s})` };
  const ju = (size: number, color = C.branco) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.08 }}>
      <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: size, color, letterSpacing: "-0.06em", lineHeight: 0.9 }}>JU</div>
      <Base w={size * 0.9} h={size * 0.12} />
    </div>
  );
  const views: React.ReactNode[] = [
    // 1 logotipo
    <div style={{ display: "flex", alignItems: "center", gap: u * 4 }}>{ju(u * 16 * (0.8 + 0.2 * p))}<div style={{ fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 4, color: C.branco, letterSpacing: "0.3em", opacity: p }}>MODA<br />JU</div></div>,
    // 2 manual de identidade
    <div style={{ display: "flex", gap: u * 2, transform: `rotate(-4deg) translateY(${(1 - p) * 20}px)` }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: u * 22, height: u * altura * 0.7, background: i === 0 ? C.limao : C.branco, borderRadius: u * 1.2, padding: u * 2, display: "flex", flexDirection: "column", justifyContent: "space-between", transform: `translateY(${i * u * 2}px)` }}>
          <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 3, color: C.preto }}>{["MANUAL", "01 · LOGO", "02 · CORES"][i]}</div>
          {i === 0 ? ju(u * 7, C.preto) : <div style={{ height: u * 8, background: i === 1 ? C.preto : `linear-gradient(90deg, ${C.limao} 33%, ${C.preto} 33% 66%, #E4E4E8 66%)`, borderRadius: u }} />}
        </div>
      ))}
    </div>,
    // 3 paleta
    <div style={{ display: "flex", gap: u * 2 }}>
      {[C.limao, C.branco, "#6C5CE7", C.preto].map((c, i) => (
        <div key={i} style={{ width: u * 16, height: u * altura * 0.62 * Math.min(1, Math.max(0, p * 1.6 - i * 0.2)), background: c, borderRadius: u * 2, border: `1px solid ${C.linha}`, alignSelf: "flex-end" }} />
      ))}
    </div>,
    // 4 tipografia
    <div style={{ display: "flex", alignItems: "baseline", gap: u * 4 }}>
      <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 22, color: C.branco, lineHeight: 1 }}>Aa</div>
      <div style={{ display: "flex", flexDirection: "column", gap: u, opacity: p }}>
        <div style={{ fontFamily: brand.font.display, fontWeight: 800, fontSize: u * 4, color: C.limao }}>Título</div>
        <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 3.4, color: C.cinza }}>Texto de apoio</div>
        <div style={{ fontFamily: brand.font.text, fontWeight: 500, fontSize: u * 2.8, color: C.cinza }}>0123456789</div>
      </div>
    </div>,
    // 5 destaques do Instagram
    <div style={{ display: "flex", gap: u * 3 }}>
      {["Loja", "Novos", "Promo", "Dicas"].map((t, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1.2, opacity: Math.min(1, Math.max(0, p * 2 - i * 0.25)) }}>
          <div style={{ width: u * 15, height: u * 15, borderRadius: "50%", border: `${u * 0.5}px solid ${C.limao}`, padding: u * 0.8 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: i % 2 ? C.branco : C.carvao, display: "flex", alignItems: "center", justifyContent: "center" }}><Base w={u * 6} h={u * 3} color={i % 2 ? C.preto : C.limao} /></div>
          </div>
          <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 2.6, color: C.branco }}>{t}</div>
        </div>
      ))}
    </div>,
    // 6 manual de aplicação (sacola, fachada, post)
    <div style={{ display: "flex", gap: u * 3, alignItems: "flex-end" }}>
      <div style={{ width: u * 20, height: u * 24, background: C.limao, clipPath: "polygon(8% 18%, 92% 18%, 100% 100%, 0 100%)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: u * 4 }}>{ju(u * 7, C.preto)}</div>
      <div style={{ width: u * 30, height: u * 20, background: C.branco, borderRadius: u * 1.5, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - p) * 20}px)` }}>{ju(u * 8, C.preto)}</div>
      <div style={{ width: u * 18, height: u * 18, background: C.carvao, borderRadius: u * 1.5, border: `1px solid ${C.linha}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{ju(u * 6)}</div>
    </div>,
    // 7 cartão de visita (frente e verso)
    <div style={{ position: "relative", width: u * 70, height: u * altura * 0.8 }}>
      <div style={{ position: "absolute", left: u * 2, top: u * 2, width: u * 46, height: u * 27, background: C.limao, borderRadius: u * 1.5, transform: `rotate(${-8 * p}deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}>{ju(u * 9, C.preto)}</div>
      <div style={{ position: "absolute", right: u * 2, bottom: u * 1, width: u * 46, height: u * 27, background: C.branco, borderRadius: u * 1.5, transform: `rotate(${6 * p}deg)`, padding: u * 3, display: "flex", flexDirection: "column", justifyContent: "flex-end", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}>
        <div style={{ fontFamily: brand.font.display, fontWeight: 800, fontSize: u * 3.4, color: C.preto }}>Juliana Souza</div>
        <div style={{ fontFamily: brand.font.text, fontWeight: 500, fontSize: u * 2.4, color: "#555" }}>(45) 99999-0000 · @modaju</div>
      </div>
    </div>,
  ];
  return (
    <div style={box}>
      <div style={{ position: "absolute", top: u * 2, left: u * 2.5, fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 2.4, color: C.cinza, letterSpacing: "0.12em" }}>{String(atual + 1).padStart(2, "0")} / 07</div>
      <Simbolo size={u * 5} style={{ position: "absolute", top: u * 1.5, right: u * 2, borderRadius: u, opacity: 0.9 }} />
      <div style={{ opacity: Math.min(1, p * 2) }}>{views[atual]}</div>
    </div>
  );
};
