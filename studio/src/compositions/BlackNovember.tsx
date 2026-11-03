import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, C } from "../brand/brand";
import { Cenas, Fatias, Flash, Grao, Logo, Tela, Vazamento, rgbSplit } from "../components";
import { Celular, F, Kicker, Notificacao, Nota, Palco, Perfil, Pilula, Simbolo3D, Titulo } from "../components/v4";
import { clamp, ease, progress, pulso, shakeAt, springs, useScale, useSpring } from "../lib/motion";
import { makeT } from "../lib/tempos";
import tempos from "../data/tempos-principal.json";
import { Kit, ITENS } from "./kit";

const T = makeT(tempos);
export const BN_DURACAO = T.total;
const w = T.w;

const K = {
  porque: T.ini("hook2"),
  olha: T.ini("olha"),
  dor2: T.ini("dor2"),
  carimbo: w("dor2", 1),
  amador2: w("dor2", 8),
  virada: T.ini("virada"),
  drop: w("virada", 3),
  oferta: T.ini("oferta1"),
  preco: w("oferta1", 8),
  black: w("oferta1", 11),
  itens: [3, 5, 9, 13, 15, 19, 24].map((n) => w("itens", n)),
  prazo: T.ini("prazo"),
  trinta: w("prazo", 4),
  cta: T.ini("cta"),
};

/* Layout comum: título no topo da área segura, celular entrando por baixo (pode passar da margem de baixo, é imagem). */
const Coluna: React.FC<{ topo: React.ReactNode; children?: React.ReactNode; gap?: number }> = ({ topo, children, gap = 5 }) => {
  const { u } = useScale();
  return (
    <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: u * 2.5 }}>{topo}</div>
      <div style={{ position: "relative", flex: 1, marginTop: u * gap }}>{children}</div>
    </Tela>
  );
};

/* ── 1 · Gancho: o celular recebe notificações de cliente indo embora. */
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const b = K.porque;
  const sh = shakeAt(f, [0, b], u * 1.2);
  const n = Math.round(interpolate(f, [0, K.olha], [48, 29], { ...clamp, easing: ease.out }));
  const W = u * 60;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={0.16} glowX={50} glowY={70} fantasma="CLIENTE PERDIDO" />
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 75%, rgba(255,74,61,${0.12 + 0.05 * Math.sin(f / 4)}), transparent 70%)` }} />
      <Coluna
        topo={
          <div style={{ filter: rgbSplit(f, [0, b], u * 0.7) }}>
            {f < b ? (
              <>
                <Kicker text="Atenção, empreendedor" at={-12} />
                <div style={{ height: u * 2 }} />
                <Titulo l1={["VOCÊ", "TÁ", "PERDENDO"]} a1={[-10, -8, -6]} l2={["CLIENTE"]} a2={[-3]} size={11} size2={15} />
              </>
            ) : (
              <>
                <Kicker text="E o pior" at={b} cor={C.alerta} />
                <div style={{ height: u * 2 }} />
                <Titulo l1={["E", "NEM", "SABE"]} a1={[b, w("hook2", 1), w("hook2", 2)]} l2={["POR", "QUÊ."]} a2={[w("hook2", 3), w("hook2", 4)]} size={11} size2={15} />
              </>
            )}
          </div>
        }
      >
        <div style={{ position: "absolute", left: "50%", top: 0, transform: `translateX(-50%) translateY(${(1 - progress(f, -10, 10, ease.out)) * u * 30}px)` }}>
          <Celular w={60} rotX={8} rot={-2}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1b1c1b,#0b0b0b)", padding: `${W * 0.18}px ${W * 0.05}px`, display: "flex", flexDirection: "column", gap: W * 0.03 }}>
              <div style={{ textAlign: "center", fontFamily: F.texto, fontWeight: 300, fontSize: W * 0.17, color: C.branco, lineHeight: 1 }}>14:02</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: W * 0.02, marginBottom: W * 0.03 }}>
                <span style={{ fontFamily: F.texto, fontWeight: 700, fontSize: W * 0.045, color: "#9a9c97" }}>clientes este mês</span>
                <span style={{ fontFamily: F.impacto, fontSize: W * 0.09, color: C.alerta, fontVariantNumeric: "tabular-nums" }}>{n} ↓</span>
              </div>
              <Notificacao app="Instagram" cor="#e1306c" titulo="@maria.paula" texto="deixou de seguir você" at={-4} w={W} />
              <Notificacao app="WhatsApp" cor="#25d366" titulo="Cliente" texto="Obrigada, vou ver em outra loja." at={22} w={W} />
              <Notificacao app="Instagram" cor="#e1306c" titulo="3 pessoas" texto="visualizaram e não responderam" at={b + 4} w={W} />
            </div>
          </Celular>
        </div>
      </Coluna>
    </AbsoluteFill>
  );
};

/* ── 2 · Dor: o perfil amador com anotações vermelhas e o veredito AMADOR. */
const Dor: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = K.olha;
  const sh = shakeAt(f, [K.carimbo, K.amador2], u * 1.6);
  const cinza = progress(f, K.amador2, K.amador2 + 8);
  const zoom = 1 + progress(f, a, K.virada, ease.inOut) * 0.06;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={0.08} fantasma="AMADOR" />
      <Coluna
        gap={4}
        topo={
          <div style={{ filter: rgbSplit(f, [K.carimbo, K.amador2], u * 0.8), minHeight: u * 30 }}>
            {f < K.dor2 ? (
              <>
                <Kicker text="Olha essa marca" at={a} />
                <div style={{ height: u * 2 }} />
                <Titulo l1={["LOGO", "TORTO,"]} a1={[w("dor1", 0), w("dor1", 1)]} l2={["COR", "PRA", "TODO", "LADO."]} a2={[w("dor1", 7), w("dor1", 8), w("dor1", 9), w("dor1", 10)]} size={9} size2={9} cor2={C.alerta} />
              </>
            ) : f < w("dor2", 3) ? (
              <>
                <Kicker text="O cliente pensa" at={K.dor2} cor={C.alerta} />
                <div style={{ height: u * 2 }} />
                <Titulo l1={["PARECE"]} a1={[K.dor2]} l2={["AMADOR."]} a2={[K.carimbo]} size={11} size2={16} cor2={C.alerta} fonte="impacto" />
              </>
            ) : (
              <>
                <Kicker text="E aí" at={w("dor2", 3)} cor={C.alerta} />
                <div style={{ height: u * 2 }} />
                <Titulo l1={["NINGUÉM", "COMPRA", "DE", "QUEM"]} a1={[w("dor2", 3), w("dor2", 4), w("dor2", 5), w("dor2", 6)]} l2={["PARECE", "AMADOR."]} a2={[w("dor2", 7), K.amador2]} size={8.5} size2={11} cor2={C.alerta} fonte="impacto" riscar={K.amador2 + 4} />
              </>
            )}
          </div>
        }
      >
        <div style={{ position: "absolute", left: "50%", top: 0, transform: `translateX(-50%) scale(${zoom}) translateY(${(1 - progress(f, a, a + 12, ease.out)) * u * 40}px)`, transformOrigin: "top center", filter: `grayscale(${cinza * 0.8}) brightness(${1 - cinza * 0.3})` }}>
          <Celular w={56} rotY={-6} rot={2} glow={0.1}>
            <Perfil tipo="amador" w={u * 56 * 0.93} />
          </Celular>
        </div>
        <div style={{ position: "absolute", inset: 0 }}>
          <Nota text="✕ logo torto" at={w("dor1", 0)} x={20} y={10} px={30} py={16} />
          <Nota text="✕ cada post de um jeito" at={w("dor1", 2)} x={46} y={44} px={44} py={58} />
          <Nota text="✕ cor pra todo lado" at={w("dor1", 7)} x={62} y={28} px={50} py={36} />
        </div>
      </Coluna>
      <Flash at={K.carimbo} color={C.alerta} max={0.35} />
    </AbsoluteFill>
  );
};

/* ── 3 · Virada: o celular gira e mostra o mesmo perfil profissional. */
const Virada: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = K.virada;
  const giro = interpolate(f, [a + 4, K.drop], [0, 180], { ...clamp, easing: ease.inOut });
  const s = useSpring(K.drop, springs.slam);
  const sh = shakeAt(f, [K.drop], u * 1.8);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={f >= K.drop ? 0.35 : 0.08} fantasma="PROFISSIONAL" glowX={50} glowY={65} />
      <Coluna
        gap={4}
        topo={
          <div style={{ filter: rgbSplit(f, [K.drop], u * 1) }}>
            <Kicker text="Agora olha ela" at={a} />
            <div style={{ height: u * 2 }} />
            <Titulo l1={["AGORA", "OLHA", "ELA"]} a1={[a, w("virada", 1), w("virada", 2)]} l2={["PROFISSIONAL."]} a2={[K.drop]} size={9} size2={9.4} base />
          </div>
        }
      >
        <div style={{ position: "absolute", left: "50%", top: 0, transform: `translateX(-50%) scale(${f >= K.drop ? 1.06 - 0.06 * s : 1})` }}>
          <div style={{ transform: `perspective(${u * 260}px) rotateY(${giro}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ backfaceVisibility: "hidden" }}>
              <Celular w={56} glow={0.1}><div style={{ filter: "grayscale(.8) brightness(.7)", position: "absolute", inset: 0 }}><Perfil tipo="amador" w={u * 56 * 0.93} /></div></Celular>
            </div>
            <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
              <Celular w={56} glow={0.45}><Perfil tipo="pro" w={u * 56 * 0.93} /></Celular>
            </div>
          </div>
        </div>
        {f >= K.drop && (
          <div style={{ position: "absolute", right: 0, top: u * 6 }}>
            <Pilula text="✓ mesma loja" at={K.drop + 4} size={3.6} />
          </div>
        )}
      </Coluna>
      <Flash at={K.drop} color={C.branco} max={0.55} />
      <Vazamento at={K.drop - 2} dur={18} />
    </AbsoluteFill>
  );
};

/* ── 4 · Oferta: preço gigante em Anton, selo Black November e o A em 3D. */
const Oferta: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = K.oferta;
  const c0 = w("oferta1", 3);
  const cnt = Math.round(interpolate(f, [c0, K.preco], [0, 499], { ...clamp, easing: ease.out }));
  const sh = shakeAt(f, [K.preco], u * 1.8);
  const s = useSpring(K.preco, springs.slam);
  const sb = useSpring(K.black, springs.pop);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Palco glow={f >= K.preco ? 0.32 : 0.14} fantasma="R$ 499" glowX={50} glowY={50} />
      <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
        <Kicker text="Quanto custa a virada?" at={a} />
        <div style={{ height: u * 2.5 }} />
        <Titulo l1={["ESSA", "VIRADA"]} a1={[a, w("oferta1", 1)]} l2={["SAI", "POR"]} a2={[w("oferta1", 2), c0]} size={9} size2={9} />
        <div style={{ display: "flex", alignItems: "flex-start", marginTop: u * 3, filter: rgbSplit(f, [K.preco], u * 1.2), opacity: f >= c0 ? 1 : 0, transform: `scale(${f >= K.preco ? 1.18 - 0.18 * s : 1})`, transformOrigin: "left center" }}>
          <span style={{ fontFamily: F.impacto, fontSize: u * 9, color: C.limao, marginTop: u * 4, marginRight: u * 1.5 }}>R$</span>
          <span style={{ fontFamily: F.impacto, fontSize: u * 34, lineHeight: 0.9, color: f >= K.preco ? C.limao : C.branco, fontVariantNumeric: "tabular-nums", letterSpacing: "0.01em" }}>{cnt}</span>
          <span style={{ fontFamily: F.impacto, fontSize: u * 9, color: C.limao, marginTop: u * 4 }}>,00</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: u * 4, marginTop: u * 4 }}>
          <div style={{ opacity: f >= K.black ? 1 : 0, transform: `rotate(${-4 * sb}deg) scale(${0.7 + 0.3 * sb})`, background: C.limao, color: C.preto, padding: `${u * 1.6}px ${u * 3}px`, borderRadius: u * 1.5, fontFamily: F.titulo, fontWeight: 900, fontStyle: "italic", fontSize: u * 5.6, lineHeight: 1, boxShadow: "0 18px 40px rgba(206,250,59,.25)" }}>BLACK<br />NOVEMBER</div>
          <Simbolo3D size={u * 20} at={w("oferta1", 14)} />
        </div>
      </Tela>
      <Flash at={K.preco} max={0.55} />
    </AbsoluteFill>
  );
};

/* ── 5 · Entregas: nome do item em destaque + mockup em pilha de cartões 3D. */
const Itens: React.FC = () => {
  const f = useCurrentFrame();
  const { u, vertical } = useScale();
  const ats = K.itens;
  const atual = Math.max(0, ats.filter((x) => f >= x).length - 1);
  const nome = ITENS[atual].nome.toUpperCase().split(" ");
  const meio = Math.ceil(nome.length / 2);
  return (
    <AbsoluteFill>
      <Palco glow={0.18 + 0.06 * pulso(f)} fantasma="VOCÊ LEVA" />
      <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Kicker text="Você leva" at={T.ini("itens")} />
          <div style={{ fontFamily: F.impacto, fontSize: u * 6, color: C.branco }}>{String(atual + 1).padStart(2, "0")}<span style={{ color: "#5b5d58" }}>/07</span></div>
        </div>
        <div style={{ height: u * 2 }} />
        <div style={{ minHeight: u * 22 }} key={atual}>
          <Titulo l1={nome.slice(0, meio)} a1={nome.slice(0, meio).map((_, i) => ats[atual] + i * 2)} l2={nome.slice(meio)} a2={nome.slice(meio).map((_, i) => ats[atual] + 3 + i * 2)} size={8.6} size2={8.6} />
        </div>
        <div style={{ position: "relative", marginTop: u * 3, height: u * (vertical ? 36 : 30) }}>
          {[2, 1].map((k) => (
            <div key={k} style={{ position: "absolute", inset: 0, transform: `translate(${k * u * 2.2}px, ${k * u * 2.2}px) rotate(${k * 2.5}deg)`, borderRadius: u * 4, background: k === 1 ? C.carvao : "#161716", border: `1px solid ${C.linha}` }} />
          ))}
          <div style={{ position: "absolute", inset: 0, transform: `perspective(${u * 220}px) rotateX(${Math.sin(f / 18) * 3}deg) rotateY(${Math.cos(f / 23) * 4}deg)`, filter: rgbSplit(f, ats, u * 0.5) }}>
            <Kit atual={atual} desde={ats[atual]} altura={vertical ? 36 : 30} />
          </div>
        </div>
        <div style={{ display: "flex", gap: u * 1.2, marginTop: u * 5 }}>
          {ITENS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: u * 0.9, borderRadius: u, background: f >= ats[i] ? C.limao : C.linha }} />
          ))}
        </div>
      </Tela>
    </AbsoluteFill>
  );
};

/* ── 6 · Prazo: tela limão, folha do calendário caindo no 30. */
const Prazo: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const p = K.prazo, cal = K.trinta;
  const s2 = useSpring(cal, springs.slam);
  const sh = shakeAt(f, [cal], u * 1.6);
  const flip = interpolate(f, [cal - 6, cal + 2], [-95, 0], { ...clamp, easing: ease.out });
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)`, background: C.limao }}>
      <div style={{ position: "absolute", top: "40%", left: -u * 10 - f * 2, whiteSpace: "nowrap", fontFamily: F.impacto, fontSize: u * 44, color: "rgba(10,10,10,.06)" }}>ÚLTIMOS DIAS · ÚLTIMOS DIAS · ÚLTIMOS DIAS</div>
      <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
        <Kicker text="Atenção ao prazo" at={p} cor={C.preto} />
        <div style={{ height: u * 2.5 }} />
        <Titulo l1={["MAS", "É", "SÓ", "ATÉ"]} a1={[p, w("prazo", 1), w("prazo", 2), w("prazo", 3)]} size={10} cor1={C.preto} />
        <div style={{ display: "flex", alignItems: "center", gap: u * 5, marginTop: u * 3 }}>
          <div style={{ perspective: u * 200 }}>
            <div style={{ transform: `rotateX(${flip}deg) scale(${1.2 - 0.2 * s2}) rotate(${-4 * s2}deg)`, transformOrigin: "top", opacity: f >= cal - 6 ? 1 : 0, background: C.preto, borderRadius: u * 4, overflow: "hidden", width: u * 34, boxShadow: "0 30px 60px rgba(0,0,0,.35)" }}>
              <div style={{ background: C.grafite, color: C.limao, fontFamily: F.texto, fontWeight: 800, fontSize: u * 3.6, textAlign: "center", padding: u * 1.6, letterSpacing: "0.2em" }}>NOVEMBRO</div>
              <div style={{ color: C.branco, fontFamily: F.impacto, fontSize: u * 22, textAlign: "center", lineHeight: 1.1 }}>30</div>
            </div>
          </div>
          <Titulo l1={["DE"]} a1={[w("prazo", 5)]} l2={["NOVEMBRO."]} a2={[w("prazo", 6)]} size={6} size2={7} cor1={C.preto} cor2={C.preto} fonte="impacto" />
        </div>
        <div style={{ marginTop: u * 3 }}><Pilula text="Depois disso, acabou." at={cal + 14} tone="escuro" /></div>
      </Tela>
      <Flash at={cal} color={C.branco} max={0.5} />
    </AbsoluteFill>
  );
};

/* ── 7 · CTA: comentário "EU QUERO" sendo digitado no post e a Area45 chamando no direct. */
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { u } = useScale();
  const a = K.cta;
  const digita = "EU QUERO";
  const n = Math.floor(interpolate(f, [w("cta", 1), w("cta", 2) + 6], [0, digita.length], clamp));
  const dm = w("cta", 6);
  const W = u * 36;
  return (
    <AbsoluteFill>
      <Palco glow={0.25 + 0.06 * pulso(f)} fantasma="EU QUERO" glowX={60} glowY={70} />
      <Tela justify="flex-start" style={{ alignItems: "stretch" }}>
        <Kicker text="Quer a sua?" at={a} />
        <div style={{ height: u * 2.5 }} />
        <Titulo l1={["COMENTA"]} a1={[a]} l2={["EU", "QUERO"]} a2={[w("cta", 1), w("cta", 2)]} size={11} size2={14} />
        <div style={{ display: "flex", gap: u * 4, marginTop: u * 4, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: u * 2.5, flex: 1, paddingTop: u * 2 }}>
            <Titulo l1={["QUE", "A", "GENTE", "TE"]} a1={[w("cta", 3), w("cta", 4), w("cta", 5), dm]} l2={["CHAMA", "NO", "DIRECT"]} a2={[w("cta", 7), w("cta", 8), w("cta", 9)]} size={4.8} size2={5.6} />
            <Logo width={u * 30} delay={a + 18} />
            <Pilula text={brand.handle} at={a + 24} size={3.6} />
          </div>
          <Celular w={36} rotY={-10} rot={3} glow={0.35}>
            <div style={{ position: "absolute", inset: 0, background: "#0d0e0d", padding: `${W * 0.2}px ${W * 0.05}px ${W * 0.08}px`, display: "flex", flexDirection: "column", gap: W * 0.04 }}>
              <div style={{ fontFamily: F.texto, fontWeight: 800, fontSize: W * 0.06, color: C.branco }}>Comentários</div>
              {[["moda.ju", "quero muito!!"], ["carla.doces", "EU QUERO"]].map(([user, txt], i) => (
                <div key={i} style={{ display: "flex", gap: W * 0.03 }}>
                  <div style={{ width: W * 0.1, height: W * 0.1, borderRadius: "50%", background: [C.limao, "#e1306c"][i], flexShrink: 0 }} />
                  <div style={{ fontFamily: F.texto, fontSize: W * 0.055, color: "#d6d7d3" }}><b style={{ color: C.branco }}>{user}</b> {txt}</div>
                </div>
              ))}
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: W * 0.03, border: `1px solid ${C.limao}`, borderRadius: W, padding: `${W * 0.04}px ${W * 0.06}px` }}>
                <div style={{ fontFamily: F.titulo, fontWeight: 900, fontSize: W * 0.075, color: C.branco }}>{digita.slice(0, n)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.limao }}>|</span></div>
              </div>
            </div>
            {f >= dm && (
              <div style={{ position: "absolute", top: W * 0.12, left: W * 0.05, right: W * 0.05 }}>
                <Notificacao app="Instagram" cor="#e1306c" titulo="area45marketing" texto="Oi! Vi seu comentário. Bora montar sua marca?" at={dm} w={W * 0.9} />
              </div>
            )}
          </Celular>
        </div>
        <div style={{ fontFamily: F.texto, fontWeight: 500, fontSize: u * 3.2, color: "#8C8E89", marginTop: u * 3, opacity: progress(f, a + 30, a + 40) }}>Válido até 30/11 · cartão em arquivo digital</div>
      </Tela>
    </AbsoluteFill>
  );
};

export const BlackNovember: React.FC = () => {
  const f = useCurrentFrame();
  const batendo = f < K.olha || (f >= K.drop && f < K.cta);
  return (
    <AbsoluteFill style={{ background: C.preto }}>
      <AbsoluteFill style={{ transform: `scale(${batendo ? 1 + 0.01 * pulso(f) : 1})` }}>
        <Cenas
          cenas={[
            { C: Gancho, a: 0, b: K.olha },
            { C: Dor, a: K.olha, b: K.virada, entrada: "punch" },
            { C: Virada, a: K.virada, b: K.oferta, entrada: "zoomout" },
            { C: Oferta, a: K.oferta, b: T.ini("itens"), entrada: "whip" },
            { C: Itens, a: T.ini("itens"), b: K.prazo, entrada: "punch" },
            { C: Prazo, a: K.prazo, b: K.cta, entrada: "whip" },
            { C: CTA, a: K.cta, b: T.total, entrada: "punch" },
          ]}
        />
      </AbsoluteFill>
      <Fatias at={[K.porque, K.carimbo, K.drop - 1, K.cta - 1]} />
      <Grao opacity={0.08} />
      <Audio src={staticFile("audio/narracao-principal.wav")} volume={1} />
      <Audio src={staticFile("audio/trilha-principal.wav")} volume={(fr) => (fr < 3 ? 0.5 : 0.24)} />
      <Audio src={staticFile("audio/sfx-principal.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
