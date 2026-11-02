import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, random } from "remotion";
import { brand, C } from "../brand/brand";
import { Base, Chip, Flash, Fundo, Linha, Logo, Progresso, Simbolo, Tela, WipeBase } from "../components";
import { clamp, ease, progress, shakeAt, springs, useScale, useSpring } from "../lib/motion";
import { makeT } from "../lib/tempos";
import tempos from "../data/tempos-principal.json";
import { Kit, ITENS } from "./kit";

const T = makeT(tempos);
export const BN_DURACAO = T.total;

/* Cena 1 · Gancho (0 → dor1): o feed rolando trava de repente. */
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { u, height } = useScale();
  const stop = 7;
  const scroll = f < stop ? f * 160 : stop * 160 + (1 - Math.exp(-(f - stop) / 2)) * 40;
  const blur = f < stop ? 14 : interpolate(f, [stop, stop + 4], [14, 0], clamp);
  const fase2 = T.ini("hook2"), fase3 = T.ini("hook3");
  const dim = f >= stop ? 0.25 : 1;
  return (
    <AbsoluteFill>
      <Fundo glow={0.12} />
      {/* posts falsos do feed */}
      <AbsoluteFill style={{ transform: `translateY(${-scroll % (u * 120)}px)`, filter: `blur(${blur}px)`, opacity: dim, alignItems: "center" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ marginTop: u * 6, width: u * 82, height: u * 100, borderRadius: u * 3, background: [C.carvao, "#2b2440", "#3a2a22", C.linha, "#20323a", "#3a2236"][i], border: `1px solid ${C.linha}` }} />
        ))}
      </AbsoluteFill>
      {f >= 3 && f < fase2 && (
        <Tela>
          <Linha words={["PARA", "DE", "ROLAR!"]} at={[3, 9, 15]} size={13} hi={[2]} base={2} />
        </Tela>
      )}
      {f >= fase2 && f < fase3 && (
        <Tela gap={5}>
          <Linha words={["SUA", "MARCA", "TÁ"]} at={[fase2, T.w("hook2", 1), T.w("hook2", 2)]} size={8} />
          <Linha words={["ESPANTANDO"]} at={[T.w("hook2", 3)]} size={11.5} hi={[0]} base={0} />
          <Linha words={["CLIENTE"]} at={[T.w("hook2", 4)]} size={13} />
          <div style={{ display: "flex", flexDirection: "column", gap: u * 2, alignItems: "center", marginTop: u * 3 }}>
            <Chip text="✕  deixou de seguir você" delay={T.w("hook2", 3) + 2} />
            <Chip text="✓✓ visualizou e não respondeu" delay={T.w("hook2", 3) + 9} />
            <Chip text="→ fechou com o concorrente" delay={T.w("hook2", 4) + 6} tone="alerta" />
          </div>
        </Tela>
      )}
      {f >= fase3 && (
        <Tela gap={2}>
          <div style={{ transform: `scale(${1 + progress(f, fase3, fase3 + 40) * 0.08})` }}>
            <Linha words={["E", "VOCÊ", "NEM"]} at={[fase3, T.w("hook3", 1), T.w("hook3", 2)]} size={12} />
            <Linha words={["PERCEBEU."]} at={[T.w("hook3", 3)]} size={11.5} hi={[0]} />
          </div>
        </Tela>
      )}
      <Flash at={stop} color={C.branco} max={0.35} />
      <Flash at={fase3} max={0.3} />
    </AbsoluteFill>
  );
};

/* Cena 2 · Dor: a marca improvisada, com etiquetas e o carimbo AMADOR. */
const MarcaImprovisada: React.FC<{ glitch: number }> = ({ glitch }) => {
  const { u } = useScale();
  const f = useCurrentFrame();
  const g = f % 9 < 2 ? glitch : 0;
  return (
    <div style={{ position: "relative", width: u * 80, height: u * 62, transform: `rotate(-3deg) translateX(${g * u}px)` }}>
      {/* cartão feio */}
      <div style={{ position: "absolute", left: 0, top: 0, width: u * 58, height: u * 34, background: "linear-gradient(135deg,#ff7ad9,#ffe066 55%,#4dd2ff)", borderRadius: u * 1.2, padding: u * 3, transform: "rotate(-4deg)", boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: "Lobster, cursive", fontSize: u * 7.5, color: "#2b37ff", textShadow: "3px 3px 0 #ff2a2a", transform: "rotate(-6deg)", fontStyle: "italic" }}>Loja da Ju ★</div>
        <div style={{ fontFamily: "'Comic Neue', cursive", fontWeight: 700, fontSize: u * 3.4, color: "#8a0f9e", marginTop: u * 2 }}>moda • acessórios • presentes!!!</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: u * 2.6, color: "#1d6b1d", marginTop: u * 1.5 }}>zap: (45) 9 9999-9999</div>
      </div>
      {/* posts sem padrão */}
      {[
        ["#ff5f5f", "Pacifico, cursive", "PROMO!!", 6, 38],
        ["#3fd16f", "'Comic Neue', cursive", "novidades", 31, 44],
        ["#5b6cff", "Bungee, sans-serif", "OFERTA", 55, 36],
      ].map(([bg, ff, txt, x, y], i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) * u, top: (y as number) * u, width: u * 22, height: u * 22, background: bg as string, borderRadius: u * (i === 1 ? 6 : 0.6), display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${[6, -8, 4][i]}deg)`, border: `${u * 0.6}px solid ${["#ffe600", "#fff", "#000"][i]}` }}>
          <span style={{ fontFamily: ff as string, color: ["#fff", "#2a2a2a", "#ffe600"][i], fontSize: u * 3.6 }}>{txt}</span>
        </div>
      ))}
    </div>
  );
};

const Dor: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = T.ini("dor1");
  const tags = [
    { t: "LOGO TORTO", at: a, x: -2, y: -2 },
    { t: "COR ALEATÓRIA", at: T.w("dor1", 2), x: 44, y: 6 },
    { t: "CADA POST DE UM JEITO", at: T.w("dor1", 4), x: 6, y: 66 },
  ];
  const d2 = T.ini("dor2");
  const carimbo = T.w("dor2", 6);
  const s = useSpring(carimbo, springs.slam);
  const sh = shakeAt(f, [carimbo], u * 1.6);
  const cinza = progress(f, carimbo, carimbo + 6);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={0.05} />
      <Tela gap={6}>
        <div style={{ height: u * 16, display: "flex", alignItems: "center" }}>
          {f < d2 ? (
            <Linha words={["SUA", "MARCA", "HOJE:"]} at={[a, a + 3, a + 6]} size={7} color={C.cinza} font="display" weight={800} />
          ) : (
            <Linha words={["O CLIENTE", "BATE O OLHO", "E PENSA:"]} at={[d2, T.w("dor2", 2), T.w("dor2", 5)]} size={5.6} weight={800} />
          )}
        </div>
        <div style={{ position: "relative", filter: `grayscale(${cinza * 0.85}) brightness(${1 - cinza * 0.35})` }}>
          <MarcaImprovisada glitch={f > T.w("dor1", 2) ? 1.2 : 0} />
          {tags.map((tg, i) => {
            const p = progress(f, tg.at, tg.at + 8);
            return (
              <div key={i} style={{ position: "absolute", left: tg.x * u, top: tg.y * u, opacity: f >= tg.at ? 1 : 0, transform: `scale(${0.6 + 0.4 * p}) rotate(${[-6, 5, -3][i]}deg)` }}>
                <div style={{ background: C.preto, color: C.branco, border: `${u * 0.4}px solid ${C.branco}`, padding: `${u * 1.2}px ${u * 2.2}px`, fontFamily: brand.font.display, fontWeight: 800, fontSize: u * 3.6, whiteSpace: "nowrap" }}>✕ {tg.t}</div>
              </div>
            );
          })}
        </div>
      </Tela>
      {f >= carimbo && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `rotate(-9deg) scale(${2.2 - 1.2 * s})`, border: `${u * 1.3}px solid ${C.alerta}`, padding: `${u * 1}px ${u * 4}px`, color: C.alerta, fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 12.5, letterSpacing: "-0.03em", background: "rgba(10,10,10,.82)", borderRadius: u * 1.5 }}>AMADOR.</div>
        </AbsoluteFill>
      )}
      <Flash at={carimbo} color={C.alerta} max={0.35} />
    </AbsoluteFill>
  );
};

/* Cena 3 · Oferta: Black November + identidade completa + R$ 499. */
const Oferta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = T.ini("oferta1"), b = T.ini("oferta2"), c = T.ini("oferta3");
  const drop = T.w("oferta3", 1);
  const cnt = Math.round(interpolate(f, [c, drop + 2], [0, 499], { ...clamp, easing: ease.out }));
  const sh = shakeAt(f, [drop + 2], u * 1.8);
  const s = useSpring(drop + 2, springs.slam);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={f >= c ? 0.3 : 0.16} />
      <Tela gap={4}>
        <Logo width={u * 42} delay={a + 4} />
        {f < b && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1 }}>
            <Chip text="CONDIÇÃO ESPECIAL DE NOVEMBRO" delay={a + 2} tone="limao" size={2.8} />
            <Linha words={["BLACK"]} at={[T.w("oferta1", 1)]} size={20} />
            <Linha words={["NOVEMBER"]} at={[T.w("oferta1", 2)]} size={13.6} outline hi={[0]} />
          </div>
        )}
        {f >= b && f < c && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1 }}>
            <Linha words={["VOCÊ", "LEVA", "A"]} at={[b, T.w("oferta2", 1), T.w("oferta2", 2)]} size={6} color={C.cinza} weight={800} />
            <Linha words={["IDENTIDADE"]} at={[T.w("oferta2", 3)]} size={12} />
            <Linha words={["VISUAL"]} at={[T.w("oferta2", 4)]} size={12} />
            <Linha words={["COMPLETA"]} at={[T.w("oferta2", 5)]} size={12} hi={[0]} base={0} />
          </div>
        )}
        {f >= c && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Linha words={["POR", "APENAS"]} at={[c, c + 4]} size={6} color={C.cinza} weight={800} />
            <div style={{ display: "flex", alignItems: "flex-start", fontFamily: brand.font.display, fontWeight: 900, color: f >= drop + 2 ? C.limao : C.branco, transform: `scale(${f >= drop + 2 ? 1.25 - 0.25 * s : 1})`, letterSpacing: "-0.05em", lineHeight: 1 }}>
              <span style={{ fontSize: u * 7, marginTop: u * 3.5, marginRight: u * 1 }}>R$</span>
              <span style={{ fontSize: u * 24, fontVariantNumeric: "tabular-nums" }}>{cnt}</span>
              <span style={{ fontSize: u * 7, marginTop: u * 3.5 }}>,00</span>
            </div>
            <Base w={u * 56} h={u * 4.5} style={{ transform: `scaleX(${progress(f, drop + 2, drop + 12)})` }} />
          </div>
        )}
      </Tela>
      <WipeBase at={a - 6} dur={12} />
      <Flash at={drop + 2} max={0.6} />
    </AbsoluteFill>
  );
};

/* Cena 4 · O que vem no pacote: cada item entra na hora da fala. */
const Itens: React.FC = () => {
  const f = useCurrentFrame();
  const { u, vertical } = useScale();
  const ats = ITENS.map((_, i) => T.ini(`item${i + 1}`));
  const atual = ats.filter((a) => f >= a).length - 1;
  return (
    <AbsoluteFill>
      <Fundo glow={0.12} />
      <Tela gap={vertical ? 4 : 2.5} justify="center">
        <Chip text="O QUE VEM NO PACOTE" tone="limao" delay={ats[0] - 6} size={2.8} />
        <Kit atual={Math.max(0, atual)} desde={ats[Math.max(0, atual)]} altura={vertical ? 46 : 30} />
        <div style={{ display: "flex", flexDirection: "column", gap: u * (vertical ? 1.4 : 0.8), width: u * 84 }}>
          {ITENS.map((it, i) => {
            const on = f >= ats[i];
            const p = progress(f, ats[i], ats[i] + 8);
            const cur = i === atual;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: u * 2.5, opacity: on ? (cur ? 1 : 0.55) : 0.12, transform: `translateX(${(1 - p) * -8 * u}px)` }}>
                <div style={{ width: u * 5, height: u * 5, borderRadius: u * 1, background: on ? C.limao : "transparent", border: `${u * 0.35}px solid ${on ? C.limao : C.linha}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.preto, fontWeight: 900, fontSize: u * 3.4, fontFamily: brand.font.text }}>{on ? "✓" : ""}</div>
                <div style={{ fontFamily: brand.font.display, fontWeight: cur ? 800 : 600, fontSize: u * (vertical ? 3.9 : 3.5), color: C.branco, textTransform: "uppercase", letterSpacing: "-0.01em" }}>{it.nome}</div>
              </div>
            );
          })}
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* Cena 5 · Preço e prazo. */
const Preco: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = T.ini("preco"), p = T.ini("prazo");
  const hit = T.w("preco", 3);
  const s = useSpring(hit, springs.slam);
  const cal = T.w("prazo", 2);
  const s2 = useSpring(cal, springs.slam);
  const sh = shakeAt(f, [hit, cal], u * 1.4);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)`, background: f >= p ? C.limao : undefined }}>
      {f < p && <Fundo glow={0.35} />}
      <Tela gap={3}>
        {f < p ? (
          <>
            <Linha words={["TUDO", "ISSO", "POR"]} at={[a, T.w("preco", 1), T.w("preco", 2)]} size={9} />
            <div style={{ display: "flex", alignItems: "flex-start", fontFamily: brand.font.display, fontWeight: 900, color: C.limao, opacity: f >= hit ? 1 : 0, transform: `scale(${1.4 - 0.4 * s})`, letterSpacing: "-0.05em", lineHeight: 1 }}>
              <span style={{ fontSize: u * 7, marginTop: u * 3.5, marginRight: u * 1 }}>R$</span>
              <span style={{ fontSize: u * 24 }}>499</span>
              <span style={{ fontSize: u * 7, marginTop: u * 3.5 }}>,00</span>
            </div>
            <Chip text="7 entregas · 1 pacote · pagamento único" delay={hit + 8} size={3} />
          </>
        ) : (
          <>
            <Linha words={["SÓ", "ATÉ"]} at={[p, T.w("prazo", 1)]} size={11} color={C.preto} />
            <div style={{ transform: `scale(${1.5 - 0.5 * s2}) rotate(${-3 * s2}deg)`, opacity: f >= cal ? 1 : 0, background: C.preto, borderRadius: u * 4, overflow: "hidden", width: u * 56, boxShadow: "0 30px 60px rgba(0,0,0,.35)" }}>
              <div style={{ background: C.grafite, color: C.limao, fontFamily: brand.font.display, fontWeight: 800, fontSize: u * 4.5, textAlign: "center", padding: u * 2, letterSpacing: "0.1em" }}>NOVEMBRO</div>
              <div style={{ color: C.branco, fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 26, textAlign: "center", lineHeight: 1.15, letterSpacing: "-0.05em" }}>30</div>
            </div>
            <Linha words={["DE", "NOVEMBRO"]} at={[T.w("prazo", 3), T.w("prazo", 4)]} size={7.5} color={C.preto} />
          </>
        )}
      </Tela>
      <Flash at={hit} max={0.5} />
      <Flash at={p} color={C.branco} max={0.5} />
    </AbsoluteFill>
  );
};

/* Cena 6 · CTA: comenta EU QUERO ou WhatsApp. */
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = T.ini("cta");
  const digita = "EU QUERO";
  const n = Math.floor(interpolate(f, [T.w("cta", 1), T.w("cta", 2) + 4], [0, digita.length], clamp));
  const pulse = 1 + Math.max(0, Math.sin((f - a) / 5)) * 0.04;
  const zap = T.w("cta", 4);
  return (
    <AbsoluteFill>
      <Fundo glow={0.25} />
      <Tela gap={4}>
        <Linha words={["COMENTA"]} at={[a]} size={12} />
        {/* bolha de comentário */}
        <div style={{ opacity: f >= a + 4 ? 1 : 0, transform: `scale(${pulse})`, display: "flex", alignItems: "center", gap: u * 3, background: C.branco, borderRadius: u * 6, padding: `${u * 3}px ${u * 5}px`, boxShadow: `0 0 0 ${u * 0.6}px ${C.limao}, 0 30px 70px rgba(206,250,59,.25)` }}>
          <Simbolo size={u * 9} style={{ borderRadius: u * 2 }} />
          <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 9, color: C.preto, letterSpacing: "-0.03em", minWidth: u * 50 }}>
            {digita.slice(0, n)}
            <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.cinza }}>|</span>
          </div>
        </div>
        <div style={{ opacity: f >= zap ? 1 : 0, transform: `translateY(${(1 - progress(f, zap, zap + 10)) * 30}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: u * 2.5 }}>
          <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 4.2, color: C.cinza }}>ou</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${1 + Math.max(0, Math.sin((f - zap) / 6)) * 0.03})` }}>
            <div style={{ background: C.limao, color: C.preto, borderRadius: u * 3, padding: `${u * 3}px ${u * 6}px`, fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 5, whiteSpace: "nowrap" }}>CHAMA NO WHATSAPP →</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1.5, marginTop: u * 2 }}>
          <Logo width={u * 34} delay={a + 10} />
          <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 3.3, color: C.branco, opacity: progress(f, a + 16, a + 26) }}>{brand.handle} · válido até 30/11</div>
          <div style={{ fontFamily: brand.font.text, fontWeight: 500, fontSize: u * 2.5, color: C.cinza, opacity: progress(f, a + 22, a + 32) }}>Cartão de visita: arquivo digital, impressão não inclusa.</div>
        </div>
      </Tela>
      <WipeBase at={a - 6} dur={12} />
    </AbsoluteFill>
  );
};

export const BlackNovember: React.FC = () => {
  const cenas: [React.FC, number, number][] = [
    [Gancho, 0, T.ini("dor1")],
    [Dor, T.ini("dor1"), T.ini("oferta1")],
    [Oferta, T.ini("oferta1"), T.ini("item1")],
    [Itens, T.ini("item1"), T.ini("preco")],
    [Preco, T.ini("preco"), T.ini("cta")],
    [CTA, T.ini("cta"), T.total],
  ];
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      {cenas.map(([Cena, a, b], i) => (
        <Sequence key={i} from={i === 0 ? 0 : a - 1} durationInFrames={b - a + 1} layout="none">
          <AbsoluteFill>
            {/* as cenas usam frames absolutos: reposiciona o relógio */}
            <Sequence from={-(i === 0 ? 0 : a - 1)} layout="none"><Cena /></Sequence>
          </AbsoluteFill>
        </Sequence>
      ))}
      <Progresso total={T.total} />
      <Audio src={staticFile("audio/narracao-principal.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-principal.wav")} volume={(fr) => (fr < 2 ? 0.55 : 0.3)} />
      <Audio src={staticFile("audio/sfx-principal.wav")} volume={0.55} />
    </AbsoluteFill>
  );
};
