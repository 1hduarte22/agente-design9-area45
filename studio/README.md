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
2. **Narração**: `python3 scripts/narrar.py [--voz pm_alex] [--mistura pm_santa:0.3] [--vel 1.08]` (frases inteiras, respiros naturais, EQ + compressão + ambiente curto) gera `public/audio/narracao-<id>.wav` e `src/data/tempos-<id>.json`. Usa Kokoro (pt-BR, Apache-2.0): `pip install kokoro-onnx soundfile` e os arquivos `kokoro-v1.0.onnx` + `voices-v1.0.bin` (releases do github.com/thewh1teagle/kokoro-onnx) em `~/kokoro` ou `$KOKORO_DIR`.
3. **Trilha e efeitos**: `python3 scripts/trilha.py` sintetiza uma trilha phonk/funk eletrônica original a 125 BPM e os SFX (impactos, whoosh, riser, ticks, glitch) nos tempos de cada frase. Sem música de terceiros, sem licença a pagar.
4. As composições leem os tempos: se o texto mudar, rode os dois scripts e as cenas se reposicionam sozinhas.

**Locução gravada ou do ElevenLabs (v5, atual):** salve o arquivo como `public/audio/narracao-<id>.wav` e transcreva palavra por palavra com faster-whisper (`word_timestamps=True`) em `src/data/palavras-<id>.json`. As composições v5 usam esses tempos (em segundos) para cortar as cenas e revelar cada palavra; `scripts/trilha.py` usa os mesmos segundos para a trilha e os efeitos.

## Texto na tela (v5)

- Uma frase curta por cena. As quebras de linha são escritas à mão, por sentido (`Frase` em `src/components/v5.tsx`).
- Uma linha nunca quebra sozinha: se não couber na largura segura, a fonte encolhe. A largura é calculada pelas métricas reais das fontes (`src/data/larguras-fontes.json`), então o resultado é igual em todo render.

## Render

```bash
export REMOTION_CHROME=/caminho/do/chrome-headless-shell   # opcional; sem isso o Remotion baixa o seu
npx remotion render src/index.ts BlackNovember-9x16 out/BlackNovember-9x16.mp4
npx remotion render src/index.ts BlackNovember-4x5  out/BlackNovember-4x5.mp4
npx remotion render src/index.ts UltimosDias-9x16   out/UltimosDias-9x16.mp4
npx remotion render src/index.ts UltimosDias-4x5    out/UltimosDias-4x5.mp4
scripts/estaticos.sh                                       # 11 PNGs em out/estaticos/
scripts/stills.sh BlackNovember-9x16 10 150 450           # folha de revisão em out/folha.jpg, com as margens marcadas em vermelho
```

`scripts/render.sh` faz os 4 Reels e normaliza o áudio em -14 LUFS.

## Margens seguras (obrigatório em toda peça)

Nenhum texto, preço, logo ou CTA nas áreas que a interface do Instagram/Meta cobre:

- **9:16:** topo 14% (270 px), base 35% (672 px; 40% em anúncio com aviso legal), laterais 108 px. O canto inferior direito (230 px × 40%) é dos ícones. Na prática, tudo que importa fica entre 14% e 65% da altura.
- **Capa no grid:** conteúdo no centro 1080×1440.
- **4:5:** cerca de 70 px em cima e embaixo, 65 px nas laterais.
- Texto com no mínimo 45 px (≈ 4,2u).

`useScale()` devolve `safeTop`, `safeBottom` e `safeSide`, e o componente `Tela` já respeita esses valores. Antes de renderizar, rode `scripts/stills.sh` e confira na folha se nada importante cai no vermelho.

## Efeitos (`src/components/fx.tsx`)

`Cenas` encadeia as cenas com `Transicao`: zoom-punch, chicote ou zoom-out na entrada, e aceleração com desfoque na saída. Também estão nesse arquivo:

- `rgbSplit(frame, hits, amp)`: aberração cromática nos impactos
- `Fatias`: glitch
- `Vazamento`: luz limão
- `Grao`: grão de filme

`pulso(frame)` em `motion.ts` dá a batida de 125 BPM. A trilha aceita marcas por palavra (`'w:frase:n'`) em `scripts/trilha.py`.

## Onde está cada coisa

| Caminho | O quê |
|---|---|
| `brand.json`, `src/brand/brand.ts` | Cores, fontes (fontsource, locais), @, logo |
| `public/brand/` | Logo e símbolo oficiais da Area45 |
| `src/components/` | Fundo, Base (trapézio da marca), Linha (texto cinético), Logo, Chip, Flash, WipeBase, Progresso e `fx.tsx` (transições e efeitos) |
| `src/lib/motion.ts` | Curvas, springs, `useScale` (margens seguras por formato), `pulso` (batida), tremor de câmera |
| `src/lib/tempos.ts` | Tempos da narração em frames (`ini`, `fim`, `w` = palavra) |
| `src/compositions/` | `BlackNovember`, `UltimosDias`, `Estaticos`, `kit` (mockups do pacote) |
| `storyboards/` | Roteiro cena a cena |
