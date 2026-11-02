import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig, random } from "remotion";

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};
export const springs = {
  slam: { damping: 14, stiffness: 260, mass: 0.6 },
  pop: { damping: 12, stiffness: 180, mass: 0.7 },
  soft: { damping: 200, stiffness: 120 },
};
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const progress = (f: number, a: number, b: number, e = ease.out) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });

/** u = 1% da largura (1080 → 10.8px). Formatos: 9x16 e 4x5 têm a mesma largura. */
export const useScale = () => {
  const { width, height } = useVideoConfig();
  const u = width / 100;
  const vertical = height / width > 1.5;
  return { u, width, height, vertical, safeTop: vertical ? height * 0.13 : height * 0.06, safeBottom: vertical ? height * 0.21 : height * 0.08 };
};

export const useSpring = (delay: number, config = springs.pop) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** Tremor de câmera que decai depois de cada impacto (frames absolutos da composição). */
export const shakeAt = (frame: number, hits: number[], amp = 1) => {
  let x = 0, y = 0;
  for (const h of hits) {
    const d = frame - h;
    if (d < 0 || d > 10) continue;
    const k = amp * Math.exp(-d / 3);
    x += (random(`x${h}-${d}`) - 0.5) * 2 * k;
    y += (random(`y${h}-${d}`) - 0.5) * 2 * k;
  }
  return { x, y };
};
