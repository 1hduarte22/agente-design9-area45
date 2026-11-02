import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, C } from "../brand/brand";
import { Base, Chip, Fundo, Linha, Logo, Simbolo, Tela } from "../components";
import { useScale } from "../lib/motion";
import { ITENS, Kit } from "./kit";

/** Peças estáticas: renderize o frame 45 (todas as animações já terminaram). */
export const ESTATICOS_FRAME = 45;
const z = (n: number) => Array(n).fill(0);

const Preco: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const { u } = useScale();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-start", fontFamily: brand.font.display, fontWeight: 900, color: C.limao, letterSpacing: "-0.05em", lineHeight: 1 }}>
        <span style={{ fontSize: u * size * 0.28, marginTop: u * size * 0.14, marginRight: u }}>R$</span>
        <span style={{ fontSize: u * size }}>499</span>
        <span style={{ fontSize: u * size * 0.28, marginTop: u * size * 0.14 }}>,00</span>
      </div>
      <Base w={u * size * 2} h={u * size * 0.16} />
    </div>
  );
};
const Rodape: React.FC<{ texto?: string }> = ({ texto = "Válido até 30/11 · arte do cartão em arquivo digital, impressão não inclusa" }) => {
  const { u } = useScale();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1.5 }}>
      <Logo width={u * 28} />
      <div style={{ fontFamily: brand.font.text, fontWeight: 500, fontSize: u * 2.4, color: C.cinza, textAlign: "center" }}>{texto}</div>
    </div>
  );
};
const Lista: React.FC<{ size?: number }> = ({ size = 4 }) => {
  const { u } = useScale();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: u * 1.6, width: u * 80 }}>
      {ITENS.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: u * 2.5 }}>
          <div style={{ width: u * size * 1.2, height: u * size * 1.2, borderRadius: u, background: C.limao, display: "flex", alignItems: "center", justifyContent: "center", color: C.preto, fontWeight: 900, fontSize: u * size * 0.8, fontFamily: brand.font.text }}>✓</div>
          <div style={{ fontFamily: brand.font.display, fontWeight: 700, fontSize: u * size, color: C.branco, textTransform: "uppercase" }}>{it.nome}</div>
        </div>
      ))}
    </div>
  );
};
const Marcador: React.FC<{ n: string }> = ({ n }) => {
  const { u } = useScale();
  return <div style={{ position: "absolute", top: u * 5, right: u * 6, fontFamily: brand.font.text, fontWeight: 700, fontSize: u * 2.6, color: C.cinza, letterSpacing: "0.15em" }}>{n}</div>;
};
const Arrasta: React.FC = () => {
  const { u } = useScale();
  return <div style={{ position: "absolute", bottom: u * 5, right: u * 6, fontFamily: brand.font.display, fontWeight: 800, fontSize: u * 2.8, color: C.limao }}>ARRASTA →</div>;
};

const PECAS: Record<string, React.FC> = {
  "feed-01": () => (
    <Tela gap={3.5}>
      <Chip text="BLACK NOVEMBER · SÓ ATÉ 30/11" tone="limao" size={3} />
      <Linha words={["IDENTIDADE", "VISUAL"]} at={z(2)} size={10} />
      <Linha words={["COMPLETA"]} at={[0]} size={11.5} hi={[0]} />
      <Linha words={["POR", "APENAS"]} at={z(2)} size={5} color={C.cinza} weight={800} />
      <Preco size={24} />
      <Rodape />
    </Tela>
  ),
  "feed-02": () => (
    <Tela gap={3.5}>
      <Linha words={["TUDO", "QUE", "SUA", "MARCA"]} at={z(4)} size={7} />
      <Linha words={["PRECISA"]} at={[0]} size={9} hi={[0]} base={0} />
      <Lista size={3.6} />
      <Chip text="7 entregas · 1 pacote · R$ 499,00" tone="limao" size={3.4} />
      <Rodape />
    </Tela>
  ),
  "feed-03": () => (
    <Tela gap={3.5}>
      <Chip text="⏰ ÚLTIMOS DIAS" tone="limao" size={3.2} />
      <Linha words={["A", "BLACK", "NOVEMBER"]} at={z(3)} size={7} color={C.cinza} weight={800} />
      <Linha words={["ACABA", "DIA"]} at={z(2)} size={10} />
      <Linha words={["30/11"]} at={[0]} size={22} hi={[0]} />
      <Linha words={["IDENTIDADE", "VISUAL", "COMPLETA", "POR", "R$ 499"]} at={z(5)} size={4.6} weight={800} hi={[4]} />
      <Rodape />
    </Tela>
  ),
  "stories-01": () => (
    <Tela gap={4}>
      <Linha words={["SUA", "MARCA", "TÁ"]} at={z(3)} size={8} />
      <Linha words={["ESPANTANDO"]} at={[0]} size={10.5} hi={[0]} base={0} />
      <Linha words={["CLIENTE?"]} at={[0]} size={12} />
      <div style={{ height: 40 }} />
      <Chip text="Black November Area45" size={3.2} />
      <Linha words={["IDENTIDADE", "VISUAL", "COMPLETA"]} at={z(3)} size={6} />
      <Preco size={19} />
    </Tela>
  ),
  "stories-02": () => (
    <Tela gap={4}>
      <Chip text="O QUE VEM NO PACOTE" tone="limao" size={3.2} />
      <Kit atual={6} desde={0} altura={40} />
      <Lista size={3.8} />
      <Linha words={["TUDO", "POR", "R$ 499"]} at={z(3)} size={7} hi={[2]} />
    </Tela>
  ),
  "stories-03": () => {
    const { u } = useScale();
    return (
      <Tela gap={4} justify="flex-start">
        <div style={{ height: u * 4 }} />
        <Linha words={["COMENTA"]} at={[0]} size={12} />
        <div style={{ display: "flex", alignItems: "center", gap: u * 3, background: C.branco, borderRadius: u * 6, padding: `${u * 3}px ${u * 5}px`, boxShadow: `0 0 0 ${u * 0.6}px ${C.limao}` }}>
          <Simbolo size={u * 9} style={{ borderRadius: u * 2 }} />
          <div style={{ fontFamily: brand.font.display, fontWeight: 900, fontSize: u * 9, color: C.preto }}>EU QUERO</div>
        </div>
        <Linha words={["OU", "CHAMA", "NO", "WHATSAPP"]} at={z(4)} size={5.5} hi={[3]} />
        <Preco size={18} />
        <Rodape />
        <div style={{ fontFamily: brand.font.text, fontWeight: 600, fontSize: u * 2.6, color: C.cinza, border: `${u * 0.3}px dashed ${C.linha}`, borderRadius: u * 3, padding: `${u * 5}px ${u * 8}px`, marginTop: u * 2 }}>área livre para a figurinha de link</div>
      </Tela>
    );
  },
  "carrossel-01": () => (
    <>
      <Tela gap={3}>
        <Linha words={["SUA", "MARCA", "PASSA"]} at={z(3)} size={8.5} />
        <Linha words={["CONFIANÇA"]} at={[0]} size={11} hi={[0]} base={0} />
        <Linha words={["OU", "PASSA"]} at={z(2)} size={8.5} />
        <Linha words={["IMPROVISO?"]} at={[0]} size={11} hi={[0]} hiColor={C.alerta} />
      </Tela>
      <Marcador n="01 / 05" /><Arrasta />
    </>
  ),
  "carrossel-02": () => (
    <>
      <Tela gap={3.5}>
        <Linha words={["O", "CLIENTE", "JULGA", "EM"]} at={z(4)} size={7.5} />
        <Linha words={["3", "SEGUNDOS."]} at={z(2)} size={11} hi={[0, 1]} />
        <div style={{ fontFamily: brand.font.text, fontWeight: 500, fontSize: 40, color: C.cinza, textAlign: "center", lineHeight: 1.4, maxWidth: 820 }}>
          Logo torto, cor aleatória e cada post de um jeito fazem o cliente desconfiar antes mesmo de te chamar.
        </div>
      </Tela>
      <Marcador n="02 / 05" /><Arrasta />
    </>
  ),
  "carrossel-03": () => (
    <>
      <Tela gap={3}>
        <Chip text="BLACK NOVEMBER AREA45" tone="limao" size={3} />
        <Linha words={["IDENTIDADE", "VISUAL", "COMPLETA"]} at={z(3)} size={8.5} hi={[2]} />
        <Linha words={["POR", "APENAS"]} at={z(2)} size={5} color={C.cinza} weight={800} />
        <Preco size={24} />
      </Tela>
      <Marcador n="03 / 05" /><Arrasta />
    </>
  ),
  "carrossel-04": () => (
    <>
      <Tela gap={3.5}>
        <Linha words={["O", "QUE", "VOCÊ"]} at={z(3)} size={7} />
        <Linha words={["RECEBE"]} at={[0]} size={10} hi={[0]} base={0} />
        <Lista size={3.8} />
      </Tela>
      <Marcador n="04 / 05" /><Arrasta />
    </>
  ),
  "carrossel-05": () => (
    <>
      <Tela gap={3.5}>
        <Linha words={["SÓ", "ATÉ"]} at={z(2)} size={8} />
        <Linha words={["30/11"]} at={[0]} size={20} hi={[0]} />
        <Linha words={["COMENTA", "“EU", "QUERO”"]} at={z(3)} size={6.5} />
        <Linha words={["OU", "CHAMA", "NO", "WHATSAPP"]} at={z(4)} size={5} hi={[3]} />
        <Rodape />
      </Tela>
      <Marcador n="05 / 05" />
    </>
  ),
};
export const PECAS_IDS = Object.keys(PECAS);

export const Estatico: React.FC<{ peca: string }> = ({ peca }) => {
  const P = PECAS[peca] ?? PECAS["feed-01"];
  return (
    <AbsoluteFill>
      <Fundo glow={0.2} />
      <P />
    </AbsoluteFill>
  );
};
