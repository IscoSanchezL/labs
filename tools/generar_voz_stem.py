#!/usr/bin/env python3
"""Genera la narración (MP3) de los laboratorios STEM con la voz de Beto (es-MX-JorgeNeural).

Lee stem/actividades/*/narracion.json (español) y narracion.en.json (inglés) ([{id, texto}]) y escribe audio/<id>.mp3 y audio/en/<id>.mp3.
Solo regenera lo que cambió (guarda un hash del texto en audio/_hash.json).
Uso:  pip install edge-tts && python3 tools/generar_voz_stem.py
"""
import asyncio, hashlib, json, sys, time
from pathlib import Path
try:
    import edge_tts
except ImportError:
    sys.exit("Falta edge-tts: pip install edge-tts")

VOCES = {"es": "es-MX-JorgeNeural", "en": "en-US-AndrewNeural"}
RATE, PITCH = "-5%", "+6Hz"
RAIZ = Path(__file__).resolve().parent.parent

async def generar(texto, destino, voz):
    for n in range(1, 5):
        try:
            await edge_tts.Communicate(texto, voz, rate=RATE, pitch=PITCH).save(str(destino))
            if destino.stat().st_size > 500:
                return True
        except Exception as e:
            print("   reintento:", e)
        time.sleep(1.5 * n)
    destino.unlink(missing_ok=True)
    return False

async def main():
    hechas = fallos = 0
    for nar in sorted((RAIZ / "stem" / "actividades").glob("*/narracion*.json")):
        idioma = "en" if nar.name == "narracion.en.json" else "es"
        sal = nar.parent / "audio" / ("en" if idioma == "en" else ""); sal.mkdir(parents=True, exist_ok=True)
        hf = sal / "_hash.json"; hashes = json.loads(hf.read_text()) if hf.exists() else {}
        for f in json.loads(nar.read_text(encoding="utf-8")):
            h = hashlib.sha1((VOCES[idioma] + f["texto"]).encode()).hexdigest()
            dest = sal / f'{f["id"]}.mp3'
            if dest.exists() and hashes.get(f["id"]) == h:
                continue
            print(f'{nar.parent.name}/{idioma}/{f["id"]}: {f["texto"][:60]}')
            if await generar(f["texto"], dest, VOCES[idioma]):
                hashes[f["id"]] = h; hechas += 1
            else:
                fallos += 1
        hf.write_text(json.dumps(hashes, indent=1))
    print(f"Generadas: {hechas} · fallidas: {fallos}")
    sys.exit(1 if fallos else 0)

asyncio.run(main())
