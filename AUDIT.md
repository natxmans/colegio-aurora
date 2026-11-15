# État des lieux — Colegio Pablo Picasso (15 novembre 2026)

Audit fait **avant les modifications de la mission 4**, sur le site publié
(https://natxmans.github.io/colegio-aurora/), avec des tests automatiques dans Chrome
(`herramientas/auditoria.py` et les autres scripts de `herramientas/`). Chaque ligne « fonctionne »
correspond à un test réellement lancé, pas à une description de page.

## 1. Ce qui fonctionne (testé)

| Partie | Résultat des tests |
|---|---|
| Accueil | logo officiel (carré, non déformé), nom, devise, puis la présentation ; menu : Presentación, Campus 3D, El colegio, La residencia, Vida diaria, Permanencia, Vida escolar, Asistentes IA |
| Présentation (17 diapositives) | flèches, clavier, miniatures, « Ver el texto », plein écran (avec plan B sur téléphone), téléchargement du .pptx ; 11 diapositives avec le vrai modèle 3D manipulable dans la diapositive |
| Liens | 32 liens et ancres de l'accueil : 0 cassé ; 22 liens des boutons du PowerPoint : tous ouvrent le bon bâtiment |
| Visionneuse 3D | 15 modèles (11 bâtiments + 4 vues intérieures) chargés sans erreur, bâtiment entier dans le cadre ; souris, molette, clic droit, doigts, vues frontal/latéral/arrière/dessus |
| Campus 3D | **64 élèves** (depuis le 15/11, voir section 8) + 21 adultes (9 professeurs, 12 personnels) ; rotation, zoom, clic sur un bâtiment, entrer/sortir, étages, toits, visite guidée (18 étapes), lieux |
| Internat (résidence) | bâtiment séparé, toit fermé, 32 chambres doubles : **chacune exactement 2 lits, 2 bureaux, 2 armoires** (compté dans la maquette) ; salon, hall, coin détente ; vue extérieure + vue intérieure |
| Journée complète (vitesse « muy rápido », sans saut) | 07:51 les 44 élèves se lèvent en uniforme · 08:15 40 en classe · 10:08 34 dans la cour · 10:31 11 en permanence (professeur absent) · 12:40 37 à la cantine · 14:14 reprise · 17:45 8 nagent, 9 jouent · 21:37 44/44 dans leur propre lit en pyjama · lendemain : réveil normal ; 0 trajet impossible, 0 téléportation |
| Jour / nuit | lumière liée à l'heure (lever 7:30, coucher 20:00), fenêtres et lampadaires allumés la nuit ; pause, 4 vitesses, heure réelle, « Ir a… », heure au choix, jour suivant |
| Assistant IA | une conversation par élève ; **mode démonstration clairement affiché** (pas d'IA connectée) ; serveur prêt (`servidor-ia/`) : clé dans une variable d'environnement, limite par adresse IP, taille maximale, erreurs gérées |
| Compatibilité | diagnostic au démarrage ; 3 qualités (Alta, Normal, Ligera sans ombres : les 64 élèves sont simulés dans les trois) ; baisse automatique si la 3D est lente ; sans WebGL : image du campus + message, le reste du site marche ; téléphone et tablette testés |
| Console | 0 erreur et 0 avertissement (accueil, campus, visionneuse) |

## 2. Présent mais incomplet

| Point | Détail |
|---|---|
| Rotation des modèles 3D pendant le **diaporama** PowerPoint | impossible dans PowerPoint (limite du logiciel) : rotation et zoom seulement en mode édition ; en diaporama, boutons « Girar en 3D » / « Ver en el campus 3D » vers le site |
| Taille de départ des modèles dans le PowerPoint | 53 à 92 % de la zone : pour être sûr qu'un bâtiment ne sorte jamais de sa zone quand on le tourne (testé sur 2 376 vues), les bâtiments longs (résidence) commencent plus petits |
| Contacts brefs | pendant une journée, 19 positions sur environ 38 000 touchent un coin de meuble ou de porte (0,05 %) ; aucun mur traversé |
| Professeurs au début du premier cours | à 08:15, 2 professeurs sur 4 sont déjà dans leur salle, les autres arrivent encore |

## 3. Annoncé mais pas réellement en service

| Point | Pourquoi | Ce qu'il faut |
|---|---|---|
| **Vraie intelligence artificielle** dans « Asistentes IA » | aucun serveur n'est hébergé ; le site le dit (« Modo demostración — sin IA real ») | un adulte héberge `servidor-ia/` avec une clé d'API Anthropic (voir `servidor-ia/LISEZMOI.md`) puis met son adresse dans `js/datos/config.js` |

Aucune autre fonctionnalité annoncée sur le site n'est fictive (vérifié : pas d'imprimante 3D, pas de robots,
pas « un ordinateur par élève »).

## 4. Erreurs techniques trouvées (et corrigées)

| Erreur | Où | Correction |
|---|---|---|
| Chargement 3D bloqué : un fichier qui ne répond jamais laissait « Preparando el campus » 70 s | `js/ui/Campus3D.js` | message clair + « Reintentar » au bout de 25 s ; si la 3D finit par arriver, elle s'affiche (testé : message à 24 s) |
| Champ « Otra hora » : certaines heures refusées (pas de 5 min calculé à partir de l'heure affichée) | `js/ui/Reloj.js` | base fixe 00:00, pas d'une minute (mission 3) |
| Serveur local une seule connexion à la fois (3D parfois bloquée avec LANCER-LE-SITE.bat) | `servidor.py` | plusieurs connexions (mission 2) |

## 5. Problèmes d'affichage trouvés (et corrigés)

| Problème | Correction |
|---|---|
| Sur ordinateur portable (zone 3D très large), bâtiments à **66 %** de la largeur | caméra adaptée au format : **85 %** (mission 3) |
| Toit de la piscine qui paraissait ouvert (une bande de verre presque invisible sur deux) | voûte pleine + une bande vitrée ; verre teinté (mission 2) |

## 6. Performances (mesurées)

- Campus (qualité Alta) : 235 dessins par image, 612 000 triangles, 137 Mo de mémoire JavaScript.
- Visionneuse, campus entier sur la carte graphique AMD de l'ordinateur : environ 4 ms par image (60 images/s possibles).
- Qualité qui baisse toute seule si la 3D descend sous 18 images/s.

## 7. Liens

0 lien cassé (32 sur l'accueil, 22 dans le PowerPoint, liens vers les 15 modèles 3D).

## 8. Population (mission du 15 novembre, après-midi)

**Pourquoi les salles paraissaient vides** : 4 classes de 11 élèves au maximum dans des salles de 12 pupitres,
et le nombre d'élèves simulés dépendait de la qualité graphique (Alta 44, Normal 32, **Ligera 16** : 4 élèves
par classe). La capacité de l'internat (32 chambres doubles) est **64 lits** : 100 à 120 élèves auraient demandé
18 à 28 chambres de plus. Solution choisie, sans toucher aux bâtiments : **64 élèves = 64 lits**.

| Élément | Avant | Après (testé) |
|---|---|---|
| Élèves | 44 (Alta) / 32 / 16 | **64 dans les 3 qualités** |
| Classes | 4 × 11, non mixtes | **6 classes mixtes** de 10–11 (4ºA–4ºF), salles de 12 pupitres (83–92 %) |
| Salles de cours occupées à la fois | 4 | 6 (3 restent vides, normal) |
| Chambres | 22 occupées | **32 / 32**, 2 élèves du même sexe, jamais plus |
| Cantine | 48 places (deux élèves sur la même chaise possibles au-delà) | **64 places** (8 tables de 8), chaque classe mange ensemble |
| Sports du soir | sans limite (la 9e nageuse restait sur place) | piscine 8, foot 14, basket 10, gymnase 20 ; si plein : autre sport ou gradins |
| Adultes | 9 professeurs + 8 | 9 professeurs + **12** (monitrice de cantine, entraîneur de basket, surveillante de l'étude, 2e éducatrice de nuit) |

Test `herramientas/poblacion.py saltos` (saut à chaque heure), **identique en Alta, Normal et Ligera** :

| Heure | Où sont les 64 élèves |
|---|---|
| 07:45 | dans les chambres (réveil, uniforme) |
| 08:15 | 6 classes : SVT 11, Physique 11, Musique 11, Gymnase 11, Français 10, Techno 10 — tous assis, professeur présent |
| 10:05 | cour de récréation : 62 + 2 qui arrivent ; éducatrice de vie scolaire dans la cour |
| 10:30 | Musique 11, Gymnase 11, Anglais 11, SVT 11, Histoire 10, **Permanence 10** (professeur de maths absent ce jour-là) |
| 12:40 | **64 à la cantine**, 5 professeurs à leur table, 2 cuisiniers, la monitrice |
| 14:15 | 6 classes complètes |
| 17:30 | foot 14, piscine 11 (8 nagent, 3 attendent), basket 10, salle de jeux 5, bibliothèque 5, lecture 5, salon 4, étude 4, jardin 3, gymnase 3 |
| 20:00 | salon de la résidence 13, coin détente 5, chambres 46 |
| 21:30 | **64/64 dans leur propre lit**, 32 chambres occupées, 2 par chambre au maximum |

À chaque heure : **0 chevauchement** (deux personnes au même endroit), **0 place occupée deux fois**, 0 erreur de console.
789 places de la maquette, toutes accessibles à pied depuis la cour (testé).

**Performances mesurées** (Chrome de test, qualité Alta) : simulation des 85 personnes ≈ 0,4 à 1 ms par image,
dessin des personnages ≈ 1,1 ms par image, 233 appels de dessin et 612 000 triangles (inchangé grâce au dessin
« instancié »). Images par seconde mesurées à 21:30 dans le Chrome de test sans écran : Alta 60, Normal 34,
Ligera 58 — ces chiffres varient d'une mesure à l'autre et ne sont **pas** ceux d'un vrai ordinateur : à vérifier sur le PC de la présentation. Les élèves cachés (hors de l'écran,
étage masqué, « Ocultar personas ») continuent d'exister dans la simulation.

**Journée complète sans saut** (`poblacion.py jornada`, vitesse « Muy rápido », 07:36 → 21:31, 923 mesures) :
classes complètes et assises à 08:15, 10:30 et 14:15 ; 54 à table + 10 qui arrivent à 12:42 ; 63/64 dans leur
propre lit à 21:31 (le dernier arrive) ; **0 trajet impossible, 0 réapparition, 0 déplacement brusque,
0 chevauchement**. 31 positions sur environ 78 000 frôlent un coin de mur ou de meuble pendant la marche (0,04 %).
Corrections faites pendant ces tests : l'horloge attend un élève en retard pour un cours ; une personne n'« arrive »
plus jamais de loin (avant : 8 glissements de 14 à 65 m) ; même tolérance pour quitter une place que pour y arriver
(avant : une place des gradins de la piscine permettait d'arriver mais pas de repartir).
