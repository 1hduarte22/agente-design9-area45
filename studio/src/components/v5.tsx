/* Linguagem v5: uma frase curta por cena, quebras de linha escritas à mão (por sentido, nunca automáticas),
 * cada linha numa linha só e encolhida para caber na área segura. Tempos em segundos, vindos da transcrição
 * palavra por palavra da narração (src/data/palavras-*.json). */
import React from "react";
import LARG from "../data/larguras-fontes.json";
import { random, useCurrentFrame } from "remotion";
import { C } from "../brand/brand";
import { ease, progress, springs, useScale, useSpring } from "../lib/motion";
import { F } from "./v4";

export const FPS = 30;
export const s = (x: number) => Math.round(x * FPS);

const CORES = { b: C.branco, l: C.limao, r: C.alerta, p: C.preto, c: "#8C8E89" } as const;
export type Cor = keyof typeof CORES;

/* Palavra que sobe de dentro da linha (máscara). */
const Sobe: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const p = progress(f, at, at + 8, ease.out);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0.08em 0.14em 0.12em", margin: "-0.08em -0.14em -0.12em", verticalAlign: "top" }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%) skewX(${(1 - p) * -10}deg)`, opacity: f >= at ? 1 : 0 }}>{children}</span>
    </span>
  );
};

/* Largura de uma linha em "em", pelas métricas reais das fontes (src/data/larguras-fontes.json).
 * Calculado, não medido no DOM: o resultado é o mesmo em todo frame e em todo render. */
const largura = (txt: string, imp: boolean) => {
  const tab = (LARG as Record<string, Record<string, number>>)[imp ? "impacto" : "titulo"];
  const ws = (imp ? txt.toUpperCase() : txt).split(" ");
  const track = imp ? 0.01 : -0.015;
  const letras = ws.reduce((acc, w) => acc + [...w].reduce((a, ch) => a + (tab[ch] ?? 0.62) + track, 0), 0);
  return letras + (ws.length - 1) * 0.26;
};

/* Uma linha: nunca quebra; se não couber em `maxW` (px), a fonte encolhe. */
const Linha: React.FC<{ size: number; maxW: number; txt: string; imp: boolean; style: React.CSSProperties; children: React.ReactNode; align: "center" | "left" }> = ({ size, maxW, txt, imp, style, children, align }) => {
  const fs = Math.min(size, Math.floor((maxW * 0.94) / largura(txt, imp)));
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: align === "center" ? "center" : "flex-start" }}>
      <div style={{ ...style, fontSize: fs, whiteSpace: "nowrap", width: "max-content", display: "flex", columnGap: "0.26em" }}>{children}</div>
    </div>
  );
};

export type L = { t: string; at: number | number[]; cor?: Cor; s?: number; imp?: boolean; riscar?: number };

/** Frase em linhas definidas à mão. `at` em segundos (um por palavra, ou um só e as palavras entram em sequência).
 *  `s` em u (1% da largura). Montserrat 900 itálico; `imp` usa Anton em caixa alta. */
export const Frase: React.FC<{ linhas: L[]; align?: "center" | "left"; maxW?: number; gap?: number }> = ({ linhas, align = "center", maxW, gap = 0.4 }) => {
  const f = useCurrentFrame();
  const { u, width, safeSide } = useScale();
  const larg = maxW ? maxW * u : width - safeSide * 2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: gap * u, width: "100%" }}>
      {linhas.map((l, i) => {
        const ws = l.t.split(" ");
        const ats = ws.map((_, k) => (Array.isArray(l.at) ? s(l.at[Math.min(k, l.at.length - 1)]) : s(l.at) + k * 3));
        const cor = CORES[l.cor ?? "b"];
        const size = (l.s ?? 10) * u;
        const st: React.CSSProperties = {
          fontFamily: l.imp ? F.impacto : F.titulo, fontWeight: l.imp ? 400 : 900, fontStyle: l.imp ? "normal" : "italic",
          lineHeight: l.imp ? 1 : 1.08, letterSpacing: l.imp ? "0.01em" : "-0.015em", color: cor, textTransform: l.imp ? "uppercase" : "none",
          textShadow: l.cor === "l" ? `0 0 ${size * 0.14}px rgba(206,250,59,.45)` : l.cor === "r" ? `0 0 ${size * 0.12}px rgba(255,74,61,.35)` : "0 4px 24px rgba(0,0,0,.45)",
          position: "relative",
        };
        return (
          <div key={i} style={{ position: "relative", width: "100%" }}>
            <Linha size={size} maxW={larg} txt={l.t} imp={!!l.imp} style={st} align={align}>
              {ws.map((w, k) => <Sobe key={k} at={ats[k]}>{w}</Sobe>)}
              {l.riscar !== undefined && (
                <div style={{ position: "absolute", left: "-3%", width: `${106 * progress(f, s(l.riscar), s(l.riscar) + 7, ease.out)}%`, top: "50%", height: "0.12em", background: C.alerta, transform: "rotate(-4deg)", borderRadius: u }} />
              )}
            </Linha>
          </div>
        );
      })}
    </div>
  );
};

/* Carimbo que bate na tela (rotação + escala). */
export const Carimbo: React.FC<{ text: string; at: number; cor?: string; size?: number; rot?: number }> = ({ text, at, cor = C.alerta, size = 14, rot = -8 }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const k = useSpring(s(at), springs.slam);
  if (f < s(at)) return null;
  return (
    <div style={{ transform: `rotate(${rot}deg) scale(${1.8 - 0.8 * k})`, opacity: Math.min(1, k * 1.5), border: `${u * 1.1}px solid ${cor}`, borderRadius: u * 2, padding: `${u * 1}px ${u * 3.2}px`, color: cor, fontFamily: F.impacto, fontSize: u * size, lineHeight: 1, letterSpacing: "0.02em", background: "rgba(10,10,10,.35)", boxShadow: `0 0 ${u * 6}px rgba(255,74,61,.25)` }}>{text}</div>
  );
};

/* Bolhas de conversa: o cliente sumindo. */
export const Conversa: React.FC<{ msgs: { t: string; eu?: boolean; at: number }[]; w: number }> = ({ msgs, w }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: w * 0.03 }}>
      {msgs.map((m, i) => {
        const k = progress(f, s(m.at), s(m.at) + 8);
        return (
          <div key={i} style={{ alignSelf: m.eu ? "flex-end" : "flex-start", maxWidth: "78%", opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.9 + 0.1 * k})`, background: m.eu ? C.limao : "#262726", color: m.eu ? C.preto : C.branco, fontFamily: F.texto, fontWeight: 600, fontSize: w * 0.055, lineHeight: 1.3, padding: `${w * 0.03}px ${w * 0.045}px`, borderRadius: w * 0.05 }}>{m.t}</div>
        );
      })}
    </div>
  );
};

/* Posts amadores espalhados pela tela, cada um com uma fonte e uma cor. */
export const POSTS_AMADOR: [string, string, string, string][] = [
  ["linear-gradient(135deg,#ff7ad9,#ffe066)", "#2b37ff", "PROMO!!", "Lobster, cursive"],
  ["#3fd16f", "#fff", "novidades", "'Comic Neue', cursive"],
  ["#5b6cff", "#ffe600", "OFERTA", "Bungee, sans-serif"],
  ["#ff5f5f", "#fff", "liquida", "Pacifico, cursive"],
  ["linear-gradient(45deg,#00c6ff,#ff00b8)", "#fff", "chegou!!!", "Lobster, cursive"],
  ["#ffe600", "#d0021b", "SALDÃO", "Bungee, sans-serif"],
  ["#8a0f9e", "#ffe066", "Bom dia", "Pacifico, cursive"],
  ["#ff9a3c", "#1d6b1d", "look", "'Comic Neue', cursive"],
  ["#1aa3a3", "#fff", "PROMO", "Lobster, cursive"],
];
export const PostsCaos: React.FC<{ at: number; lado: number }> = ({ at, lado }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: lado * 3.2, height: lado * 3.2 }}>
      {POSTS_AMADOR.map(([bg, fg, t, font], i) => {
        const r = (k: string) => random(`pc${i}${k}`);
        const a0 = s(at) + i * 2;
        const k = progress(f, a0, a0 + 10, ease.out);
        const x = (i % 3) * lado * 1.08 + (r("x") - 0.5) * lado * 0.35;
        const y = Math.floor(i / 3) * lado * 1.08 + (r("y") - 0.5) * lado * 0.35;
        const rot = (r("r") - 0.5) * 28 + Math.sin((f + i * 9) / 14) * 2;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: lado, height: lado, background: bg, borderRadius: lado * 0.06, display: "flex", alignItems: "center", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * lado * 1.2}px) rotate(${rot * k}deg) scale(${0.6 + 0.4 * k})`, boxShadow: "0 18px 40px rgba(0,0,0,.5)" }}>
            <span style={{ fontFamily: font, fontSize: lado * 0.2, color: fg, transform: `rotate(${(r("t") - 0.5) * 20}deg)` }}>{t}</span>
          </div>
        );
      })}
    </div>
  );
};

/* Bolas de cor brigando entre si. */
export const CoresCaos: React.FC<{ at: number; w: number; h: number }> = ({ at, w, h }) => {
  const f = useCurrentFrame();
  const cores = ["#ff00b8", "#2b37ff", "#ffe600", "#3fd16f", "#ff5f5f", "#00c6ff", "#ff9a3c", "#8a0f9e", "#1aa3a3", "#d0021b"];
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {cores.map((c, i) => {
        const r = (k: string) => random(`cc${i}${k}`);
        const a0 = s(at) + i * 2;
        const k = useSpringLocal(f, a0);
        const d = w * (0.16 + r("d") * 0.14);
        const x = r("x") * (w - d) + Math.sin((f + i * 13) / 11) * w * 0.03;
        const y = r("y") * (h - d) + Math.cos((f + i * 7) / 9) * h * 0.03;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", background: c, transform: `scale(${k})`, boxShadow: `0 0 ${d * 0.4}px ${c}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: F.texto, fontWeight: 700, fontSize: d * 0.16, color: "rgba(255,255,255,.85)", mixBlendMode: "difference" }}>{c.toUpperCase()}</span>
          </div>
        );
      })}
    </div>
  );
};
const useSpringLocal = (f: number, a: number) => {
  const t = Math.max(0, f - a) / 30;
  if (f < a) return 0;
  return 1 - Math.exp(-t * 9) * Math.cos(t * 22);
};

/* Gráfico de vendas despencando. */
export const Queda: React.FC<{ at: number; w: number; h: number }> = ({ at, w, h }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const k = progress(f, s(at), s(at) + 26, ease.inOut);
  const pts = [0.25, 0.3, 0.22, 0.35, 0.45, 0.6, 0.72, 0.88, 0.95].map((y, i, a) => [(i / (a.length - 1)) * w, y * h] as const);
  const n = Math.max(2, Math.ceil(k * pts.length));
  const vis = pts.slice(0, n);
  const d = vis.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const last = vis[vis.length - 1];
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: u * 3, background: "rgba(255,74,61,.06)", border: "1px solid rgba(255,74,61,.25)" }}>
      {[0.25, 0.5, 0.75].map((y) => <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y * h, height: 1, background: "rgba(245,245,247,.08)" }} />)}
      <div style={{ position: "absolute", left: u * 3, top: u * 2.4, fontFamily: F.texto, fontWeight: 800, fontSize: u * 3.4, color: "#c9cac6", letterSpacing: "0.12em" }}>VENDAS</div>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`${d} L${last[0]},${h} L0,${h} Z`} fill="rgba(255,74,61,.14)" />
        <path d={d} stroke={C.alerta} strokeWidth={u * 1.1} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={last[0]} cy={last[1]} r={u * 1.8} fill={C.alerta} />
      </svg>
      <div style={{ position: "absolute", right: u * 3, top: u * 2, fontFamily: F.impacto, fontSize: u * 8, color: C.alerta, opacity: progress(f, s(at) + 18, s(at) + 26) }}>↓</div>
    </div>
  );
};

/* Folha de calendário que cai no dia. */
export const Calendario: React.FC<{ at: number; dia: string; w: number; riscar?: number }> = ({ at, dia, w, riscar }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const k = useSpring(s(at), springs.slam);
  const flip = -95 + 95 * progress(f, s(at) - 6, s(at) + 2, ease.out);
  return (
    <div style={{ perspective: u * 200 }}>
      <div style={{ position: "relative", transform: `rotateX(${flip}deg) scale(${1.15 - 0.15 * k}) rotate(${-4 * k}deg)`, transformOrigin: "top", opacity: f >= s(at) - 6 ? 1 : 0, background: C.preto, borderRadius: w * 0.1, overflow: "hidden", width: w, boxShadow: "0 30px 60px rgba(0,0,0,.4)" }}>
        <div style={{ background: C.alerta, color: C.branco, fontFamily: F.texto, fontWeight: 800, fontSize: w * 0.1, textAlign: "center", padding: w * 0.045, letterSpacing: "0.2em" }}>NOVEMBRO</div>
        <div style={{ color: C.branco, fontFamily: F.impacto, fontSize: w * 0.62, textAlign: "center", lineHeight: 1.15 }}>{dia}</div>
        {riscar !== undefined && (
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <path d="M15 30 L85 90" stroke={C.alerta} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress(f, s(riscar), s(riscar) + 6)} />
            <path d="M85 30 L15 90" stroke={C.alerta} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress(f, s(riscar) + 4, s(riscar) + 10)} />
          </svg>
        )}
      </div>
    </div>
  );
};

/* Contador de progresso dos itens (bolinhas). */
export const Pontos: React.FC<{ n: number; atual: number; cor?: string }> = ({ n, atual, cor = C.limao }) => {
  const { u } = useScale();
  return (
    <div style={{ display: "flex", gap: u * 1.2, justifyContent: "center" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ width: i === atual ? u * 6 : u * 1.6, height: u * 1.6, borderRadius: u, background: i <= atual ? cor : "rgba(245,245,247,.18)" }} />
      ))}
    </div>
  );
};
