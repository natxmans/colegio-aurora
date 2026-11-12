# Colegio Pablo Picasso · Nuestro colegio ideal

Site web du projet d'espagnol (4e) : un internat moderne en Espagne, avec une maquette 3D
que l'on peut visiter et la présentation PowerPoint intégrée.

Devise affichée sur le site : **Estudiar · Convivir · Crecer**. Le logo utilisé est le blason
original du PowerPoint (`img/logo-original-1024.png`) : ne jamais le redessiner ni le déformer.

- **En ligne :** https://natxmans.github.io/colegio-aurora/
- **PowerPoint final :** `presentacion/nuestro_colegio_ideal.pptx` (12 diapositives)

## Lancer le site sur ton PC

1. Double-clique sur **`LANCER-LE-SITE.bat`** (il faut Python, déjà installé).
2. Le navigateur s'ouvre sur `http://localhost:8820`.
3. Laisse la fenêtre noire ouverte pendant la présentation.

⚠️ Il faut **Internet** : React, Three.js et Drei se chargent depuis `esm.sh`.

## Pendant la présentation

| Action | Comment |
|---|---|
| Tourner autour | clic gauche + glisser (tablette/téléphone : 1 doigt) |
| Zoomer | molette (tablette/téléphone : pincer) |
| Déplacer la vue | clic droit + glisser (2 doigts) |
| Visiter un bâtiment ou une salle | clic dessus ou sur son étiquette |
| Entrer dans la salle | bouton « Entrar en la sala » |
| Vues | `Vista completa`, `Planta baja`, `Primer piso`, `Vista en corte` (touches 1 2 3 4) |
| Toit, jour/nuit | « Ocultar techo », « Día / Noche » |
| Visite automatique | « Visita guiada » (15 étapes) |
| Diaporama | section « Nuestra presentación » : flèches, miniatures, plein écran, téléchargement |

### Liens directs (pratique en classe)

- `…/?vista=completa` : ouvre directement la maquette 3D
- `…/?vista=corte` : vue en coupe des deux étages
- `…/?sala=hab101&dentro=1` : à l'intérieur de la chambre 101
- `…/?sala=piscina`, `…/?sala=mates`, `…/?sala=comedor`… : un lieu précis
- `…/?seccion=presentacion` : le diaporama

## Organisation du code

- `index.html` : écran de chargement + « import map » des bibliothèques
- `css/estilos.css` : tout le design (bleu marine, blanc, beige)
- `img/` : logo original (`logo-original-1024.png`), photos sans filigrane (`fotos/`), diapositives (`diapositivas/`),
  `campus-3d.jpg` (image fixe du campus, affichée si la 3D ne peut pas se charger)
- `presentacion/` : le PowerPoint final téléchargeable
- `js/main.js` : application React (+ liens directs)
- `js/estado.js` : état de la visite et cadrage automatique de la caméra (ordinateur, tablette, téléphone)
- `js/datos/salas.js` : tous les espaces (position, texte en espagnol, caméra) et les vues générales
  (`VISTAS` : angle, cadrage, `fov` = angle de vision ; `CAJAS` = zone à cadrer)
- `js/datos/contenido.js` : textes des sections (fidèles au PowerPoint)
- `js/datos/diapositivas.js` : texte des 12 diapositives
- `js/3d/` : la maquette
  - `kit.js` : moteur d'instanciation (des milliers de pièces en peu d'appels de dessin)
  - `Alumno.js` : élèves en uniforme (polo blanc à col bleu, veste bleu marine avec le logo, pantalon ou jupe)
  - `Aulas.js` : les 8 salles (tables individuelles, ordinateurs en classe)
  - `Salas.js` : bibliothèque numérique, entrée, comedor, chambres, salons
  - `Edificio.js` : bâtiment, étages qui s'écartent, toit
  - `Deportes.js` : gymnase couvert, piscine olympique couverte et chauffée, foot, basket
  - `Exteriores.js` : patio, jardins, entrée avec le logo, oliveraies
  - `etiquetas.js` : étiquettes des bâtiments sans chevauchement
- `js/ui/` : menu, sections, visite 3D, uniforme 3D, diaporama (`Presentacion.js`)

## Taille des bâtiments dans la 3D

Le campus est compact (le gymnase, la piscine, le basket et le foot sont collés au bâtiment
principal) et la « Vista completa » utilise un angle de vision serré : les bâtiments occupent
environ 2,5 fois plus de place à l'écran qu'avant (mesuré : 48 % de l'écran au lieu de 19 %).
Pour régler le cadrage : `VISTAS.completa` et `CAJAS.campus` dans `js/datos/salas.js`.

## Modifier le PowerPoint puis le site

1. Modifie `presentacion/nuestro_colegio_ideal.pptx`.
2. Exporte chaque diapositive en image JPG (1600 × 900) dans `img/diapositivas/diapositiva-01.jpg` … `-12.jpg`.
3. Publie (voir ci-dessous).

## Publier les changements

```
git add -A
git commit -m "Mise à jour"
git push
```
GitHub Pages met le site à jour en 1 à 2 minutes.
