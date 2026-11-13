# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Portfolio — Timothée Hennequin

Les choix visuels, éditoriaux et d’interaction sont décrits dans `DESIGN.md` (à lire avant toute évolution d’interface). `AGENTS.md` décrit les outils du serveur MCP Svelte : lancer `svelte-autofixer` sur tout code Svelte écrit, jusqu’à ce qu’il ne remonte plus rien.

## Objectif et positionnement

Portfolio personnel destiné à des recruteurs et collaborateurs potentiels : parcours, projets, compétences.

Je suis développeur web, diplômé d’Epitech, avec une expérience professionnelle en développement et une formation complémentaire en Product Design chez OpenClassrooms. Cette formation renforce mon autonomie en recherche UX, conception UI et accessibilité. Ne pas présenter mon parcours comme une reconversion exclusive vers le métier de Product Designer.

Mettre en valeur la complémentarité entre développement et conception avec des exemples concrets. Privilégier une présentation concise et pertinente à un inventaire exhaustif.

## Sources de référence

- Le code actuel, `package.json`, `package-lock.json` et les configurations font référence pour les versions, les commandes et l’architecture. Si ce document diverge du code, suivre le code et mettre ce document à jour.
- Les informations explicitement fournies par Timothée font référence pour son parcours et les projets. Signaler les contradictions plutôt que les résoudre en inventant une information.
- Un brief ou une capture de projet fournit du contexte ; les choix visuels du portfolio restent ceux de son propre design system.

## Commandes

```sh
npm install
npm run dev       # serveur de dev Astro
npm run build     # build statique dans build/ (pages en .html : /projets/vroum.html)
npm run preview   # sert le build
npm run check     # astro check (fichiers .astro et TS) + svelte-check (composants Svelte)
```

Il n’y a ni tests, ni linter, ni formatter configurés : `npm run check` puis `npm run build` sont les seules vérifications automatiques. Le rendu visuel se contrôle dans le navigateur (`npm run dev` ou `npm run preview`).

Dépendances :

- TypeScript reste en 6.x tant que `@astrojs/svelte`, `@astrojs/check` et `svelte-check` n’acceptent pas la version 7 : vérifier leurs `peerDependencies` avant de monter de version majeure.
- Ne pas lancer `npm audit fix --force` : pour l’alerte `deepmerge` (gravité faible, utilisé seulement pendant le build par le plugin Svelte de Vite), il rétrograderait `@astrojs/svelte` en 0.1.2.
- Astro exige Node ≥ 22.23.4 ; le déploiement utilise la dernière LTS (`node-version: lts/*` dans `.github/workflows/deploy.yml`).

## Architecture

Astro (site statique multipage), îles Svelte 5 (runes), TypeScript, CSS avec propriétés personnalisées. Le contenu des études de cas est en Markdown, séparé du code. Aucune bibliothèque UI ou d’animation.

| Emplacement | Responsabilité |
| --- | --- |
| `src/content/projects/<slug>.md` | Une étude de cas : métadonnées en en-tête (titre, tags, ordre, image…) et texte en Markdown ; ses captures dans `src/content/projects/<slug>/` |
| `src/content.config.ts` | Schéma de la collection `projects` (validé au build) |
| `src/lib/projects.ts` | Lecture de la collection : `getFeaturedProjects` (triés par `order`), `getNextProject` |
| `src/layouts/BaseLayout.astro` | Document HTML commun : script du thème avant rendu, script de transition de retour, en-tête, dock, pied de page |
| `src/layouts/CaseStudyLayout.astro` | Mise en page d’une étude de cas et styles du contenu Markdown |
| `src/pages/index.astro` | Accueil statique : hero, profil (`#profil`), contact (`#contact`) |
| `src/pages/projets/[slug].astro` | Génère une page par fichier de la collection |
| `src/lib/components/` | Composants Svelte : rendus en HTML statique, ou îles hydratées avec `client:*` |
| `src/lib/components/ProjectCarousel.svelte` | Île du carrousel des projets |
| `src/lib/components/HeroScene.svelte` | Île du paysage jour/nuit derrière le hero (règles dans `DESIGN.md`, « Scène d’accueil ») ; couleurs `--scene-*` dans `tokens.css` |
| `src/lib/data/skills.ts`, `tech-icons.ts` | Compétences (`TechId`) et logos de `src/lib/assets/tech/` |
| `src/lib/styles/` | `tokens.css` (couleurs, thèmes, espacements, rayons, tailles), `typography.css` (classes `ds-*`), `global.css` |
| `src/lib/snap-blocks.ts` | Défilement (`snapBlocks`) et empilement (`stackBlocks`) des blocs `.snap-block` de l’accueil, appelés par un `<script>` de `index.astro` |
| `public/` | Fichiers servis tels quels : images de couverture des projets, CV, `.nojekyll` |

Il n’existe pas de page « À propos » séparée : le parcours est la section Profil de l’accueil.

Points qui demandent de lire plusieurs fichiers :

- **Îles** : seuls `Header`, `Dock` (`client:load`), `ProjectCarousel` (`client:load`) et `HeroScene` (`client:idle`) envoient du JavaScript. Les autres composants Svelte (`Button`, `TechIcon`, `WindowFrame`, `ProjectTags`, `ProjectImage`, `Footer`) sont rendus en HTML au build. Une île ne reçoit que des props sérialisables (pas d’objet de collection, pas de fonction) ; c’est la raison du type `CarouselProject`.
- **Chemins** : le chemin de base vient de `BASE_PATH` (workflow `.github/workflows/deploy.yml`, vide pour `<user>.github.io`). Liens internes et fichiers de `public/` passent par `withBase()` / `projectPath()` (`src/lib/paths.ts`) ; dans le Markdown, les images sont référencées en relatif (`./<slug>/image.webp`) : Astro les optimise et ajoute la base lui-même. Ne jamais écrire de chemin préfixé en dur.
- **Alias `#lib`** : les imports utilisent `#lib/...` (champ `imports` de `package.json`), et les modules TS sont importés avec l’extension `.js` (ex. `#lib/projects.js`).
- **Thème et dock** : le script inline de `BaseLayout.astro` lit `localStorage` (`theme`) et pose `data-theme` sur `<html>` avant le rendu ; `Header.svelte` écrit la même clé et le même attribut. Le dock est en bas sur mobile et sur le bord gauche à partir de `40rem` (media queries, sans attribut ; la page réserve `--dock-gutter` à gauche). Sur l’accueil, un script inline de `index.astro` pose `data-dock-horizon` avant le rendu (dock horizontal sur l’horizon du paysage en haut de page) ; `src/lib/dock-horizon.ts` le retire au défilement et calcule `--dock-lift`, et `Dock.svelte` remplace ses styles de bord gauche tant que l’attribut est présent. `trackSection` (`snap-blocks.ts`) pose `data-section` (section affichée, d’après le `data-section` des blocs de l’accueil) ; le dock en déduit son élément actif (`aria-current="location"`), et l’ancre de l’adresse sur les autres pages. Garder les trois synchronisés. Le dock reçoit le chemin courant en prop (`pathname`) pour son état actif.
- **Transitions de vue** : natives entre documents (`@view-transition` dans `global.css`, Chrome et Safari récents ; navigation simple ailleurs). `ProjectCard` pose `data-transition` sur la carte cliquée ; la page projet porte les mêmes `view-transition-name`. Au retour, le script `pagereveal` de `BaseLayout.astro` reconnaît le projet quitté, nomme sa carte et place le carrousel sur sa page avant le premier rendu (l’accueil bloque ce rendu avec `<link rel="expect" href="#projets-carousel">`). La position du carrousel est aussi mémorisée en `sessionStorage` pour les retours arrière.
- **Markdown** : moteur par défaut d’Astro, sans plugin. Le HTML produit est brut (titres avec identifiants automatiques, paragraphes, listes, images) ; toute la mise en forme est dans les styles `:global()` de `CaseStudyLayout.astro`. Une image légendée s’écrit `![Texte alternatif](./slug/image.webp)` puis `*Légende*` à la ligne suivante (même paragraphe) : le CSS cible `p:has(> img)`. Les liens externes s’ouvrent dans le même onglet. Les apostrophes et guillemets droits sont convertis en typographiques.
- **Défilement fluide** : activé par l’attribut `data-smooth-scroll`, posé sur `<html>` après le chargement (`BaseLayout.astro`, règle dans `global.css`). Sans cela, une arrivée sur `/#projets` défilerait depuis le haut de la page au lieu de s’y placer directement.

## Conventions de code

- Suivre le style du fichier modifié (tabulations dans les fichiers Svelte et TS).
- Composants interactifs en Svelte 5 (runes, snippets, attachments) ; pages et mises en page en `.astro`. Pas de syntaxe Svelte 4 (`export let`, `<slot>`, `on:click`) dans les composants Svelte. Ne pas convertir les composants sans nécessité.
- Réutiliser les composants et fonctions existants avant de créer une abstraction.
- Conserver un typage utile ; éviter `any`, les contournements TypeScript et les suppressions d’avertissements sans justification.
- Garder les accès à `window`, `document`, `localStorage` et autres API du navigateur compatibles avec le rendu au build (dans un attachment, un `$effect`, un gestionnaire d’événement ou un `<script>` Astro). Nettoyer les abonnements, écouteurs, `requestAnimationFrame` et temporisations.
- Ne pas ajouter de dépendance, de service externe ou de nouvelle couche technique lorsqu’une solution simple existe (en particulier pas de bibliothèque de particules ou d’animation pour la scène d’accueil : SVG et CSS suffisent).

## Interface

Les règles détaillées sont dans `DESIGN.md`. En résumé :

- Utiliser les tokens sémantiques de `tokens.css` ; ajouter un token seulement si son rôle et sa réutilisation le justifient, et le définir pour les deux thèmes.
- Vérifier les thèmes clair et sombre, mobile et ordinateur, clavier et mouvement réduit.
- Réutiliser `Button`, `ProjectCard`, `ProjectTags`, `ProjectImage`, `WindowFrame` et `CaseStudyLayout` selon leur usage réel.
- Conserver la navigation, le dock, les liens d’évitement et les préférences existantes.
- Pour une correction locale, limiter les changements aux styles concernés ; éviter les sélecteurs globaux qui touchent d’autres pages.

## Accessibilité

- Éléments HTML sémantiques : liens pour naviguer, boutons pour agir, titres dans un ordre cohérent, labels pour les champs.
- Utilisable au clavier, focus visible. Aucun contenu essentiel ne dépend uniquement du survol, du glisser-déposer ou d’une animation.
- Pour un contrôle interactif, vérifier son nom accessible, ses états et la gestion du focus.
- Contrastes, tailles de cibles, lisibilité au zoom ; la couleur n’est jamais le seul indicateur.
- Texte alternatif pertinent pour les images informatives ; `alt=""` ou `aria-hidden="true"` pour le décoratif.
- Les outils automatiques complètent les vérifications manuelles ; ne pas annoncer de conformité sur la base d’un score.

## Contenu éditorial et exactitude

Contenu public en français, à la première personne pour les études de cas, ton professionnel, direct et naturel.

- Expliquer le problème, mon rôle, les décisions importantes et leurs conséquences.
- Distinguer projet professionnel, personnel et de formation ; préciser les contributions en équipe.
- Distinguer maquette, prototype, fonctionnalité développée et fonctionnalité en production.
- Distinguer observations, déclarations, interprétations, hypothèses, recommandations et résultats mesurés.
- Ne jamais inventer d’entretiens, tests, participants, chiffres, gains, clients, responsabilités ou technologies.
- Présenter les limites lorsqu’elles changent la compréhension du résultat, sans précautions répétitives.
- Ne pas présenter une exploration Figma Make comme un livrable final sans préciser le travail d’adaptation réel.
- Ne publier ni données personnelles de participants, ni informations confidentielles, ni secrets. Utiliser uniquement les coordonnées professionnelles déjà présentes sur le portfolio.
- Vérifier liens et ressources. Ne pas créer de faux lien ni présenter une illustration comme une capture réelle du produit.

## Ajouter ou modifier un projet

1. Examiner un projet comparable et vérifier les informations disponibles.
2. Créer `src/content/projects/<slug>.md` en copiant l’en-tête d’un projet existant : le nom du fichier donne l’URL, `order` la place dans le carrousel, `image` (couverture) un fichier de `public/` (sans `/`). Le schéma de `src/content.config.ts` refuse un en-tête incomplet au build.
3. Placer la couverture dans `public/` et les captures de l’étude dans `src/content/projects/<slug>/` (Astro les optimise au build).
4. Écrire le contenu en Markdown : `##` pour chaque section, `###` pour un intertitre, `![Texte alternatif](./<slug>/image.webp)` suivi de `*Légende*` à la ligne pour une image légendée. Pas de HTML dans le contenu.
5. Sélectionner les sections utiles : contexte, problème, rôle, démarche, décisions, solution, résultats, limites, apprentissages. Adapter leur longueur au projet.
6. Si un visuel manque, le signaler dans le compte rendu plutôt que publier un faux visuel ou un libellé « à insérer ».
7. Vérifier la carte de l’accueil, l’ordre des projets, le compteur et les contrôles du carrousel, la route, la transition de vue et le lien vers le projet suivant.
8. Contrôler la cohérence entre la carte, l’étude de cas, la section Profil et les compétences si la modification les concerne.

Ne pas dupliquer les métadonnées de l’en-tête Markdown ni réordonner les autres projets sans raison liée à la demande.

## Méthode de travail

- Comprendre le comportement actuel et le périmètre demandé avant de modifier.
- Pour une modification conséquente, présenter brièvement l’approche puis réaliser des changements cohérents et vérifiables.
- Avancer de manière autonome sur les choix courants ; poser une question seulement lorsqu’une information manquante influence réellement le contenu ou une décision difficile à annuler.
- Préserver les modifications locales. Pas de commande Git destructive, pas de commit, push ou déploiement sans demande explicite (un push sur `main` déclenche le déploiement).
- Éviter les refontes opportunistes, les abstractions anticipées et les fichiers de suivi inutiles.
- Mettre à jour `CLAUDE.md` et `DESIGN.md` lorsqu’un changement les rend inexacts.

## Vérification

Adapter la vérification au changement :

- Contenu : exactitude, liens, titres, cohérence entre les sections concernées.
- TypeScript, Astro ou Svelte : `npm run check`, `svelte-autofixer` pour les composants Svelte ; traiter les erreurs introduites.
- Routes, ressources, rendu statique : `npm run build` et contrôle des chemins dans `build/` (tester aussi avec `BASE_PATH=/demo npm run build`).
- Interface : mobile et ordinateur, thèmes clair et sombre ; tablette si la disposition change à cette largeur ; dock sur l’horizon et à gauche (accueil).
- Interaction : clavier, focus, tactile, mouvement réduit.
- Ajouter un test seulement s’il couvre un comportement ou une régression utile (le dépôt n’a pas d’infrastructure de test ; en proposer une avant de l’ajouter).

Préciser exactement ce qui a été vérifié et ce qui ne l’a pas été. Avant de terminer, relire le diff pour repérer les modifications involontaires et les fichiers temporaires.

## Compte rendu attendu

Répondre en français, de manière concise : résultat, principaux fichiers, vérifications effectuées, limites. Distinguer les changements appliqués des propositions et des actions restant à réaliser.
