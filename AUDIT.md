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
| Campus 3D | 44 élèves + 17 adultes (9 professeurs, personnel) ; rotation, zoom, clic sur un bâtiment, entrer/sortir, étages, toits, visite guidée (18 étapes), lieux |
| Internat (résidence) | bâtiment séparé, toit fermé, 32 chambres doubles : **chacune exactement 2 lits, 2 bureaux, 2 armoires** (compté dans la maquette) ; salon, hall, coin détente ; vue extérieure + vue intérieure |
| Journée complète (vitesse « muy rápido », sans saut) | 07:51 les 44 élèves se lèvent en uniforme · 08:15 40 en classe · 10:08 34 dans la cour · 10:31 11 en permanence (professeur absent) · 12:40 37 à la cantine · 14:14 reprise · 17:45 8 nagent, 9 jouent · 21:37 44/44 dans leur propre lit en pyjama · lendemain : réveil normal ; 0 trajet impossible, 0 téléportation |
| Jour / nuit | lumière liée à l'heure (lever 7:30, coucher 20:00), fenêtres et lampadaires allumés la nuit ; pause, 4 vitesses, heure réelle, « Ir a… », heure au choix, jour suivant |
| Assistant IA | une conversation par élève ; **mode démonstration clairement affiché** (pas d'IA connectée) ; serveur prêt (`servidor-ia/`) : clé dans une variable d'environnement, limite par adresse IP, taille maximale, erreurs gérées |
| Compatibilité | diagnostic au démarrage ; 3 qualités (Alta 44 élèves + ombres, Normal 32, Ligera 16 sans ombres) ; baisse automatique si la 3D est lente ; sans WebGL : image du campus + message, le reste du site marche ; téléphone et tablette testés |
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
