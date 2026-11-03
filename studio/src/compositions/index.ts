import React from "react";
import { BlackNovember, BN_DURACAO } from "./BlackNovember";
import { UltimosDias, UD_DURACAO } from "./UltimosDias";
import { Estatico } from "./Estaticos";

type Fmt = "9x16" | "4x5" | "1x1" | "16x9";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compositions: { id: string; component: React.FC<any>; durationInFrames: number; formats: Fmt[]; props?: Record<string, unknown> }[] = [
  { id: "BlackNovember", component: BlackNovember, durationInFrames: BN_DURACAO, formats: ["9x16", "4x5"] },
  { id: "UltimosDias", component: UltimosDias, durationInFrames: UD_DURACAO, formats: ["9x16", "4x5"] },
  { id: "Estatico", component: Estatico, durationInFrames: 46, formats: ["9x16", "4x5"], props: { peca: "feed-01" } },
];
