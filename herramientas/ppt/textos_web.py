# Texto de cada diapositiva del PowerPoint final (para «Ver el texto» en el sitio)
# → js/datos/diapositivas.json y js/datos/diapositivas.js
# Uso: python herramientas/ppt/textos_web.py
import json, os, re
from pptx import Presentation

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PPT = os.path.join(RAIZ, 'presentacion', 'nuestro_colegio_ideal.pptx')
MODELOS = {m['id']: m for m in json.load(open(os.path.join(RAIZ, 'modelos', 'modelos.json'), encoding='utf-8'))}
IGNORAR = {'Leyenda 3D', 'Boton Girar en 3D', 'Zona 3D'}

textos = []
for s in Presentation(PPT).slides:
    lineas = []
    formas = sorted([f for f in s.shapes if f.has_text_frame and f.name not in IGNORAR], key=lambda f: (f.left > 5_000_000, f.top, f.left))
    for f in formas:
        for par in f.text_frame.paragraphs:
            for parte in [x.strip() for x in par.text.replace('\v', '\n').split('\n')]:
                # «COLEGIO PABLO PICASSO» se repite arriba de cada diapositiva: solo se guarda en la portada
                if parte and (parte != 'COLEGIO PABLO PICASSO' or not textos):
                    lineas.append(re.sub(r'^•\s+', '• ', parte))
    # el modelo 3D de la diapositiva (los modelos están en un bloque que python-pptx no lee como forma)
    xml = s.shapes._spTree.xml
    m = re.search(r'name="Modelo 3D - (\w+)"', xml)
    if m and m.group(1) in MODELOS:
        lineas.append('Modelo 3D: ' + MODELOS[m.group(1)]['nombre'] + '.')
    textos.append(lineas)

json.dump(textos, open(os.path.join(RAIZ, 'js', 'datos', 'diapositivas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
open(os.path.join(RAIZ, 'js', 'datos', 'diapositivas.js'), 'w', encoding='utf-8').write(
    '// Texto de cada diapositiva (generado a partir del PowerPoint final)\nexport const TEXTOS = ' + json.dumps(textos, ensure_ascii=False, indent=1) + ';\n')
print(len(textos), 'diapositivas;', sum(1 for t in textos if t and t[-1].startswith('Modelo 3D')), 'con modelo 3D')
