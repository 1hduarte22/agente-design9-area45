#!/usr/bin/env bash
# Renderiza os Reels (9:16 e 4:5) com áudio e normaliza o volume para -14 LUFS (padrão de Reels/TikTok).
set -e
cd "$(dirname "$0")/.."
for c in ${@:-BlackNovember UltimosDias}; do for fm in 9x16 4x5; do
  npx remotion render src/index.ts "$c-$fm" "out/.$c-$fm.mp4" --log=error
  ffmpeg -y -loglevel error -i "out/.$c-$fm.mp4" -c:v copy -af "loudnorm=I=-14:TP=-1.0:LRA=9" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "out/$c-$fm.mp4"
  rm "out/.$c-$fm.mp4"; echo "ok out/$c-$fm.mp4"
done; done
