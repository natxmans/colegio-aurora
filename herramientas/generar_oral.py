# Pour corriger un texte de l'oral : modifier la liste D ci-dessous, puis lancer « python herramientas/generar_oral.py »
# (régénère PRESENTACION_ORAL.md, PERSONA_1/2.md, les .html et les PDF à imprimer).
# Genera los textos del oral (fuente única → 3 archivos)
import os, re
OUT = r'C:\Users\natha\OneDrive\Documents\Mes sites\Nuestro colegio ideal\presentacion\oral'
# (n, título en la diapositiva, lo que se ve, [(quién, español, francés)], transición (quién, es, fr) o None, segundos)
D = [
 (1, 'COLEGIO PABLO PICASSO — Nuestro colegio ideal (portada)', 'el logo, el nombre del colegio y el campus entero en 3D', [
   ('P1', '¡Hola a todos! Buenos días.', 'Bonjour à tous !'),
   ('P2', 'Hoy os presentamos nuestro proyecto de español: nuestro colegio ideal.', "Aujourd'hui, nous vous présentons notre projet d'espagnol : notre collège idéal."),
   ('P1', 'Se llama Colegio Pablo Picasso.', "Il s'appelle Colegio Pablo Picasso."),
   ('P2', 'Es un internado moderno, limpio y acogedor, en España.', "C'est un internat moderne, propre et accueillant, en Espagne."),
   ('JUNTOS', 'Su lema es: «Estudiar, convivir, crecer».', 'Sa devise est : « Étudier, vivre ensemble, grandir ».'),
   ('P1', 'Hemos hecho una maqueta en 3D. Aquí veis el campus entero.', "Nous avons fait une maquette en 3D. Ici, vous voyez tout le campus."),
  ], None, 30),
 (2, '1. Presentación del colegio', 'cuatro recuadros: un lugar ideal, moderno y limpio, un internado, un buen ambiente', [
   ('P1', 'Primero, os presentamos el colegio. Está en España, en un lugar tranquilo y agradable. Es un colegio moderno y limpio.', "D'abord, nous vous présentons le collège. Il est en Espagne, dans un endroit calme et agréable. C'est un collège moderne et propre."),
   ('P1', 'Es un internado: durante la semana, los alumnos duermen en el colegio. El fin de semana, vuelven a casa.', "C'est un internat : pendant la semaine, les élèves dorment au collège. Le week-end, ils rentrent à la maison."),
   ('P1', 'Los profesores son simpáticos y las clases son divertidas.', 'Les professeurs sont sympathiques et les cours sont amusants.'),
  ], ('P1', 'Ahora, vamos a hablar del uniforme.', "Maintenant, nous allons parler de l'uniforme."), 30),
 (3, '2. El uniforme y la ropa de diario', 'el uniforme del colegio y la ropa del fin de semana', [
   ('P2', 'Gracias. De lunes a viernes, llevamos uniforme.', "Merci. Du lundi au vendredi, nous portons un uniforme."),
   ('P2', 'Llevamos un polo blanco con el cuello azul marino, una chaqueta azul marino con el logo del colegio y un pantalón o una falda azul marino.', 'Nous portons un polo blanc avec le col bleu marine, une veste bleu marine avec le logo du collège et un pantalon ou une jupe bleu marine.'),
   ('P2', 'El fin de semana, en casa, llevamos ropa cómoda.', 'Le week-end, à la maison, nous portons des vêtements confortables.'),
  ], ('P2', 'Ahora, os presentamos el edificio principal.', 'Maintenant, nous vous présentons le bâtiment principal.'), 25),
 (4, '3. El edificio principal', 'el edificio principal en 3D', [
   ('P1', 'Este es el edificio principal. Es moderno y tiene dos plantas.', 'Voici le bâtiment principal. Il est moderne et il a deux étages.'),
   ('P1', 'En la planta baja, están las aulas, los laboratorios, la biblioteca y el comedor. En el primer piso, están la vida escolar, la permanencia y los salones.', "Au rez-de-chaussée, il y a les salles de classe, les laboratoires, la bibliothèque et la cantine. Au premier étage, il y a la vie scolaire, la permanence et les salons."),
   ('P1', 'Hay grandes ventanas y mucha luz natural.', 'Il y a de grandes fenêtres et beaucoup de lumière naturelle.'),
  ], ('P1', 'Ahora, vamos a entrar en un aula.', 'Maintenant, nous allons entrer dans une salle de classe.'), 30),
 (5, '4. Las aulas', 'un aula con ordenadores, en 3D', [
   ('P2', 'Las aulas son grandes, limpias y cómodas. En cada aula, hay doce pupitres y una pizarra.', 'Les salles sont grandes, propres et confortables. Dans chaque salle, il y a douze pupitres et un tableau.'),
   ('P2', 'Hay ordenadores modernos para trabajar. En clase, trabajamos mucho en equipo.', 'Il y a des ordinateurs modernes pour travailler. En classe, nous travaillons beaucoup en équipe.'),
   ('P2', 'En nuestra maqueta, hay seis clases de diez u once alumnos.', 'Dans notre maquette, il y a six classes de dix ou onze élèves.'),
  ], ('P2', 'Ahora, te toca a ti: los laboratorios.', "Maintenant, c'est à toi : les laboratoires."), 30),
 (6, '5. Los laboratorios', 'los laboratorios en 3D', [
   ('P1', 'Tenemos dos laboratorios: un laboratorio de Ciencias de la Vida y de la Tierra, y un laboratorio de Física y Química.', 'Nous avons deux laboratoires : un laboratoire de Sciences de la Vie et de la Terre, et un laboratoire de Physique-Chimie.'),
   ('P1', 'Hay microscopios y mesas de trabajo. Aquí, hacemos experimentos.', 'Il y a des microscopes et des tables de travail. Ici, nous faisons des expériences.'),
  ], ('P1', 'Ahora, vamos a ver nuestras asignaturas.', 'Maintenant, nous allons voir nos matières.'), 25),
 (7, '6. Nuestras nueve asignaturas', 'la lista de las nueve asignaturas de 4º', [
   ('P2', 'En cuarto, tenemos nueve asignaturas.', 'En quatrième, nous avons neuf matières.'),
   ('P2', 'Hay ciencias: Ciencias de la Vida y de la Tierra, y Física y Química. Hay dos idiomas: francés e inglés.', 'Il y a des sciences : SVT et Physique-Chimie. Il y a deux langues : le français et l\'anglais.'),
   ('P2', 'Hay también Historia y Geografía, Matemáticas y Tecnología. Y, por fin, Educación Física y Música.', 'Il y a aussi Histoire-Géographie, Mathématiques et Technologie. Et enfin, EPS et Musique.'),
   ('P2', 'Cada clase dura una hora.', 'Chaque cours dure une heure.'),
  ], ('P2', 'Ahora, vamos a la biblioteca.', 'Maintenant, allons à la bibliothèque.'), 30),
 (8, '7. La biblioteca digital', 'la biblioteca en 3D', [
   ('P1', 'Esta es la biblioteca digital. Es un lugar tranquilo.', "Voici la bibliothèque numérique. C'est un endroit calme."),
   ('P1', 'Hay libros en papel y también libros digitales. Hay mesas para leer y estudiar, y ordenadores.', 'Il y a des livres en papier et aussi des livres numériques. Il y a des tables pour lire et étudier, et des ordinateurs.'),
   ('P1', 'Por la tarde, después de las clases, muchos alumnos vienen aquí.', "L'après-midi, après les cours, beaucoup d'élèves viennent ici."),
  ], ('P1', '¿Y dónde comemos? Te toca.', "Et où est-ce qu'on mange ? À toi."), 25),
 (9, '8. El comedor', 'el comedor en 3D', [
   ('P2', 'Comemos todos juntos en el comedor. El comedor es muy grande.', 'Nous mangeons tous ensemble à la cantine. La cantine est très grande.'),
   ('P2', 'Comemos a las doce y veinte. La comida es sana y equilibrada.', 'Nous mangeons à midi vingt. La nourriture est saine et équilibrée.'),
   ('P2', 'En la maqueta, los sesenta y cuatro alumnos comen juntos, en ocho mesas grandes.', 'Dans la maquette, les soixante-quatre élèves mangent ensemble, à huit grandes tables.'),
  ], ('P2', 'Y por la noche, ¿dónde dormimos? En la residencia.', 'Et le soir, où dormons-nous ? À la résidence.'), 25),
 (10, '9. La residencia', 'la residencia en 3D', [
   ('P1', 'Todos los dormitorios están en la residencia. Es un edificio al lado del colegio.', 'Toutes les chambres sont dans la résidence. C\'est un bâtiment à côté du collège.'),
   ('P1', 'Tiene dos plantas de habitaciones y salones para descansar.', 'Elle a deux étages de chambres et des salons pour se reposer.'),
   ('P1', 'Hay treinta y dos habitaciones dobles: hay sitio para sesenta y cuatro alumnos.', 'Il y a trente-deux chambres doubles : il y a de la place pour soixante-quatre élèves.'),
  ], ('P1', 'Ahora, vamos a ver una habitación.', 'Maintenant, nous allons voir une chambre.'), 25),
 (11, '10. Las habitaciones', 'una habitación doble en 3D', [
   ('P2', 'Cada habitación es para dos compañeros.', 'Chaque chambre est pour deux camarades.'),
   ('P2', 'Hay dos camas individuales, dos escritorios y dos armarios. Así, cada alumno tiene su cama, su escritorio y su armario.', 'Il y a deux lits simples, deux bureaux et deux armoires. Comme ça, chaque élève a son lit, son bureau et son armoire.'),
   ('P2', 'A las nueve de la noche, los alumnos se acuestan.', 'À neuf heures du soir, les élèves se couchent.'),
  ], ('P2', 'Ahora, hablamos de deporte.', 'Maintenant, parlons de sport.'), 25),
 (12, '11. El gimnasio', 'el gimnasio en 3D', [
   ('P1', 'En el colegio, hacemos mucho deporte.', 'Au collège, nous faisons beaucoup de sport.'),
   ('P1', 'El gimnasio es grande, cubierto y moderno. Aquí tenemos la clase de Educación Física.', "Le gymnase est grand, couvert et moderne. Ici, nous avons le cours d'EPS."),
   ('P1', 'Después de las clases, también podemos hacer ejercicio aquí.', 'Après les cours, nous pouvons aussi faire du sport ici.'),
  ], ('P1', 'Y ahora, la piscina.', 'Et maintenant, la piscine.'), 20),
 (13, '12. La piscina', 'la piscina olímpica en 3D', [
   ('P2', 'También tenemos una piscina olímpica. Es cubierta y climatizada.', 'Nous avons aussi une piscine olympique. Elle est couverte et chauffée.'),
   ('P2', 'Por eso, podemos nadar todo el año, también en invierno.', "C'est pour ça que nous pouvons nager toute l'année, même en hiver."),
   ('P2', 'Hay ocho calles, y un socorrista vigila a los alumnos.', 'Il y a huit couloirs, et un maître-nageur surveille les élèves.'),
  ], ('P2', 'Ahora, vamos fuera.', 'Maintenant, allons dehors.'), 25),
 (14, '13. Las instalaciones deportivas', 'el campo de fútbol y la cancha de baloncesto en 3D', [
   ('P1', 'Fuera, hay un campo de fútbol con gradas y una cancha de baloncesto.', 'Dehors, il y a un terrain de foot avec des tribunes et un terrain de basket.'),
   ('P1', 'Después de las clases, a las cinco, los alumnos juegan al fútbol y al baloncesto con sus amigos.', 'Après les cours, à cinq heures, les élèves jouent au foot et au basket avec leurs amis.'),
  ], ('P1', 'Ahora, os explicamos la vida en el internado.', "Maintenant, nous vous expliquons la vie à l'internat."), 20),
 (15, '14. La vida en el internado', 'cuatro recuadros: de lunes a viernes, el fin de semana, sin deberes, jardines y salones', [
   ('P2', 'De lunes a viernes, vivimos en el colegio. El sábado y el domingo, volvemos a casa con la familia.', 'Du lundi au vendredi, nous vivons au collège. Le samedi et le dimanche, nous rentrons à la maison avec la famille.'),
   ('P2', 'No hay deberes en casa: hacemos todo el trabajo en el colegio, en la sala de estudio.', "Il n'y a pas de devoirs à la maison : nous faisons tout le travail au collège, dans la salle d'étude."),
   ('P2', 'Para descansar, hay jardines y salones con sofás. Allí hablamos con los amigos.', 'Pour se reposer, il y a des jardins et des salons avec des canapés. Là, nous parlons avec nos amis.'),
  ], ('P2', '¿Y cómo es un día en el colegio?', 'Et comment se passe une journée au collège ?'), 30),
 (16, '15. El horario', 'el horario de un día', [
   ('P1', 'Así es un día en el colegio. Nos despertamos a las ocho menos cuarto. Las clases empiezan a las ocho.', "Voici une journée au collège. Nous nous réveillons à huit heures moins le quart. Les cours commencent à huit heures."),
   ('P1', 'A las diez, tenemos un recreo de veinte minutos. Comemos a las doce y veinte.', 'À dix heures, nous avons une récréation de vingt minutes. Nous mangeons à midi vingt.'),
   ('P1', 'Las clases vuelven a empezar a las dos y terminan a las cinco. A las nueve de la noche, nos acostamos.', 'Les cours reprennent à deux heures et finissent à cinq heures. À neuf heures du soir, nous nous couchons.'),
  ], ('P1', 'Para terminar…', 'Pour finir…'), 30),
 (17, '16. ¿Por qué nos gusta nuestro colegio?', 'tres razones y «¡Bienvenidos al Colegio Pablo Picasso!»', [
   ('P2', '¿Por qué nos gusta nuestro colegio? Hay tres razones.', 'Pourquoi aimons-nous notre collège ? Il y a trois raisons.'),
   ('P2', 'Primero, el colegio es moderno, limpio y bien equipado. Segundo, los profesores son simpáticos y el ambiente es agradable.', "D'abord, le collège est moderne, propre et bien équipé. Ensuite, les professeurs sont sympathiques et l'ambiance est agréable."),
   ('P2', 'Y tercero, no hay deberes en casa: el fin de semana, tenemos tiempo libre para la familia.', "Et enfin, il n'y a pas de devoirs à la maison : le week-end, nous avons du temps libre pour la famille."),
   ('JUNTOS', '¡Bienvenidos al Colegio Pablo Picasso!', 'Bienvenue au Colegio Pablo Picasso !'),
   ('P1', '¿Tenéis alguna pregunta?', 'Avez-vous des questions ?'),
   ('JUNTOS', '¡Muchas gracias!', 'Merci beaucoup !'),
  ], None, 35),
]
NOM = {'P1': 'Personne 1', 'P2': 'Personne 2', 'JUNTOS': 'Les deux ensemble'}
pal = lambda s: len(re.findall(r"[\wáéíóúñü]+", s))
cuenta = {'P1': 0, 'P2': 0, 'JUNTOS': 0}; seg = {'P1': 0, 'P2': 0, 'JUNTOS': 0}
for n, t, v, partes, tr, s in D:
    for q, es, fr in partes: cuenta[q] += pal(es)
    if tr: cuenta[tr[0]] += pal(tr[1])
    quien = {q for q, _, _ in partes if q != 'JUNTOS'}
    if len(quien) == 1: seg[quien.pop()] += s
    else: seg['JUNTOS'] += s
total_s = sum(x[5] for x in D)
def orador(partes):
    q = {p[0] for p in partes}
    return 'Les deux' if len(q) > 1 else NOM[q.pop()]
CAB = """> Textes écrits à partir des **vraies diapositives** du fichier `presentacion/nuestro_colegio_ideal.pptx`
> (17 diapositives, vérifiées le 15/11/2026) et de la **vraie maquette 3D** (64 élèves, 6 classes,
> 32 chambres doubles, 8 tables de 8 à la cantine, 8 couloirs dans la piscine).
> Aucune information n'est inventée. Espagnol simple (présent, phrases courtes).
>
> **▶ CLIC** = changer de diapositive à ce moment-là (conseil : c'est **Personne 1** qui tient la souris
> ou la télécommande pendant tout l'oral ; l'autre n'a qu'à parler).
> On **explique** ce que la classe voit : on ne lit pas la diapositive.
"""
L = ['# Présentation orale à deux — Colegio Pablo Picasso\n', CAB,
     '\n## Répartition de la parole\n',
     '| Diapo | Titre | Qui parle | Durée |', '|---|---|---|---|']
for n, t, v, partes, tr, s in D:
    L.append(f'| {n} | {t} | {orador(partes)} | ~{s} s |')
L += ['', f"**Durée estimée : environ {total_s // 60} min {total_s % 60:02d} s** (à vérifier en répétition : objectif 7 à 9 minutes).", '',
      '| | Personne 1 | Personne 2 | Ensemble |', '|---|---|---|---|',
      f"| Diapositives | 2, 4, 6, 8, 10, 12, 14, 16 (+ début de la 1) | 3, 5, 7, 9, 11, 13, 15, 17 (+ début de la 1) | intro (1) et fin (17) |",
      f"| Mots en espagnol | {cuenta['P1']} | {cuenta['P2']} | {cuenta['JUNTOS']} |",
      f"| Temps de parole seul | ~{seg['P1']} s | ~{seg['P2']} s | ~{seg['JUNTOS']} s |", '',
      'Les deux alternent à chaque diapositive : Personne 1 a plutôt **les bâtiments**, Personne 2 plutôt **la vie des élèves**. Les deux textes ont la même longueur : vous choisissez librement qui est Personne 1 et qui est Personne 2. Cette répartition ne sert **que pour l’oral** : tout le reste du projet se fait à deux.', '',
      '## Diapositive par diapositive\n']
for n, t, v, partes, tr, s in D:
    L.append(f'### Diapo {n} — {t}  ·  {orador(partes)}  ·  ~{s} s')
    L.append(f'*Ce que la classe voit : {v}.*\n')
    L.append('| Qui | Espagnol (à dire) | Français |'); L.append('|---|---|---|')
    for q, es, fr in partes: L.append(f'| **{NOM[q]}** | {es} | {fr} |')
    if tr: L.append(f'| **{NOM[tr[0]]}** — *transition* | {tr[1]} **▶ CLIC** | {fr_tr if False else tr[2]} |')
    else: L.append('| | **▶ CLIC** à la fin' + (' (dernière diapositive : on reste dessus pour les questions)' if n == 17 else '') + ' | |')
    L.append('')
L += ['## Mots difficiles à prononcer\n',
      '| Lettre | Comment on la dit | Exemples du texte |', '|---|---|---|',
      '| **j**, **ge**, **gi** | comme un « r » qui racle la gorge | trabajamos, ejercicio, jardines, Geografía |',
      '| **ll** | comme « y » | llevamos, allí |',
      '| **ñ** | comme « gn » | España, compañeros |',
      '| **c** (+e, i) et **z** | comme le « th » anglais (ou « s ») | Ciencias, piscina, doce, gracias, azul |',
      '| **v** | presque comme « b » | vivimos, veinte, vuelven, ventanas |',
      '| **h** | ne se prononce pas | hay, hablamos, hora, Historia |',
      '| **u** | « ou » | uniforme, azul, juntos |',
      '| **e** final | se prononce « é » | clase, simpáticos → « clasé » |',
      '| **r** / **rr** | roulé | recreo, pizarra |', '',
      'Accent tonique (syllabe forte) : la**bo**ra**to**rios · e-qui-li-**bra**-da · cli-ma-ti-**za**-da · re-si-**den**-cia · **có**-mo-das · Mate**má**ticas.', '']
open(os.path.join(OUT, 'PRESENTACION_ORAL.md'), 'w', encoding='utf-8').write('\n'.join(L))
for P in ['P1', 'P2']:
    M = [f'# Mon texte — {NOM[P]}\n', f"Toutes mes interventions, dans l'ordre. **[ENSEMBLE]** = on le dit à deux. "
         + ("Je tiens la souris : je fais les **▶ CLIC**." if P == 'P1' else "Personne 1 fait les **▶ CLIC** : j'attends que la diapositive change avant de parler."), '']
    for n, t, v, partes, tr, s in D:
        mien = [(q, es, fr) for q, es, fr in partes if q in (P, 'JUNTOS')]
        trm = tr if tr and tr[0] == P else None
        if not mien and not trm: continue
        M.append(f'## Diapo {n} — {t}')
        for q, es, fr in partes:
            if q == P: M.append(f'- 🇪🇸 **{es}**  \n  🇫🇷 *{fr}*')
            elif q == 'JUNTOS': M.append(f'- **[ENSEMBLE]** 🇪🇸 **{es}**  \n  🇫🇷 *{fr}*')
            else: M.append(f'- *(l\'autre dit : « {es} »)*')
        if not tr and n < 17 and P == 'P1': M.append('- **▶ CLIC** (fin de la diapositive)')
        if trm: M.append(f'- ➜ *transition* 🇪🇸 **{trm[1]}**' + (' **▶ CLIC**' if P == 'P1' else ' *(Personne 1 clique)*') + f'  \n  🇫🇷 *{trm[2]}*')
        M.append('')
    open(os.path.join(OUT, f'PERSONA_{P[1]}.md'), 'w', encoding='utf-8').write('\n'.join(M))
print(cuenta, seg, total_s)

# ---------- versiones para imprimir (HTML → PDF con Chrome) ----------
import html as H, subprocess
CSS = """body{font-family:Arial,Helvetica,sans-serif;margin:14mm 14mm;color:#14285a}h1{font-size:22pt;margin:0 0 4mm}
.nota{font-size:11pt;color:#555;margin-bottom:6mm}.d{border-top:2px solid #c9a978;padding-top:3mm;margin-top:5mm;page-break-inside:avoid}
.d h2{font-size:14pt;margin:0 0 2mm}.es{font-size:17pt;font-weight:bold;line-height:1.35;margin:2mm 0 0}.fr{font-size:11.5pt;color:#555;font-style:italic;margin:0 0 2mm}
.otro{font-size:11pt;color:#888;margin:1mm 0}.junt{background:#f3ead8;border-radius:6px;padding:1mm 2mm}.clic{background:#14285a;color:#fff;border-radius:4px;padding:0 2mm;font-size:12pt}"""
for P in ['P1', 'P2']:
    B = [f'<!doctype html><meta charset="utf-8"><title>{NOM[P]}</title><style>{CSS}</style>',
         f'<h1>Colegio Pablo Picasso — mi texto ({NOM[P]})</h1><div class="nota">Lis lentement, regarde la classe. ▶ CLIC = changer de diapositive'
         + (' (c\'est moi qui clique).' if P == 'P1' else ' (Personne 1 clique).') + ' Durée totale ≈ 7 à 9 min.</div>']
    for n, t, v, partes, tr, s in D:
        mien = [x for x in partes if x[0] in (P, 'JUNTOS')]
        trm = tr if tr and tr[0] == P else None
        if not mien and not trm: continue
        B.append(f'<div class="d"><h2>Diapo {n} — {H.escape(t)}</h2>')
        for q, es, fr in partes:
            if q == P: B.append(f'<p class="es">{H.escape(es)}</p><p class="fr">{H.escape(fr)}</p>')
            elif q == 'JUNTOS': B.append(f'<p class="es junt">[ENSEMBLE] {H.escape(es)}</p><p class="fr">{H.escape(fr)}</p>')
            else: B.append(f'<p class="otro">(l\'autre dit : « {H.escape(es)} »)</p>')
        if not tr and n < 17 and P == 'P1': B.append('<p class="es"><span class="clic">▶ CLIC</span> (fin de la diapositive)</p>')
        if trm: B.append(f'<p class="es">➜ {H.escape(trm[1])} <span class="clic">▶ CLIC</span></p><p class="fr">{H.escape(trm[2])}</p>')
        B.append('</div>')
    f = os.path.join(OUT, f'PERSONA_{P[1]}.html'); open(f, 'w', encoding='utf-8').write('\n'.join(B))
    pdf = os.path.join(OUT, f'PERSONA_{P[1]}_imprimir.pdf')
    subprocess.run([r'C:\Program Files\Google\Chrome\Application\chrome.exe', '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                    f'--print-to-pdf={pdf}', 'file:///' + f.replace(os.sep, '/')], timeout=120, capture_output=True)
    print(pdf, os.path.exists(pdf) and os.path.getsize(pdf))

# ---------- fiche d'une page : la répartition de la parole (à imprimer) ----------
def debut(t, n=7):
    m = t.split(); return ' '.join(m[:n]) + (' …' if len(m) > n else '')
F = ['<!doctype html><meta charset="utf-8"><title>Répartition de la parole</title><style>',
     '@page{size:A4 landscape;margin:9mm}body{font-family:Arial,Helvetica,sans-serif;color:#14285a;margin:0}',
     'h1{font-size:15pt;margin:0 0 1mm}p.n{font-size:9pt;color:#555;margin:0 0 2mm}',
     'table{border-collapse:collapse;width:100%;font-size:8.6pt}th,td{border:1px solid #c9a978;padding:1.1mm 1.6mm;vertical-align:top}',
     'th{background:#14285a;color:#fff;text-align:left}.p1{background:#e8eef9}.p2{background:#f6efe2}.j{background:#e9f3ea}',
     '.q{font-weight:bold;white-space:nowrap}.c{background:#14285a;color:#fff;border-radius:3px;padding:0 1.2mm;font-size:8pt;white-space:nowrap}</style>',
     '<h1>Colegio Pablo Picasso — répartition de la parole</h1>',
     f'<p class="n">On alterne à chaque diapositive. Personne 1 : diapos 2, 4, 6, 8, 10, 12, 14, 16 ({cuenta["P1"]} mots, ~{seg["P1"]} s seul). '
     f'Personne 2 : diapos 3, 5, 7, 9, 11, 13, 15, 17 ({cuenta["P2"]} mots, ~{seg["P2"]} s seul). Ensemble : intro et fin. '
     f'Durée ≈ {total_s // 60} min {total_s % 60:02d}. Personne 1 fait les <span class="c">▶ CLIC</span>. '
     'Personne 1 = ____________________ · Personne 2 = ____________________</p>',
     '<table><tr><th>Diapo</th><th>Titre</th><th>Qui parle</th><th>Premiers mots</th><th>Transition (fin de la diapo)</th><th>Durée</th></tr>']
for n, t, v, partes, tr, s in D:
    q = orador(partes); cls = 'j' if q == 'Les deux' else ('p1' if q == 'Personne 1' else 'p2')
    if tr: fin = f'<b>{NOM[tr[0]]}</b> : « {H.escape(tr[1])} » <span class="c">▶ CLIC</span>'
    elif n < 17: fin = '<span class="c">▶ CLIC</span> après « ' + H.escape(debut(partes[-1][1], 6)) + ' »'
    else: fin = 'Ensemble : « ¡Bienvenidos…! » · P1 : « ¿Tenéis alguna pregunta? » · Ensemble : « ¡Muchas gracias! »'
    seq = [NOM[p[0]].replace('Personne ', 'P').replace('Les deux ensemble', 'Ensemble') for p in partes]
    qui = ' → '.join(x for k, x in enumerate(seq) if k == 0 or x != seq[k - 1])
    F.append(f'<tr class="{cls}"><td class="q">{n}</td><td>{H.escape(t)}</td><td class="q">{qui}</td><td>« {H.escape(debut(partes[0][1]))} »</td><td>{fin}</td><td>~{s} s</td></tr>')
F.append('</table>')
f = os.path.join(OUT, 'REPARTITION_PAROLE.html'); open(f, 'w', encoding='utf-8').write('\n'.join(F))
pdf = os.path.join(OUT, 'REPARTITION_PAROLE_imprimir.pdf')
subprocess.run([r'C:\Program Files\Google\Chrome\Application\chrome.exe', '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                f'--print-to-pdf={pdf}', 'file:///' + f.replace(os.sep, '/')], timeout=120, capture_output=True)
print(pdf, os.path.exists(pdf) and os.path.getsize(pdf))
