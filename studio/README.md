# Estúdio Motion Architect (Remotion)

Estúdio local usado pela skill `motion-architect`. Primeiro projeto: campanha **Black November da Area45** (identidade visual por R$ 499), com narração, trilha e efeitos.

```bash
cd studio
npm install
npm run studio                      # abre o Remotion Studio em http://localhost:3000
npx tsc --noEmit                    # checagem antes de renderizar
```

## Pipeline de áudio (100% local)

1. **Roteiro** em `scripts/roteiros.json`: uma frase por linha, com a pausa (`gap`) depois dela.
2. **Narração**: `python3 scripts/narrar.py [--voz pm_alex] [--vel 1.2]` gera `public/audio/narracao-<id>.wav` e `src/data/tempos-<id>.json`. Usa Kokoro (pt-BR, Apache-2.0): `pip install kokoro-onnx soundfile` e os arquivos `kokoro-v1.0.onnx` + `voices-v1.0.bin` (releases do github.com/thewh1teagle/kokoro-onnx) em `~/kokoro` ou `$KOKORO_DIR`.
3. **Trilha e efeitos**: `python3 scripts/trilha.py` sintetiza uma trilha phonk/funk eletrônica original a 125 BPM e os SFX (impactos, whoosh, riser, ticks, glitch) nos tempos de cada frase. Sem música de terceiros, sem licença a pagar.
4. As composições leem os tempos: se o texto mudar, rode os dois scripts e as cenas se reposicionam sozinhas.

**Trocar por uma locução gravada ou do ElevenLabs:** salve o arquivo como `public/audio/narracao-<id>.wav` e ajuste `ini`/`fim` de cada frase em `src/data/tempos-<id>.json` (os tempos podem ser lidos no Remotion Studio ou num editor de áudio).

## Render

```bash
export REMOTION_CHROME=/caminho/do/chrome-headless-shell   # opcional; sem isso o Remotion baixa o seu
npx remotion render src/index.ts BlackNovember-9x16 out/BlackNovember-9x16.mp4
npx remotion render src/index.ts BlackNovember-4x5  out/BlackNovember-4x5.mp4
npx remotion render src/index.ts UltimosDias-9x16   out/UltimosDias-9x16.mp4
npx remotion render src/index.ts UltimosDias-4x5    out/UltimosDias-4x5.mp4
scripts/estaticos.sh                                       # 11 PNGs em out/estaticos/
scripts/stills.sh BlackNovember-9x16 10 150 450           # folha de revisão em out/folha.jpg
```

## Onde está cada coisa

| Caminho | O quê |
|---|---|
| `brand.json`, `src/brand/brand.ts` | Cores, fontes (fontsource, locais), @, logo |
| `public/brand/` | Logo e símbolo oficiais da Area45 |
| `src/components/` | Fundo, Base (trapézio da marca), Linha (texto cinético), Logo, Chip, Flash, WipeBase, Progresso |
| `src/lib/motion.ts` | Curvas, springs, `useScale` (áreas seguras por formato), tremor de câmera |
| `src/lib/tempos.ts` | Tempos da narração em frames (`ini`, `fim`, `w` = palavra) |
| `src/compositions/` | `BlackNovember`, `UltimosDias`, `Estaticos`, `kit` (mockups do pacote) |
| `storyboards/` | Roteiro cena a cena |
