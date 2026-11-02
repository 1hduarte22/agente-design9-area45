export type Frase = { id: string; fala: string; ini: number; fim: number };
export type Tempos = { duracao: number; frases: Frase[] };
export const FPS = 30;

/** Acesso aos tempos da narração em frames. `w(id, n)` estima o início da n-ésima palavra pela proporção de letras. */
export const makeT = (t: Tempos) => {
  const get = (id: string) => {
    const f = t.frases.find((x) => x.id === id);
    if (!f) throw new Error(`frase ${id} não existe`);
    return f;
  };
  const ini = (id: string) => Math.round(get(id).ini * FPS);
  const fim = (id: string) => Math.round(get(id).fim * FPS);
  const w = (id: string, n: number) => {
    const f = get(id);
    const words = f.fala.split(/\s+/);
    const total = words.join("").length;
    const before = words.slice(0, n).join("").length;
    return Math.round((f.ini + (f.fim - f.ini) * (before / total) * 0.95) * FPS);
  };
  return { ini, fim, w, total: Math.ceil(t.duracao * FPS) };
};
