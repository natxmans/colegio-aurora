# PLANNING FINAL — Colegio Pablo Picasso · « Nuestro colegio ideal »

**Date limite ferme : mardi 17 novembre 2026 à 7 h 00.**
Planning commun, refait le dimanche 15 novembre 2026 à 17 h 45 (il reste alors environ **37 heures**).

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

> Si vous avez cours lundi, gardez **le même ordre** : les blocs « lundi matin » et « lundi après-midi »
> passent en fin de journée, et le **gel des modifications reste lundi à 21 h**.

---

## 3. Planning chronologique et suivi

« Comment » : **Ensemble** · **Chacun son texte** (séparément, c'est naturel) · **Automatique** (tâche programmée de Claude, sans vous).

### Dimanche 15 novembre — 14 h 40 à 22 h : comprendre, sauvegarder, corriger

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T01 | 14:40–15:15 | 35 min | Audit rapide du projet | Ensemble | P0 | **Fait** | `AUDIT.md` + audit de la population |
| T02 | 14:45–15:00 | 15 min | Sauvegarde complète | Ensemble | P0 | **Fait** | `Sauvegardes/colegio-avant-final-2026-11-15-1445` (294 Mo) + étiquette git `sauvegarde-avant-poblacion` |
| T03 | 15:00–16:00 | 1 h | Compter les élèves, les places des salles, les chambres | Ensemble | P0 | **Fait** | 44 élèves (16 en qualité Ligera) ; 32 chambres = **64 lits** ; salles de 12 pupitres ; cantine 48 places |
| T04 | 15:30–17:00 | 1 h 30 | Population : 64 élèves, 6 classes, chambres de 2, cantine 64 places | Ensemble | P0 | **Fait** | `poblacion.py saltos` en Alta, Normal et Ligera : classes de 10–11 assises, 64 à la cantine, 64/64 dans leur lit, 0 chevauchement |
| T05 | 17:00–17:30 | 30 min | Corriger les trajets impossibles, les glissements et l'horloge | Ensemble | P0 | **Fait** | journée sans saut : 0 trajet impossible, 0 réapparition, 0 glissement |
| T06 | 15:30–17:30 | 2 h | Tests de la maquette et des anciennes fonctions | Ensemble | P0 | **Fait** | 51/51, 21/21, 9/9, liens 23/23, visionneuse 37/37, panneau des 6 classes OK sur téléphone, 0 erreur |
| T07 | 17:30–17:45 | 15 min | Publier et vérifier la version en ligne | Ensemble | P0 | **Fait** | publié ; **en ligne** : 51/51 et 64 élèves aux 9 heures |
| T08 | 15:00–17:30 | — | Textes de l'oral v1 (espagnol + français) + PDF à imprimer | Ensemble | P0 | **Fait (v1)** | `presentacion/oral/` ; à relire en T12 |
| T09 | 16:30–16:45 | 15 min | Copie de secours du PowerPoint dans le cloud (.pptx + PDF) | Ensemble | P0 | **Fait** | `Sauvegardes/presentation-secours-2026-11-15` (OneDrive) ; PDF de 17 pages, bâtiments visibles |
| T10 | 17:45–18:15 | 30 min | Lire ce planning ensemble et le valider | Ensemble | P0 | À faire | |
| T11 | 18:15–19:15 | 1 h | Vérifier le site publié avec la grille de la section 7 | Ensemble | P0 | À faire | grille remplie, bugs notés en section 8 |
| — | 19:15–20:00 | 45 min | *Pause repas* | | | | |
| T12 | 20:00–21:00 | 1 h | Vérifier le PowerPoint (grille section 7) **puis** relire l'oral à voix haute, diaporama ouvert | Ensemble | P0 | À faire | mots difficiles et phrases à changer notés |
| T13 | 21:00–21:30 | 30 min | Corriger les bugs simples trouvés en T11–T12 (s'il y en a) | Ensemble | P0 | À faire | tests relancés |
| T14 | 21:30–22:00 | 30 min | Bilan du dimanche (section 9) | Ensemble | P0 | À faire | |

### Lundi 16 novembre — matin (8 h 00 à 12 h 30) : terminer l'essentiel

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T15 | 8:00 | — | Tests du site en ligne + bilan écrit dans ce fichier | Automatique | P0 | Programmé | tâche `colegio-bilan-lundi-matin` |
| T16 | 8:30–9:00 | 30 min | Lire le bilan automatique, choisir les corrections à faire | Ensemble | P0 | À faire | liste en section 8 |
| T17 | 9:00–11:00 | 2 h | Corriger les bugs importants (site, maquette, liens) | Ensemble | P0 | À faire | chaque bug : « corrigé » ou « accepté » |
| T18 | 11:00–11:45 | 45 min | Vérifier à l'écran répartition, déplacements et horaires (« Otra hora » : 8:15, 10:05, 12:40, 17:30, 21:30) + journée complète de test | Ensemble | P0 | À faire | `poblacion.py jornada` sans échec |
| T19 | 11:45–12:30 | 45 min | Publier les corrections et vérifier la version en ligne (seulement s'il y a eu des corrections) | Ensemble | P0 | À faire | `prueba_total.py` en ligne |

### Lundi 16 novembre — après-midi (14 h 00 à 18 h 00) : préparer l'oral

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T20 | 14:00–14:45 | 45 min | Corriger les textes de l'oral (relecture de T12), régénérer les PDF | Ensemble | P0 | À faire | `herramientas/generar_oral.py` |
| T21 | 14:45–15:15 | 30 min | Valider qui est Personne 1 et qui est Personne 2, les transitions, qui clique | Ensemble | P0 | À faire | tableau de `PRESENTACION_ORAL.md` |
| T22 | 15:15–16:15 | 1 h | S'entraîner sur son texte (prononciation, regarder la classe) | Chacun son texte | P0 | À faire | chacun lit sans bloquer |
| T23 | 16:15–17:00 | 45 min | Test de projection : plein écran, 2e écran ou projecteur si possible, clics, lisibilité du fond de la salle | Ensemble | P0 | À faire | 17 diapositives dans l'ordre |
| T24 | 17:00–17:45 | 45 min | Copie de secours sur clé USB (.pptx + PDF) ouverte sur un autre ordinateur ; imprimer les deux textes | Ensemble | P0 | À faire | la copie s'ouvre |

### Lundi 16 novembre — soir (19 h 00 à 22 h 00) : répéter et geler

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T25 | 19:00–19:30 | 30 min | Répétition complète n° 1, chronométrée | Ensemble | P0 | À faire | durée notée (objectif 7 à 9 min) |
| T26 | 19:30–20:15 | 45 min | Corrections importantes seulement (texte, petits bugs) | Ensemble | P0 | À faire | |
| T27 | 20:15–20:45 | 30 min | Répétition complète n° 2 | Ensemble | P1 | À faire | |
| T28 | **21:00** | — | **GEL** : plus aucune modification du site ni du PowerPoint | Ensemble | P0 | À faire | |
| T29 | 21:00 | — | Sauvegarde finale datée + vérification du site en ligne | Automatique | P0 | Programmé | tâche `colegio-gel-lundi-soir` |
| T30 | 21:00–21:30 | 30 min | Lire le bilan automatique, vérifier la clé USB et les textes imprimés | Ensemble | P0 | À faire | |
| T31 | 21:30–21:45 | 15 min | Bilan du lundi (section 9) | Ensemble | P0 | À faire | |

### Mardi 17 novembre — avant 7 h 00 : vérifier seulement (aucune modification)

| ID | Quand | Durée | Tâche | Comment | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|---|
| T32 | 6:00 | — | Vérification automatique : site, .pptx, textes, copie de secours | Automatique | P0 | Programmé | tâche `colegio-verification-mardi-6h` |
| T33 | 6:15–6:45 | 30 min | Ouvrir le site, ouvrir le PowerPoint depuis la clé USB, relire le début de son texte | Ensemble | P0 | À faire | grille courte section 7 |
| T34 | 6:45–7:00 | 15 min | Matériel prêt : clé USB, textes imprimés, chargeur | Ensemble | P0 | À faire | |

---

## 4. Détail des tâches qui restent

Format : **fichiers · avant elle · résultat attendu · test de fin.**

- **T10 Valider le planning** — ce fichier · T01–T09 · vous êtes d'accord sur l'ordre et les horaires · les horaires de lundi sont adaptés si vous avez cours.
- **T11 Site publié** — aucun fichier (lecture) · T07 · liste des problèmes · grille « Site » de la section 7 entièrement cochée.
- **T12 PowerPoint + relecture de l'oral** — `.pptx` (lecture), `presentacion/oral/*` · T08 · problèmes du PowerPoint notés ; phrases trop difficiles soulignées · grille « PowerPoint » cochée ; les 17 diapositives lues à voix haute une fois.
- **T13 Bugs simples** — selon le bug · T11, T12 · bugs simples corrigés · tests de T06 relancés, rien de cassé.
- **T14 Bilan** — ce fichier · tout le dimanche · statuts à jour · section 9 remplie.
- **T16 Choisir les corrections** — section 8 · T15 · une liste courte, P0 d'abord.
- **T17 Bugs importants** — `js/`, `css/`, `index.html` selon le bug · T16 · bugs P0 corrigés · tests relancés (51 tests, liens, population).
- **T18 Population à l'écran** — maquette · T17 · ce que vous voyez correspond au test · « Otra hora » aux 5 heures + `poblacion.py jornada` : 0 trajet impossible, 0 glissement.
- **T19 Publication** — dépôt GitHub · T17, T18 · version en ligne à jour · `prueba_total.py https://natxmans.github.io/colegio-aurora/` = 51/51.
- **T20 Textes de l'oral** — `herramientas/generar_oral.py` → `presentacion/oral/*` · T12 · phrases simples et justes · chaque phrase correspond à la diapositive projetée.
- **T21 Répartition de la parole** — `PRESENTACION_ORAL.md` · T20 · chacun sait ses diapositives, ses transitions, qui clique · lecture enchaînée des transitions sans hésiter.
- **T22 Entraînement** — `PERSONA_1` / `PERSONA_2` · T21 · chacun lit son texte en entier sans bloquer · une lecture chronométrée chacun.
- **T23 Projection** — `.pptx` (lecture) · T12 · diaporama sans surprise · 17 diapositives dans l'ordre, textes lisibles de loin.
- **T24 Clé USB + impression** — copie du `.pptx` et du PDF · T23 · copie qui s'ouvre ailleurs · ouverture réelle depuis la clé ; 2 textes imprimés.
- **T25 à T27 Répétitions** — · T21–T24 · durée connue, transitions fluides · chrono noté dans le bilan.
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
T10 → T11 → T12 → T13 → T14
T15 → T16 → T17 → T18 → T19
T12 → T20 → T21 → T22
T12 → T23 → T24
T21 + T23 + T24 → T25 → T26 → T27 → T28 (GEL lundi 21 h) → T29/T30 → T31
T32 → T33 → T34
```

---

## 7. Grilles de vérification

### Site — https://natxmans.github.io/colegio-aurora/

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

---

## 10. Rappels automatiques

Trois vraies tâches programmées existent (onglet « Scheduled » de l'application Claude).
Elles ne tournent **que si l'ordinateur est allumé et l'application Claude ouverte** ; sinon elles partent au
prochain démarrage. Elles peuvent s'arrêter pour demander une autorisation : il faut alors cliquer « Autoriser ».
Elles **ne modifient jamais** le site ni le PowerPoint : elles testent, sauvegardent et écrivent un bilan ici.

| Quand | Tâche du planning | Tâche programmée | Ce qu'elle fait |
|---|---|---|---|
| lundi 16/11, 8 h 00 | T15 | `colegio-bilan-lundi-matin` | tests automatiques du site publié (audit, 51 tests, liens) + bilan dans la section 9 |
| lundi 16/11, 21 h 00 | T29 | `colegio-gel-lundi-soir` | rappel du GEL, sauvegarde finale datée, vérification du site publié et de la copie de secours |
| mardi 17/11, 6 h 00 | T32 | `colegio-verification-mardi-6h` | vérification finale (site, .pptx, textes, copie de secours) + liste du matériel |
