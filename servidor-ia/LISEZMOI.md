# Serveur de l'assistant IA des élèves

Le site est sur GitHub Pages : c'est un site **public**. Une clé d'API ne doit donc
**jamais** être écrite dans le site. Ce petit serveur garde la clé de son côté et fait le
lien entre le site et l'IA (Claude, d'Anthropic).

```
site (GitHub Pages)  ──►  ce serveur (avec la clé)  ──►  API Claude
```

Tant que le serveur n'est pas en ligne, l'assistant du site fonctionne en
**mode démonstration**, et il l'affiche clairement. Dans ce mode, les réponses
viennent seulement des données du collège (horaire, matières, lieux). Ce n'est pas une IA.

## Ce que fait le serveur

- `GET /api/estado` : indique si la clé est configurée.
- `POST /api/asistente` : envoie la question de l'élève à l'IA, puis renvoie la réponse.
- Protections :
  - seuls les sites autorisés peuvent l'appeler (CORS) ;
  - 20 questions maximum toutes les 10 minutes par adresse IP ;
  - messages courts et historique limité ;
  - le contexte de l'élève est nettoyé ;
  - aucun message n'est enregistré dans les journaux du serveur.
- Modèle : `claude-opus-5-5`. Effort : `low` (réponses rapides pour un élève).
- Si le modèle refuse une question, l'API la relance automatiquement avec un modèle de
  secours. C'est l'option `fallbacks: "default"`.

## L'installer (par exemple chez alwaysdata, ou sur n'importe quel serveur Python)

1. Copier le dossier `servidor-ia/` sur le serveur.
2. Installer la bibliothèque : `pip install -r requirements.txt`
3. Définir les variables d'environnement (jamais dans un fichier publié) :
   - `ANTHROPIC_API_KEY` : la clé d'API (à créer sur console.anthropic.com par un **adulte** : il faut être majeur) ;
   - `IA_ORIGENES` : `https://natxmans.github.io` (les sites autorisés, séparés par des virgules) ;
   - `IA_PUERTO` : le port donné par l'hébergeur (par défaut `8790`).
4. Lancer : `python asistente.py`
5. Dans le site, ouvrir `js/datos/config.js` et écrire l'adresse du serveur :
   `url: 'https://adresse-du-serveur'`, puis publier le site.

## Tester sans dépenser

`prueba_sin_gastar.py` lance le serveur contre une **fausse API locale**.
Ce test a vérifié :

- l'adresse appelée, le modèle, l'option de secours et l'effort ;
- l'ajout du contexte de l'élève ;
- le blocage des sites non autorisés ;
- la limite de questions ;
- le fait que la clé ne sort jamais.

Il n'a pas été testé avec une vraie clé, parce qu'il n'y en a pas encore.
