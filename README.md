# Knovia Front

Frontend React pour explorer des graphes de connaissance, appelés dans l'interface des "toiles".

L'application permet de :

- consulter une liste de graphes thématiques
- ouvrir une toile précise via son identifiant
- visualiser les noeuds et relations d'un graphe
- inspecter les proprietes et connexions d'un noeud

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Cytoscape.js
- Tailwind CSS v4

## Demarrage

### Prerequis

- Node.js
- npm
- une API backend disponible sur `http://localhost:8080`

### Installation

```bash
npm install
```

### Lancement en developpement

```bash
npm run dev
```

L'application sera accessible via l'URL fournie par Vite, generalement `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Fonctionnement

### Page d'accueil

La page d'accueil recupere la liste des graphes depuis l'endpoint :

```txt
GET http://localhost:8080/api/graphs
```

Elle affiche un fil de toiles avec :

- le nom du graphe
- sa description
- sa date de creation
- une categorie deduite automatiquement a partir du nom

### Vue detail d'une toile

La route `/graph/:id` charge le detail d'un graphe depuis :

```txt
GET http://localhost:8080/api/graphs/:id
```

La visualisation s'appuie sur Cytoscape pour afficher :

- les noeuds
- les relations
- une legende par type de noeud
- un panneau lateral d'inspection quand un noeud est selectionne

## Structure du projet

```txt
src/
  api/                 appels HTTP vers le backend
  components/          composants reutilisables
  hooks/               logique metier reutilisable
  layout/              structure globale de navigation
  pages/               pages principales
  types/               types TypeScript
  utils/               constantes et fonctions utilitaires
```

## Routes

- `/` : liste des toiles
- `/graph/:id` : visualisation detaillee d'un graphe

## Contrat de donnees attendu

### Resume d'un graphe

```ts
interface IGraphSummary {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}
```

### Detail d'un graphe

```ts
interface IGraphDetail {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  nodes: IGraphNode[];
  relationships: IGraphRelationship[];
}
```

## Points a connaitre

- Le `README` precedent etait encore celui du template Vite.
- L'URL de l'API est actuellement codee en dur dans `src/api/graphApi.ts`.
- La categorisation de la page d'accueil repose aujourd'hui sur des mots-cles trouves dans le nom des graphes.
- Le bouton de changement de langue existe dans l'etat applicatif, mais il n'est pas encore expose dans le header.

## Pistes d'amelioration

- deplacer l'URL de l'API dans une variable d'environnement
- documenter les reponses backend avec des exemples JSON
- ajouter une vraie recherche et des filtres par categorie
- enrichir la navigation entre graphes et profils
