# PLANNING FINAL — Colegio Pablo Picasso · « Nuestro colegio ideal »

**Date limite ferme : mardi 17 novembre 2026 à 7 h 00.**
Planning créé le dimanche 15 novembre 2026 à 14 h 50 (il reste alors environ **40 heures**).

Ce fichier est le **suivi officiel**. Un statut ne passe à « Fait » que lorsque le test de la tâche a
réellement été fait (le résultat est noté dans la colonne « Preuve »).

---

## 1. Qui fait quoi

| | Personne 1 — Développement et maquette 3D | Personne 2 — Site, PowerPoint et présentation |
|---|---|---|
| Rôle | Travaille sur l'ordinateur avec Claude. Claude écrit le code et lance les tests automatiques ; Personne 1 **regarde le résultat à l'écran et valide**. | Vérifie le site et le PowerPoint **comme un visiteur** (sans modifier le code), prépare l'oral en espagnol. |
| Partie | campus 3D, élèves, salles, internat, professeurs, horaires, déplacements | pages, menus, boutons, liens, 17 diapositives, fichier .pptx, téléchargement, textes oraux |
| Signale les bugs | — | dans la section 8 de ce fichier (« Bugs trouvés ») ; c'est Personne 1 + Claude qui corrigent |

Pourquoi cette répartition : toutes les modifications de code passent par une seule personne (Personne 1 avec
Claude), donc **personne ne modifie le même fichier en même temps**. Personne 2 travaille sur des fichiers
à elle (les textes de l'oral) et teste la version publiée.

À inverser seulement si Personne 2 est plus à l'aise en espagnol à l'oral… ce qui ne change rien : les deux
parlent autant (voir `presentacion/oral/`).

### Fichiers : qui a le droit de les modifier

| Fichiers | Modifiés par | Les autres |
|---|---|---|
| `js/sim/*`, `js/3d/*`, `js/calidad.js`, `js/ui/*`, `css/*`, `index.html`, `visor3d.html` | Personne 1 (avec Claude) | lecture seule |
| `herramientas/*` (tests), `AUDIT.md`, `LISEZMOI.md` | Personne 1 (avec Claude) | lecture seule |
| `presentacion/nuestro_colegio_ideal.pptx` | **personne directement** : il est reconstruit par `herramientas/ppt/anadir_3d.ps1` (Personne 1 + Claude, après copie de sauvegarde) | Personne 2 l'ouvre pour répéter, sans enregistrer par-dessus |
| `presentacion/oral/*` (textes de l'oral) | Personne 2 (corrections de mots, prononciation) | Personne 1 lit sa partie |
| `PLANNING_FINAL.md` (ce fichier) | une seule personne à la fois, aux bilans | |

---

## 2. Priorités

- **P0 — Indispensable** : sans ça, on ne peut pas présenter.
- **P1 — Important** : apporte une vraie valeur, à faire après les P0 de la même période.
- **P2 — Facultatif** : seulement si tout le reste est fini.

Règle : **aucune tâche P2 avant que toutes les P0 de la période soient faites.**
Si une tâche dépasse son heure limite, on décale d'abord les P2, puis les P1 ; on ne sacrifie jamais une P0.

> Si vous avez cours lundi, gardez **le même ordre** : les blocs « lundi matin » et « lundi après-midi »
> passent en fin de journée, et le **gel des modifications reste lundi à 21 h**.

---

## 3. Tableau de suivi

| ID | Tâche | Responsable | Échéance | Prio | Statut | Preuve / remarque |
|---|---|---|---|---|---|---|
| T01 | Audit rapide du projet | Claude + P1 | dim. 15:15 | P0 | **Fait** | `AUDIT.md` + audit de population (16 h, dim.) |
| T02 | Sauvegarde complète | P1 | dim. 15:00 | P0 | **Fait** | dossier `Sauvegardes/colegio-avant-final-2026-11-15-1445` (294 Mo) + étiquette git `sauvegarde-avant-poblacion` |
| T03 | Répartition définitive des rôles | Les deux | dim. 15:30 | P0 | À faire | lire ce fichier ensemble et le confirmer |
| T04 | Vérifier le nombre d'élèves et la capacité | Claude + P1 | dim. 16:00 | P0 | **Fait** | 44 élèves avant ; capacité internat = 32 × 2 = **64** ; 100–120 impossible sans nouvelles chambres |
| T05 | Vérifier les places des salles et des chambres | Claude + P1 | dim. 16:00 | P0 | **Fait** | aulas 12 pupitres, cantine 48 → 64 places, 32 chambres = 2 lits / 2 bureaux / 2 armoires |
| T06 | Population : 64 élèves, 6 classes, chambres de 2 | Claude + P1 | dim. 18:00 | P0 | **Fait** | `poblacion.py saltos` en Alta, Normal et Ligera : classes de 10–11 assises, 64 à la cantine, 64/64 dans leur lit, 0 chevauchement ; captures vérifiées |
| T06b | Corriger les trajets impossibles et l'horloge en vitesse rapide | Claude + P1 | dim. 18:30 | P0 | **Fait** | journée continue 07:36→21:31 : 0 trajet impossible, 0 réapparition, 0 glissement ; 789 places atteignables **et** quittables |
| T07 | Tests de la maquette (9 heures, journée sans saut, 3 qualités, console) | Claude + P1 | dim. 19:30 | P0 | **Fait** | 9 heures × 3 qualités OK ; journée continue OK ; `prueba_total` 51/51, `pantallas2` 21/21, `prueba_mision3` 9/9, liens 23/23, visionneuse 37/37, panneau 6 classes OK sur téléphone ; 0 erreur console |
| T08 | Vérification du site publié (pages, menus, boutons, liens) | P2 | dim. 18:00 | P0 | À faire | grille de la section 7 |
| T09 | Vérification du PowerPoint (17 diapos, boutons, ouverture) | P2 | dim. 19:00 | P0 | À faire | grille de la section 7 |
| T10 | Textes oraux v1 (espagnol + français, 2 personnes) | Claude → P2 relit | dim. 19:00 | P0 | En cours | v1 écrite (379 / 382 mots, ~7 min 40) + PDF à imprimer ; **relecture de P2 à faire** |
| T11 | Publication de la population sur le site | Claude + P1 | dim. 20:30 | P0 | À faire | après T07 ; vérifier la version en ligne |
| T12 | Première lecture à voix haute des textes (chacun sa partie) | Les deux | dim. 21:30 | P1 | À faire | noter les mots difficiles |
| T13 | Bilan du dimanche | Les deux | dim. 22:00 | P0 | À faire | section 9 |
| T14 | Finaliser les corrections de la maquette (bugs de dimanche) | Claude + P1 | lun. 10:00 | P0 | À faire | |
| T15 | Revérifier répartition, déplacements, horaires (journée complète) | Claude + P1 | lun. 11:00 | P0 | À faire | `herramientas/poblacion.py jornada` |
| T16 | Tester les bâtiments (visionneuse, 15 modèles, liens du PPT) | Claude + P1 | lun. 11:30 | P0 | À faire | `prueba_ppt3d.py`, `prueba_enlaces.py` |
| T17 | Revérifier pages et liens du site publié | P2 | lun. 10:30 | P0 | À faire | grille section 7 + `auditoria.py` |
| T18 | Corriger les bugs importants signalés | Claude + P1 | lun. 12:30 | P0 | À faire | section 8 vide ou « corrigé » |
| T19 | Valider les textes oraux diapo par diapo (le texte correspond à ce qu'on voit) | Les deux | lun. 15:00 | P0 | À faire | |
| T20 | Répartition de la parole + transitions définitives | Les deux | lun. 15:30 | P0 | À faire | tableau de `PRESENTACION_ORAL.md` |
| T21 | Entraînement prononciation (chacun seul) | Les deux | lun. 16:30 | P1 | À faire | fiche « mots difficiles » |
| T22 | Vérifier le fichier .pptx + test de projection (plein écran, 2e écran si possible) | P2 (+ P1 pour les boutons 3D) | lun. 18:00 | P0 | À faire | |
| T23 | Copie de secours : .pptx + PDF sur clé USB et dans le cloud | P1 | lun. 18:30 | P0 | En cours | copie .pptx + PDF (17 pages, bâtiments visibles) dans `Sauvegardes/presentation-secours-2026-11-15` (OneDrive) ; **clé USB à faire** |
| T24 | Répétition complète n° 1, chronométrée | Les deux | lun. 19:30 | P0 | À faire | durée notée |
| T25 | Corrections importantes après la répétition | Les deux | lun. 20:30 | P0 | À faire | |
| T26 | Répétition complète n° 2 | Les deux | lun. 21:00 | P1 | À faire | |
| T27 | **GEL des modifications** du site et du PowerPoint | Les deux | lun. 21:00 | P0 | À faire | plus aucune modification après |
| T28 | Sauvegarde finale + vérification de la version publiée | P1 | lun. 21:45 | P0 | À faire | |
| T29 | Bilan du lundi | Les deux | lun. 22:00 | P0 | À faire | |
| T30 | Vérification finale : site, PowerPoint, fichiers, clé USB | Les deux | mar. 6:45 | P0 | À faire | grille section 7 (version courte) |
| T31 | Matériel prêt (clé USB, textes imprimés, chargeur) | Les deux | mar. 7:00 | P0 | À faire | |
| T32 | Démonstration du campus 3D en direct pendant l'oral (30 s) | P1 | lun. 18:00 | P2 | À faire | seulement s'il y a Internet en classe |
| T33 | Étude écrite d'une extension de la résidence pour 100–120 élèves (sans la construire) | Claude | lun. 12:30 | P2 | À faire | ne rien construire sans accord |

---

## 4. Détail de chaque tâche

Format : **début → limite · durée · priorité · fichiers · avant elle · résultat attendu · test de fin.**

### Dimanche 15 novembre — 14 h 40 à 22 h (comprendre et corriger)

**T01 Audit rapide** — 14:40 → 15:15 · 30 min · P0 · tout le dossier · aucune · liste de ce qui marche / ne marche pas · `AUDIT.md` à jour et audit de population fait.

**T02 Sauvegarde complète** — 14:45 → 15:00 · 15 min · P0 · tout le dossier · aucune · copie complète datée · le dossier `Sauvegardes/colegio-avant-final-2026-11-15-1445` existe et contient `presentacion/nuestro_colegio_ideal.pptx`.

**T03 Répartition des rôles** — 15:00 → 15:30 · 15 min · P0 · `PLANNING_FINAL.md` · T01 · les deux sont d'accord · chacun sait quels fichiers il peut modifier (section 1).

**T04 Nombre d'élèves** — 15:00 → 16:00 · 1 h · P0 · `js/sim/horario.js`, `js/calidad.js` · T01 · chiffres réels · avant : 44 élèves (16 seulement en qualité « Ligera »), 4 classes de 11 dans des salles de 12.

**T05 Places des salles et des chambres** — 15:00 → 16:00 · 1 h · P0 · `js/3d/*` · T01 · tableau des places · comptées dans la maquette (voir rapport).

**T06 Population 64 élèves** — 15:30 → 18:00 · 2 h 30 · P0 · `js/sim/horario.js`, `js/sim/vida.js`, `js/3d/Personas.js`, `js/3d/Salas.js`, `js/calidad.js` · T04, T05 · 64 internes (= les 64 lits), 6 classes mixtes de 10–11, chambres de 2 du même sexe, cantine de 64 places, sports avec places limitées, 4 adultes de plus · `herramientas/poblacion.py saltos` : chaque classe à 10–11 élèves assis, 64 à la cantine, 64/64 dans leur lit, 0 chevauchement.

**T06b Trajets impossibles + horloge** — 17:00 → 18:30 · 1 h 30 · P0 · `js/sim/vida.js` · T06 · 0 réapparition · `herramientas/fallos_camino.py` : 0 « recolocado ».

**T07 Tests de la maquette** — 18:00 → 19:30 · 1 h 30 · P0 · `herramientas/*` · T06b · tous les tests passent · `poblacion.py saltos` en Alta / Normal / Ligera, `poblacion.py jornada`, `prueba_total.py`, `pantallas2.py`, 0 erreur console.

**T08 Vérification du site publié** — 15:30 → 18:00 · 2 h · P0 · aucun (lecture) · aucune · liste des bugs · grille de la section 7 remplie.

**T09 Vérification du PowerPoint** — 18:00 → 19:00 · 1 h · P0 · `presentacion/nuestro_colegio_ideal.pptx` (sans enregistrer) · aucune · liste des problèmes · grille de la section 7 remplie.

**T10 Textes oraux v1** — 15:00 → 19:00 · Claude écrit, P2 relit 30 min · P0 · `presentacion/oral/*` · textes des 17 diapositives · chaque diapo a : orateur, texte espagnol, traduction, transition, moment pour changer · la phrase parle bien de ce qui est sur la diapo.

**T11 Publication** — 19:30 → 20:30 · 1 h · P0 · dépôt GitHub · T07 · le site en ligne montre 64 élèves · `prueba_total.py https://natxmans.github.io/colegio-aurora/` + regard à l'écran.

**T12 Première lecture à voix haute** — 20:30 → 21:30 · 1 h · P1 · `presentacion/oral/PERSONA_1.md`, `PERSONA_2.md` · T10 · mots difficiles soulignés · chacun lit sa partie en entier une fois.

**T13 Bilan du dimanche** — 21:30 → 22:00 · 30 min · P0 · ce fichier · tout ce qui précède · statuts à jour · section 9 remplie.

### Lundi 16 novembre — matin (terminer l'essentiel)

**T14 Corrections maquette** — 8:30 → 10:00 · P0 · `js/sim/*`, `js/3d/*` · T13 · bugs de dimanche corrigés · tests de T07 relancés.
**T15 Journée complète** — 10:00 → 11:00 · P0 · `herramientas/poblacion.py` · T14 · répartition, déplacements et horaires OK · 0 mur traversé, 0 réapparition, classes à l'heure.
**T16 Bâtiments** — 11:00 → 11:30 · P0 · visionneuse · T14 · 15 modèles s'ouvrent, boutons du PowerPoint OK · `prueba_ppt3d.py`, `prueba_enlaces.py`.
**T17 Pages et liens** — 8:30 → 10:30 · P0 · lecture · T11 · 0 lien cassé · `auditoria.py` + grille.
**T18 Bugs importants** — 10:30 → 12:30 · P0 · selon le bug · T17 · section 8 : tout « corrigé » ou « accepté ».
**T33 (P2) Étude extension résidence** — seulement si T14–T18 sont finis.

### Lundi 16 novembre — après-midi (préparer l'oral)

**T19 Valider les textes** — 14:00 → 15:00 · P0 · `presentacion/oral/*` · T10 · chaque phrase correspond à la diapositive projetée · lecture avec le diaporama ouvert.
**T20 Parole + transitions** — 15:00 → 15:30 · P0 · idem · T19 · répartition équilibrée (tableau dans `PRESENTACION_ORAL.md`).
**T21 Prononciation** — 15:30 → 16:30 · P1 · fiche mots difficiles · T20 · chacun lit sans bloquer.
**T22 Fichier .pptx + projection** — 16:30 → 18:00 · P0 · `.pptx` (lecture) · T09 · diaporama plein écran, 17 diapos dans l'ordre, textes lisibles de loin · test sur l'écran/projecteur si possible.
**T23 Copie de secours** — 17:30 → 18:30 · P0 · `.pptx`, PDF · T22 · copie qui s'ouvre sur un autre ordinateur · ouvrir la copie de la clé USB.

### Lundi 16 novembre — soir (répéter et geler)

**T24 Répétition n° 1** — 19:00 → 19:30 · P0 · T20, T22 · durée notée (objectif 7 à 9 min).
**T25 Corrections** — 19:30 → 20:30 · P0 · seulement des corrections importantes.
**T26 Répétition n° 2** — 20:30 → 21:00 · P1.
**T27 GEL** — 21:00 · P0 · plus aucune modification du site ni du PowerPoint.
**T28 Sauvegarde finale** — 21:00 → 21:45 · P0 · copie datée + version publiée revérifiée.
**T29 Bilan** — 21:45 → 22:00 · P0.

### Mardi 17 novembre — avant 7 h (vérifier seulement)

**T30 Vérification finale** — 6:15 → 6:45 · P0 · ouvrir le site, ouvrir le PowerPoint depuis la clé USB, vérifier les textes imprimés.
**T31 Matériel** — 6:45 → 7:00 · P0 · clé USB, textes, chargeur.
**Aucune modification mardi matin.**

---

## 5. Ce qui peut se faire en parallèle

| En même temps | Pourquoi c'est possible |
|---|---|
| T06 / T06b / T07 (P1 + Claude) **et** T08 / T09 (P2) | P2 teste la version **publiée** et le .pptx sans les modifier |
| T10 (Claude écrit) **et** T08 (P2 teste) | fichiers différents |
| T14–T16 (P1) **et** T17 (P2) | P2 lit, P1 corrige |
| T21 : chacun s'entraîne seul | chacun son fichier `PERSONA_1.md` / `PERSONA_2.md` |

## 6. Dépendances (ce qui bloque quoi)

```
T01 → T03, T04, T05 → T06 → T06b → T07 → T11 (publication) → T17 → T18
T10 (textes) → T12 → T19 → T20 → T21
T09 → T22 → T23
T20 + T22 → T24 → T25 → T26 → T27 (GEL lundi 21 h) → T28 → T30 → T31
```

---

## 7. Grilles de vérification (pour Personne 2)

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
| B01 | Claude (test) | maquette, journée continue | 12 trajets impossibles et 3 personnes qui « réapparaissent » à leur destination | P0 | **corrigé** : 0 / 0 sur la journée complète |
| B02 | Claude (test) | maquette, vitesse « Muy rápido » | l'horloge n'attend pas assez une classe qui marche vers le gymnase : élèves en retard | P1 | **corrigé** : journée continue, classes complètes à 8:15, 10:30, 14:15 |
| B03 | Claude (test) | maquette, journée continue | 8 personnes « glissent » de 14 à 65 m quand leur nouveau trajet n'est pas encore calculé | P0 | **corrigé** : 0 saut brusque sur la journée complète |
| B05 | Claude (test) | maquette | pendant la marche, environ 0,04 % des positions frôlent un coin de mur ou de meuble (surtout un couloir de la résidence) ; aucun mur traversé | P2 | accepté (déjà le cas avant) |
| B04 | Claude (test) | `prueba_total.py` | le test attendait encore 4 classes | P1 | **corrigé** : 51/51 |

---

## 9. Bilans

### Bilan 1 — dimanche 15 novembre, 15 h 00

- **Travail terminé** : T01 audit, T02 sauvegarde, T04 nombre d'élèves, T05 places des salles et des chambres.
- **Travail en cours** : T06 population (64 élèves en place, testée par heures), T06b trajets ratés, T10 textes oraux.
- **Travail restant** : T03, T07 à T31.
- **Problèmes** : B01, B02.
- **Prochaine action** : T06b (Claude) ; Personne 2 commence T08.
- **Temps restant** : environ 40 h avant mardi 7 h.

---

## 10. Rappels automatiques

Trois vraies tâches programmées ont été créées le dimanche 15/11 (onglet « Scheduled » de l'application Claude).
Elles ne tournent **que si l'ordinateur est allumé et l'application Claude ouverte** ; sinon elles partent au
prochain démarrage. Elles peuvent s'arrêter pour demander une autorisation : il faut alors cliquer « Autoriser ».
Elles **ne modifient jamais** le site ni le PowerPoint : elles testent, sauvegardent et écrivent un bilan ici.

| Quand | Tâche | Ce qu'elle fait |
|---|---|---|
| lundi 16/11, 8 h 00 | `colegio-bilan-lundi-matin` | tests automatiques du site publié (audit, 51 tests, liens) + bilan dans la section 9 |
| lundi 16/11, 21 h 00 | `colegio-gel-lundi-soir` | rappel du GEL, sauvegarde finale datée, vérification du site publié et de la copie de secours |
| mardi 17/11, 6 h 00 | `colegio-verification-mardi-6h` | vérification finale (site, .pptx, textes, copie de secours) + liste du matériel |
