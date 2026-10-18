#!/usr/bin/env python3
"""Marca un experimento de stem/datos.js como listo. uso: marcar_listo.py <id> <url> <n_es> <d_es> <a_es> <n_en> <d_en> <a_en>"""
import sys, re
i, url, nes, des, aes, nen, den, aen = sys.argv[1:9]
p = 'stem/datos.js'; s = open(p).read()
m = re.search(r"\{ id: '%s', grado: (\d+), cat: '(\w+)', estado: 'pronto',(.*?)icono: '([^']*)',\n      es: \{[^\n]*\},\n      en: \{[^\n]*\} \}" % re.escape(i), s, re.S)
assert m, 'no encontrado: ' + i
e = lambda t: t.replace("\\", "\\\\").replace("'", "\\'")
nuevo = "{ id: '%s', grado: %s, cat: '%s', estado: 'listo', url: '%s', icono: '%s',\n      es: { n: '%s', d: '%s', a: '%s' },\n      en: { n: '%s', d: '%s', a: '%s' } }" % (i, m.group(1), m.group(2), url, m.group(4), e(nes), e(des), e(aes), e(nen), e(den), e(aen))
s = s[:m.start()] + nuevo + s[m.end():]
open(p, 'w').write(s); print('listo', i)
