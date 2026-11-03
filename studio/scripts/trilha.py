"""Trilha original sintetizada (phonk/funk eletrônico 125 BPM) + SFX, sincronizada aos tempos da narração.
Gera public/audio/trilha-<id>.wav e public/audio/sfx-<id>.wav. 100% local, sem licença de terceiros.
Uso: python3 scripts/trilha.py"""
import json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR, BPM = 44100, 125
B = 60 / BPM
rng = np.random.default_rng(45)
def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR; return np.minimum(t / a, 1) * np.exp(-t / d)
def filt(x, f, kind='low', o=2):
    return sosfilt(butter(o, f, kind, fs=SR, output='sos'), x)
def kick(dur=0.55):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.035); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph) * env(n, 0.001, 0.32))
def clap():
    n = int(0.22 * SR); x = rng.standard_normal(n)
    e = sum(env(n, 0.001, 0.012) * (np.arange(n) >= int(k * SR)) for k in (0, 0.011, 0.022)) + 0.6 * env(n, 0.001, 0.08)
    return filt(filt(x, 900, 'high'), 6000) * e * 0.7
def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); return filt(rng.standard_normal(n), 7000, 'high') * env(n, 0.001, 0.06 if open_ else 0.015) * 0.35
def cowbell(note):
    n = int(0.28 * SR); t = np.arange(n) / SR; f = 440 * 2 ** ((note - 69) / 12)
    x = np.sign(np.sin(2 * np.pi * f * t)) + np.sign(np.sin(2 * np.pi * f * 1.48 * t))
    return filt(filt(x, f * 0.8, 'high'), f * 4) * env(n, 0.001, 0.07) * 0.22
def sub(note, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = 440 * 2 ** ((note - 69) / 12)
    return np.tanh(1.8 * np.sin(2 * np.pi * f * t)) * env(n, 0.003, dur * 0.7) * 0.5
def boom():
    n = int(1.6 * SR); t = np.arange(n) / SR; f = 32 + 90 * np.exp(-t / 0.06)
    low = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.6)
    return np.tanh(1.6 * (low + 0.5 * filt(rng.standard_normal(n), 2500) * env(n, 0.001, 0.12)))
def whoosh(dur=0.7, up=True):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        p = i / n if up else 1 - i / n; out[i:i + seg] = filt(x[i:i + seg], 300 + 6000 * p ** 2)
    e = np.sin(np.pi * np.arange(n) / n) ** 2 if up else np.exp(-np.arange(n) / (0.25 * SR))
    return out * e * 0.6
def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = 200 + 1400 * (t / dur) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return (tone + whoosh(dur) * 0.8) * (t / dur) ** 1.5
def tick():
    n = int(0.09 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 1800 * t) * env(n, 0.0005, 0.018) * 0.5 + np.sin(2 * np.pi * 900 * t) * env(n, 0.001, 0.04) * 0.4
def glitch():
    n = int(0.25 * SR); x = np.sign(np.sin(2 * np.pi * 220 * np.arange(n) / SR)) * (rng.random(n // 300 + 1).repeat(300)[:n] > 0.4)
    return filt(x, 3000) * 0.35
def add(buf, x, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf): return
    m = min(len(x), len(buf) - i); buf[i:i + m] += x[:m] * g
# melodia de cowbell (fá menor), 2 compassos de 16 semicolcheias
MEL = [77, None, 80, None, 77, 75, None, 77, None, 72, None, 75, 77, None, 80, 82] + [80, None, 77, None, 75, 77, None, 72, None, 70, None, 72, 75, None, 77, None]
BASS = [41, 41, 44, 39]  # fá, fá, lá bemol, mi bemol (um por compasso)
def beat(buf, a, b, modo):
    """modo: full | dark (meio-tempo, abafado) | build (só chimbal acelerando) | off"""
    s16 = B / 4; k = int(np.ceil(a / s16))
    while k * s16 < b:
        t = k * s16; pos = k % 16; bar = (k // 16) % 4
        if modo in ('full',):
            if pos in (0, 6, 10): add(buf, kick(), t, 0.95)
            if pos in (4, 12): add(buf, clap(), t, 0.8)
            add(buf, hat(pos % 4 == 2), t, 0.55 if pos % 2 else 0.8)
            if MEL[k % 32] is not None: add(buf, cowbell(MEL[k % 32]), t, 1.0)
            if pos == 0: add(buf, sub(BASS[bar], B * 3.6), t, 1.0)
        elif modo == 'dark':
            if pos in (0, 10): add(buf, kick(0.7), t, 0.9)
            if pos == 8: add(buf, clap(), t, 0.5)
            if pos % 4 == 0: add(buf, hat(), t, 0.4)
            if pos == 0: add(buf, sub(BASS[bar] - 2, B * 3.8), t, 0.9)
        elif modo == 'build':
            frac = (t - a) / max(b - a, 1e-3); passo = 4 if frac < 0.5 else (2 if frac < 0.8 else 1)
            if pos % passo == 0: add(buf, clap() * (0.3 + 0.6 * frac), t, 1.0)
            add(buf, hat(), t, 0.5)
            if pos == 0: add(buf, kick(), t, 0.8)
        k += 1
def render(rid, T, cues):
    dur = T['duracao']; ph = {f['id']: f for f in T['frases']}
    def at(x):
        if not isinstance(x, str): return x
        if x.startswith('w:'):  # 'w:frase:n' = início estimado da n-ésima palavra (mesma regra de src/lib/tempos.ts)
            _, fid, n = x.split(':'); f = ph[fid]; ws = f['fala'].split()
            if n in f.get('palavras', {}): return f['palavras'][n]
            tot = len(''.join(ws)); antes = len(''.join(ws[:int(n)]))
            return round((f['ini'] + (f['fim'] - f['ini']) * antes / tot * 0.95) * 30) / 30
        return ph[x]['ini']
    mus, sfx = np.zeros(int((dur + 0.5) * SR)), np.zeros(int((dur + 0.5) * SR))
    for a, b, modo, *opt in cues['secoes']:
        sec = np.zeros_like(mus); beat(sec, at(a), at(b), modo)
        if opt and opt[0] == 'abafado': sec = filt(sec, 900)
        mus += sec
    for kind, ref, *g in cues['sfx']:
        t = at(ref); gain = g[0] if g else 1.0
        x = {'boom': boom, 'whoosh': whoosh, 'tick': tick, 'glitch': glitch}.get(kind)
        if kind == 'riser': add(sfx, riser(at(g[0]) - t), t, 0.8); continue
        if kind == 'whoosh_pre': add(sfx, whoosh(0.6), t - 0.6, 0.9); continue
        add(sfx, x(), t, gain)
    fade = int(0.6 * SR); mus[-fade:] *= np.linspace(1, 0, fade)
    for nome, x, pk in (('trilha', mus, 0.85), ('sfx', sfx, 0.9)):
        x = np.tanh(x / max(np.max(np.abs(x)), 1e-6) * 1.3) ; x = x / np.max(np.abs(x)) * pk
        sf.write(f'public/audio/{nome}-{rid}.wav', np.stack([x, x], 1), SR)
    print(rid, 'ok', round(dur, 2))
# v5: marcas em segundos, tiradas da transcrição palavra por palavra (src/data/palavras-*.json)
CUES = {
  'principal': {
    'secoes': [(0, 3.54, 'full'), (3.54, 12.38, 'dark', 'abafado'), (12.38, 13.96, 'build'), (13.96, 33.36, 'full'), (33.36, 'FIM', 'full', 'abafado')],
    'sfx': [('boom', 0.0, 1.0), ('glitch', 0.96, 0.6), ('whoosh_pre', 1.56), ('glitch', 1.56, 0.5), ('boom', 3.54, 0.4),
            ('tick', 4.66, 0.9), ('boom', 5.0, 0.35), ('whoosh_pre', 5.82)] + [('tick', 5.82 + k * 0.067, 0.5) for k in range(9)] +
           [('tick', 7.36, 0.9), ('boom', 8.94, 0.95), ('glitch', 8.94, 0.7), ('whoosh_pre', 9.44), ('boom', 10.3, 0.4),
            ('tick', 11.38, 0.8), ('glitch', 11.75, 0.5), ('riser', 12.38, 13.96), ('boom', 13.96, 1.0),
            ('whoosh_pre', 15.64), ('riser', 16.66, 17.15), ('boom', 17.15, 1.0), ('boom', 18.6, 0.45), ('whoosh_pre', 20.86)] +
           [('tick', x, 0.9) for x in (21.46, 22.06, 23.32, 24.42, 25.62, 27.0, 28.4)] +
           [('whoosh', 22.0, 0.35), ('whoosh', 24.4, 0.35), ('whoosh', 26.92, 0.35),
            ('whoosh_pre', 30.3), ('tick', 30.92, 0.8), ('boom', 31.1, 0.9), ('whoosh_pre', 32.36), ('boom', 32.74, 0.6), ('whoosh_pre', 33.36), ('boom', 'FIMHIT', 0.8)]},
  'ultimos-dias': {
    'secoes': [(0, 4.62, 'full'), (4.62, 10.04, 'full'), (10.04, 11.9, 'build'), (11.9, 13.62, 'full'), (13.62, 16.12, 'dark', 'abafado'), (16.12, 'FIM', 'full')],
    'sfx': [('boom', 0.0, 1.0), ('glitch', 0.13, 0.6), ('boom', 0.46, 0.5), ('whoosh_pre', 1.38), ('boom', 1.5, 0.4), ('boom', 3.76, 0.8)] +
           [('tick', x, 0.85) for x in (4.62, 5.5, 6.14, 7.08, 7.98, 8.7)] +
           [('whoosh_pre', 10.04)] + [('tick', 10.19 + k * 0.12, 0.4) for k in range(7)] +
           [('riser', 11.08, 11.9), ('boom', 11.9, 1.0), ('whoosh_pre', 13.62), ('glitch', 14.6, 0.6), ('glitch', 15.22, 0.8), ('boom', 15.22, 0.9),
            ('whoosh_pre', 16.12), ('boom', 16.54, 0.6), ('whoosh_pre', 17.14), ('boom', 'FIMHIT', 0.7)]},
}
for rid, cues in CUES.items():
    T = json.load(open(f'src/data/tempos-{rid}.json'))
    T['frases'] += [{'id': 'FIM', 'ini': T['duracao']}, {'id': 'FIMHIT', 'ini': T['duracao'] - 1.0}]
    render(rid, T, cues)
