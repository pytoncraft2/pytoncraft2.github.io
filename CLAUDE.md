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
npm run dev       # serveur de dev Vite
npm run build     # build statique dans build/
npm run preview   # sert le build
npm run check     # svelte-kit sync + svelte-check (typecheck TS et Svelte)
```

Il n’y a ni tests, ni linter, ni formatter configurés : `npm run check` puis `npm run build` sont les seules vérifications automatiques. Le rendu visuel se contrôle dans le navigateur (`npm run dev` ou `npm run preview`).

## Architecture

SvelteKit, TypeScript, Svelte 5 (runes), CSS avec propriétés personnalisées. Aucune bibliothèque UI ou d’animation.

| Emplacement | Responsabilité |
| --- | --- |
| `src/app.html` | Script inline appliqué avant hydratation : thème et position du dock |
| `src/routes/+layout.svelte` | Structure commune, styles, en-tête, pied de page, dock, transitions de vue |
| `src/routes/+layout.ts` | `prerender = true` pour tout le site |
| `src/routes/+page.svelte` | Accueil : hero, carrousel des projets, profil (`#profil`), contact (`#contact`) |
| `src/routes/projets/<slug>/+page.svelte` | Étude de cas d’un projet |
| `src/lib/data/projects.ts` | Type `Project`, union `ProjectSlug`, ordre et helpers (`getProject`, `getNextProject`, `getFeaturedProjects`, `projectPath`) |
| `src/lib/data/skills.ts`, `tech-icons.ts` | Compétences (`TechId`) et logos de `src/lib/assets/tech/` |
| `src/lib/components/` | Composants partagés |
| `src/lib/components/HeroScene.svelte` | Paysage jour/nuit décoratif derrière le hero (règles dans `DESIGN.md`, « Scène d’accueil ») ; couleurs `--scene-*` dans `tokens.css` |
| `src/lib/styles/` | `tokens.css` (couleurs, thèmes, espacements, rayons, tailles), `typography.css` (classes `ds-*`), `global.css` |
| `src/lib/snap-blocks.ts` | Attachment `{@attach snapBlocks}` : défilement par blocs `.snap-block` de l’accueil |

Il n’existe pas de page « À propos » séparée : le parcours est la section Profil de l’accueil.

Points qui demandent de lire plusieurs fichiers :

- **Rendu statique et chemins** : `adapter-static` avec `fallback: '404.html'`, déployé sur GitHub Pages par `.github/workflows/deploy.yml` (push sur `main`). Le chemin de base vient de `BASE_PATH` (vide en dev). Les liens internes passent par `resolve()` et les fichiers de `static/` par `asset()` (`$app/paths`) ; ne jamais écrire de chemin absolu en dur.
- **Alias `#lib`** : les imports utilisent `#lib/...` (champ `imports` de `package.json`), pas `$lib`, et les modules TS sont importés avec l’extension `.js` (ex. `#lib/data/projects.js`). L’entrée nue `#lib` pointe vers `src/lib/index.js`, qui n’existe pas : toujours importer un sous-chemin.
- **Runes forcées** : `vite.config.ts` active le mode runes hors `node_modules`. Pas de syntaxe Svelte 4 (`export let`, `<slot>`, `on:click`).
- **Thème et dock** : `src/app.html` lit `localStorage` (`theme`, `dock-placement`) et pose `data-theme` / `data-dock` sur `<html>` avant l’hydratation ; `Header.svelte` et `Dock.svelte` écrivent les mêmes clés et attributs. Garder les trois synchronisés. Les styles ciblent `:global(html[data-theme='dark'])` et `:global(html[data-dock=...])` ; les tokens sombres sont dans `tokens.css` sous `[data-theme='dark']`.
- **Transitions de vue** : `+layout.svelte` enveloppe les navigations dans `document.startViewTransition` (sauf mouvement réduit) et pose `data-project-transition` lors d’un passage accueil ↔ projet. `ProjectCard` et `ProjectTags` partagent des `view-transition-name` avec la page projet ; l’en-tête utilise `app-header`. Un nouvel élément animé de l’accueil ne doit pas réutiliser ces noms.

## Conventions de code

- Suivre le style du fichier modifié (tabulations dans les fichiers Svelte et TS).
- Utiliser runes, snippets et attachments lorsque le contexte s’y prête. Ne pas convertir les composants sans nécessité.
- Réutiliser les composants et fonctions existants avant de créer une abstraction.
- Conserver un typage utile ; éviter `any`, les contournements TypeScript et les suppressions d’avertissements sans justification.
- Garder les accès à `window`, `document`, `localStorage` et autres API du navigateur compatibles avec le pré-rendu (dans un attachment, un `$effect` ou un gestionnaire d’événement). Nettoyer les abonnements, écouteurs, `requestAnimationFrame` et temporisations.
- Ne pas ajouter de dépendance, de service externe ou de nouvelle couche technique lorsqu’une solution simple existe (en particulier pas de bibliothèque de particules ou d’animation pour la scène d’accueil : SVG et CSS suffisent).

## Interface

Les règles détaillées sont dans `DESIGN.md`. En résumé :

- Utiliser les tokens sémantiques de `tokens.css` ; ajouter un token seulement si son rôle et sa réutilisation le justifient, et le définir pour les deux thèmes.
- Vérifier les thèmes clair et sombre, mobile et ordinateur, clavier et mouvement réduit.
- Réutiliser `Button`, `ProjectCard`, `ProjectTags`, `ProjectImage`, `WindowFrame`, `CaseStudyLayout` et `CaseStudySection` selon leur usage réel.
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
2. Ajouter le slug à l’union `ProjectSlug` et l’entrée dans `projects` (`src/lib/data/projects.ts`), en respectant le type `Project`. Le champ `image` est un chemin relatif à `static/`.
3. Placer les captures optimisées (WebP de préférence) dans `static/`.
4. Créer `src/routes/projets/<slug>/+page.svelte` : `getProject('<slug>')` puis `CaseStudyLayout` + `CaseStudySection`. Les images de `static/` passent par `asset()`.
5. Sélectionner les sections utiles : contexte, problème, rôle, démarche, décisions, solution, résultats, limites, apprentissages. Adapter leur longueur au projet.
6. Si un visuel manque, le signaler dans le compte rendu plutôt que publier un faux visuel ou un libellé « à insérer ».
7. Vérifier la carte de l’accueil, l’ordre des projets, le compteur et les contrôles du carrousel, la route, la transition de vue et le lien vers le projet suivant.
8. Contrôler la cohérence entre la carte, l’étude de cas, la section Profil et les compétences si la modification les concerne.

Ne pas dupliquer les métadonnées centralisées ni réordonner les autres projets sans raison liée à la demande.

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
- TypeScript ou Svelte : `npm run check`, `svelte-autofixer` ; traiter les erreurs introduites.
- Routes, ressources, pré-rendu : `npm run build` et contrôle des chemins dans `build/`.
- Interface : mobile et ordinateur, thèmes clair et sombre ; tablette si la disposition change à cette largeur ; dock à gauche, à droite et en bas.
- Interaction : clavier, focus, tactile, mouvement réduit.
- Ajouter un test seulement s’il couvre un comportement ou une régression utile (le dépôt n’a pas d’infrastructure de test ; en proposer une avant de l’ajouter).

Préciser exactement ce qui a été vérifié et ce qui ne l’a pas été. Avant de terminer, relire le diff pour repérer les modifications involontaires et les fichiers temporaires.

## Compte rendu attendu

Répondre en français, de manière concise : résultat, principaux fichiers, vérifications effectuées, limites. Distinguer les changements appliqués des propositions et des actions restant à réaliser.
