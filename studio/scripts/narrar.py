"""Narração local (Kokoro, pt-BR) frase a frase -> public/audio/narracao-<id>.wav + src/data/tempos-<id>.json.
Uso: python3 scripts/narrar.py [--voz pm_alex] [--vel 1.12]
Os tempos de cada frase dirigem as cenas no Remotion. Para trocar por uma locução gravada/ElevenLabs,
veja scripts/alinhar.py."""
import json, sys, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
arg = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
voz, vel = arg('--voz', 'pm_alex'), float(arg('--vel', '1.2'))
modelos = os.environ.get('KOKORO_DIR', os.path.expanduser('~/kokoro'))
k = Kokoro(f'{modelos}/kokoro-v1.0.onnx', f'{modelos}/voices-v1.0.bin')
roteiros = json.load(open('scripts/roteiros.json'))
os.makedirs('public/audio', exist_ok=True); os.makedirs('src/data', exist_ok=True)
SR = 24000
for rid, frases in roteiros.items():
    pista, t, tempos = [], 0.25, []
    pista.append(np.zeros(int(0.25 * SR)))
    for f in frases:
        a, sr = k.create(f['fala'], voice=voz, speed=vel, lang='pt-br'); assert sr == SR
        # corta silêncio das pontas
        idx = np.where(np.abs(a) > 0.02)[0]; a = a[max(0, idx[0] - 240): idx[-1] + 480]
        tempos.append({'id': f['id'], 'fala': f['fala'], 'ini': round(t, 3), 'fim': round(t + len(a) / SR, 3)})
        pista += [a, np.zeros(int(f['gap'] * SR))]; t += len(a) / SR + f['gap']
    audio = np.concatenate(pista); audio = audio / np.max(np.abs(audio)) * 0.89
    sf.write(f'public/audio/narracao-{rid}.wav', audio, SR)
    json.dump({'duracao': round(t, 3), 'frases': tempos}, open(f'src/data/tempos-{rid}.json', 'w'), ensure_ascii=False, indent=1)
    print(rid, round(t, 2), 's')
