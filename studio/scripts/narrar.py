"""Narração local (Kokoro, pt-BR) -> public/audio/narracao-<id>.wav + src/data/tempos-<id>.json.
Uso: python3 scripts/narrar.py [--voz pm_alex] [--mistura pm_santa:0.3] [--vel 1.08]

Para soar natural: cada fala é uma frase inteira (a entonação fecha certo), a velocidade fica perto
da normal, as pausas entre frases são de respiração (0,1 a 0,6 s) e não há corte seco nas pontas.
Depois o ffmpeg dá o acabamento de locução: graves limpos, presença, compressão leve e uma sala curta.
Os tempos de cada frase dirigem as cenas no Remotion."""
import json, sys, os, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
arg = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
voz, mistura, vel = arg('--voz', 'pm_alex'), arg('--mistura', 'pm_santa:0.3'), float(arg('--vel', '1.08'))
modelos = os.environ.get('KOKORO_DIR', os.path.expanduser('~/kokoro'))
k = Kokoro(f'{modelos}/kokoro-v1.0.onnx', f'{modelos}/voices-v1.0.bin')
estilo = k.get_voice_style(voz)
if mistura:
    v2, peso = mistura.split(':'); peso = float(peso)
    estilo = estilo * (1 - peso) + k.get_voice_style(v2) * peso
roteiros = json.load(open('scripts/roteiros.json'))
os.makedirs('public/audio', exist_ok=True); os.makedirs('src/data', exist_ok=True)
SR = 24000
def apara(a):
    idx = np.where(np.abs(a) > 0.012)[0]
    a = a[max(0, idx[0] - int(0.04 * SR)): idx[-1] + int(0.12 * SR)].copy()
    n = int(0.01 * SR); a[:n] *= np.linspace(0, 1, n); a[-n * 3:] *= np.linspace(1, 0, n * 3)
    return a
for rid, frases in roteiros.items():
    t, tempos, pista = 0.12, [], [np.zeros(int(0.12 * SR))]
    for f in frases:
        a, sr = k.create(f['fala'], voice=estilo, speed=f.get('vel', vel), lang='pt-br'); assert sr == SR
        a = apara(a)
        tempos.append({'id': f['id'], 'fala': f['fala'], 'ini': round(t, 3), 'fim': round(t + len(a) / SR, 3)})
        pista += [a, np.zeros(int(f['gap'] * SR))]; t += len(a) / SR + f['gap']
    bruto = f'public/audio/.bruto-{rid}.wav'
    sf.write(bruto, np.concatenate(pista) * 0.8, SR)
    # acabamento de locução
    filtro = ('highpass=f=85,equalizer=f=220:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=3,'
              'equalizer=f=9000:t=q:w=1:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,'
              'aecho=0.85:0.4:18|31:0.10|0.06,alimiter=limit=0.89')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', bruto, '-af', filtro, '-ar', '44100',
                    f'public/audio/narracao-{rid}.wav'], check=True)
    os.remove(bruto)
    json.dump({'duracao': round(t, 3), 'frases': tempos}, open(f'src/data/tempos-{rid}.json', 'w'), ensure_ascii=False, indent=1)
    print(rid, round(t, 2), 's')
