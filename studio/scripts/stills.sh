#!/usr/bin/env bash
# Uso: scripts/stills.sh <Composicao-formato> <frame> [frame...]  -> out/check-<frame>.png + out/folha.jpg
# A folha marca em vermelho as áreas fora da margem segura (topo 14%, base 35%, laterais 108px no 9:16).
set -e
cd "$(dirname "$0")/.."
comp=$1; shift
for fr in "$@"; do npx remotion still src/index.ts "$comp" "out/check-$fr.png" --frame="$fr" --log=error; done
python3 - "$@" <<'PY'
import sys; from PIL import Image, ImageDraw
fs=sys.argv[1:]; ims=[Image.open(f'out/check-{f}.png').convert('RGB') for f in fs]
W0,H0=ims[0].size; vert=H0/W0>1.5
top,bot,side=(0.14,0.35,108) if vert else (0.055,0.055,65)
w=360; h=int(H0*w/W0); cols=min(5,len(ims)); rows=(len(ims)+cols-1)//cols
F=Image.new('RGB',(w*cols,(h+24)*rows),'white'); d=ImageDraw.Draw(F)
for i,im in enumerate(ims):
    ov=Image.new('RGBA',im.size,(0,0,0,0)); o=ImageDraw.Draw(ov); red=(255,0,0,70)
    o.rectangle([0,0,W0,H0*top],fill=red); o.rectangle([0,H0*(1-bot),W0,H0],fill=red)
    o.rectangle([0,H0*top,side,H0*(1-bot)],fill=red); o.rectangle([W0-side,H0*top,W0,H0*(1-bot)],fill=red)
    im=Image.alpha_composite(im.convert('RGBA'),ov).convert('RGB').resize((w,h))
    x,y=(i%cols)*w,(i//cols)*(h+24); F.paste(im,(x,y+24)); d.text((x+6,y+5),f'frame {fs[i]}',fill='black')
F.save('out/folha.jpg',quality=85)
PY
