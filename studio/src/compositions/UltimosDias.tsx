import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Cenas, Fatias, Flash, Grao, Logo, Tela, Vazamento, rgbSplit } from "../components";
import { Celular, F, Kicker, Notificacao, Palco, Pilula, Simbolo3D, Titulo } from "../components/v4";
import { clamp, ease, progress, pulso, shakeAt, springs, useScale, useSpring } from "../lib/motion";
import { makeT } from "../lib/tempos";
import tempos from "../data/tempos-ultimos-dias.json";
import { ITENS } from "./kit";

const T = makeT(tempos);
export const UD_DURACAO = T.total;
const w = T.w;
const DROP = w("oferta2", 8);

/* Gancho: tela pisca limão, ÚLTIMOS DIAS e contagem regressiva no celular. */
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const h2 = T.ini("hook2");
  const pisca = f < 14 && Math.floor(f / 3) % 2 === 0;
  const sh = shakeAt(f, [0, w("hook2", 10)], u * 1.4);
  const seg = Math.max(0, 59 - Math.floor(f / 3) % 60);
  const W = u * 46;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {pisca ? <AbsoluteFill style={{ background: C.limao }} /> : <Palco glow={0.22} fantasma="ÚLTIMOS DIAS" />}
      <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
        <div style={{ filter: rgbSplit(f, [0, 6, w("hook2", 10)], u * 0.9) }}>
          {f < h2 ? (
            <>
              <Kicker text="Black November Area45" at={-10} cor={pisca ? C.preto : C.limao} />
              <div style={{ height: u * 2 }} />
              <Titulo l1={["ÚLTIMOS"]} a1={[-8]} l2={["DIAS!"]} a2={[-4]} size={14} size2={22} cor1={pisca ? C.preto : C.branco} cor2={pisca ? C.preto : C.limao} fonte="impacto" />
            </>
          ) : (
            <>
              <Kicker text="A Black November termina" at={h2} />
              <div style={{ height: u * 2 }} />
              <Titulo l1={["TERMINA", "DIA"]} a1={[w("hook2", 8), w("hook2", 9)]} l2={["30/11"]} a2={[w("hook2", 10)]} size={10} size2={22} fonte="impacto" />
            </>
          )}
        </div>
        {f >= h2 && (
          <div style={{ display: "flex", gap: u * 2, marginTop: u * 4, opacity: progress(f, h2 + 4, h2 + 14) }}>
            {[["00", "dias"], ["23", "horas"], ["59", "min"], [String(seg).padStart(2, "0"), "seg"]].map(([n, l], i) => (
              <div key={i} style={{ flex: 1, background: "rgba(245,245,247,.06)", border: `1px solid ${i === 3 ? C.limao : C.linha}`, borderRadius: u * 2.5, padding: `${u * 1.6}px 0`, textAlign: "center" }}>
                <div style={{ fontFamily: F.impacto, fontSize: u * 9, color: i === 3 ? C.limao : C.branco, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: F.texto, fontWeight: 700, fontSize: u * 3, color: "#9a9c97", letterSpacing: "0.15em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        )}
        {f < h2 && (
          <div style={{ marginTop: u * 4, alignSelf: "center" }}>
            <Celular w={46} rotX={6} glow={0.3}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1b1c1b,#0b0b0b)", padding: `${W * 0.2}px ${W * 0.05}px`, display: "flex", flexDirection: "column", gap: W * 0.04 }}>
                <Notificacao app="Lembrete" cor="#ff9500" titulo="Black November Area45" texto="Termina dia 30/11" at={2} w={W * 0.9} />
              </div>
            </Celular>
          </div>
        )}
      </Tela>
    </AbsoluteFill>
  );
};

/* Oferta: entregas marcadas a cada palavra e o preço travando em R$ 499. */
const Oferta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = T.ini("oferta1"), b = T.ini("oferta2");
  const s = useSpring(DROP, springs.slam);
  const sh = shakeAt(f, [DROP], u * 1.8);
  const c0 = w("oferta2", 3);
  const cnt = Math.round(interpolate(f, [c0, DROP], [0, 499], { ...clamp, easing: ease.out }));
  const ats = [0, 1, 2, 3, 4, 5, 6].map((n) => w("oferta1", n));
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={f >= DROP ? 0.32 : 0.15} fantasma="R$ 499" />
      <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
        {f < b ? (
          <>
            <Kicker text="Identidade visual completa" at={a} />
            <div style={{ height: u * 3 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: u * 1.6 }}>
              {ITENS.map((it, i) => {
                const on = f >= ats[i];
                const p = progress(f, ats[i], ats[i] + 8, ease.out);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: u * 3, opacity: on ? 1 : 0.15, transform: `translateX(${on ? (1 - p) * -6 * u : 0}px)` }}>
                    <div style={{ width: u * 6, height: u * 6, borderRadius: u * 1.5, background: on ? C.limao : "transparent", border: `${u * 0.35}px solid ${on ? C.limao : C.linha}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.texto, fontWeight: 900, fontSize: u * 4, color: C.preto }}>{on ? "✓" : ""}</div>
                    <div style={{ fontFamily: F.titulo, fontWeight: 900, fontStyle: "italic", fontSize: u * 4.8, color: C.branco, textTransform: "uppercase", whiteSpace: "nowrap" }}>{it.nome}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <Kicker text="Tudo isso por" at={b} />
            <div style={{ height: u * 2.5 }} />
            <Titulo l1={["A", "IDENTIDADE"]} a1={[b, w("oferta2", 1)]} l2={["COMPLETA", "POR"]} a2={[w("oferta2", 2), c0]} size={9} size2={9} />
            <div style={{ display: "flex", alignItems: "flex-start", marginTop: u * 3, filter: rgbSplit(f, [DROP], u * 1.2), opacity: f >= c0 ? 1 : 0, transform: `scale(${f >= DROP ? 1.18 - 0.18 * s : 1})`, transformOrigin: "left center" }}>
              <span style={{ fontFamily: F.impacto, fontSize: u * 9, color: C.limao, marginTop: u * 4, marginRight: u * 1.5 }}>R$</span>
              <span style={{ fontFamily: F.impacto, fontSize: u * 34, lineHeight: 0.9, color: f >= DROP ? C.limao : C.branco, fontVariantNumeric: "tabular-nums" }}>{cnt}</span>
              <span style={{ fontFamily: F.impacto, fontSize: u * 9, color: C.limao, marginTop: u * 4 }}>,00</span>
            </div>
            <div style={{ marginTop: u * 3 }}><Simbolo3D size={u * 16} at={DROP + 4} /></div>
          </>
        )}
      </Tela>
      <Flash at={DROP} max={0.55} />
    </AbsoluteFill>
  );
};

/* Final: ACABOU em vermelho com a barra esvaziando, depois o CTA. */
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const d = T.ini("depois"), c = T.ini("cta");
  const barra = 1 - progress(f, d, c, ease.inOut);
  return (
    <AbsoluteFill>
      <Palco glow={f >= c ? 0.28 : 0.06} fantasma={f >= c ? "EU QUERO" : "ACABOU"} />
      <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
        {f < c ? (
          <>
            <Kicker text="Não deixa pra depois" at={d} cor={C.alerta} />
            <div style={{ height: u * 2.5 }} />
            <div style={{ filter: rgbSplit(f, [w("depois", 4)], u * 1.3) }}>
              <Titulo l1={["PASSOU", "DO", "DIA", "30,"]} a1={[d, w("depois", 1), w("depois", 2), w("depois", 3)]} l2={["ACABOU."]} a2={[w("depois", 4)]} size={9} size2={20} cor2={C.alerta} fonte="impacto" />
            </div>
            <div style={{ height: u * 2.4, background: C.carvao, borderRadius: u * 2, overflow: "hidden", marginTop: u * 5 }}>
              <div style={{ width: `${barra * 100}%`, height: "100%", background: barra > 0.3 ? C.limao : C.alerta }} />
            </div>
            <div style={{ fontFamily: F.texto, fontWeight: 700, fontSize: u * 4.2, color: "#9a9c97", marginTop: u * 2 }}>R$ 499 só até 30/11</div>
          </>
        ) : (
          <>
            <Kicker text="Garante a sua" at={c} />
            <div style={{ height: u * 2.5 }} />
            <Titulo l1={["COMENTA"]} a1={[c]} l2={["EU", "QUERO"]} a2={[w("cta", 1), w("cta", 2)]} size={11} size2={15} />
            <div style={{ height: u * 3 }} />
            <Titulo l1={["E", "GARANTE", "A", "SUA."]} a1={[w("cta", 3), w("cta", 4), w("cta", 5), w("cta", 6)]} size={6.5} />
            <div style={{ display: "flex", alignItems: "center", gap: u * 4, marginTop: u * 5 }}>
              <Logo width={u * 30} delay={c + 10} />
              <Pilula text={brand.handle} at={c + 16} size={3.6} />
            </div>
          </>
        )}
      </Tela>
      <Flash at={c} max={0.4} />
    </AbsoluteFill>
  );
};

export const UltimosDias: React.FC = () => {
  const f = useCurrentFrame();
  const batendo = f < T.ini("oferta1") || (f >= DROP && f < T.ini("depois")) || f >= T.ini("cta");
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      <AbsoluteFill style={{ transform: `scale(${batendo ? 1 + 0.01 * pulso(f) : 1})` }}>
        <Cenas
          cenas={[
            { C: Gancho, a: 0, b: T.ini("oferta1") },
            { C: Oferta, a: T.ini("oferta1"), b: T.ini("depois"), entrada: "whip" },
            { C: Final, a: T.ini("depois"), b: T.total, entrada: "punch" },
          ]}
        />
      </AbsoluteFill>
      <Fatias at={[T.ini("hook2"), DROP, w("depois", 4), T.ini("cta")]} />
      <Vazamento at={DROP - 2} dur={18} />
      <Grao opacity={0.08} />
      <Audio src={staticFile("audio/narracao-ultimos-dias.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-ultimos-dias.wav")} volume={(fr) => (fr < 3 ? 0.5 : 0.24)} />
      <Audio src={staticFile("audio/sfx-ultimos-dias.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
