/* Black November v5 · Reels "Últimos dias" (19,8 s), 15 cenas curtas.
 * Tempos (segundos) da transcrição palavra por palavra: src/data/palavras-ultimos-dias.json. */
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Cenas, Fatias, Flash, Grao, Logo, Tela, rgbSplit } from "../components";
import { F, Kicker, Palco, Pilula, Simbolo3D } from "../components/v4";
import { Calendario, Frase, Pontos, s } from "../components/v5";
import { clamp, ease, progress, pulso, shakeAt, springs, useScale, useSpring } from "../lib/motion";
import { ITENS, Kit } from "./kit";

export const UD_DURACAO = s(19.8);

const CORTES = {
  ultimos: 0, black: 1.38, termina: 3.08, i1: 4.62, i2: 5.5, i3: 6.14, i4: 7.08, i5: 7.98, i6: 8.56,
  completa: 10.04, preco: 11.08, passou: 13.62, acabou: 15.22, comenta: 16.12, garante: 17.14, fim: 19.8,
};
const c = (k: keyof typeof CORTES) => s(CORTES[k]);

/* 1 · ÚLTIMOS DIAS! (pisca limão) */
const Ultimos: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const pisca = f < 14 && Math.floor(f / 3) % 2 === 0;
  const sh = shakeAt(f, [0, s(0.46)], u * 1.6);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {pisca ? <AbsoluteFill style={{ background: C.limao }} /> : <Palco glow={0.25} fantasma="ÚLTIMOS DIAS" />}
      <Tela justify="center">
        <div style={{ filter: rgbSplit(f, [0, 6, s(0.46)], u * 1) }}>
          <Frase linhas={[{ t: "ÚLTIMOS", at: 0, s: 22, imp: true, cor: pisca ? "p" : "b" }, { t: "DIAS!", at: 0.46, s: 34, imp: true, cor: pisca ? "p" : "l" }]} gap={0} />
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 2 · A Black November da Área 45 */
const Black: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const sb = useSpring(s(1.5), springs.pop);
  return (
    <AbsoluteFill>
      <Palco glow={0.3} fantasma="BLACK NOVEMBER" glowX={50} glowY={55} />
      <Tela justify="center">
        <Frase linhas={[{ t: "A Black November", at: [1.38, 1.42, 1.68], s: 9.5 }, { t: "da Área 45", at: [2.1, 2.32, 2.5], cor: "l", s: 12 }]} />
        <div style={{ display: "flex", alignItems: "center", gap: u * 4, marginTop: u * 7 }}>
          <div style={{ opacity: f >= s(1.5) ? 1 : 0, transform: `rotate(${-6 * sb}deg) scale(${0.6 + 0.4 * sb})`, background: C.limao, color: C.preto, padding: `${u * 2.2}px ${u * 3.6}px`, borderRadius: u * 2, fontFamily: F.titulo, fontWeight: 900, fontStyle: "italic", fontSize: u * 7, lineHeight: 0.95 }}>BLACK<br />NOVEMBER</div>
          <Simbolo3D size={u * 26} at={s(2.3)} />
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 3 · termina dia 30 (tela limão, calendário) */
const Termina: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const sh = shakeAt(f, [s(3.76)], u * 1.6);
  return (
    <AbsoluteFill style={{ background: C.limao, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <div style={{ position: "absolute", top: "44%", left: -u * 10 - f * 2, whiteSpace: "nowrap", fontFamily: F.impacto, fontSize: u * 44, color: "rgba(10,10,10,.06)" }}>ÚLTIMOS DIAS · ÚLTIMOS DIAS · ÚLTIMOS DIAS</div>
      <Tela justify="center">
        <Frase linhas={[{ t: "termina dia", at: [3.08, 3.6], cor: "p", s: 11 }]} />
        <div style={{ marginTop: u * 5 }}><Calendario at={3.76} dia="30" w={u * 44} /></div>
      </Tela>
      <Flash at={s(3.76)} color={C.branco} max={0.5} />
    </AbsoluteFill>
  );
};

/* 4-9 · itens rápidos, um por cena */
const ITENS_UD: { idx: number; linhas: { t: string; at: number[] }[]; at: number }[] = [
  { idx: 0, linhas: [{ t: "Logomarca", at: [4.62] }], at: 4.62 },
  { idx: 1, linhas: [{ t: "Manual", at: [5.5] }], at: 5.5 },
  { idx: 2, linhas: [{ t: "Paleta", at: [6.14] }, { t: "de cores", at: [6.44, 6.58] }], at: 6.14 },
  { idx: 3, linhas: [{ t: "Tipografia", at: [7.08] }], at: 7.08 },
  { idx: 4, linhas: [{ t: "Destaques", at: [7.98] }], at: 7.98 },
  { idx: 6, linhas: [{ t: "e cartão", at: [8.56, 8.7] }, { t: "de visita", at: [9.12, 9.22] }], at: 8.56 },
];
const item = (i: number): React.FC => {
  const Item: React.FC = () => {
    const f = useCurrentFrame();
    const { u, vertical } = useScale();
    const it = ITENS_UD[i];
    const L = it.linhas;
    return (
      <AbsoluteFill>
        <Palco glow={0.2 + 0.06 * pulso(f)} fantasma="IDENTIDADE COMPLETA" glowX={i % 2 ? 25 : 75} glowY={40} />
        <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Kicker text="Tá tudo incluso" at={i === 0 ? s(it.at) : -30} align="left" />
            <div style={{ fontFamily: F.impacto, fontSize: u * 7, color: C.branco }}>{String(i + 1).padStart(2, "0")}<span style={{ color: "#5b5d58" }}>/06</span></div>
          </div>
          <div style={{ height: u * 3 }} />
          <div style={{ minHeight: u * 25, display: "flex", alignItems: "center" }}>
            <Frase linhas={L.map((l, k) => ({ ...l, s: L.length === 1 ? 15 : 11.5, cor: k === L.length - 1 ? "l" : "b" }))} />
          </div>
          <div style={{ marginTop: u * 3, alignSelf: "center", transform: `perspective(${u * 220}px) rotateX(${Math.sin(f / 18) * 3}deg) rotateY(${Math.cos(f / 23) * 4}deg)` }}>
            <Kit atual={it.idx} desde={s(it.at)} altura={vertical ? 40 : 28} />
          </div>
          <div style={{ marginTop: u * 4 }}><Pontos n={6} atual={i} /></div>
        </Tela>
      </AbsoluteFill>
    );
  };
  return Item;
};
const ITENS_C = ITENS_UD.map((_, i) => item(i));

/* 10 · A identidade completa (checklist dos 7 itens) */
const Completa: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = CORTES.completa;
  return (
    <AbsoluteFill>
      <Palco glow={0.22} fantasma="COMPLETA" />
      <Tela justify="flex-start">
        <Frase linhas={[{ t: "A identidade", at: [10.04, 10.12], s: 11 }, { t: "completa", at: 10.56, cor: "l", s: 15 }]} />
        <div style={{ display: "flex", flexDirection: "column", gap: u * 1.6, marginTop: u * 6, alignSelf: "stretch" }}>
          {ITENS.map((it, i) => {
            const at = s(a + 0.15 + i * 0.12);
            const k = progress(f, at, at + 8);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: u * 2.4, opacity: k, transform: `translateX(${(1 - k) * -u * 12}px)` }}>
                <div style={{ width: u * 5, height: u * 5, borderRadius: u * 1.2, background: C.limao, color: C.preto, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.texto, fontWeight: 900, fontSize: u * 3.4 }}>✓</div>
                <div style={{ fontFamily: F.titulo, fontWeight: 900, fontStyle: "italic", fontSize: u * 4.6, color: C.branco, whiteSpace: "nowrap" }}>{it.nome}</div>
              </div>
            );
          })}
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 11 · por R$ 499 (tela limão) */
const Preco: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = c("preco");
  const bate = s(11.9);
  const cnt = Math.round(interpolate(f, [s(11.42), bate], [0, 499], { ...clamp, easing: ease.out }));
  const k = useSpring(bate, springs.slam);
  const sh = shakeAt(f, [bate], u * 2);
  return (
    <AbsoluteFill style={{ background: C.limao, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <div style={{ position: "absolute", top: "62%", left: -u * 60 + f * 2.4, whiteSpace: "nowrap", fontFamily: F.impacto, fontSize: u * 40, color: "rgba(10,10,10,.06)" }}>R$ 499 · R$ 499 · R$ 499 · R$ 499 · R$ 499</div>
      <Tela justify="center">
        <Frase linhas={[{ t: "por", at: 11.08, cor: "p", s: 10 }]} />
        <div style={{ display: "flex", alignItems: "flex-start", marginTop: u * 2, transform: `scale(${f >= bate ? 1.2 - 0.2 * k : 0.9 + 0.1 * progress(f, a, bate)})`, filter: rgbSplit(f, [bate], u * 1.2) }}>
          <span style={{ fontFamily: F.impacto, fontSize: u * 10, color: C.preto, marginTop: u * 5, marginRight: u * 1.5 }}>R$</span>
          <span style={{ fontFamily: F.impacto, fontSize: u * 40, lineHeight: 0.92, color: C.preto, fontVariantNumeric: "tabular-nums" }}>{cnt}</span>
        </div>
        <div style={{ marginTop: u * 4 }}><Kicker text="Black November · Área 45" at={bate + 6} cor={C.preto} /></div>
      </Tela>
      <Flash at={bate} color={C.branco} max={0.55} />
    </AbsoluteFill>
  );
};

/* 12 · Passou do dia 30, */
const Passou: React.FC = () => {
  const { u } = useScale();
  return (
    <AbsoluteFill>
      <Palco glow={0.06} fantasma="PASSOU DO DIA 30" />
      <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 60%, rgba(255,74,61,.14), transparent 70%)" }} />
      <Tela justify="center">
        <Frase linhas={[{ t: "Passou do", at: [13.62, 14.22], s: 11 }, { t: "dia 30,", at: [14.32, 14.48], cor: "r", s: 15 }]} />
        <div style={{ marginTop: u * 5 }}><Calendario at={13.75} dia="30" w={u * 34} riscar={14.6} /></div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 13 · ACABOU. */
const Acabou: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = c("acabou");
  const sh = shakeAt(f, [a], u * 2.2);
  const barra = 1 - progress(f, a, c("comenta") - 4, ease.inOut);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={0.03} fantasma="ACABOU" />
      <Tela justify="center">
        <div style={{ filter: rgbSplit(f, [a], u * 1.2) }}><Frase linhas={[{ t: "ACABOU.", at: 15.22, imp: true, cor: "r", s: 30 }]} /></div>
        <div style={{ width: u * 70, height: u * 2.4, borderRadius: u * 2, background: "rgba(245,245,247,.1)", marginTop: u * 5, overflow: "hidden" }}>
          <div style={{ width: `${barra * 100}%`, height: "100%", background: C.alerta }} />
        </div>
      </Tela>
      <Flash at={a} color={C.alerta} max={0.45} />
    </AbsoluteFill>
  );
};

/* 14 · Comenta EU QUERO */
const Comenta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = c("comenta");
  const txt = "EU QUERO";
  const n = Math.floor(interpolate(f, [s(16.54), s(17.0)], [0, txt.length], clamp));
  return (
    <AbsoluteFill>
      <Palco glow={0.3 + 0.08 * pulso(f)} fantasma="EU QUERO" glowX={50} glowY={70} />
      <Tela justify="center">
        <Frase linhas={[{ t: "Comenta", at: 16.12, s: 12 }, { t: "EU QUERO", at: [16.54, 16.8], cor: "l", s: 20, imp: true }]} />
        <div style={{ marginTop: u * 6, width: u * 72, display: "flex", alignItems: "center", gap: u * 2, border: `${u * 0.4}px solid ${C.limao}`, borderRadius: u * 10, padding: `${u * 2.2}px ${u * 3.5}px`, background: "rgba(20,21,20,.8)", transform: `scale(${0.9 + 0.1 * progress(f, a, a + 10)})` }}>
          <div style={{ width: u * 6, height: u * 6, borderRadius: "50%", background: "#e1306c", flexShrink: 0 }} />
          <div style={{ fontFamily: F.titulo, fontWeight: 900, fontSize: u * 5, color: C.branco, flex: 1 }}>{txt.slice(0, n)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.limao }}>|</span></div>
          <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: u * 3.6, color: n >= txt.length ? C.limao : "#5b5d58" }}>Publicar</div>
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 15 · e garante a sua. */
const Garante: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  return (
    <AbsoluteFill>
      <Palco glow={0.3 + 0.06 * pulso(f)} fantasma="GARANTE A SUA" glowX={50} glowY={60} />
      <Tela justify="center">
        <Frase linhas={[{ t: "e garante", at: [17.14, 17.42], s: 11 }, { t: "a sua.", at: [17.92, 18.02], cor: "l", s: 17 }]} />
        <div style={{ marginTop: u * 6 }}><Simbolo3D size={u * 22} at={s(18.2)} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: u * 4, marginTop: u * 4 }}>
          <Logo width={u * 30} delay={s(18.4)} />
          <Pilula text={brand.handle} at={s(18.6)} size={3.8} />
        </div>
        <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: u * 3.2, color: "#8C8E89", marginTop: u * 4, opacity: progress(f, s(18.8), s(19.1)) }}>Válido até 30/11 · cartão em arquivo digital</div>
      </Tela>
    </AbsoluteFill>
  );
};

export const UltimosDias: React.FC = () => {
  const f = useCurrentFrame();
  const ordem: [React.FC, keyof typeof CORTES, "punch" | "whip" | "zoomout" | "corte"][] = [
    [Ultimos, "ultimos", "corte"], [Black, "black", "whip"], [Termina, "termina", "punch"],
    [ITENS_C[0], "i1", "whip"], [ITENS_C[1], "i2", "punch"], [ITENS_C[2], "i3", "whip"], [ITENS_C[3], "i4", "punch"], [ITENS_C[4], "i5", "whip"], [ITENS_C[5], "i6", "punch"],
    [Completa, "completa", "zoomout"], [Preco, "preco", "punch"], [Passou, "passou", "whip"], [Acabou, "acabou", "corte"], [Comenta, "comenta", "punch"], [Garante, "garante", "whip"],
  ];
  const cenas = ordem.map(([C_, k, entrada], i) => ({ C: C_, a: c(k), b: i < ordem.length - 1 ? c(ordem[i + 1][1]) : UD_DURACAO, entrada }));
  const batendo = f < c("passou") || f >= c("comenta");
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      <AbsoluteFill style={{ transform: `scale(${batendo ? 1 + 0.01 * pulso(f) : 1})` }}>
        <Cenas cenas={cenas} />
      </AbsoluteFill>
      <Fatias at={[6, c("termina") + 20, s(11.9), c("acabou") - 1, c("comenta") - 1]} />
      <Grao opacity={0.08} />
      <Audio src={staticFile("audio/narracao-ultimos-dias.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-ultimos-dias.wav")} volume={(fr) => (fr < 3 ? 0.5 : 0.24)} />
      <Audio src={staticFile("audio/sfx-ultimos-dias.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
