/* Black November v5 · Reels principal (36,5 s), 25 cenas curtas.
 * Uma ideia por cena, linhas quebradas por sentido. Tempos (em segundos) vêm da transcrição palavra por palavra
 * da narração do Marcio: src/data/palavras-principal.json. */
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Cenas, Fatias, Flash, Grao, Logo, Tela, Vazamento, rgbSplit } from "../components";
import { Celular, F, Kicker, Notificacao, Palco, Perfil, Pilula, Simbolo3D } from "../components/v4";
import { Calendario, Carimbo, CoresCaos, Conversa, Frase, PostsCaos, Pontos, Queda, s } from "../components/v5";
import { clamp, ease, progress, pulso, shakeAt, springs, useScale, useSpring } from "../lib/motion";
import { Kit } from "./kit";

export const BN_DURACAO = s(36.5);

/* Início de cada cena (segundos), na palavra que a abre. */
const CORTES = {
  gancho: 0, porque: 1.56, olha: 3.54, logo: 4.66, posts: 5.82, cores: 7.36, amador: 8.68, ninguem: 9.44, dequem: 10.78,
  agora: 12.38, pro: 13.96, virada: 15.64, preco: 16.66, black: 17.78, leva: 20.86,
  i2: 22.0, i3: 23.28, i4: 24.4, i5: 25.54, i6: 26.92, i7: 28.0, ate: 30.3, trinta: 31.1, comenta: 32.36, direct: 33.36, fim: 36.5,
};
const c = (k: keyof typeof CORTES) => s(CORTES[k]);

/* Texto no topo da área segura e o visual embaixo. */
const Topo: React.FC<{ texto: React.ReactNode; children?: React.ReactNode; gap?: number }> = ({ texto, children, gap = 4 }) => {
  const { u } = useScale();
  return (
    <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
      <div>{texto}</div>
      <div style={{ position: "relative", flex: 1, marginTop: u * gap }}>{children}</div>
    </Tela>
  );
};
const Centro: React.FC<{ x?: string; y?: string | number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x = "50%", y = 0, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", ...style }}>{children}</div>
);
const sobe = (f: number, a: number, dist: number) => `translateY(${(1 - progress(f, s(a), s(a) + 12, ease.out)) * dist}px)`;

/* 1 · Você tá perdendo cliente */
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const sh = shakeAt(f, [0, s(0.96)], u * 1.2);
  const n = Math.round(interpolate(f, [0, c("porque")], [48, 31], { ...clamp, easing: ease.out }));
  const W = u * 58;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={0.14} glowX={50} glowY={75} fantasma="CLIENTE PERDIDO" />
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 80%, rgba(255,74,61,${0.14 + 0.05 * Math.sin(f / 4)}), transparent 70%)` }} />
      <Topo texto={<div style={{ filter: rgbSplit(f, [0, s(0.96)], u * 0.7) }}><Frase linhas={[{ t: "Você tá perdendo", at: [0, 0.2, 0.38], s: 9.5 }, { t: "cliente", at: 0.96, cor: "r", s: 17 }]} /></div>}>
        <Centro y={0} style={{ transform: `translateX(-50%) ${sobe(f, -0.3, u * 30)}` }}>
          <Celular w={58} rotX={8} rot={-2} glow={0.15}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1b1c1b,#0b0b0b)", padding: `${W * 0.17}px ${W * 0.05}px`, display: "flex", flexDirection: "column", gap: W * 0.03 }}>
              <div style={{ textAlign: "center", fontFamily: F.texto, fontWeight: 300, fontSize: W * 0.16, color: C.branco, lineHeight: 1 }}>14:02</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: W * 0.02, marginBottom: W * 0.02 }}>
                <span style={{ fontFamily: F.texto, fontWeight: 700, fontSize: W * 0.045, color: "#9a9c97" }}>clientes este mês</span>
                <span style={{ fontFamily: F.impacto, fontSize: W * 0.09, color: C.alerta, fontVariantNumeric: "tabular-nums" }}>{n} ↓</span>
              </div>
              <Notificacao app="Instagram" cor="#e1306c" titulo="@maria.paula" texto="deixou de seguir você" at={2} w={W} />
              <Notificacao app="WhatsApp" cor="#25d366" titulo="Cliente" texto="Obrigada, vou ver em outra loja." at={s(0.8)} w={W} />
            </div>
          </Celular>
        </Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 2 · e nem sabe por quê */
const Porque: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = CORTES.porque;
  const W = u * 70;
  return (
    <AbsoluteFill>
      <Palco glow={0.1} glowX={30} glowY={70} fantasma="POR QUÊ?" />
      <div style={{ position: "absolute", right: -u * 8, top: "38%", fontFamily: F.impacto, fontSize: u * 90, lineHeight: 1, color: "transparent", WebkitTextStroke: `${u * 0.4}px rgba(206,250,59,.35)`, transform: `rotate(${12 + Math.sin(f / 12) * 4}deg) scale(${0.9 + 0.1 * progress(f, s(2.54), s(2.54) + 10)})` }}>?</div>
      <Topo texto={<Frase linhas={[{ t: "E nem sabe", at: [1.56, 1.92, 2.18], s: 10 }, { t: "por quê.", at: [2.54, 2.72], cor: "l", s: 17 }]} />} gap={6}>
        <Centro y={0} style={{ width: W, transform: `translateX(-50%) ${sobe(f, a, u * 20)}` }}>
          <div style={{ background: "rgba(20,21,20,.85)", border: `1px solid ${C.linha}`, borderRadius: u * 4, padding: u * 4, display: "flex", flexDirection: "column", gap: u * 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: u * 2, marginBottom: u }}>
              <div style={{ width: u * 7, height: u * 7, borderRadius: "50%", background: "#e1306c" }} />
              <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: u * 3.6, color: C.branco }}>Cliente</div>
            </div>
            <Conversa w={W} msgs={[{ t: "Oi! Qual o valor?", at: a + 0.1 }, { t: "R$ 89, amiga 😊", eu: true, at: a + 0.5 }, { t: "Vou pensar...", at: a + 0.9 }]} />
            <div style={{ alignSelf: "flex-end", fontFamily: F.texto, fontWeight: 600, fontSize: u * 2.8, color: "#8C8E89", opacity: progress(f, s(a + 1.3), s(a + 1.5)) }}>Visto há 3 dias</div>
          </div>
        </Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 3 · Olha essa marca. */
const Olha: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = CORTES.olha;
  return (
    <AbsoluteFill>
      <Palco glow={0.08} fantasma="OLHA ESSA MARCA" />
      <Topo texto={<Frase linhas={[{ t: "Olha essa marca.", at: [3.54, 3.74, 3.94], s: 10 }]} />} gap={4}>
        <Centro y={0} style={{ transform: `translateX(-50%) ${sobe(f, a - 0.1, u * 50)} scale(${1 + progress(f, s(a), s(CORTES.logo), ease.inOut) * 0.05})`, transformOrigin: "top center" }}>
          <Celular w={58} rotY={-6} rot={2} glow={0.1}><Perfil tipo="amador" w={u * 58 * 0.93} /></Celular>
        </Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 4 · Logo torto */
const LogoTorto: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = CORTES.logo;
  const D = u * 52;
  const giro = -14 + Math.sin(f / 5) * 3;
  return (
    <AbsoluteFill>
      <Palco glow={0.06} fantasma="LOGO TORTO" />
      <Topo texto={<Frase linhas={[{ t: "Logo torto,", at: [4.66, 5.0], cor: "r", s: 15 }]} />} gap={6}>
        <Centro y={0} style={{ transform: `translateX(-50%) scale(${0.7 + 0.3 * progress(f, s(a), s(a) + 10)})` }}>
          <div style={{ position: "relative", width: D, height: D }}>
            <div style={{ width: D, height: D, borderRadius: "50%", background: "linear-gradient(135deg,#ff7ad9,#ffe066 55%,#4dd2ff)", border: `${u * 1.2}px solid #ffb800`, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${giro}deg)` }}>
              <div style={{ fontFamily: "Lobster, cursive", fontSize: D * 0.24, color: "#2b37ff", transform: "rotate(-10deg) translateX(8%)" }}>Ju ★</div>
            </div>
            <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: -u * 4, width: D + u * 8, height: D + u * 8, overflow: "visible" }}>
              <circle cx={50} cy={50} r={49} fill="none" stroke={C.alerta} strokeWidth={1.2} strokeDasharray="4 3" transform={`rotate(${f * 2} 50 50)`} />
            </svg>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: D * 1.25, height: u * 0.6, background: "rgba(255,74,61,.7)", transform: "translate(-50%,-50%)" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: D * 1.25, height: u * 0.6, background: "rgba(255,74,61,.7)", transform: `translate(-50%,-50%) rotate(${giro}deg)` }} />
            <div style={{ position: "absolute", right: -u * 4, top: -u * 2, fontFamily: F.impacto, fontSize: u * 9, color: C.alerta, transform: `scale(${progress(f, s(5.0), s(5.0) + 6)})` }}>{Math.round(Math.abs(giro))}°</div>
          </div>
        </Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 5 · cada post de um jeito */
const Posts: React.FC = () => {
  const { u, vertical } = useScale();
  const L = u * (vertical ? 23 : 20);
  return (
    <AbsoluteFill>
      <Palco glow={0.06} fantasma="CADA UM DE UM JEITO" />
      <Topo texto={<Frase linhas={[{ t: "Cada post", at: [5.82, 5.96], s: 10 }, { t: "de um jeito,", at: [6.5, 6.56, 6.66], cor: "r", s: 13 }]} />} gap={5}>
        <Centro y={0}><PostsCaos at={CORTES.posts} lado={L} /></Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 6 · cor pra todo lado */
const Cores: React.FC = () => {
  const { u, vertical } = useScale();
  return (
    <AbsoluteFill>
      <Palco glow={0.06} fantasma="COR PRA TODO LADO" />
      <Topo texto={<Frase linhas={[{ t: "Cor pra", at: [7.36, 7.5], s: 10 }, { t: "todo lado.", at: [7.72, 7.98], cor: "r", s: 15 }]} />} gap={4}>
        <Centro y={0}><CoresCaos at={CORTES.cores} w={u * 80} h={u * (vertical ? 52 : 34)} /></Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 7 · Parece AMADOR. (carimbo) */
const Amador: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const hit = s(8.94);
  const sh = shakeAt(f, [hit], u * 2);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={0.04} fantasma="AMADOR" />
      <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 55%, rgba(255,74,61,.18), transparent 70%)" }} />
      <Tela justify="center">
        <div style={{ position: "absolute", opacity: 0.35, filter: "grayscale(1) blur(2px)", transform: "scale(.9) rotate(4deg)" }}>
          <Celular w={50} glow={0}><Perfil tipo="amador" w={u * 50 * 0.93} /></Celular>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 3, filter: rgbSplit(f, [hit], u * 1) }}>
          <Frase linhas={[{ t: "Parece", at: 8.68, s: 12 }]} />
          <Carimbo text="AMADOR." at={8.94} size={19} />
        </div>
      </Tela>
      <Flash at={hit} color={C.alerta} max={0.4} />
    </AbsoluteFill>
  );
};

/* 8 · E ninguém compra */
const Ninguem: React.FC = () => {
  const { u, vertical } = useScale();
  return (
    <AbsoluteFill>
      <Palco glow={0.05} fantasma="NINGUÉM COMPRA" />
      <Topo texto={<Frase linhas={[{ t: "E ninguém", at: [9.44, 9.98], s: 11 }, { t: "compra", at: 10.3, cor: "r", s: 17 }]} />} gap={6}>
        <Centro y={0}><Queda at={CORTES.ninguem + 0.2} w={u * 80} h={u * (vertical ? 44 : 28)} /></Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 9 · de quem parece amador. (riscado; o celular cai) */
const DeQuem: React.FC = () => {
  const f = useCurrentFrame();
  const { u, height } = useScale();
  const a = CORTES.dequem;
  const cai = progress(f, s(11.6), s(12.38), ease.in);
  return (
    <AbsoluteFill>
      <Palco glow={0.04} fantasma="AMADOR" />
      <Topo texto={<Frase linhas={[{ t: "de quem parece", at: [10.78, 10.94, 11.06], s: 10 }, { t: "amador.", at: 11.38, cor: "r", s: 17, riscar: 11.75 }]} />} gap={5}>
        <Centro y={0} style={{ transform: `translateX(-50%) ${sobe(f, a, u * 30)} translateY(${cai * height * 0.5}px) rotate(${cai * 18}deg)`, filter: "grayscale(.9) brightness(.6)" }}>
          <Celular w={52} rot={-3} glow={0}><Perfil tipo="amador" w={u * 52 * 0.93} /></Celular>
        </Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 10 · Agora olha ela... (o celular começa a girar) */
const Agora: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = CORTES.agora;
  const giro = interpolate(f, [s(13.2), c("pro")], [0, 90], { ...clamp, easing: ease.in });
  return (
    <AbsoluteFill>
      <Palco glow={0.08 + 0.2 * progress(f, s(13.2), c("pro"))} fantasma="AGORA OLHA" glowX={50} glowY={65} />
      <Topo texto={<Frase linhas={[{ t: "Agora olha", at: [12.38, 12.74], s: 11 }, { t: "ela...", at: 13.14, cor: "l", s: 15 }]} />} gap={4}>
        <Centro y={0} style={{ transform: `translateX(-50%) ${sobe(f, a, u * 40)}` }}>
          <div style={{ transform: `perspective(${u * 260}px) rotateY(${giro}deg)` }}>
            <Celular w={56} glow={0.1}><div style={{ filter: "grayscale(.8) brightness(.7)", position: "absolute", inset: 0 }}><Perfil tipo="amador" w={u * 56 * 0.93} /></div></Celular>
          </div>
        </Centro>
      </Topo>
    </AbsoluteFill>
  );
};

/* 11 · PROFISSIONAL. */
const Pro: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = c("pro");
  const giro = interpolate(f, [a - 1, a + 8], [-90, 0], { ...clamp, easing: ease.out });
  const sh = shakeAt(f, [a], u * 1.8);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={0.38} fantasma="PROFISSIONAL" glowX={50} glowY={60} />
      <Topo texto={<div style={{ filter: rgbSplit(f, [a], u * 1) }}><Frase linhas={[{ t: "Profissional!", at: 13.96, cor: "l", s: 14 }]} /></div>} gap={4}>
        <Centro y={0}>
          <div style={{ transform: `perspective(${u * 260}px) rotateY(${giro}deg) scale(${1.04 - 0.04 * progress(f, a, a + 20)})` }}>
            <Celular w={56} glow={0.5}><Perfil tipo="pro" w={u * 56 * 0.93} /></Celular>
          </div>
        </Centro>
        <div style={{ position: "absolute", left: -u * 2, top: u * 22 }}><Pilula text="✓ mesma loja" at={a + 8} size={3.6} /></div>
        <div style={{ position: "absolute", right: -u * 2, top: u * 44 }}><Pilula text="✓ outro nível" at={a + 16} size={3.6} /></div>
      </Topo>
      <Flash at={a} color={C.branco} max={0.6} />
      <Vazamento at={a - 2} dur={18} />
    </AbsoluteFill>
  );
};

/* 12 · Essa virada sai por (antes e depois lado a lado) */
const Virada: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = CORTES.virada;
  return (
    <AbsoluteFill>
      <Palco glow={0.18} fantasma="ANTES · DEPOIS" />
      <Topo texto={<Frase linhas={[{ t: "Essa virada", at: [15.64, 15.84], s: 11 }, { t: "sai por...", at: [16.24, 16.48], cor: "l", s: 13 }]} />} gap={6}>
        <div style={{ display: "flex", justifyContent: "center", gap: u * 5, alignItems: "flex-start" }}>
          {(["amador", "pro"] as const).map((t, i) => (
            <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 2, transform: `${sobe(f, a + i * 0.12, u * 30)} rotate(${i ? 3 : -3}deg)` }}>
              <div style={{ filter: i ? undefined : "grayscale(.7) brightness(.75)" }}><Celular w={34} glow={i ? 0.4 : 0}><Perfil tipo={t} w={u * 34 * 0.93} /></Celular></div>
              <Pilula text={i ? "depois" : "antes"} at={s(a) + 4 + i * 4} tone={i ? "limao" : "escuro"} size={3.4} />
            </div>
          ))}
        </div>
      </Topo>
    </AbsoluteFill>
  );
};

/* 13 · R$ 499 (tela limão) */
const Preco: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = c("preco");
  const bate = s(17.15);
  const cnt = Math.round(interpolate(f, [a, bate], [0, 499], { ...clamp, easing: ease.out }));
  const k = useSpring(bate, springs.slam);
  const sh = shakeAt(f, [bate], u * 2);
  return (
    <AbsoluteFill style={{ background: C.limao, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <div style={{ position: "absolute", top: "18%", left: -u * 10 - f * 2.4, whiteSpace: "nowrap", fontFamily: F.impacto, fontSize: u * 40, color: "rgba(10,10,10,.06)" }}>BLACK NOVEMBER · BLACK NOVEMBER · BLACK NOVEMBER</div>
      <div style={{ position: "absolute", top: "62%", left: -u * 60 + f * 2.4, whiteSpace: "nowrap", fontFamily: F.impacto, fontSize: u * 40, color: "rgba(10,10,10,.06)" }}>R$ 499 · R$ 499 · R$ 499 · R$ 499 · R$ 499</div>
      <Tela justify="center">
        <Kicker text="Identidade visual completa" at={a} cor={C.preto} />
        <div style={{ display: "flex", alignItems: "flex-start", marginTop: u * 3, transform: `scale(${f >= bate ? 1.2 - 0.2 * k : 0.9 + 0.1 * progress(f, a, bate)})`, filter: rgbSplit(f, [bate], u * 1.2) }}>
          <span style={{ fontFamily: F.impacto, fontSize: u * 10, color: C.preto, marginTop: u * 5, marginRight: u * 1.5 }}>R$</span>
          <span style={{ fontFamily: F.impacto, fontSize: u * 40, lineHeight: 0.92, color: C.preto, fontVariantNumeric: "tabular-nums" }}>{cnt}</span>
        </div>
      </Tela>
      <Flash at={bate} color={C.branco} max={0.55} />
    </AbsoluteFill>
  );
};

/* 14 · na Black November da Área 45 */
const Black: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const sb = useSpring(s(18.6), springs.pop);
  return (
    <AbsoluteFill>
      <Palco glow={0.3} fantasma="BLACK NOVEMBER" glowX={50} glowY={55} />
      <Tela justify="flex-start">
        <Frase linhas={[{ t: "na Black November", at: [17.78, 18.6, 18.9], s: 9.5 }, { t: "da Área 45.", at: [19.36, 19.6, 19.78], cor: "l", s: 12 }]} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: u * 4, marginTop: u * 8 }}>
          <div style={{ opacity: f >= s(18.6) ? 1 : 0, transform: `rotate(${-6 * sb}deg) scale(${0.6 + 0.4 * sb})`, background: C.limao, color: C.preto, padding: `${u * 2.4}px ${u * 4}px`, borderRadius: u * 2, fontFamily: F.titulo, fontWeight: 900, fontStyle: "italic", fontSize: u * 8, lineHeight: 0.95, boxShadow: "0 24px 50px rgba(206,250,59,.3)" }}>BLACK<br />NOVEMBER</div>
          <Simbolo3D size={u * 30} at={s(19.5)} />
        </div>
        <div style={{ marginTop: u * 6 }}><Pilula text="R$ 499 · até 30/11" at={s(19.9)} tone="escuro" size={4} /></div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 15-21 · Você leva: um item por cena */
const ITENS_V5: { linhas: { t: string; at: number[] }[]; at: number }[] = [
  { linhas: [{ t: "O logo", at: [21.32, 21.46] }], at: 21.46 },
  { linhas: [{ t: "Manual de", at: [22.06, 22.28] }, { t: "identidade", at: [22.48] }], at: 22.06 },
  { linhas: [{ t: "Paleta", at: [23.32] }, { t: "de cores", at: [23.64, 23.82] }], at: 23.32 },
  { linhas: [{ t: "Tipografia", at: [24.42] }], at: 24.42 },
  { linhas: [{ t: "Destaques do", at: [25.62, 26.12] }, { t: "Instagram", at: [26.26] }], at: 25.62 },
  { linhas: [{ t: "Manual de", at: [27.0, 27.26] }, { t: "aplicação", at: [27.48] }], at: 27.0 },
  { linhas: [{ t: "Arte do seu", at: [28.4, 28.64, 28.8] }, { t: "cartão de visita", at: [29.04, 29.4, 29.48] }], at: 28.4 },
];
const item = (i: number): React.FC => {
  const Item: React.FC = () => {
    const f = useCurrentFrame();
    const { u, vertical } = useScale();
    const it = ITENS_V5[i];
    const L = it.linhas;
    return (
      <AbsoluteFill>
        <Palco glow={0.2 + 0.06 * pulso(f)} fantasma="VOCÊ LEVA" glowX={i % 2 ? 25 : 75} glowY={40} />
        <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {i === 0 ? <Frase align="left" maxW={50} linhas={[{ t: "Você leva:", at: [20.86, 21.12], s: 7 }]} /> : <Kicker text="Você leva" at={-30} align="left" />}
            <div style={{ fontFamily: F.impacto, fontSize: u * 7, color: C.branco, whiteSpace: "nowrap" }}>{String(i + 1).padStart(2, "0")}<span style={{ color: "#5b5d58" }}>/07</span></div>
          </div>
          <div style={{ height: u * 3 }} />
          <div style={{ minHeight: u * 25, display: "flex", alignItems: "center" }}>
            <Frase linhas={L.map((l, k) => ({ ...l, s: L.length === 1 ? 15 : 11.5, cor: k === L.length - 1 ? "l" : "b" }))} />
          </div>
          <div style={{ marginTop: u * 3, alignSelf: "center", transform: `perspective(${u * 220}px) rotateX(${Math.sin(f / 18) * 3}deg) rotateY(${Math.cos(f / 23) * 4}deg)` }}>
            <Kit atual={i} desde={s(it.at)} altura={vertical ? 40 : 28} />
          </div>
          <div style={{ marginTop: u * 4 }}><Pontos n={7} atual={i} /></div>
        </Tela>
      </AbsoluteFill>
    );
  };
  return Item;
};
const ITENS_C = ITENS_V5.map((_, i) => item(i));

/* 22 · Mas é só até... */
const Ate: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  return (
    <AbsoluteFill>
      <Palco glow={0.1} fantasma="ÚLTIMOS DIAS" />
      <AbsoluteFill style={{ background: `radial-gradient(50% 30% at 50% 50%, rgba(255,74,61,${0.08 + 0.06 * pulso(f, 4)}), transparent 70%)` }} />
      <Tela justify="center">
        <Frase linhas={[{ t: "Mas é só", at: [30.3, 30.5, 30.64], s: 13 }, { t: "até...", at: 30.92, cor: "r", s: 16 }]} />
        <div style={{ marginTop: u * 6 }}><Pilula text="Depois disso, acabou." at={s(30.7)} tone="escuro" size={4} /></div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 23 · 30 de novembro (tela limão) */
const Trinta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = c("trinta");
  const sh = shakeAt(f, [a], u * 1.6);
  return (
    <AbsoluteFill style={{ background: C.limao, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <div style={{ position: "absolute", top: "44%", left: -u * 10 - f * 2, whiteSpace: "nowrap", fontFamily: F.impacto, fontSize: u * 44, color: "rgba(10,10,10,.06)" }}>ÚLTIMOS DIAS · ÚLTIMOS DIAS · ÚLTIMOS DIAS</div>
      <Tela justify="center">
        <Calendario at={31.1} dia="30" w={u * 44} />
        <div style={{ marginTop: u * 5 }}><Frase linhas={[{ t: "de novembro.", at: [31.46, 31.64], cor: "p", s: 11 }]} /></div>
      </Tela>
      <Flash at={a} color={C.branco} max={0.5} />
    </AbsoluteFill>
  );
};

/* 24 · Comenta EU QUERO */
const Comenta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = c("comenta");
  const txt = "EU QUERO";
  const n = Math.floor(interpolate(f, [s(32.74), s(33.2)], [0, txt.length], clamp));
  return (
    <AbsoluteFill>
      <Palco glow={0.3 + 0.08 * pulso(f)} fantasma="EU QUERO" glowX={50} glowY={70} />
      <Tela justify="center">
        <Frase linhas={[{ t: "Comenta", at: 32.36, s: 12 }, { t: "EU QUERO", at: [32.74, 33.0], cor: "l", s: 20, imp: true }]} />
        <div style={{ marginTop: u * 6, width: u * 72, display: "flex", alignItems: "center", gap: u * 2, border: `${u * 0.4}px solid ${C.limao}`, borderRadius: u * 10, padding: `${u * 2.2}px ${u * 3.5}px`, background: "rgba(20,21,20,.8)", transform: `scale(${0.9 + 0.1 * progress(f, a, a + 10)})` }}>
          <div style={{ width: u * 6, height: u * 6, borderRadius: "50%", background: "#e1306c", flexShrink: 0 }} />
          <div style={{ fontFamily: F.titulo, fontWeight: 900, fontSize: u * 5, color: C.branco, flex: 1 }}>{txt.slice(0, n)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.limao }}>|</span></div>
          <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: u * 3.6, color: n >= txt.length ? C.limao : "#5b5d58" }}>Publicar</div>
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* 25 · que a gente te chama no direct */
const Direct: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = CORTES.direct;
  const W = u * 64;
  return (
    <AbsoluteFill>
      <Palco glow={0.28 + 0.06 * pulso(f)} fantasma="NO DIRECT" glowX={60} glowY={70} />
      <Tela justify="flex-start">
        <Frase linhas={[{ t: "Que a gente te chama", at: [33.36, 33.64, 33.7, 33.84, 34.06], s: 9 }, { t: "no direct.", at: [34.34, 34.46], cor: "l", s: 15 }]} />
        <div style={{ width: W, marginTop: u * 5, transform: sobe(f, a + 0.6, u * 20) }}>
          <Notificacao app="Instagram" cor="#e1306c" titulo="area45marketing" texto="Oi! Vi seu comentário. Bora montar sua marca?" at={s(34.3)} w={W} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: u * 4, marginTop: u * 6 }}>
          <Logo width={u * 32} delay={s(34.8)} />
          <Pilula text={brand.handle} at={s(35.0)} size={3.8} />
        </div>
        <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: u * 3.2, color: "#8C8E89", marginTop: u * 4, opacity: progress(f, s(35.2), s(35.5)) }}>Válido até 30/11 · cartão em arquivo digital</div>
      </Tela>
    </AbsoluteFill>
  );
};

export const BlackNovember: React.FC = () => {
  const f = useCurrentFrame();
  const batendo = f < c("olha") || (f >= c("pro") && f < c("comenta"));
  const ordem: [React.FC, keyof typeof CORTES, "punch" | "whip" | "zoomout" | "corte"][] = [
    [Gancho, "gancho", "corte"], [Porque, "porque", "whip"], [Olha, "olha", "punch"], [LogoTorto, "logo", "corte"], [Posts, "posts", "whip"],
    [Cores, "cores", "punch"], [Amador, "amador", "corte"], [Ninguem, "ninguem", "whip"], [DeQuem, "dequem", "corte"], [Agora, "agora", "zoomout"],
    [Pro, "pro", "corte"], [Virada, "virada", "whip"], [Preco, "preco", "punch"], [Black, "black", "zoomout"], [ITENS_C[0], "leva", "whip"],
    [ITENS_C[1], "i2", "punch"], [ITENS_C[2], "i3", "whip"], [ITENS_C[3], "i4", "punch"], [ITENS_C[4], "i5", "whip"], [ITENS_C[5], "i6", "punch"],
    [ITENS_C[6], "i7", "whip"], [Ate, "ate", "zoomout"], [Trinta, "trinta", "punch"], [Comenta, "comenta", "punch"], [Direct, "direct", "whip"],
  ];
  const cenas = ordem.map(([C_, k, entrada], i) => ({ C: C_, a: c(k), b: i < ordem.length - 1 ? c(ordem[i + 1][1]) : BN_DURACAO, entrada }));
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      <AbsoluteFill style={{ transform: `scale(${batendo ? 1 + 0.01 * pulso(f) : 1})` }}>
        <Cenas cenas={cenas} />
      </AbsoluteFill>
      <Fatias at={[c("porque"), c("amador") + 8, c("pro") - 1, c("preco") + 15, c("comenta") - 1]} />
      <Grao opacity={0.08} />
      <Audio src={staticFile("audio/narracao-principal.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-principal.wav")} volume={(fr) => (fr < 3 ? 0.5 : 0.24)} />
      <Audio src={staticFile("audio/sfx-principal.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
