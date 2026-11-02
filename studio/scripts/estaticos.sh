#!/usr/bin/env bash
# Renderiza todas as peças estáticas em out/estaticos/ (PNG 1080px).
set -e
cd "$(dirname "$0")/.."
mkdir -p out/estaticos
for p in feed-01 feed-02 feed-03 carrossel-01 carrossel-02 carrossel-03 carrossel-04 carrossel-05; do
  npx remotion still src/index.ts Estatico-4x5 "out/estaticos/${p}_4x5.png" --frame=45 --props="{\"peca\":\"$p\"}" --log=error
done
for p in stories-01 stories-02 stories-03; do
  npx remotion still src/index.ts Estatico-9x16 "out/estaticos/${p}_9x16.png" --frame=45 --props="{\"peca\":\"$p\"}" --log=error
done
