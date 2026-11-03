/* Linguagem visual v4 · baseada nos Reels aprovados da Area45 (Area45mkt):
 * Montserrat 900 itálico em duas linhas (branco + limão), kicker pequeno com tracking largo,
 * mockups reais de celular, fundo preto com brilho limão, uma ideia por tela. */
import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Base } from "./index";
import { ease, progress, springs, useScale, useSpring } from "../lib/motion";

export const F = { titulo: brand.font.titulo, impacto: brand.font.impacto, texto: brand.font.text };

/* ── Fundo com profundidade: brilho, texto fantasma, linhas finas e partículas. */
export const Palco: React.FC<{ fantasma?: string; glow?: number; tom?: string; glowX?: number; glowY?: number }> = ({ fantasma = "BLACK NOVEMBER", glow = 0.22, tom = C.preto, glowX = 70, glowY = 30 }) => {
  const f = useCurrentFrame();
  const { u, height } = useScale();
  return (
    <AbsoluteFill style={{ background: tom, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(55% 35% at ${glowX + Math.sin(f / 50) * 6}% ${glowY + Math.cos(f / 60) * 4}%, rgba(206,250,59,${glow}), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(50% 30% at 15% 85%, rgba(206,250,59,${glow * 0.35}), transparent 70%)` }} />
      {fantasma && (
        <div style={{ position: "absolute", top: height * 0.5 - u * 22, left: -u * 10 - (f * 0.8) % (u * 160), whiteSpace: "nowrap", fontFamily: F.impacto, fontSize: u * 44, lineHeight: 1, color: "rgba(245,245,247,0.022)", letterSpacing: "0.02em" }}>
          {`${fantasma} · ${fantasma} · ${fantasma} · `}
        </div>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(60% 28% at 50% 100%, rgba(206,250,59,${glow * 0.8}), transparent 75%)` }} />
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", bottom: 0, left: `${8 + i * 11}%`, width: u * (0.6 + (i % 3) * 0.5), height: height * (0.35 + 0.15 * Math.sin(f / 25 + i * 1.7)), background: `linear-gradient(0deg, rgba(206,250,59,${0.10 + 0.05 * Math.sin(f / 15 + i)}), transparent)`, filter: `blur(${u * 0.8}px)` }} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => {
        const r = (k: string) => random(`p${i}${k}`);
        const y = ((r("y") * height - f * (0.6 + r("v") * 1.4)) % height + height) % height;
        return <div key={i} style={{ position: "absolute", left: `${r("x") * 100}%`, top: y, width: u * (0.25 + r("s") * 0.45), height: u * (0.25 + r("s") * 0.45), borderRadius: "50%", background: i % 4 === 0 ? C.limao : C.branco, opacity: 0.15 + r("o") * 0.35 }} />;
      })}
      <AbsoluteFill style={{ background: "radial-gradient(130% 85% at 50% 45%, transparent 55%, rgba(0,0,0,0.7))" }} />
    </AbsoluteFill>
  );
};

/* ── Palavra revelada por máscara (sobe de dentro da linha). */
const Revela: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const p = progress(f, at, at + 9, ease.out);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0.06em 0.12em 0.1em", margin: "-0.06em -0.12em -0.1em", verticalAlign: "top" }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%) skewX(${(1 - p) * -8}deg)`, opacity: f >= at ? 1 : 0, ...style }}>{children}</span>
    </span>
  );
};

/* ── Kicker: texto pequeno em caixa alta com tracking largo e um traço antes. */
export const Kicker: React.FC<{ text: string; at: number; cor?: string; align?: "left" | "center" }> = ({ text, at, cor = C.limao, align = "center" }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const p = progress(f, at, at + 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: u * 2, justifyContent: align === "center" ? "center" : "flex-start", opacity: p }}>
      {align === "left" && <div style={{ width: u * 7 * p, height: u * 0.45, background: cor }} />}
      <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: u * 3.2, letterSpacing: "0.28em", color: cor, textTransform: "uppercase", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

/* ── Título em duas linhas no padrão Area45mkt: linha 1 branca, linha 2 limão. */
export const Titulo: React.FC<{
  l1: string[]; a1: number[]; l2?: string[]; a2?: number[]; size?: number; size2?: number; cor1?: string; cor2?: string; align?: "left" | "center"; fonte?: "titulo" | "impacto"; base?: boolean; riscar?: number; caixa?: "frase" | "alta" | "original";
}> = ({ l1, a1, l2 = [], a2 = [], size = 10, size2, cor1 = C.branco, cor2 = C.limao, align = "center", fonte = "titulo", base = false, riscar, caixa }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const imp = fonte === "impacto";
  const modo = caixa ?? (imp ? "alta" : "frase");
  if (modo === "frase") {
    const low = (ws: string[]) => ws.map((x) => (/^[A-Z0-9$\/,.!?ÁÉÍÓÚÂÊÔÃÕÇ-]+$/.test(x) && !/^(R\$|AREA45|ÁREA|JU)$/.test(x) ? x.toLowerCase() : x));
    l1 = low(l1); l2 = low(l2);
    if (l1[0]) l1 = [l1[0][0].toUpperCase() + l1[0].slice(1), ...l1.slice(1)];
  }
  const st = (s: number, cor: string): React.CSSProperties => ({ fontFamily: imp ? F.impacto : F.titulo, fontWeight: imp ? 400 : 900, fontStyle: imp ? "normal" : "italic", fontSize: u * s, lineHeight: imp ? 0.98 : 1.04, letterSpacing: imp ? "0.01em" : "-0.01em", color: cor, textTransform: modo === "alta" ? "uppercase" : "none", textShadow: cor === C.limao ? `0 0 ${u * s * 0.12}px rgba(206,250,59,.45)` : undefined });
  const linha = (ws: string[], as: number[], s: number, cor: string, isL2: boolean) => (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: `${imp ? 0.22 : 0.26}em`, justifyContent: align === "center" ? "center" : "flex-start", position: "relative", ...st(s, cor) }}>
      {ws.map((w, i) => <Revela key={i} at={as[i] ?? as[as.length - 1]}>{w}</Revela>)}
      {isL2 && riscar !== undefined && (
        <div style={{ position: "absolute", left: "-2%", width: `${104 * progress(f, riscar, riscar + 8, ease.out)}%`, top: "52%", height: u * 1.4, background: C.alerta, transform: "rotate(-3deg)", borderRadius: u }} />
      )}
    </div>
  );
  const last = (l2.length ? a2 : a1).slice(-1)[0] ?? 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: u * 0.6 }}>
      {linha(l1, a1, size, cor1, false)}
      {l2.length > 0 && linha(l2, a2, size2 ?? size, cor2, true)}
      {base && <Base w={u * 30} h={u * 2.2} style={{ marginTop: u * 1.2, transform: `scaleX(${progress(f, last + 4, last + 14, ease.out)})`, transformOrigin: align === "center" ? "center" : "left" }} />}
    </div>
  );
};

/* ── Celular (mockup). `w` em u. O conteúdo da tela é o children. */
export const Celular: React.FC<{ w?: number; children: React.ReactNode; rotY?: number; rotX?: number; rot?: number; style?: React.CSSProperties; glow?: number }> = ({ w = 52, children, rotY = 0, rotX = 0, rot = 0, style, glow = 0.25 }) => {
  const { u } = useScale();
  const W = u * w, H = W * 2.05;
  return (
    <div style={{ width: W, height: H, transform: `perspective(${u * 260}px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotate(${rot}deg)`, transformStyle: "preserve-3d", ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: W * 0.16, background: "linear-gradient(145deg,#3a3b3a,#121312 40%,#2a2b2a)", boxShadow: `0 ${u * 6}px ${u * 14}px rgba(0,0,0,.7), 0 0 ${u * 12}px rgba(206,250,59,${glow})`, padding: W * 0.035 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: W * 0.13, overflow: "hidden", background: "#0d0e0d" }}>
          {children}
          <div style={{ position: "absolute", top: W * 0.03, left: "50%", width: W * 0.3, height: W * 0.075, marginLeft: -W * 0.15, borderRadius: W, background: "#000" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,.10), transparent 35%)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
};

/* ── Notificação estilo iOS que cai do topo da tela do celular. */
export const Notificacao: React.FC<{ app: string; cor: string; titulo: string; texto: string; at: number; w: number }> = ({ app, cor, titulo, texto, at, w }) => {
  const f = useCurrentFrame();
  const s = useSpring(at, springs.pop);
  return (
    <div style={{ opacity: f >= at ? 1 : 0, transform: `translateY(${(1 - s) * -60}%) scale(${0.94 + 0.06 * s})`, background: "rgba(40,41,40,.92)", borderRadius: w * 0.05, padding: w * 0.035, display: "flex", gap: w * 0.03, alignItems: "flex-start", border: "1px solid rgba(255,255,255,.08)" }}>
      <div style={{ width: w * 0.1, height: w * 0.1, borderRadius: w * 0.025, background: cor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: F.texto, fontWeight: 900, fontSize: w * 0.05 }}>{app[0]}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: w * 0.008, minWidth: 0 }}>
        <div style={{ fontFamily: F.texto, fontWeight: 600, fontSize: w * 0.034, color: "#9a9c97", textTransform: "uppercase", letterSpacing: "0.04em" }}>{app} · agora</div>
        <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: w * 0.045, color: C.branco }}>{titulo}</div>
        <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: w * 0.042, color: "#d6d7d3", lineHeight: 1.25 }}>{texto}</div>
      </div>
    </div>
  );
};

/* ── Perfil do Instagram dentro do celular: versão amadora ou profissional. */
export const Perfil: React.FC<{ tipo: "amador" | "pro"; w: number }> = ({ tipo, w }) => {
  const pro = tipo === "pro";
  const px = (n: number) => w * n;
  const posts = pro
    ? [[C.limao, C.preto, "NOVA\nCOLEÇÃO"], [C.carvao, C.branco, "LOOK\nDO DIA"], [C.branco, C.preto, "SÓ\nHOJE"], [C.preto, C.limao, "JU"], [C.limao, C.preto, "-20%"], [C.carvao, C.branco, "DICAS"], [C.branco, C.preto, "NOVOS\nLOOKS"], [C.carvao, C.limao, "JU"], [C.limao, C.preto, "FRETE\nGRÁTIS"]]
    : [["linear-gradient(135deg,#ff7ad9,#ffe066)", "#2b37ff", "PROMO!!"], ["#3fd16f", "#fff", "novidades"], ["#5b6cff", "#ffe600", "OFERTA"], ["#ff5f5f", "#fff", "liquida"], ["linear-gradient(45deg,#00c6ff,#ff00b8)", "#fff", "chegou!!!"], ["#ffe600", "#d0021b", "SALDÃO"], ["#8a0f9e", "#ffe066", "Bom dia"], ["#ff9a3c", "#1d6b1d", "look"], ["#1aa3a3", "#fff", "PROMO"]];
  const fontesAmador = ["Lobster, cursive", "'Comic Neue', cursive", "Bungee, sans-serif", "Pacifico, cursive"];
  return (
    <div style={{ position: "absolute", inset: 0, background: pro ? "#0d0e0d" : "#fafafa", paddingTop: px(0.16), display: "flex", flexDirection: "column", gap: px(0.035) }}>
      <div style={{ display: "flex", alignItems: "center", gap: px(0.05), padding: `0 ${px(0.05)}px` }}>
        <div style={{ width: px(0.22), height: px(0.22), borderRadius: "50%", background: pro ? C.preto : "linear-gradient(135deg,#ff7ad9,#ffe066 55%,#4dd2ff)", border: pro ? `${px(0.008)}px solid ${C.limao}` : `${px(0.008)}px solid #ffb800`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", overflow: "hidden" }}>
          {pro ? (<><div style={{ fontFamily: F.titulo, fontWeight: 900, fontStyle: "italic", fontSize: px(0.085), color: C.branco, lineHeight: 0.9 }}>JU</div><Base w={px(0.08)} h={px(0.012)} /></>) : <div style={{ fontFamily: "Lobster, cursive", fontSize: px(0.05), color: "#2b37ff", transform: "rotate(-10deg)" }}>Ju ★</div>}
        </div>
        <div style={{ display: "flex", gap: px(0.04), flex: 1, justifyContent: "space-around" }}>
          {[["128", "posts"], [pro ? "4.812" : "312", "seguidores"], ["210", "seguindo"]].map(([n, l], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: px(0.05), color: pro ? C.branco : "#111" }}>{n}</div>
              <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: px(0.032), color: pro ? "#9a9c97" : "#555" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: `0 ${px(0.05)}px`, display: "flex", flexDirection: "column", gap: px(0.008) }}>
        {pro ? (
          <><div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: px(0.042), color: C.branco }}>Moda Ju</div><div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: px(0.035), color: "#c9cac6" }}>Moda feminina com curadoria · Cascavel/PR</div></>
        ) : (
          <><div style={{ fontFamily: "Lobster, cursive", fontSize: px(0.05), color: "#e1306c" }}>Loja da Ju ★★</div><div style={{ fontFamily: "'Comic Neue', cursive", fontWeight: 700, fontSize: px(0.036), color: "#8a0f9e" }}>moda • acessórios • presentes!!! chama no zap</div></>
        )}
      </div>
      <div style={{ display: "flex", gap: px(0.035), padding: `0 ${px(0.05)}px` }}>
        {["Loja", "Novos", "Promo", "Dicas"].map((t, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: px(0.01) }}>
            <div style={{ width: px(0.15), height: px(0.15), borderRadius: "50%", border: `${px(0.006)}px solid ${pro ? C.limao : ["#ff3b30", "#34c759", "#5856d6", "#ff9500"][i]}`, padding: px(0.008) }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: pro ? (i % 2 ? C.branco : C.carvao) : ["#ffe066", "#4dd2ff", "#ff7ad9", "#3fd16f"][i], display: "flex", alignItems: "center", justifyContent: "center" }}>
                {pro && <Base w={px(0.06)} h={px(0.03)} color={i % 2 ? C.preto : C.limao} />}
              </div>
            </div>
            <div style={{ fontFamily: pro ? F.texto : fontesAmador[i], fontWeight: 600, fontSize: px(0.03), color: pro ? C.branco : "#222" }}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: px(0.006) }}>
        {posts.map(([bg, fg, t], i) => (
          <div key={i} style={{ aspectRatio: "1", background: bg, display: "flex", alignItems: pro ? "flex-end" : "center", justifyContent: pro ? "flex-start" : "center", padding: px(0.02), overflow: "hidden" }}>
            <span style={{ fontFamily: pro ? F.titulo : fontesAmador[i % 4], fontWeight: pro ? 900 : 400, fontStyle: pro ? "italic" : "normal", fontSize: px(pro ? 0.045 : 0.05), color: fg, whiteSpace: "pre-line", lineHeight: 1, transform: pro ? undefined : `rotate(${[-8, 6, -4, 10, -6, 3, -9, 5, -2][i]}deg)` }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Selo / etiqueta de anotação com linha até um ponto. */
export const Nota: React.FC<{ text: string; at: number; x: number; y: number; px: number; py: number; cor?: string }> = ({ text, at, x, y, px, py, cor = C.alerta }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const s = useSpring(at, springs.pop);
  const p = progress(f, at, at + 8);
  if (f < at) return null;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
        <line x1={x * u} y1={y * u} x2={(x + (px - x) * p) * u} y2={(y + (py - y) * p) * u} stroke={cor} strokeWidth={u * 0.4} />
        <circle cx={px * u} cy={py * u} r={u * 1.1 * p} fill={cor} />
      </svg>
      <div style={{ position: "absolute", left: x * u, top: y * u, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * s})`, background: cor, color: C.branco, fontFamily: F.texto, fontWeight: 800, fontSize: u * 4.2, padding: `${u * 1}px ${u * 2.2}px`, borderRadius: u * 1.2, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>{text}</div>
    </>
  );
};

/* ── Logo 3D "A" (o mesmo dos Reels Area45mkt), flutuando. */
export const Simbolo3D: React.FC<{ size: number; at?: number }> = ({ size, at = 0 }) => {
  const f = useCurrentFrame();
  const s = useSpring(at, springs.pop);
  return (
    <Img src={staticFile("brand/3d/logo-a-3d.png")} style={{ width: size, height: size, opacity: f >= at ? 1 : 0, transform: `translateY(${Math.sin((f - at) / 18) * size * 0.04}px) rotate(${Math.sin((f - at) / 26) * 4}deg) scale(${0.6 + 0.4 * s})`, filter: `drop-shadow(0 ${size * 0.08}px ${size * 0.2}px rgba(206,250,59,.35))` }} />
  );
};

/* ── Pílula limão (URL / @ / CTA). */
export const Pilula: React.FC<{ text: string; at: number; tone?: "limao" | "escuro"; size?: number }> = ({ text, at, tone = "limao", size = 4.2 }) => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const s = useSpring(at, springs.pop);
  return (
    <div style={{ opacity: f >= at ? 1 : 0, transform: `scale(${0.85 + 0.15 * s})`, background: tone === "limao" ? C.limao : "rgba(245,245,247,.08)", border: tone === "limao" ? "none" : "1px solid rgba(245,245,247,.18)", color: tone === "limao" ? C.preto : C.branco, fontFamily: F.texto, fontWeight: 800, fontSize: u * size, padding: `${u * size * 0.45}px ${u * size * 1.1}px`, borderRadius: u * 10, whiteSpace: "nowrap" }}>{text}</div>
  );
};
