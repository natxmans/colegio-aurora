# Colegio Pablo Picasso · Nuestro colegio ideal

Site web du projet d'espagnol (4e) : un internat moderne en Espagne.
- **D'abord la présentation PowerPoint** (12 diapositives), en grand en haut de la page.
- **Ensuite le campus 3D vivant** : les élèves et les professeurs suivent leur journée tout seuls,
  avec un vrai cycle jour/nuit.

Devise officielle : **Estudiar · Convivir · Crecer**. Logo officiel : l'emblème rond « INTERNAT »
(bleu marine et crème, bannière Colegio Pablo Picasso, devise) → `img/logo-original-1024.png`,
centré sans déformation dans un carré transparent. Ne jamais le redessiner ni l'étirer.

- **En ligne :** https://natxmans.github.io/colegio-aurora/
- **PowerPoint final :** `presentacion/nuestro_colegio_ideal.pptx` (17 diapositives, dont 11 avec un vrai bâtiment 3D).
  Ancienne version (v1) gardée dans `Sauvegardes/colegio-avant-perfection-…/nuestro_colegio_ideal_3D_v1.pptx`.
- **Visionneuse 3D :** https://natxmans.github.io/colegio-aurora/visor3d.html (les 11 bâtiments, souris et doigts)

## Les bâtiments en 3D (PowerPoint + visionneuse)

Les 11 modèles (`modelos/*.glb`) sont **exportés de la maquette du site** : mêmes pièces, mêmes corrections.
Couverture = campus entier ; puis bâtiment principal, salle de classe, laboratoires, bibliothèque, cantine,
résidence, chambre double, gymnase, piscine, terrains de sport (un bâtiment par diapositive).
Les salles « en coupe » (salle, labos, bibliothèque, cantine, chambre) sont montrées sans le toit, exprès,
pour voir l'intérieur ; les bâtiments vus de l'extérieur ont un toit complet (vérifié vue de dessus).
**Toit corrigé (v2)** : la voûte de la piscine avait une bande sur deux en verre presque invisible (on voyait
l'intérieur : toit « à moitié ouvert »). Elle est maintenant pleine avec une seule bande vitrée au sommet ;
idem pour le gymnase ; façades vitrées en verre teinté (`js/3d/Deportes.js`, `js/3d/kit.js`).

**Dans PowerPoint (testé dans PowerPoint Microsoft 365)** : les modèles sont de vrais objets 3D.
- En **mode édition** : clic sur le bâtiment → tirer le **rond du milieu** pour le tourner dans tous les sens
  (façade, côtés, arrière, toit). Onglet **Modèle 3D → Panoramique et zoom** : la loupe à droite zoome,
  glisser déplace le bâtiment. Le bâtiment ne sort jamais de sa zone (testé sur 440 positions).
- En **mode diaporama** (F5), PowerPoint ne permet pas de tourner un modèle 3D (un clic passe à la diapositive
  suivante) : c'est une limite de PowerPoint. Pendant l'exposé : bouton **« Girar en 3D ↗ »** (visionneuse du
  site sur ce bâtiment) ou **« Ver en el campus 3D ↗ »** (le même bâtiment dans le campus vivant). Internet nécessaire.
- La molette de la souris, dans PowerPoint, change de diapositive (elle ne zoome pas le modèle).
- PowerPoint n'a pas d'effet « au survol » pour les modèles 3D : l'indication est écrite sous le texte.
- Logiciels sans 3D (LibreOffice, anciennes versions) : une image du bâtiment s'affiche à la place (testé dans LibreOffice).

**Sur le site** : dans la présentation en haut de la page, sur les diapositives 3D, la visionneuse est placée
dans la diapositive : glisser = tourner à 360°, molette = zoom, clic droit = déplacer ; au doigt : un doigt pour
tourner, deux doigts pour zoomer et déplacer. Boutons Vista frontal / lateral / trasera / superior / Restablecer vista.
Au survol : curseur « main », le bâtiment s'éclaire un peu et une indication apparaît (il ne tourne jamais tout seul).
Le zoom est limité et le centre de la vue reste sur le bâtiment : il ne peut pas sortir du cadre.
Sur la couverture, le campus entier (13 Mo) ne se charge qu'en cliquant sur « Girar el campus en 3D ».
Dans la visionneuse, bouton **Exterior / Interior** pour le bâtiment principal (rez-de-chaussée), la résidence (chambres
de l'étage), le gymnase et la piscine : la vue extérieure garde le toit fermé, la vue intérieure l'enlève.

**Refaire les modèles et le PowerPoint** (si la maquette change), avec `LANCER-LE-SITE.bat` ouvert :
1. `python herramientas/exportar_modelos.py` → `modelos/*.glb` (zones dans `js/datos/modelos3d.js`)
2. `powershell -File herramientas/ppt/anadir_3d.ps1` → PowerPoint (part de `herramientas/ppt/base-12-diapositivas.pptx`,
   plan dans `herramientas/ppt/plan-3d.json`), images des diapositives et `js/datos/diapositivas3d.json`
3. `python herramientas/ppt/textos_web.py` → texte des diapositives pour « Ver el texto »
   (images du campus pour les diapositives sans 3D : `python herramientas/ppt/renders_ppt.py`)
4. Tests : `python herramientas/prueba_ppt3d.py` (37 tests), `python herramientas/prueba_enlaces.py` (les 22 liens),
   `python herramientas/revisar_tejados.py` (toits vus de dessus), `python herramientas/vistas_modelos.py` (photos des modèles)

## Lancer le site sur ton PC

1. Double-clique sur **`LANCER-LE-SITE.bat`** (il faut Python, déjà installé).
2. Le navigateur s'ouvre sur `http://localhost:8820`.
3. Laisse la fenêtre noire ouverte pendant la présentation.

⚠️ La 3D a besoin d'**Internet** (React, Three.js et Drei viennent de `esm.sh`).
La présentation, elle, marche même sans Internet et sans 3D.
Si la connexion coupe un instant (Wi-Fi de la classe), le site réessaie tout seul jusqu'à 3 fois,
puis affiche un bouton « Reintentar ».

## La présentation (haut de la page)

Flèches ou touches ← →, miniatures, « Ver el texto », plein écran, « Descargar (.pptx) ».
Elle est écrite sans bibliothèque (`js/presentacion-basica.js`) : rien ne peut la bloquer.
Sur les 11 diapositives avec un bâtiment, le modèle 3D se manipule directement dans la diapositive
(sans WebGL : l'image de la diapositive reste affichée).

## Le campus 3D

| Action | Comment |
|---|---|
| Ouvrir en grand | « Explorar a pantalla completa » (Échap pour sortir) |
| Tourner / zoomer / déplacer | clic gauche + glisser / molette / clic droit (en plein écran) |
| Visiter un bâtiment ou une salle | clic dessus ou sur son étiquette |
| Vues | Vista general, Planta baja, Primer piso, Residencia, Deportes, En corte (touches 1 à 6) |
| Toits | « Quitar techos » / « Poner techos » |
| Personnages | « Ocultar personas » / « Mostrar personas » (la simulation continue quand ils sont cachés) |
| Visite automatique | « Visita guiada » (18 étapes) |
| Le temps | panneau en bas à gauche : pause, Lento / Normal / Rápido / Muy rápido, Hora real |
| Aller à une heure | « ¿Qué pasa? » → 07:45, 08:00, 10:00, 12:20, 14:00, 17:00, 21:00, Día, Noche, ou « Otra hora » (n'importe quelle heure) |
| Jour suivant | « ¿Qué pasa? » → « Día siguiente » (07:30 du jour suivant, du lundi au vendredi) |
| Voir ce que fait chaque classe | « ¿Qué pasa? » : les 4 classes, les absences, « Simular la ausencia de un profesor », « Seguir a un alumno » |

Cliquer sur un élève ne fait rien (choix voulu : c'est une présentation). Les assistants des élèves
sont dans la section « Asistentes IA ».

### Liens directs (pratique en classe)

- `…/?hora=10:00&vista=completa` : le campus à l'heure de la récréation
- `…/?vista=residencia` : la résidence (chambres doubles)
- `…/?sala=hab101&dentro=1` : à l'intérieur de la chambre 101
- `…/?sala=permanencia`, `…/?sala=comedor`, `…/?sala=piscina`… : un lieu précis
- `…/?ritmo=rapido` : le temps passe plus vite
- `…/?calidad=ligera` (ou `normal`, `alta`) : forcer une qualité

## Comment marche la vie du collège

- **Horaire officiel** (`js/sim/horario.js`) : 07:45 réveil, 08:00 cours, 10:00 récréation de 20 min,
  12:20 repas, 14:00 cours, 17:00 fin des cours, 21:00 coucher. 4 classes (4ºA à 4ºD), 9 matières,
  9 professeurs, du personnel (accueil, bibliothèque, cuisine, vie scolaire, permanence, maître-nageur, éducateur de nuit).
- **Absences** : certains jours un professeur manque ; ses élèves vont à la **permanencia**.
- **Déplacements** (`js/sim/navegacion.js`) : un plan de circulation est calculé à partir des vrais
  murs et meubles de la maquette. Les élèves passent par les portes, les couloirs et les escaliers :
  ils ne traversent pas les murs. Toutes les places (766 chaises, lits, bureaux…) sont accessibles à pied.
- **Corps articulés** (`js/sim/cuerpo.js`) : bassin, colonne, cou, tête, épaules, coudes, poignets,
  hanches, genoux, chevilles. Animations : marcher, courir, s'asseoir, écrire, ordinateur, lire,
  manger, discuter, nager, se coucher, dormir, football, basket, exercices…
- **Le temps** (`js/sim/reloj.js`) : quand beaucoup d'élèves marchent, l'horloge ralentit pour qu'on
  les voie marcher (pas de téléportation). La nuit, quand tout le monde dort, elle accélère.
  Seul le bouton « Ir a… » replace directement tout le monde (c'est un saut dans le temps voulu).
- **Jour/nuit** : soleil, ciel, lune, étoiles, fenêtres allumées quand il y a du monde,
  lumières des chambres éteintes peu à peu à partir de 21:00, lampadaires le soir.

## Diagnostic et qualité

`js/diagnostico.js` vérifie au chargement : navigateur, WebGL, textures, mémoire, processeur,
connexion, écran. Résultat dans le menu : « Compatible », « Compatible con rendimiento reducido »
ou « Algunas funciones no están disponibles ». Trois qualités (`js/calidad.js`) :
Alta (44 élèves, ombres), Normal (32), Ligera (16, sans ombres). Si la 3D est trop lente,
la qualité baisse toute seule. Sans WebGL : image du campus + message, le reste du site marche.

## L'assistant IA de chaque élève

Section « Asistentes IA ». Tant qu'aucun serveur n'est configuré, il fonctionne en
**modo demostración** (affiché clairement : réponses tirées des données du collège, ce n'est pas une IA).
La clé d'API ne doit jamais être dans le site : voir `servidor-ia/LISEZMOI.md`.

## Organisation du code

- `index.html` : en-tête, présentation (HTML simple), emplacement du campus 3D
- `css/estilos.css` + `css/sitio.css` : le design (bleu marine, blanc, beige)
- `js/main.js` : monte le campus 3D (chargé seulement quand on arrive à la section), les sections et l'assistant
- `js/estado.js` : état de la visite ; `js/3d/camara.js` : cadrage automatique sur les bâtiments
- `js/datos/salas.js` : tous les espaces (bâtiment principal, résidence, sport, extérieurs) et les vues
- `js/datos/contenido.js` : textes des sections ; `js/datos/diapositivas.json` : texte des 12 diapositives
- `js/3d/` : la maquette (`Edificio.js`, `Residencia.js`, `Salas.js`, `Aulas.js`, `Deportes.js`,
  `Exteriores.js`, `Personas.js`, `LucesNoche.js`, `Escena.js`, `puntos.js` = places utilisables)
- `js/sim/` : la simulation (horloge, horaire, plan de circulation, corps, vie des personnages)
- `js/ui/` : interface (campus, horloge, assistant, sections)
- `servidor-ia/` : serveur sécurisé pour l'assistant IA (à héberger, avec la clé côté serveur)
