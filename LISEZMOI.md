# Colegio Aurora · Nuestro colegio ideal

Site web 3D du projet d'espagnol : un collège-internat futuriste à Valencia (Espagne),
avec une maquette 3D que l'on peut visiter.

## Lancer le site (sur ton PC)

1. Double-clique sur **`LANCER-LE-SITE.bat`** (il faut Python, déjà installé sur ton PC).
2. Le navigateur s'ouvre sur `http://localhost:8820`.
3. Laisse la fenêtre noire ouverte pendant la présentation.

⚠️ Il faut **Internet** : React, Three.js et Drei se chargent depuis `esm.sh`.
Ouvrir `index.html` directement (double-clic) ne marche pas : la page l'explique.

## Pendant la présentation

| Action | Comment |
|---|---|
| Tourner autour | clic gauche + glisser (tablette : 1 doigt) |
| Zoomer | molette (tablette : pincer) |
| Déplacer la vue | clic droit + glisser (tablette : 2 doigts) |
| Visiter une salle | clic sur la salle ou sur son étiquette |
| Entrer dans la salle | bouton « Entrar en la sala » de la fiche |
| Vues | `Vista completa`, `Planta baja`, `Primer piso`, `Vista en corte` (touches 1 2 3 4) |
| Toit | bouton « Ocultar techo » |
| Jour / nuit | bouton « Día / Noche » |
| Visite automatique | bouton « Visita guiada » (14 étapes, 8 s chacune) |
| Fermer une fiche | croix ou touche `Échap` |

## Organisation du code

- `index.html` : écran de chargement + « import map » des bibliothèques
- `css/estilos.css` : tout le design
- `js/main.js` : application React
- `js/estado.js` : état de la visite (vue, salle choisie, caméra…)
- `js/datos/salas.js` : les 50 espaces (position, texte en espagnol, caméra)
- `js/datos/contenido.js` : textes des sections (matières, horaire, uniforme…)
- `js/3d/` : la maquette
  - `kit.js` : moteur d'instanciation (des milliers de pièces dessinées en peu d'appels)
  - `Alumno.js` : les élèves en uniforme (assis, qui marchent, nagent, courent…)
  - `Aulas.js` : les 8 salles de classe
  - `Salas.js` : les autres salles du rez-de-chaussée + tout l'internat
  - `Edificio.js` : bâtiment, étages qui s'écartent, toit
  - `Deportes.js` : complexe sportif
  - `Exteriores.js` : patio, jardins, entrée, palmiers, mer
- `js/ui/` : menu, sections, interface de la visite, visionneuse de l'uniforme
