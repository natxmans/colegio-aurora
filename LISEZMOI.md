# Colegio Pablo Picasso · Nuestro colegio ideal

Site web du projet d'espagnol (4e) : un internat moderne en Espagne.
- **D'abord la présentation PowerPoint** (12 diapositives), en grand en haut de la page.
- **Ensuite le campus 3D vivant** : les élèves et les professeurs suivent leur journée tout seuls,
  avec un vrai cycle jour/nuit.

Devise officielle : **Estudiar · Convivir · Crecer**. Logo officiel : l'emblème rond « INTERNAT »
(bleu marine et crème, bannière Colegio Pablo Picasso, devise) → `img/logo-original-1024.png`,
centré sans déformation dans un carré transparent. Ne jamais le redessiner ni l'étirer.

- **En ligne :** https://natxmans.github.io/colegio-aurora/
- **PowerPoint final :** `presentacion/nuestro_colegio_ideal.pptx` (12 diapositives)

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

## Le campus 3D

| Action | Comment |
|---|---|
| Ouvrir en grand | « Explorar a pantalla completa » (Échap pour sortir) |
| Tourner / zoomer / déplacer | clic gauche + glisser / molette / clic droit (en plein écran) |
| Visiter un bâtiment ou une salle | clic dessus ou sur son étiquette |
| Vues | Vista general, Planta baja, Primer piso, Residencia, Deportes, En corte (touches 1 à 6) |
| Toits | « Quitar techos » / « Poner techos » |
| Visite automatique | « Visita guiada » (18 étapes) |
| Le temps | panneau en bas à gauche : pause, Lento / Normal / Rápido / Muy rápido, Hora real |
| Aller à une heure | « ¿Qué pasa? » → 07:45, 08:00, 10:00, 12:20, 14:00, 17:00, 21:00, Día, Noche |
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
