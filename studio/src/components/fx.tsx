import React from "react";
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { C } from "../brand/brand";
import { clamp, ease, progress, useScale } from "../lib/motion";

/** Grão de filme: ruído SVG que muda a cada 2 frames. */
export const Grao: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 12;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.2'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`, backgroundSize: "300px 300px" }} />
  );
};

/** Aberração cromática que decai depois de cada impacto. Devolve um `filter` CSS. */
export const rgbSplit = (frame: number, hits: number[], amp: number) => {
  let k = 0;
  for (const h of hits) {
    const d = frame - h;
    if (d >= 0 && d < 10) k = Math.max(k, Math.exp(-d / 2.5));
  }
  if (k < 0.02) return "none";
  const x = amp * k;
  return `drop-shadow(${x}px 0 0 rgba(255,40,80,.85)) drop-shadow(${-x}px 0 0 rgba(40,220,255,.85))`;
};

/** Fatias de glitch: barras horizontais deslocadas em blend difference por alguns frames. */
export const Fatias: React.FC<{ at: number[]; dur?: number }> = ({ at, dur = 5 }) => {
  const f = useCurrentFrame();
  const { u, height } = useScale();
  const hit = at.find((a) => f >= a && f < a + dur);
  if (hit === undefined) return null;
  const n = 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "difference" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(`${hit}-${f}-${i}-${k}`);
        const y = r("y") * height, h = u * (0.6 + r("h") * 5);
        return <div key={i} style={{ position: "absolute", top: y, height: h, left: (r("x") - 0.5) * u * 30, width: "100%", background: i % 3 === 0 ? C.limao : C.branco, opacity: 0.5 + r("o") * 0.5 }} />;
      })}
    </AbsoluteFill>
  );
};

/** Vazamento de luz limão que atravessa a tela na diagonal. */
export const Vazamento: React.FC<{ at: number; dur?: number; color?: string }> = ({ at, dur = 16, color = "206,250,59" }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const p = progress(f, at, at + dur, ease.inOut);
  const o = interpolate(f, [at, at + dur * 0.3, at + dur], [0, 0.9, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: o, background: `linear-gradient(115deg, transparent ${p * 120 - 40}%, rgba(${color},.55) ${p * 120 - 15}%, rgba(255,255,255,.7) ${p * 120 - 8}%, rgba(${color},.4) ${p * 120}%, transparent ${p * 120 + 20}%)` }} />
  );
};

export type Entrada = "punch" | "whip" | "zoomout" | "corte";

/** Envolve uma cena (frames absolutos a→b): entrada com zoom-punch / chicote e saída com speed-ramp + blur. */
export const Transicao: React.FC<{ a: number; b: number; entrada?: Entrada; saida?: boolean; children: React.ReactNode }> = ({ a, b, entrada = "punch", saida = true, children }) => {
  const f = useCurrentFrame();
  const { height } = useScale();
  const pi = progress(f, a, a + 8, ease.out);
  const po = saida ? progress(f, b - 5, b, ease.in) : 0;
  let scale = 1, ty = 0, blur = 0, rot = 0;
  if (entrada === "punch") { scale = 1.28 - 0.28 * pi; blur = (1 - pi) * 14; }
  if (entrada === "whip") { ty = (1 - pi) * height * 0.35; blur = (1 - pi) * 18; rot = (1 - pi) * -4; }
  if (entrada === "zoomout") { scale = 0.82 + 0.18 * pi; blur = (1 - pi) * 10; }
  scale *= 1 + po * 0.22;
  blur += po * 12;
  ty -= po * height * 0.04;
  return (
    <AbsoluteFill style={{ transform: `translateY(${ty}px) scale(${scale}) rotate(${rot}deg)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: entrada === "corte" ? 1 : Math.min(1, 0.35 + pi) }}>
      {children}
    </AbsoluteFill>
  );
};

/** Encadeia cenas que usam frames absolutos, cada uma com sua transição. */
export type CenaDef = { C: React.FC; a: number; b: number; entrada?: Entrada; saida?: boolean };
export const Cenas: React.FC<{ cenas: CenaDef[] }> = ({ cenas }) => (
  <>
    {cenas.map(({ C: Cena, a, b, entrada, saida }, i) => {
      const from = i === 0 ? 0 : a - 1;
      return (
        <Sequence key={i} from={from} durationInFrames={b - from} layout="none">
          <Sequence from={-from} layout="none">
            <Transicao a={a} b={b} entrada={i === 0 ? "corte" : entrada} saida={saida ?? i < cenas.length - 1}>
              <Cena />
            </Transicao>
          </Sequence>
        </Sequence>
      );
    })}
  </>
);
