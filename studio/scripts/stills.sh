#!/usr/bin/env bash
# Uso: scripts/stills.sh <Composicao-formato> <frame> [frame...]  -> out/check-<frame>.png + out/folha.jpg
set -e
cd "$(dirname "$0")/.."
comp=$1; shift
for fr in "$@"; do npx remotion still src/index.ts "$comp" "out/check-$fr.png" --frame="$fr" --log=error; done
python3 - "$@" <<'PY'
import sys; from PIL import Image
fs=sys.argv[1:]; ims=[Image.open(f'out/check-{f}.png') for f in fs]; w=300; h=int(ims[0].height*w/ims[0].width)
W=Image.new('RGB',(w*len(ims),h),'white')
for i,im in enumerate(ims): W.paste(im.resize((w,h)),(i*w,0))
W.save('out/folha.jpg',quality=85)
PY
