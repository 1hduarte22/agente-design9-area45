import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Base, Cenas, Chip, Fatias, Flash, Fundo, Grao, Linha, Logo, Progresso, Simbolo, Tela, Vazamento, WipeBase, rgbSplit } from "../components";
import { clamp, ease, progress, pulso, shakeAt, springs, useScale, useSpring } from "../lib/motion";
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
          <Chip text="BLACK NOVEMBER · AREA45" tone={pisca ? "escuro" : "limao"} size={3.4} />
          <div style={{ filter: rgbSplit(f, [0, 6, 12], u * 1), display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Linha words={["ÚLTIMOS"]} at={[-6]} size={12} color={pisca ? C.preto : C.branco} />
            <Linha words={["DIAS!"]} at={[-2]} size={16} hi={[0]} hiColor={pisca ? C.preto : C.limao} base={pisca ? undefined : 0} />
          </div>
        </Tela>
      ) : (
        <Tela gap={3}>
          <Linha words={["A", "BLACK", "NOVEMBER"]} at={[h2, T.w("hook2", 1), T.w("hook2", 2)]} size={6.5} color={C.cinza} weight={800} />
          <Linha words={["TERMINA", "DIA"]} at={[T.w("hook2", 8), T.w("hook2", 9)]} size={9.5} />
          <div style={{ filter: rgbSplit(f, [T.w("hook2", 10)], u * 1.2) }}><Linha words={["30/11"]} at={[T.w("hook2", 10)]} size={22} hi={[0]} /></div>
          <div style={{ display: "flex", gap: u * 2, opacity: progress(f, T.w("hook2", 10) + 4, T.w("hook2", 10) + 12) }}>
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
  const drop = T.w("oferta2", 8);
  const s = useSpring(drop, springs.slam);
  const sh = shakeAt(f, [drop], u * 1.8);
  const cnt = Math.round(interpolate(f, [T.w("oferta2", 3), drop], [0, 499], { ...clamp, easing: ease.out }));
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={f >= b ? 0.32 : 0.15} />
      <Tela gap={3.5}>
        <Logo width={u * 32} delay={a} />
        {f < b ? (
          <>
            <Linha words={["IDENTIDADE", "VISUAL"]} at={[a, a + 3]} size={8} />
            <Linha words={["COMPLETA"]} at={[a + 6]} size={9.5} hi={[0]} base={0} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: u * 1.4, justifyContent: "center", width: u * 80 }}>
              {ITENS.map((it, i) => (
                <Chip key={i} text={`✓ ${it.nome}`} delay={T.w("oferta1", [0, 1, 2, 3, 4, 5, 6][i])} size={3.3} tone={i === 0 || i === 6 ? "limao" : "escuro"} />
              ))}
            </div>
          </>
        ) : (
          <Linha words={["A", "IDENTIDADE", "COMPLETA", "POR"]} at={[b, T.w("oferta2", 1), T.w("oferta2", 2), T.w("oferta2", 3)]} size={6.5} hi={[2]} />
        )}
        {f >= b && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: u * 2, filter: rgbSplit(f, [drop], u * 1.2) }}>
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
          <Linha words={["PASSOU", "DO", "DIA", "30,"]} at={[d, T.w("depois", 1), T.w("depois", 2), T.w("depois", 3)]} size={8.5} />
          <div style={{ filter: rgbSplit(f, [T.w("depois", 4)], u * 1.4) }}><Linha words={["ACABOU."]} at={[T.w("depois", 4)]} size={15} hi={[0]} hiColor={C.alerta} /></div>
          <div style={{ width: u * 70, height: u * 3, background: C.carvao, borderRadius: u * 2, overflow: "hidden", marginTop: u * 3 }}>
            <div style={{ width: `${barra * 100}%`, height: "100%", background: barra > 0.3 ? C.limao : C.alerta }} />
          </div>
          <div style={{ fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 4.2, color: C.cinza }}>R$ 499 só até 30/11</div>
        </Tela>
      ) : (
        <Tela gap={4}>
          <Linha words={["COMENTA"]} at={[c]} size={11} />
          <div style={{ opacity: f >= T.w("cta", 1) ? 1 : 0, transform: `scale(${pulse})`, display: "flex", alignItems: "center", gap: u * 3, background: C.branco, borderRadius: u * 6, padding: `${u * 3}px ${u * 5}px`, boxShadow: `0 0 0 ${u * 0.6}px ${C.limao}` }}>
            <Simbolo size={u * 8} style={{ borderRadius: u * 2 }} />
            <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 6.5, color: C.preto, whiteSpace: "nowrap" }}>“EU QUERO”</div>
          </div>
          <Linha words={["E", "GARANTE", "A", "SUA"]} at={[T.w("cta", 3), T.w("cta", 4), T.w("cta", 5), T.w("cta", 6)]} size={7} hi={[1]} />
          <Logo width={u * 30} delay={c + 8} />
          <div style={{ fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 4.2, color: C.branco, opacity: progress(f, c + 12, c + 22) }}>{brand.handle} · até 30/11</div>
        </Tela>
      )}
      <Flash at={c} max={0.45} />
    </AbsoluteFill>
  );
};

export const UltimosDias: React.FC = () => {
  const f = useCurrentFrame();
  const drop = T.w("oferta2", 8);
  const batendo = f < T.ini("oferta1") || (f >= drop && f < T.ini("depois")) || f >= T.ini("cta");
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      <AbsoluteFill style={{ transform: `scale(${batendo ? 1 + 0.012 * pulso(f) : 1})` }}>
        <Cenas
          cenas={[
            { C: Gancho, a: 0, b: T.ini("oferta1") },
            { C: Oferta, a: T.ini("oferta1"), b: T.ini("depois"), entrada: "whip" },
            { C: Final, a: T.ini("depois"), b: T.total, entrada: "punch" },
          ]}
        />
      </AbsoluteFill>
      <Fatias at={[T.ini("hook2"), T.ini("oferta1") - 1, drop, T.w("depois", 4), T.ini("cta")]} />
      <Vazamento at={drop - 2} dur={18} />
      <Grao opacity={0.1} />
      <Progresso total={T.total} />
      <Audio src={staticFile("audio/narracao-ultimos-dias.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-ultimos-dias.wav")} volume={(fr) => (fr < 3 ? 0.55 : 0.28)} />
      <Audio src={staticFile("audio/sfx-ultimos-dias.wav")} volume={0.55} />
    </AbsoluteFill>
  );
};
