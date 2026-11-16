# PLANNING FINAL — Colegio Pablo Picasso · « Nuestro colegio ideal »

**Date limite ferme : mardi 17 novembre 2026 à 7 h 00.**
Planning commun, refait le dimanche 15 novembre 2026 à 17 h 45, **vérifié et rendu réalisable à 18 h 15**
(plus aucune tâche « Ensemble » en même temps qu'une autre ; cours du lundi et sommeil pris en compte).

Ce fichier est le **suivi officiel**. Un statut ne passe à « Fait » que lorsque le test de la tâche a
réellement été fait (le résultat est noté dans la colonne « Preuve »).

---

## 1. Comment on travaille

- **Un seul projet, un travail commun à deux.** Toutes les tâches (site, maquette 3D, corrections,
  améliorations, PowerPoint, vérifications, finalisation) se font **ensemble**, dans l'ordre chronologique
  ci-dessous.
- Une tâche n'est faite **séparément** que lorsque c'est naturel : chacun s'entraîne sur **son** texte de
  l'oral, chacun relit **son** texte. C'est indiqué dans la colonne « Comment ».
- **Claude** fait les modifications de code et lance les tests automatiques pendant que vous regardez le
  résultat à l'écran et décidez ensemble.
- **Personne 1 / Personne 2 ne sert QUE pour l'oral** : qui présente quelles diapositives
  (voir `presentacion/oral/`). Ça ne change rien au travail sur le projet.
- Si vous n'êtes pas au même endroit (lundi soir, mardi matin), « Ensemble » peut se faire en appel vidéo,
  avec l'écran partagé.
- Les tests automatiques de Claude peuvent tourner **en arrière-plan** pendant une tâche « Ensemble » : ce n'est
  pas une tâche de plus pour vous, juste un résultat à lire ensuite.

### Règles de sécurité des fichiers

- **Une seule modification à la fois** : les changements du site et de la maquette passent tous par la même
  session Claude, sur le même ordinateur. Personne ne modifie un fichier du site à côté.
- Si vous travaillez un moment sur deux ordinateurs, **jamais le même fichier** : chacun ne touche qu'à son
  texte d'oral (`PERSONA_1` ou `PERSONA_2`), le reste est en lecture seule.
- Le PowerPoint `presentacion/nuestro_colegio_ideal.pptx` n'est **jamais** enregistré par-dessus à la main :
  pour répéter, on l'ouvre en lecture ; s'il faut le changer, Claude le reconstruit avec
  `herramientas/ppt/anadir_3d.ps1` après une copie de sauvegarde.
- Avant toute grosse modification : sauvegarde (copie datée dans `Sauvegardes/` + étiquette git).

---

## 2. Priorités

- **P0 — Indispensable** : sans ça, on ne peut pas présenter.
- **P1 — Important** : apporte une vraie valeur, à faire après les P0 de la même période.
- **P2 — Facultatif** : seulement si **toutes** les P0 sont finies (réserve, section 5).

Si une tâche dépasse son heure limite : on supprime d'abord les P2, puis on raccourcit les P1 ;
on ne sacrifie jamais une P0.

> **Hypothèses de ce planning (à corriger en T10 si elles sont fausses)** : lundi, cours d'environ 8 h à 17 h,
> retour à la maison vers 17 h 30 ; coucher vers 22 h dimanche et vers 21 h 45 lundi ; lever à 6 h mardi.
> Le **gel des modifications reste lundi à 21 h**.
> Si une tâche déborde : on supprime d'abord T27 (P1), puis on raccourcit T22 ; jamais une P0.

---

## 3. Planning chronologique et suivi

« Comment » : **Ensemble** · **Chacun son texte** (séparément, c'est naturel) · **Automatique** (tâche programmée de Claude, sans vous).
Dans chaque tableau, les lignes sont dans l'ordre de l'heure ; deux tâches « Ensemble » ne se chevauchent jamais.

### Dimanche 15 novembre — 14 h 40 à 17 h 45 : déjà fait

Horaires **reconstitués** d'après l'historique de la session (à quelques minutes près) : les tâches sont
terminées, leurs preuves sont conservées. Les tests automatiques ont parfois tourné en arrière-plan pendant la
tâche suivante.

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T01 | 14:40–14:45 | 5 min | Audit rapide du projet | Ensemble | P0 | **Fait** | `AUDIT.md` + audit de la population |
| T02 | 14:45–14:50 | 5 min | Sauvegarde complète | Ensemble | P0 | **Fait** | `Sauvegardes/colegio-avant-final-2026-11-15-1445` (294 Mo) + étiquette git `sauvegarde-avant-poblacion` |
| T03 | 14:50–15:00 | 10 min | Compter les élèves, les places des salles, les chambres | Ensemble | P0 | **Fait** | 44 élèves (16 en qualité Ligera) ; 32 chambres = **64 lits** ; salles de 12 pupitres ; cantine 48 places |
| T08 | 15:00–15:20 | 20 min | Textes de l'oral v1 (espagnol + français) + PDF à imprimer | Ensemble | P0 | **Fait (v1)** | `presentacion/oral/` ; à relire en T12 |
| T04 | 15:20–15:50 | 30 min | Population : 64 élèves, 6 classes, chambres de 2, cantine 64 places | Ensemble | P0 | **Fait** | `poblacion.py saltos` en Alta, Normal et Ligera : classes de 10–11 assises, 64 à la cantine, 64/64 dans leur lit, 0 chevauchement |
| T09 | 15:50–16:00 | 10 min | Copie de secours du PowerPoint dans le cloud (.pptx + PDF) | Ensemble | P0 | **Fait** | `Sauvegardes/presentation-secours-2026-11-15` (OneDrive) ; PDF de 17 pages, bâtiments visibles |
| T05 | 16:00–16:50 | 50 min | Corriger les trajets impossibles, les glissements et l'horloge | Ensemble | P0 | **Fait** | journée sans saut : 0 trajet impossible, 0 réapparition, 0 glissement |
| T06 | 16:50–17:15 | 25 min | Tests de la maquette et des anciennes fonctions | Ensemble | P0 | **Fait** | 51/51, 21/21, 9/9, liens 23/23, visionneuse 37/37, panneau des 6 classes OK sur téléphone, 0 erreur |
| T07 | 17:15–17:45 | 30 min | Publier et vérifier la version en ligne | Ensemble | P0 | **Fait** | publié ; **en ligne** : 51/51 et 64 élèves aux 9 heures |

### Dimanche 15 novembre — 18 h 15 à 21 h 45 : vérifier et préparer l'oral

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T10 | 18:15–18:30 | 15 min | Lire ce planning ensemble, corriger les hypothèses d'horaires (cours, coucher) | Ensemble | P0 | À faire | |
| T11 | 18:30–19:15 | 45 min | Vérifier le site publié avec la grille de la section 7 | Ensemble | P0 | À faire | grille remplie, bugs notés en section 8 |
| — | 19:15–20:00 | 45 min | *Pause repas* | | | | |
| T12 | 20:00–20:45 | 45 min | Vérifier le PowerPoint (grille section 7) **puis** relire l'oral à voix haute, diaporama ouvert | Ensemble | P0 | À faire | mots difficiles et phrases à changer notés |
| T20 | 20:45–21:05 | 20 min | Corriger les textes de l'oral (relecture de T12), régénérer les PDF | Ensemble | P0 | À faire | `herramientas/generar_oral.py` |
| T21 | 21:05–21:20 | 15 min | Choisir qui est Personne 1 et qui est Personne 2, lire les transitions, décider qui clique | Ensemble | P0 | À faire | tableau de `PRESENTACION_ORAL.md` |
| T13 | 21:20–21:35 | 15 min | Corriger les bugs **simples** trouvés en T11–T12 (s'il n'y en a pas : temps libre) | Ensemble | P0 | À faire | tests relancés |
| T14 | 21:35–21:45 | 10 min | Bilan du dimanche (section 9) | Ensemble | P0 | À faire | |
| — | 22:00 | — | *Coucher (cours lundi)* | | | | |

### Lundi 16 novembre — journée de cours

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T15 | 8:00 | — | Tests du site en ligne + bilan écrit dans ce fichier (si l'ordinateur est éteint, au prochain démarrage) | Automatique | P0 | Programmé | tâche `colegio-bilan-lundi-matin` |

Aucune tâche pendant les cours. Facultatif : relire son texte pendant un trajet ou à midi.

### Lundi 16 novembre — 17 h 30 à 21 h 45 : corriger, répéter, geler

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T16 | 17:30–17:45 | 15 min | Lire le bilan automatique de 8 h, choisir les corrections à faire | Ensemble | P0 | À faire | liste en section 8 |
| T17 | 17:45–18:15 | 30 min | Corriger les bugs importants (site, maquette, liens) — seulement s'il y en a | Ensemble | P0 | À faire | chaque bug : « corrigé » ou « accepté » |
| T18 | 18:15–18:25 | 10 min | Si la maquette a été modifiée : vérifier à l'écran les horaires (« Otra hora » 8:15, 12:40, 21:30) ; Claude lance la journée complète de test en arrière-plan | Ensemble | P0 | À faire | `poblacion.py jornada` sans échec |
| T19 | 18:25–18:35 | 10 min | Si des corrections ont été faites : publier et vérifier la version en ligne | Ensemble | P0 | À faire | `prueba_total.py` en ligne = 51/51 |
| T22 | 18:35–19:05 | 30 min | S'entraîner sur son texte (prononciation, regarder la classe) | Chacun son texte | P0 | À faire | chacun lit sans bloquer |
| T23 | 19:05–19:25 | 20 min | Test de projection : plein écran, 2e écran ou projecteur si possible, clics, lisibilité | Ensemble | P0 | À faire | 17 diapositives dans l'ordre |
| T24 | 19:25–19:45 | 20 min | Copie de secours sur clé USB (.pptx + PDF) ouverte sur un autre ordinateur ; imprimer les deux textes | Ensemble | P0 | À faire | la copie s'ouvre |
| — | 19:45–20:20 | 35 min | *Pause repas* | | | | |
| T25 | 20:20–20:40 | 20 min | Répétition complète n° 1, chronométrée | Ensemble | P0 | À faire | durée notée (objectif 7 à 9 min) |
| T26 | 20:40–21:00 | 20 min | Corrections importantes seulement (texte, petits bugs) ; réimprimer si le texte change | Ensemble | P0 | À faire | |
| T28 | **21:00** | — | **GEL** : plus aucune modification du site ni du PowerPoint | Ensemble | P0 | À faire | |
| T29 | 21:00 | — | Sauvegarde finale datée + vérification du site en ligne | Automatique | P0 | Programmé | tâche `colegio-gel-lundi-soir` (tourne pendant T30) |
| T30 | 21:00–21:15 | 15 min | Lire le bilan automatique, vérifier la clé USB et les textes imprimés | Ensemble | P0 | À faire | |
| T31 | 21:15–21:25 | 10 min | Bilan du lundi (section 9) | Ensemble | P0 | À faire | |
| T27 | 21:25–21:40 | 15 min | Répétition complète n° 2 (aucune modification, le gel est respecté) | Ensemble | P1 | À faire | la première à supprimer en cas de retard |
| — | 21:45 | — | *Coucher (lever à 6 h)* | | | | |

### Mardi 17 novembre — 6 h 00 à 7 h 00 : vérifier seulement (aucune modification)

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T32 | 6:00 | — | Vérification automatique : site, .pptx, textes, copie de secours (pendant que vous vous préparez) | Automatique | P0 | Programmé | tâche `colegio-verification-mardi-6h` |
| T33 | 6:30–6:45 | 15 min | Lire la vérification automatique, ouvrir le site et le PowerPoint depuis la clé USB, relire le début de son texte | Ensemble | P0 | À faire | grille courte section 7 |
| T34 | 6:45–7:00 | 15 min | Matériel prêt : clé USB, textes imprimés, chargeur | Ensemble | P0 | À faire | |

**Temps de travail restant prévu** : dimanche soir 2 h 45 (+ 45 min de repas), lundi soir 3 h 35 (+ 35 min de
repas), mardi 30 min. Tout tient avant mardi 7 h, sans travailler pendant les cours ni après 21 h 45.

---

## 4. Détail des tâches qui restent

Format : **fichiers · avant elle · résultat attendu · test de fin.**

- **T10 Valider le planning** — ce fichier · T01–T09 · vous êtes d'accord sur l'ordre et les horaires · les hypothèses (cours lundi 8 h–17 h, coucher) sont vraies, sinon on décale les blocs sans changer l'ordre.
- **T11 Site publié** — aucun fichier (lecture) · T07 · liste des problèmes · grille « Site » de la section 7 entièrement cochée.
- **T12 PowerPoint + relecture de l'oral** — `.pptx` (lecture), `presentacion/oral/*` · T08 · problèmes du PowerPoint notés ; phrases trop difficiles soulignées · grille « PowerPoint » cochée ; les 17 diapositives lues à voix haute une fois.
- **T13 Bugs simples** — selon le bug · T11, T12 · bugs simples corrigés · tests de T06 relancés, rien de cassé. Un bug long à corriger est reporté à T17.
- **T14 Bilan** — ce fichier · tout le dimanche · statuts à jour · section 9 remplie.
- **T16 Choisir les corrections** — section 8 · T15 · une liste courte, P0 d'abord.
- **T17 Bugs importants** — `js/`, `css/`, `index.html` selon le bug · T16 · bugs P0 corrigés · tests relancés (51 tests, liens, population).
- **T18 Population à l'écran** — maquette · T17 · seulement si T17 a modifié la maquette (sinon c'est déjà prouvé par T04–T06) · « Otra hora » à 8:15, 12:40, 21:30 + `poblacion.py jornada` en arrière-plan : 0 trajet impossible, 0 glissement.
- **T19 Publication** — dépôt GitHub · T17, T18 · version en ligne à jour · `prueba_total.py https://natxmans.github.io/colegio-pablo-picasso/` = 51/51.
- **T20 Textes de l'oral** — `herramientas/generar_oral.py` → `presentacion/oral/*` · T12 · phrases simples et justes · chaque phrase correspond à la diapositive projetée.
- **T21 Répartition de la parole** — `PRESENTACION_ORAL.md` · T20 · chacun sait ses diapositives, ses transitions, qui clique · lecture enchaînée des transitions sans hésiter.
- **T22 Entraînement** — `PERSONA_1` / `PERSONA_2` · T21 · chacun lit son texte en entier sans bloquer · une lecture chronométrée chacun.
- **T23 Projection** — `.pptx` (lecture) · T12, T21 · diaporama sans surprise · 17 diapositives dans l'ordre, textes lisibles de loin.
- **T24 Clé USB + impression** — copie du `.pptx` et du PDF · T23 · copie qui s'ouvre ailleurs · ouverture réelle depuis la clé ; 2 textes imprimés.
- **T25 et T27 Répétitions** — · T21–T24 · durée connue, transitions fluides · chrono noté dans le bilan. T27 se fait après le gel : c'est une répétition, pas une modification.
- **T28 Gel** — à partir de 21 h, plus aucune modification.
- **T33, T34** — aucune modification · tout s'ouvre, matériel dans le sac.

---

## 5. Réserve P2 — seulement si toutes les P0 sont finies

| ID | Tâche | Comment | Remarque |
|---|---|---|---|
| R1 | Préparer une démonstration du campus 3D en direct (30 s) pendant l'oral | Ensemble | seulement s'il y a Internet en classe ; sinon le PowerPoint suffit |
| R2 | Étude écrite d'une extension de la résidence pour 100 à 120 élèves (18 à 28 chambres doubles de plus) | Ensemble | **ne rien construire** sans votre accord |

---

## 6. Ce qui peut se faire séparément, et les dépendances

Séparément (c'est naturel) : **T22** (chacun s'entraîne sur son texte) et, si vous voulez, la relecture de son
propre texte pendant T12. Tout le reste se fait ensemble.

```
Dimanche : T10 → T11 → T12 → T20 → T21 → T13 → T14
Lundi    : T15 (8 h, auto) → T16 → T17 → T18 → T19 → T22 → T23 → T24 → T25 → T26
           → T28 (GEL 21 h) + T29 (auto) → T30 → T31 → T27
Mardi    : T32 (6 h, auto) → T33 → T34
Liens    : T12 → T20 → T21 → T22 et T23 ; T23 → T24 → T25
```

---

## 7. Grilles de vérification

### Site — https://natxmans.github.io/colegio-pablo-picasso/

| Vérification | OK ? |
|---|---|
| L'accueil s'ouvre : logo rond, « Colegio Pablo Picasso », devise « Estudiar · Convivir · Crecer » | |
| Les 8 entrées du menu emmènent à la bonne section | |
| La présentation : flèches, miniatures, « Ver el texto », plein écran | |
| Le bouton de téléchargement du .pptx télécharge bien le fichier | |
| « Visita guiada en 3D » et « Los edificios en 3D » marchent | |
| Le campus 3D s'affiche (ou un message clair + « Reintentar ») | |
| Dans le campus : boutons du haut visibles, entrer/sortir d'un bâtiment, étages, horloge | |
| « ¿Qué pasa? » montre les 6 classes ; à 12:20 la cantine est pleine ; à 21:30 tout le monde dort | |
| Les sections El colegio, La residencia, Vida diaria, Permanencia, Vida escolar, Asistentes IA s'ouvrent | |
| L'assistant IA dit clairement « Modo demostración » | |
| Sur un téléphone : la page se lit sans défilement de côté | |

### PowerPoint — `presentacion/nuestro_colegio_ideal.pptx`

| Vérification | OK ? |
|---|---|
| Le fichier s'ouvre (environ 31 Mo) | |
| 17 diapositives, dans l'ordre de `presentacion/oral/PRESENTACION_ORAL.md` | |
| Titres numérotés de 1 à 16 sans doublon (la couverture n'a pas de numéro) | |
| Les bâtiments 3D sont visibles dans les diapositives | |
| En diaporama, « Girar en 3D » ouvre le site (Internet nécessaire) ; sans Internet, on continue sans | |
| Les textes se lisent depuis le fond de la classe | |

### Mardi matin (version courte)

Site en ligne ouvert · PowerPoint ouvert depuis la clé USB · PDF de secours présent · textes imprimés · durée connue.

---

## 8. Bugs trouvés

| N° | Trouvé par | Où | Description | Priorité | Statut |
|---|---|---|---|---|---|
| B01 | test automatique | maquette, journée continue | 12 trajets impossibles et 3 personnes qui « réapparaissent » à leur destination | P0 | **corrigé** : 0 / 0 sur la journée complète |
| B02 | test automatique | maquette, vitesse « Muy rápido » | l'horloge n'attendait pas une classe qui marche vers le gymnase : élèves en retard | P1 | **corrigé** : classes complètes à 8:15, 10:30, 14:15 |
| B03 | test automatique | maquette, journée continue | 8 personnes « glissaient » de 14 à 65 m quand leur nouveau trajet n'était pas encore calculé | P0 | **corrigé** : 0 saut brusque sur la journée complète |
| B04 | test automatique | `prueba_total.py` | le test attendait encore 4 classes | P1 | **corrigé** : 51/51 |
| B05 | test automatique | maquette | pendant la marche, environ 0,04 % des positions frôlent un coin de mur ou de meuble (surtout un couloir de la résidence) ; aucun mur traversé | P2 | accepté (déjà le cas avant) |
| B06 | vérification du planning | GitHub | Le dépôt a été renommé vers 18 h 09 (`colegio-aurora` → `colegio-pablo-picasso`) : l'ancienne adresse du site renvoie **404**. Le site marche à la nouvelle adresse, mais les **22 boutons du PowerPoint** (« Girar en 3D », « Ver en el campus 3D ») et le PDF de secours pointent encore vers l'ancienne. Décision à prendre : (A) redonner au dépôt le nom `colegio-aurora`, ou (B) mettre les liens du PowerPoint à la nouvelle adresse (modification du PowerPoint, après copie de sauvegarde) | P0 | **corrigé** lundi 20 h 20 (choix : mettre à jour les liens) : 22/22 liens du PowerPoint vers la nouvelle adresse, tous en code 200 ; PowerPoint ouvre le fichier (17 diapositives, 11 bâtiments 3D) ; copie de secours .pptx + PDF refaite (l'ancienne est gardée dans `ancienne-adresse-colegio-aurora/`) ; PowerPoint d'origine sauvegardé dans `Sauvegardes/pptx-avant-nouvelle-adresse-2026-11-16-2014` |

---

## 9. Bilans

### Bilan — dimanche 15 novembre, 17 h 45

- **Travail terminé** : T01 à T09. Population de 64 élèves publiée et vérifiée en ligne ; bugs B01 à B04
  corrigés ; textes de l'oral v1 + PDF à imprimer ; copie de secours du PowerPoint dans le cloud.
- **Travail en cours** : aucun.
- **Travail restant** : T10 à T14 ce soir, puis lundi T16 à T31, mardi T33 et T34.
- **Problèmes** : aucun bloquant. B05 accepté.
- **Prochaine action** : T10 (lire et valider ce planning ensemble), puis T11 (vérifier le site publié).
- **Temps restant** : environ 37 h avant mardi 7 h.

### Vérification du planning — dimanche 15 novembre, 18 h 15

- **Chevauchements trouvés** : 14, tous entre les tâches déjà faites T01 à T09 (horaires approximatifs écrits
  en même temps) ; en plus, T10 commençait à 17 h 45 alors qu'il était 18 h 09, et les blocs « lundi matin » et
  « lundi après-midi » tombaient pendant les cours.
- **Corrections** : T01–T09 remis dans l'ordre réel, sans chevauchement (preuves conservées) ; dimanche soir
  recommencé à 18 h 15 ; T20 et T21 (textes de l'oral) avancés au dimanche soir ; aucune tâche pendant les cours
  du lundi ; lundi soir de 17 h 30 à 21 h 40 avec repas ; T27 (P1) déplacée après le gel (répétition seulement) ;
  coucher prévu (22 h dimanche, 21 h 45 lundi) ; mardi : lever 6 h, vérification 6 h 30.
- **Contrôle** : 0 chevauchement sur chaque journée, 34 tâches présentes une seule fois, 33 P0 gardées,
  réserve P2 séparée, gel lundi 21 h inchangé.

---

## 10. Rappels automatiques

Trois vraies tâches programmées existent (onglet « Scheduled » de l'application Claude).
Elles ne tournent **que si l'ordinateur est allumé et l'application Claude ouverte** ; sinon elles partent au
prochain démarrage. Elles peuvent s'arrêter pour demander une autorisation : il faut alors cliquer « Autoriser ».
Elles **ne modifient jamais** le site ni le PowerPoint : elles testent, sauvegardent et écrivent un bilan ici.

| Quand | Tâche du planning | Tâche programmée | Ce qu'elle fait |
|---|---|---|---|
| lundi 16/11, 8 h 00 | T15 | `colegio-bilan-lundi-matin` | pendant les cours : tests automatiques du site publié (audit, 51 tests, liens) + bilan dans la section 9, prêt pour T16 à 17 h 30 |
| lundi 16/11, 21 h 00 | T29 | `colegio-gel-lundi-soir` | rappel du GEL, sauvegarde finale datée, vérification du site publié et de la copie de secours |
| mardi 17/11, 6 h 00 | T32 | `colegio-verification-mardi-6h` | vérification finale (site, .pptx, textes, copie de secours) + liste du matériel |
