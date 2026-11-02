import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { clamp, ease, progress, useScale, useSpring, springs } from "../lib/motion";

/** Trapézio da base do A (assinatura da marca). Proporção tirada do logo: topo = 43% da base. */
export const BASE_CLIP = "polygon(28.5% 0, 71.5% 0, 100% 100%, 0 100%)";
export const Base: React.FC<{ w: number; h: number; color?: string; style?: React.CSSProperties }> = ({ w, h, color = C.limao, style }) => (
  <div style={{ width: w, height: h, background: color, clipPath: BASE_CLIP, ...style }} />
);

/** Fundo: preto com grade fina e um brilho limão que respira. */
export const Fundo: React.FC<{ glow?: number; grid?: boolean; tone?: string }> = ({ glow = 0.18, grid = true, tone = C.preto }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const gy = 30 + Math.sin(f / 40) * 6;
  return (
    <AbsoluteFill style={{ background: tone }}>
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${C.carvao} 1px, transparent 1px), linear-gradient(90deg, ${C.carvao} 1px, transparent 1px)`,
            backgroundSize: `${u * 10}px ${u * 10}px`,
            backgroundPosition: `center ${-f * 0.6}px`,
            opacity: 0.55,
          }}
        />
      )}
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% ${gy}%, rgba(206,250,59,${glow}), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.65))" }} />
    </AbsoluteFill>
  );
};

/** Coluna centralizada dentro da área segura do formato. */
export const Tela: React.FC<{ children: React.ReactNode; gap?: number; justify?: React.CSSProperties["justifyContent"]; style?: React.CSSProperties }> = ({ children, gap = 0, justify = "center", style }) => {
  const { u, safeTop, safeBottom } = useScale();
  return (
    <AbsoluteFill style={{ paddingTop: safeTop, paddingBottom: safeBottom, paddingLeft: u * 7, paddingRight: u * 7, display: "flex", flexDirection: "column", justifyContent: justify, alignItems: "center", gap: gap * u, ...style }}>
      {children}
    </AbsoluteFill>
  );
};

type LinhaProps = {
  words: string[]; at: number[]; size: number; color?: string; hi?: number[]; hiColor?: string; weight?: number; font?: "display" | "text"; outline?: boolean; base?: number; tracking?: number;
};

/** Uma palavra que bate na tela (escala 1.35 → 1, de baixo pra cima). Componente próprio para cada palavra ter seus hooks. */
const Palavra: React.FC<{ w: string; at: number; isHi: boolean; withBase: boolean } & Omit<LinhaProps, "words" | "at" | "hi" | "base">> = ({ w, at, isHi, withBase, size, color = C.branco, hiColor = C.limao, weight = 900, font = "display", outline = false, tracking = -0.02 }) => {
  const { u } = useScale();
  const f = useCurrentFrame();
  const s = useSpring(at, springs.slam);
  const baseP = progress(f, at + 3, at + 11);
  return (
    <span style={{ position: "relative", display: "inline-block", opacity: f >= at ? 1 : 0, transform: `translateY(${(1 - s) * 30}%) scale(${1.35 - 0.35 * s})`, fontFamily: font === "display" ? brand.font.display : brand.font.text, fontWeight: weight, fontSize: size * u, letterSpacing: `${tracking}em`, color: outline ? "transparent" : isHi ? hiColor : color, WebkitTextStroke: outline ? `${u * 0.35}px ${isHi ? hiColor : color}` : undefined, textTransform: "uppercase" }}>
      {withBase && (
        <span style={{ position: "absolute", left: "-4%", right: "-4%", bottom: "-0.06em", height: "0.2em", background: C.limao, clipPath: "polygon(4% 0, 96% 0, 100% 100%, 0 100%)", transform: `scaleX(${baseP})`, transformOrigin: "left" }} />
      )}
      <span style={{ position: "relative" }}>{w}</span>
    </span>
  );
};

/** Uma linha de palavras; `at` = frame de entrada de cada palavra, `hi` = índices em limão, `base` = palavra sublinhada pela base. */
export const Linha: React.FC<LinhaProps> = ({ words, at, hi = [], base, size, ...rest }) => {
  const { u } = useScale();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * u * 0.28, lineHeight: 1.02 }}>
      {words.map((w, i) => (
        <Palavra key={i} w={w} at={at[i]} isHi={hi.includes(i)} withBase={base === i} size={size} {...rest} />
      ))}
    </div>
  );
};

export const Logo: React.FC<{ width: number; delay?: number; style?: React.CSSProperties }> = ({ width, delay = 0, style }) => {
  const f = useCurrentFrame();
  const p = progress(f, delay, delay + 14);
  return <Img src={staticFile(brand.logo)} style={{ width, opacity: p, transform: `translateY(${(1 - p) * 20}px)`, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, ...style }} />;
};
export const Simbolo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile(brand.simbolo)} style={{ width: size, height: size, ...style }} />
);

/** Etiqueta pequena (kicker). */
export const Chip: React.FC<{ text: string; delay?: number; tone?: "limao" | "escuro" | "alerta"; size?: number; style?: React.CSSProperties }> = ({ text, delay = 0, tone = "escuro", size = 3.2, style }) => {
  const { u } = useScale();
  const s = useSpring(delay, springs.pop);
  const f = useCurrentFrame();
  const bg = tone === "limao" ? C.limao : tone === "alerta" ? C.alerta : C.carvao;
  const fg = tone === "limao" ? C.preto : C.branco;
  return (
    <div style={{ opacity: f >= delay ? 1 : 0, transform: `scale(${0.7 + 0.3 * s})`, background: bg, color: fg, border: tone === "escuro" ? `1px solid ${C.linha}` : "none", padding: `${u * size * 0.45}px ${u * size * 0.9}px`, borderRadius: u * size * 0.5, fontFamily: brand.font.text, fontWeight: 700, fontSize: u * size, letterSpacing: "0.01em", whiteSpace: "nowrap", ...style }}>
      {text}
    </div>
  );
};

/** Flash branco/limão curto em um impacto. */
export const Flash: React.FC<{ at: number; color?: string; max?: number }> = ({ at, color = C.limao, max = 0.55 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + 7], [0, max, 0], clamp);
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

/** Transição: o trapézio limão sobe e cobre a tela (in), depois sai por cima (out). */
export const WipeBase: React.FC<{ at: number; dur?: number }> = ({ at, dur = 12 }) => {
  const f = useCurrentFrame();
  const { height } = useScale();
  const pin = progress(f, at, at + dur / 2, ease.inOut);
  const pout = progress(f, at + dur / 2, at + dur, ease.inOut);
  if (f < at || f > at + dur) return null;
  const top = height * (1 - pin) - height * 0.3;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "-30%", width: "160%", top: top - pout * height * 1.4, height: height * 1.3, background: C.limao, clipPath: "polygon(22% 0, 78% 0, 100% 100%, 0 100%)" }} />
    </AbsoluteFill>
  );
};

/** Barra de progresso do Reels (retenção): fina, limão, embaixo da área segura superior. */
export const Progresso: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const { u, safeTop } = useScale();
  return (
    <div style={{ position: "absolute", top: safeTop - u * 3, left: u * 7, right: u * 7, height: u * 0.5, background: C.carvao, borderRadius: u }}>
      <div style={{ width: `${(f / total) * 100}%`, height: "100%", background: C.limao, borderRadius: u }} />
    </div>
  );
};
