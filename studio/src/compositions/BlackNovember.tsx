import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, random } from "remotion";
import { brand, C } from "../brand/brand";
import { Base, Cenas, Chip, Fatias, Flash, Fundo, Grao, Linha, Logo, Progresso, Simbolo, Tela, Vazamento, WipeBase, rgbSplit } from "../components";
import { clamp, ease, progress, pulso, shakeAt, springs, useScale, useSpring } from "../lib/motion";
import { makeT } from "../lib/tempos";
import tempos from "../data/tempos-principal.json";
import { Kit, ITENS } from "./kit";

const T = makeT(tempos);
export const BN_DURACAO = T.total;

/* Momentos-chave (frames absolutos), usados por cenas, efeitos e trilha. */
const K = {
  porque: T.ini("hook2"),
  olha: T.ini("olha"),
  carimbo: T.w("dor2", 1),
  amador2: T.w("dor2", 8),
  virada: T.ini("virada"),
  drop: T.w("virada", 3),
  preco: T.w("oferta1", 8),
  black: T.w("oferta1", 11),
  itens: [3, 5, 9, 13, 15, 19, 24].map((n) => T.w("itens", n)),
  prazo: T.ini("prazo"),
  trinta: T.w("prazo", 4),
  cta: T.ini("cta"),
};

/* ── Cena 1 · Gancho: a frase já está na tela no frame 0 e o contador de clientes despenca. */
const Contador: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const n = Math.round(interpolate(f, [0, K.olha], [48, 29], { ...clamp, easing: ease.out }));
  const drops = [4, 13, 22, 30, 41, 52, 66, 80, 96];
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: u * 3, background: C.carvao, border: `1px solid ${C.linha}`, borderRadius: u * 3, padding: `${u * 2.4}px ${u * 4}px` }}>
      <div style={{ fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 3.6, color: C.cinza, lineHeight: 1.1 }}>clientes<br />este mês</div>
      <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 11, color: C.alerta, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.04em", lineHeight: 1 }}>{n}</div>
      <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 6, color: C.alerta }}>↓</div>
      {drops.filter((d) => f >= d && f < d + 18).map((d) => {
        const p = (f - d) / 18;
        return (
          <div key={d} style={{ position: "absolute", right: u * (2 + random(`dx${d}`) * 10), top: -u * 2 - p * u * 12, opacity: 1 - p, fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 4.4, color: C.alerta }}>−1</div>
        );
      })}
    </div>
  );
};

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const b = K.porque;
  const sh = shakeAt(f, [0, b], u * 1.4);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={0.08} />
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 45%, rgba(255,74,61,${0.14 + 0.06 * Math.sin(f / 4)}), transparent 70%)` }} />
      <Tela gap={5}>
        <div style={{ filter: rgbSplit(f, [0, b], u * 0.9), display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1 }}>
          {f < b ? (
            <>
              <Linha words={["VOCÊ", "TÁ"]} at={[-9, -6]} size={8} />
              <Linha words={["PERDENDO"]} at={[-6]} size={10.5} hi={[0]} base={0} />
              <Linha words={["CLIENTE"]} at={[-2]} size={11} />
            </>
          ) : (
            <>
              <Linha words={["E", "NEM", "SABE"]} at={[b, T.w("hook2", 1), T.w("hook2", 2)]} size={8.5} />
              <Linha words={["POR", "QUÊ."]} at={[T.w("hook2", 3), T.w("hook2", 4)]} size={14} hi={[0, 1]} />
            </>
          )}
        </div>
        <Contador />
      </Tela>
    </AbsoluteFill>
  );
};

/* ── Cena 2 · Dor: a marca improvisada, etiquetas e o carimbo AMADOR. */
const MarcaImprovisada: React.FC<{ glitch?: number }> = ({ glitch = 0 }) => {
  const { u } = useScale();
  const f = useCurrentFrame();
  const g = f % 9 < 2 ? glitch : 0;
  return (
    <div style={{ position: "relative", width: u * 78, height: u * 60, transform: `rotate(-3deg) translateX(${g * u}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: u * 56, height: u * 33, background: "linear-gradient(135deg,#ff7ad9,#ffe066 55%,#4dd2ff)", borderRadius: u * 1.2, padding: u * 3, transform: "rotate(-4deg)", boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: "Lobster, cursive", fontSize: u * 7.5, color: "#2b37ff", textShadow: "3px 3px 0 #ff2a2a", transform: "rotate(-6deg)", fontStyle: "italic" }}>Loja da Ju ★</div>
        <div style={{ fontFamily: "'Comic Neue', cursive", fontWeight: 700, fontSize: u * 3.4, color: "#8a0f9e", marginTop: u * 2 }}>moda • acessórios • presentes!!!</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: u * 2.6, color: "#1d6b1d", marginTop: u * 1.5 }}>zap: (45) 9 9999-9999</div>
      </div>
      {[
        ["#ff5f5f", "Pacifico, cursive", "PROMO!!", 5, 37],
        ["#3fd16f", "'Comic Neue', cursive", "novidades", 29, 42],
        ["#5b6cff", "Bungee, sans-serif", "OFERTA", 53, 35],
      ].map(([bg, ff, txt, x, y], i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) * u, top: (y as number) * u, width: u * 21, height: u * 21, background: bg as string, borderRadius: u * (i === 1 ? 6 : 0.6), display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${[6, -8, 4][i]}deg)`, border: `${u * 0.6}px solid ${["#ffe600", "#fff", "#000"][i]}` }}>
          <span style={{ fontFamily: ff as string, color: ["#fff", "#2a2a2a", "#ffe600"][i], fontSize: u * 3.6 }}>{txt}</span>
        </div>
      ))}
    </div>
  );
};

const Dor: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = K.olha, d1 = T.ini("dor1"), d2 = T.ini("dor2");
  const tags = [
    { t: "LOGO TORTO", at: T.w("dor1", 0), x: -1, y: -3 },
    { t: "CADA POST DE UM JEITO", at: T.w("dor1", 2), x: 4, y: 56 },
    { t: "COR PRA TODO LADO", at: T.w("dor1", 7), x: 22, y: 24 },
  ];
  const s = useSpring(K.carimbo, springs.slam);
  const sh = shakeAt(f, [K.carimbo, K.amador2], u * 1.8);
  const cinza = progress(f, K.carimbo, K.carimbo + 6);
  const zoom = (1.5 - 0.5 * progress(f, a, a + 14, ease.out) + progress(f, d1, d2 + 40, ease.inOut) * 0.04) * 0.88;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={0.05} />
      <Tela gap={4}>
        <div style={{ height: u * 14, display: "flex", alignItems: "center", filter: rgbSplit(f, [K.carimbo, K.amador2], u * 0.8) }}>
          {f < d2 ? (
            <Linha words={["OLHA", "ESSA", "MARCA."]} at={[a, T.w("olha", 1), T.w("olha", 2)]} size={8} hi={[2]} />
          ) : f < T.w("dor2", 3) ? (
            <Linha words={["PARECE", "AMADOR."]} at={[d2, K.carimbo]} size={7.5} hi={[1]} hiColor={C.alerta} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Linha words={["NINGUÉM", "COMPRA", "DE"]} at={[T.w("dor2", 3), T.w("dor2", 4), T.w("dor2", 5)]} size={5} />
              <Linha words={["QUEM", "PARECE", "AMADOR."]} at={[T.w("dor2", 6), T.w("dor2", 7), K.amador2]} size={5} hi={[2]} hiColor={C.alerta} />
            </div>
          )}
        </div>
        <div style={{ position: "relative", transform: `scale(${zoom})`, filter: `grayscale(${cinza * 0.85}) brightness(${1 - cinza * 0.35})` }}>
          <MarcaImprovisada glitch={f > tags[1].at ? 1.2 : 0} />
          {tags.map((tg, i) => {
            const p = progress(f, tg.at, tg.at + 8);
            return (
              <div key={i} style={{ position: "absolute", left: tg.x * u, top: tg.y * u, opacity: f >= tg.at ? 1 : 0, transform: `scale(${1.6 - 0.6 * p}) rotate(${[-6, -3, 5][i]}deg)` }}>
                <div style={{ background: C.preto, color: C.branco, border: `${u * 0.4}px solid ${C.alerta}`, padding: `${u * 1.2}px ${u * 2.2}px`, fontFamily: brand.font.display, fontWeight: 800, fontSize: u * 3.8, whiteSpace: "nowrap" }}>✕ {tg.t}</div>
              </div>
            );
          })}
        </div>
      </Tela>
      {f >= K.carimbo && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Tela>
            <div style={{ marginTop: u * 14, transform: `rotate(-9deg) scale(${(2.4 - 1.4 * s) * (1 + (f >= K.amador2 ? 0.12 * Math.exp(-(f - K.amador2) / 4) : 0))})`, border: `${u * 1.3}px solid ${C.alerta}`, padding: `${u * 1}px ${u * 4}px`, color: C.alerta, fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 10, letterSpacing: "-0.03em", background: "rgba(10,10,10,.85)", borderRadius: u * 1.5, filter: rgbSplit(f, [K.carimbo, K.amador2], u * 1.2) }}>AMADOR.</div>
          </Tela>
        </AbsoluteFill>
      )}
      <Flash at={K.carimbo} color={C.alerta} max={0.4} />
    </AbsoluteFill>
  );
};

/* ── Cena 3 · Virada: um scanner limão transforma a marca improvisada na marca profissional. */
const NovaMarca: React.FC = () => {
  const { u } = useScale();
  const post = (bg: string, fg: string, txt: string) => (
    <div style={{ width: u * 17, height: u * 17, background: bg, borderRadius: u * 1.2, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: u * 1.6, border: `1px solid ${C.linha}` }}>
      <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 2.6, color: fg, lineHeight: 1, whiteSpace: "pre-line" }}>{txt}</div>
      <Base w={u * 6} h={u * 1.4} color={fg === C.preto ? C.preto : C.limao} />
    </div>
  );
  return (
    <div style={{ position: "relative", width: u * 78, height: u * 60, background: C.grafite, borderRadius: u * 3, border: `1px solid ${C.linha}`, padding: u * 4, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 30px 80px rgba(206,250,59,.18)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: u * 4 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1 }}>
          <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 17, color: C.branco, letterSpacing: "-0.06em", lineHeight: 0.85 }}>JU</div>
          <Base w={u * 15} h={u * 2} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: u * 1.2 }}>
          <div style={{ fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 3.4, color: C.branco, letterSpacing: "0.3em" }}>MODA JU</div>
          <div style={{ display: "flex", gap: u * 1.2 }}>
            {[C.limao, C.branco, "#6C5CE7", C.preto].map((c, i) => <div key={i} style={{ width: u * 5, height: u * 5, borderRadius: "50%", background: c, border: `1px solid ${C.linha}` }} />)}
          </div>
          <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 2.6, color: C.cinza }}>Unbounded · Inter</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: u * 2.2 }}>
        {post(C.limao, C.preto, "NOVOS\nLOOKS")}
        {post(C.carvao, C.branco, "LOOK\nDO DIA")}
        {post(C.branco, C.preto, "SÓ\nHOJE")}
        {post(C.carvao, C.branco, "DICAS")}
      </div>
    </div>
  );
};

const Virada: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = K.virada;
  const scan = progress(f, a + 4, K.drop, ease.inOut);
  const s = useSpring(K.drop, springs.slam);
  const sh = shakeAt(f, [K.drop], u * 2);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={f >= K.drop ? 0.32 : 0.06} />
      <Tela gap={4}>
        <div style={{ height: u * 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", filter: rgbSplit(f, [K.drop], u * 1.2) }}>
          <Linha words={["AGORA", "OLHA", "ELA"]} at={[a, T.w("virada", 1), T.w("virada", 2)]} size={6.5} color={C.cinza} weight={800} />
          <Linha words={["PROFISSIONAL."]} at={[K.drop]} size={7.6} hi={[0]} base={0} />
        </div>
        <div style={{ position: "relative", width: u * 78, height: u * 60, transform: `perspective(${u * 200}px) rotateY(${(1 - s) * -10 + Math.sin(f / 20) * 3}deg) scale(${f >= K.drop ? 1.08 - 0.08 * s : 1})` }}>
          <div style={{ position: "absolute", inset: 0, filter: "grayscale(.85) brightness(.6)", clipPath: `inset(0 0 0 ${scan * 100}%)` }}><MarcaImprovisada /></div>
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - scan) * 100}% 0 0)` }}><NovaMarca /></div>
          {scan > 0 && scan < 1 && (
            <div style={{ position: "absolute", top: -u * 4, bottom: -u * 4, left: `${scan * 100}%`, width: u * 1, marginLeft: -u * 0.5, background: C.limao, boxShadow: `0 0 ${u * 4}px ${u * 1.5}px rgba(206,250,59,.8)` }} />
          )}
          <div style={{ position: "absolute", top: -u * 3, left: u * 2, opacity: f >= a + 2 && scan < 0.3 ? 1 : 0 }}><Chip text="ANTES" tone="alerta" size={3} /></div>
          <div style={{ position: "absolute", top: -u * 3, right: u * 2, opacity: scan > 0.7 ? 1 : 0 }}><Chip text="DEPOIS" tone="limao" size={3} /></div>
        </div>
      </Tela>
      <Flash at={K.drop} color={C.branco} max={0.6} />
      <Vazamento at={K.drop - 2} dur={18} />
    </AbsoluteFill>
  );
};

/* ── Cena 4 · Oferta: o preço bate na palavra "nove", Black November e a Area45. */
const Oferta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = T.ini("oferta1");
  const c0 = T.w("oferta1", 3);
  const cnt = Math.round(interpolate(f, [c0, K.preco], [0, 499], { ...clamp, easing: ease.out }));
  const sh = shakeAt(f, [K.preco, K.black], u * 1.8);
  const s = useSpring(K.preco, springs.slam);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Fundo glow={f >= K.preco ? 0.3 : 0.14} />
      <Tela gap={3}>
        <Linha words={["ESSA", "VIRADA", "SAI", "POR"]} at={[a, T.w("oferta1", 1), T.w("oferta1", 2), c0]} size={6} color={C.cinza} weight={800} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", filter: rgbSplit(f, [K.preco], u * 1.2) }}>
          <div style={{ display: "flex", alignItems: "flex-start", fontFamily: brand.font.display, fontWeight: 900, color: f >= K.preco ? C.limao : C.branco, opacity: f >= c0 ? 1 : 0, transform: `scale(${f >= K.preco ? 1.3 - 0.3 * s : 1})`, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <span style={{ fontSize: u * 6, marginTop: u * 3, marginRight: u * 1 }}>R$</span>
            <span style={{ fontSize: u * 20, fontVariantNumeric: "tabular-nums" }}>{cnt}</span>
            <span style={{ fontSize: u * 6, marginTop: u * 3 }}>,00</span>
          </div>
          <Base w={u * 48} h={u * 4} style={{ transform: `scaleX(${progress(f, K.preco, K.preco + 10)})` }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: u * 2, filter: rgbSplit(f, [K.black], u * 1) }}>
          <Linha words={["BLACK"]} at={[K.black]} size={13} />
          <Linha words={["NOVEMBER"]} at={[T.w("oferta1", 12)]} size={9.6} outline hi={[0]} />
        </div>
        <Logo width={u * 34} delay={T.w("oferta1", 14)} />
      </Tela>
      <WipeBase at={a - 6} dur={12} />
      <Flash at={K.preco} max={0.6} />
    </AbsoluteFill>
  );
};

/* ── Cena 5 · O que vem no pacote: cada item entra na palavra dita. */
const Itens: React.FC = () => {
  const f = useCurrentFrame();
  const { u, vertical } = useScale();
  const ats = K.itens;
  const atual = Math.max(0, ats.filter((a) => f >= a).length - 1);
  return (
    <AbsoluteFill>
      <Fundo glow={0.12 + 0.08 * pulso(f)} />
      <Tela gap={vertical ? 3 : 2.5}>
        <Chip text="VOCÊ LEVA TUDO ISSO" tone="limao" delay={T.ini("itens")} size={3.4} />
        <div style={{ transform: `perspective(${u * 220}px) rotateX(${Math.sin(f / 18) * 4}deg) rotateY(${Math.cos(f / 23) * 5}deg)`, filter: rgbSplit(f, ats, u * 0.6) }}>
          <Kit atual={atual} desde={ats[atual]} altura={vertical ? 28 : 30} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: u * 0.8, width: u * 80 }}>
          {ITENS.map((it, i) => {
            const on = f >= ats[i];
            const p = progress(f, ats[i], ats[i] + 8);
            const cur = i === atual;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: u * 2.5, opacity: on ? (cur ? 1 : 0.6) : 0.15, transform: `translateX(${on ? (1 - p) * -8 * u : 0}px) scale(${cur ? 1 + 0.06 * (1 - p) : 1})`, transformOrigin: "left" }}>
                <div style={{ width: u * 4.6, height: u * 4.6, borderRadius: u * 1, background: on ? C.limao : "transparent", border: `${u * 0.35}px solid ${on ? C.limao : C.linha}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.preto, fontWeight: 900, fontSize: u * 3.2, fontFamily: brand.font.text }}>{on ? "✓" : ""}</div>
                <div style={{ fontFamily: brand.font.display, fontWeight: cur ? 800 : 600, fontSize: u * 3.7, color: cur ? C.limao : C.branco, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "-0.01em" }}>{it.nome}</div>
              </div>
            );
          })}
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* ── Cena 6 · Prazo: fundo limão e a folha do calendário caindo no 30. */
const Prazo: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const p = K.prazo, cal = K.trinta;
  const s2 = useSpring(cal, springs.slam);
  const sh = shakeAt(f, [cal], u * 1.6);
  const flip = interpolate(f, [cal - 6, cal + 2], [-95, 0], { ...clamp, easing: ease.out });
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)`, background: C.limao }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,.05) 0 ${u * 2}px, transparent ${u * 2}px ${u * 6}px)`, backgroundPosition: `${f * 3}px 0` }} />
      <Tela gap={3}>
        <Linha words={["MAS", "É", "SÓ", "ATÉ"]} at={[p, T.w("prazo", 1), T.w("prazo", 2), T.w("prazo", 3)]} size={9} color={C.preto} hi={[2]} hiColor={C.alerta} />
        <div style={{ perspective: u * 200 }}>
          <div style={{ transform: `rotateX(${flip}deg) scale(${1.25 - 0.25 * s2}) rotate(${-3 * s2}deg)`, transformOrigin: "top", opacity: f >= cal - 6 ? 1 : 0, background: C.preto, borderRadius: u * 4, overflow: "hidden", width: u * 50, boxShadow: "0 30px 60px rgba(0,0,0,.35)" }}>
            <div style={{ background: C.grafite, color: C.limao, fontFamily: brand.font.display, fontWeight: 800, fontSize: u * 4.2, textAlign: "center", padding: u * 1.8, letterSpacing: "0.1em" }}>NOVEMBRO</div>
            <div style={{ color: C.branco, fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 24, textAlign: "center", lineHeight: 1.15, letterSpacing: "-0.05em" }}>30</div>
          </div>
        </div>
        <Linha words={["DEPOIS", "ACABOU."]} at={[cal + 14, cal + 20]} size={7} color={C.preto} />
      </Tela>
      <Flash at={cal} color={C.branco} max={0.5} />
    </AbsoluteFill>
  );
};

/* ── Cena 7 · CTA: comenta EU QUERO e a gente chama no direct. */
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = K.cta;
  const digita = "EU QUERO";
  const n = Math.floor(interpolate(f, [T.w("cta", 1), T.w("cta", 2) + 6], [0, digita.length], clamp));
  const pulse = 1 + 0.035 * pulso(f, 4);
  const dm = T.w("cta", 4);
  return (
    <AbsoluteFill>
      <Fundo glow={0.22 + 0.08 * pulso(f)} />
      <Tela gap={3.5}>
        <Linha words={["COMENTA"]} at={[a]} size={11} />
        <div style={{ opacity: f >= a + 4 ? 1 : 0, transform: `scale(${pulse})`, display: "flex", alignItems: "center", gap: u * 3, background: C.branco, borderRadius: u * 6, padding: `${u * 3}px ${u * 5}px`, boxShadow: `0 0 0 ${u * 0.6}px ${C.limao}, 0 30px 70px rgba(206,250,59,.25)` }}>
          <Simbolo size={u * 9} style={{ borderRadius: u * 2 }} />
          <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 7.5, color: C.preto, letterSpacing: "-0.03em", minWidth: u * 46, whiteSpace: "nowrap" }}>
            {digita.slice(0, n)}
            <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.cinza }}>|</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Linha words={["QUE", "A", "GENTE", "TE", "CHAMA"]} at={[T.w("cta", 3), T.w("cta", 4), dm, T.w("cta", 6), T.w("cta", 7)]} size={4.6} weight={800} color={C.cinza} />
          <Linha words={["NO", "DIRECT"]} at={[T.w("cta", 8), T.w("cta", 9)]} size={8} hi={[1]} base={1} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1.2, marginTop: u * 1 }}>
          <Logo width={u * 32} delay={a + 10} />
          <div style={{ fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 4.2, color: C.branco, opacity: progress(f, a + 16, a + 26) }}>{brand.handle} · até 30/11</div>
          <div style={{ fontFamily: brand.font.text, fontWeight: 500, fontSize: u * 3.4, color: C.cinza, opacity: progress(f, a + 22, a + 32) }}>Cartão em arquivo digital · sem impressão</div>
        </div>
      </Tela>
      <WipeBase at={a - 6} dur={12} />
    </AbsoluteFill>
  );
};

export const BlackNovember: React.FC = () => {
  const f = useCurrentFrame();
  const batendo = f < K.olha || (f >= K.drop && f < K.cta);
  const bump = batendo ? 1 + 0.012 * pulso(f) : 1;
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      <AbsoluteFill style={{ transform: `scale(${bump})` }}>
        <Cenas
          cenas={[
            { C: Gancho, a: 0, b: K.olha },
            { C: Dor, a: K.olha, b: K.virada, entrada: "punch" },
            { C: Virada, a: K.virada, b: T.ini("oferta1"), entrada: "zoomout" },
            { C: Oferta, a: T.ini("oferta1"), b: T.ini("itens"), entrada: "whip" },
            { C: Itens, a: T.ini("itens"), b: K.prazo, entrada: "punch" },
            { C: Prazo, a: K.prazo, b: K.cta, entrada: "whip" },
            { C: CTA, a: K.cta, b: T.total, entrada: "punch" },
          ]}
        />
      </AbsoluteFill>
      <Fatias at={[K.porque, K.olha - 2, K.carimbo, K.virada, K.drop - 1, K.prazo - 1, K.cta - 1]} />
      <Flash at={K.porque} color={C.branco} max={0.25} />
      <Grao opacity={0.1} />
      <Progresso total={T.total} />
      <Audio src={staticFile("audio/narracao-principal.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-principal.wav")} volume={(fr) => (fr < 3 ? 0.55 : 0.28)} />
      <Audio src={staticFile("audio/sfx-principal.wav")} volume={0.55} />
    </AbsoluteFill>
  );
};
