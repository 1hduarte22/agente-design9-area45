import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Base, Chip, Flash, Fundo, Linha, Logo, Progresso, Simbolo, Tela, WipeBase } from "../components";
import { clamp, ease, progress, shakeAt, springs, useScale, useSpring } from "../lib/motion";
import { makeT } from "../lib/tempos";
import tempos from "../data/tempos-ultimos-dias.json";
import { ITENS } from "./kit";

const T = makeT(tempos);
export const UD_DURACAO = T.total;

/* Gancho: alarme limão piscando 3x + ÚLTIMA CHAMADA, depois "acaba dia 30" com relógio. */
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const h2 = T.ini("hook2");
  const pisca = f < 18 && Math.floor(f / 3) % 2 === 0;
  const sh = shakeAt(f, [0, 8], u * 1.5);
  const seg = Math.max(0, 59 - Math.floor((f - h2) / 3));
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)`, background: pisca ? C.limao : undefined }}>
      {!pisca && <Fundo glow={0.22} />}
      {f < h2 ? (
        <Tela gap={3}>
          <Chip text="⏰ ALERTA" tone={pisca ? "escuro" : "limao"} size={3.4} />
          <Linha words={["ÚLTIMA"]} at={[0]} size={15} color={pisca ? C.preto : C.branco} />
          <Linha words={["CHAMADA!"]} at={[4]} size={12.5} hi={[0]} hiColor={pisca ? C.preto : C.limao} />
        </Tela>
      ) : (
        <Tela gap={3}>
          <Linha words={["A", "BLACK", "NOVEMBER"]} at={[h2, T.w("hook2", 1), T.w("hook2", 2)]} size={6.5} color={C.cinza} weight={800} />
          <Linha words={["ACABA", "DIA"]} at={[T.w("hook2", 6), T.w("hook2", 7)]} size={11} />
          <Linha words={["30/11"]} at={[T.w("hook2", 8)]} size={24} hi={[0]} />
          <div style={{ display: "flex", gap: u * 2, opacity: progress(f, T.w("hook2", 8) + 4, T.w("hook2", 8) + 12) }}>
            {[["00", "dias"], ["23", "horas"], [String(seg).padStart(2, "0"), "seg"]].map(([n, l], i) => (
              <div key={i} style={{ background: C.carvao, border: `1px solid ${C.linha}`, borderRadius: u * 2, padding: `${u * 1.5}px ${u * 3}px`, textAlign: "center" }}>
                <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 7, color: i === 2 ? C.limao : C.branco, fontVariantNumeric: "tabular-nums" }}>{n}</div>
                <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 2.4, color: C.cinza }}>{l}</div>
              </div>
            ))}
          </div>
        </Tela>
      )}
      <Flash at={h2} color={C.branco} max={0.3} />
    </AbsoluteFill>
  );
};

/* Oferta: itens em cascata ("do logo ao cartão") e o preço batendo no drop. */
const Oferta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = T.ini("oferta1"), b = T.ini("oferta2");
  const drop = T.w("oferta2", 1);
  const s = useSpring(drop, springs.slam);
  const sh = shakeAt(f, [drop], u * 1.8);
  const cnt = Math.round(interpolate(f, [b, drop], [0, 499], { ...clamp, easing: ease.out }));
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={f >= b ? 0.32 : 0.15} />
      <Tela gap={3.5}>
        <Logo width={u * 36} delay={a} />
        <Linha words={["IDENTIDADE", "VISUAL"]} at={[a + 2, T.w("oferta1", 1)]} size={8.5} />
        <Linha words={["COMPLETA"]} at={[T.w("oferta1", 2)]} size={10} hi={[0]} base={0} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: u * 1.6, justifyContent: "center", width: u * 86 }}>
          {ITENS.map((it, i) => (
            <Chip key={i} text={`✓ ${it.nome}`} delay={T.w("oferta1", 3) + i * 4} size={2.9} tone={i === 0 || i === 6 ? "limao" : "escuro"} />
          ))}
        </div>
        {f >= b && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: u * 2 }}>
            <div style={{ display: "flex", alignItems: "flex-start", fontFamily: brand.font.display, fontWeight: 900, color: f >= drop ? C.limao : C.branco, transform: `scale(${f >= drop ? 1.25 - 0.25 * s : 1})`, letterSpacing: "-0.05em", lineHeight: 1 }}>
              <span style={{ fontSize: u * 6, marginTop: u * 3, marginRight: u }}>R$</span>
              <span style={{ fontSize: u * 21, fontVariantNumeric: "tabular-nums" }}>{cnt}</span>
              <span style={{ fontSize: u * 6, marginTop: u * 3 }}>,00</span>
            </div>
            <Base w={u * 46} h={u * 3.6} style={{ transform: `scaleX(${progress(f, drop, drop + 10)})` }} />
          </div>
        )}
      </Tela>
      <WipeBase at={a - 6} dur={12} />
      <Flash at={drop} max={0.55} />
    </AbsoluteFill>
  );
};

/* Depois: o preço "some" (barra de tempo esvaziando) + CTA. */
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const d = T.ini("depois"), c = T.ini("cta");
  const barra = 1 - progress(f, d, c, ease.inOut);
  const pulse = 1 + Math.max(0, Math.sin((f - c) / 5)) * 0.04;
  return (
    <AbsoluteFill>
      <Fundo glow={f >= c ? 0.28 : 0.08} />
      {f < c ? (
        <Tela gap={4}>
          <Linha words={["DEPOIS", "DISSO"]} at={[d, T.w("depois", 1)]} size={7} color={C.cinza} weight={800} />
          <Linha words={["VOLTA", "PRO", "PREÇO"]} at={[T.w("depois", 2), T.w("depois", 3), T.w("depois", 4)]} size={9.5} />
          <Linha words={["NORMAL."]} at={[T.w("depois", 5)]} size={12} hi={[0]} hiColor={C.alerta} />
          <div style={{ width: u * 70, height: u * 3, background: C.carvao, borderRadius: u * 2, overflow: "hidden", marginTop: u * 3 }}>
            <div style={{ width: `${barra * 100}%`, height: "100%", background: barra > 0.3 ? C.limao : C.alerta }} />
          </div>
          <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 3.2, color: C.cinza }}>R$ 499 só até 30/11</div>
        </Tela>
      ) : (
        <Tela gap={4}>
          <Linha words={["CORRE!"]} at={[c]} size={15} hi={[0]} />
          <div style={{ opacity: f >= T.w("cta", 2) ? 1 : 0, transform: `scale(${pulse})`, display: "flex", alignItems: "center", gap: u * 3, background: C.branco, borderRadius: u * 6, padding: `${u * 3}px ${u * 5}px`, boxShadow: `0 0 0 ${u * 0.6}px ${C.limao}` }}>
            <Simbolo size={u * 8} style={{ borderRadius: u * 2 }} />
            <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 5.2, color: C.preto, whiteSpace: "nowrap" }}>COMENTA “EU QUERO”</div>
          </div>
          <Logo width={u * 30} delay={c + 8} />
          <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 3.2, color: C.branco, opacity: progress(f, c + 12, c + 22) }}>{brand.handle} · WhatsApp no perfil</div>
        </Tela>
      )}
      <Flash at={c} max={0.45} />
    </AbsoluteFill>
  );
};

export const UltimosDias: React.FC = () => {
  const cenas: [React.FC, number, number][] = [
    [Gancho, 0, T.ini("oferta1")],
    [Oferta, T.ini("oferta1"), T.ini("depois")],
    [Final, T.ini("depois"), T.total],
  ];
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      {cenas.map(([Cena, a, b], i) => (
        <Sequence key={i} from={i === 0 ? 0 : a - 1} durationInFrames={b - a + 1} layout="none">
          <AbsoluteFill>
            <Sequence from={-(i === 0 ? 0 : a - 1)} layout="none"><Cena /></Sequence>
          </AbsoluteFill>
        </Sequence>
      ))}
      <Progresso total={T.total} />
      <Audio src={staticFile("audio/narracao-ultimos-dias.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-ultimos-dias.wav")} volume={(fr) => (fr < 2 ? 0.55 : 0.3)} />
      <Audio src={staticFile("audio/sfx-ultimos-dias.wav")} volume={0.55} />
    </AbsoluteFill>
  );
};
