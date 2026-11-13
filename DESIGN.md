# Direction de design — Portfolio de Timothée Hennequin

## Rôle du document

Ce document guide les décisions visuelles, éditoriales et d’interaction du portfolio. Il complète `CLAUDE.md`, qui décrit la manière de travailler dans le dépôt.

Il formalise une direction ; il ne constitue pas un audit du site déployé. Vérifier les composants et les styles actuels avant toute modification.

Les valeurs exactes sont définies dans `src/lib/styles/tokens.css`, les classes typographiques dans `typography.css` et les comportements dans les composants. Ne pas recopier leurs valeurs dans ce document. Si une règle souhaitée diffère du comportement actuel, traiter cet écart explicitement lors de la tâche concernée.

## Intention et public

Le portfolio doit permettre à un recruteur ou à un collaborateur de comprendre rapidement :

1. Qui je suis : développeur web, avec des compétences complémentaires en UX/UI.
2. Ce que je sais réaliser : des applications, des interfaces et une démarche de conception argumentée.
3. Ce que j’ai personnellement apporté aux projets présentés.
4. Comment consulter mon travail, mon CV et me contacter.

La personnalité visuelle doit soutenir cette lecture. La priorité reste la compréhension du parcours et des réalisations.

## Principes de conception

| Principe | Conséquence sur l’interface |
| --- | --- |
| Clarté | Un titre explicite, une information principale et une action identifiable par ensemble de contenu. |
| Preuves concrètes | Présenter les réalisations, contributions et décisions avant les affirmations générales de compétence. |
| Sobriété | Utiliser l’espace, la typographie et les surfaces pour structurer la lecture. |
| Cohérence | Réutiliser les mêmes composants et règles entre l’accueil et les études de cas. |
| Personnalité utile | Les fenêtres, le dock et la scène d’accueil créent une identité reconnaissable tout en conservant une navigation évidente. |
| Accessibilité | Prévoir les différents modes d’interaction et besoins de lecture dès la conception. |

## Identité visuelle

L’interface évoque un environnement de travail numérique à travers les fenêtres de contenu et le dock. Cette inspiration se traduit par des cadres, des surfaces et des repères de navigation, sans imposer la complexité d’un système de fenêtres superposées.

L’accueil ajoute une touche plus personnelle : une scène illustrée de paysage (voir « Scène d’accueil »), héritée de mon premier portfolio. Elle est le seul espace illustré et animé du site ; les autres pages restent sobres.

- Conserver une base neutre et un accent bleu pour les actions et repères interactifs, conformément aux tokens du portfolio.
- Employer les bordures discrètes et les arrondis partagés pour regrouper les contenus.
- Donner de la profondeur uniquement lorsqu’elle clarifie une interaction ou une superposition.
- Garder les couleurs propres aux projets dans leurs captures et leurs visuels. Elles ne remplacent pas les couleurs de navigation du portfolio.
- Privilégier les icônes existantes, avec un style et des dimensions cohérents. Ajouter un libellé lorsque le sens n’est pas évident.
- Éviter les effets décoratifs qui concurrencent les projets : accumulation de badges, grands dégradés, animations permanentes ou multiplication des encadrements. Seule exception : la scène d’accueil, dans le cadre défini plus bas.

## Couleurs et thèmes

Utiliser les tokens sémantiques selon leur fonction : `--text-primary`, `--text-secondary`, `--surface-default`, `--surface-subtle`, `--surface-elevated`, `--border-default`, `--action-primary` et `--action-focus`, notamment.

Le thème sombre conserve la même hiérarchie et les mêmes informations. Vérifier séparément les textes secondaires, bordures, états interactifs et logos sombres. Des surfaces proches peuvent être distinguées par leur espacement et leurs bordures sans multiplier les nuances.

Le contraste entre un élément et son fond doit être vérifié dans son contexte réel. L’existence d’un token ne garantit pas à elle seule la lisibilité de toutes ses combinaisons.

## Typographie et composition

- Utiliser Sora pour les titres (`--font-heading`, graisses 600 et 700), Onest pour le texte (`--font-sans`) et les classes `ds-*` existantes ; réserver les plus grandes tailles à l’introduction et aux titres structurants.
- Conserver une hiérarchie de titres sémantique, indépendamment de la taille visuelle choisie.
- Garder les paragraphes des études de cas dans une colonne de lecture confortable. Les captures peuvent occuper une largeur plus importante si leur compréhension le nécessite.
- Utiliser les espacements partagés pour établir un rythme : éléments d’un même groupe proches, sections distinctes davantage séparées.
- Prévoir un espace intérieur visible autour des cartes et des contenus imbriqués. Les textes et visuels ne doivent pas toucher les bordures.
- Aligner les cartes, titres et actions sur des repères communs. Ne pas ajouter de hauteur fixe susceptible de couper un contenu plus long.
- Ajuster la composition au contenu réel, y compris pour les noms longs, les tags et les traductions éventuelles.

## Accueil et parcours de lecture

L’introduction présente le nom, le positionnement et une phrase concrète sur ce que je conçois et développe. L’action principale conduit aux projets ; le contact reste facilement accessible.

La scène d’accueil accompagne cette introduction sans la remplacer : le nom, le positionnement et les actions restent lisibles et utilisables même si la scène ne s’affiche pas.

Les projets sélectionnés constituent la preuve principale. Chaque carte présente un titre, des tags utiles, une description courte et un lien explicite vers l’étude de cas. Un visuel sert à identifier le projet et à comprendre sa nature.

Les compétences, le parcours et les moyens de contact complètent cette lecture. Ne pas multiplier les sections qui répètent la même information. Toute affirmation chiffrée doit rester vérifiable et correctement contextualisée.

## Scène d’accueil

### Origine

Mon premier portfolio (Next.js, 2021) ouvrait sur un bloc `blocHead` : ciel nocturne bleu marine, particules qui montent lentement comme des étoiles, un disque « PORTFOLIO » qui se lève comme un soleil, trois collines elliptiques superposées dans des bleus proches, le tout dévoilé par un rideau noir en diagonale. La nouvelle scène reprend cette idée en version plus aboutie : même paysage en couches, mais plus riche en détails, plus vivant et lié au thème du site.

### Intention

Un petit paysage illustré qui raconte une histoire sans texte : collines et montagnes en couches, un arbre, un cycliste sur un chemin, le ciel. En thème clair, c’est le jour : soleil, quelques nuages, éventuellement des oiseaux. En thème sombre, la nuit : lune, étoiles qui scintillent, étoile filante occasionnelle. Le passage d’un thème à l’autre devient un passage du jour à la nuit.

| Élément | Ancienne version | Nouvelle version |
| --- | --- | --- |
| Ciel | Aplat bleu marine | Teinte selon le thème, dégradé vertical discret limité à la scène |
| Astre | Disque « PORTFOLIO » qui se lève | Soleil (clair) ou lune (sombre), lever court à l’arrivée, sans texte |
| Étoiles | 160 particules JS qui montent | Quelques dizaines d’étoiles SVG fixes, scintillement léger ; étoile filante ponctuelle |
| Relief | Trois ellipses de bleus voisins | Collines et montagnes en plusieurs plans, de plus en plus contrastées vers l’avant |
| Vie | — | Arbre (feuillage qui ondule légèrement), cycliste qui traverse le chemin, nuages ou oiseaux de jour |
| Entrée | Rideau noir de 2 s | Apparition brève des plans, sans masquer le contenu |

Les éléments listés sont une direction, pas un inventaire obligatoire. Mieux vaut peu d’éléments soignés et cohérents qu’une accumulation.

### Style

- Illustration vectorielle plate, formes simples et arrondies, sans contour ni texture, cohérente avec les arrondis et la sobriété du reste de l’interface.
- Profondeur obtenue par superposition de plans et variations de valeur d’une même famille de teintes, pas par des ombres.
- Couleurs de scène définies comme tokens dédiés dans `tokens.css` (préfixe `--scene-`), en version claire et sombre. L’accent `--action-primary` reste réservé aux éléments interactifs : la scène ne l’utilise pas, afin de ne rien faire paraître cliquable.
- La palette s’accorde à celle du site : bleus et sarcelles proches de `--color-cyan` et `--color-mint`, neutres chauds de `--color-snow`, ciel nocturne proche du thème sombre.

### Composition

- La scène occupe une bande du hero (en fond derrière le texte ou en bandeau sous celui-ci), jamais derrière un paragraphe sans garantie de contraste. Si le texte la recouvre, le fond situé directement sous le texte doit rester assez uni pour respecter les contrastes du site.
- Les éléments animés (cycliste, étoile filante, astre) circulent hors de la zone du titre, des boutons et des points clés.
- Sur mobile, la scène se simplifie : moins de plans, moins d’étoiles, hauteur réduite, aucun débordement horizontal. Elle ne doit pas repousser les actions principales hors du premier écran.
- Le dock occupe le bord gauche sur ordinateur et le bas de l’écran sur mobile.

### Mouvement

- Animations CSS sur `transform` et `opacity` uniquement ; pas de boucle JavaScript continue ni de bibliothèque de particules.
- Animations d’ambiance de faible amplitude, jouées une seule fois à l’arrivée : chaque élément (nuages, oiseaux, arbre, étoiles, étoile filante, cycliste) bouge puis s’arrête à la place qu’il occupe dans le décor fixe. Aucune boucle infinie. Les animations ne jouent qu’à la première arrivée sur l’accueil dans la session (onglet) : au retour arrière ou à une nouvelle visite, le décor fixe s’affiche directement (`data-scene-played`, `sessionStorage`).
- Toute animation est terminée en moins de 5 secondes (WCAG 2.2.2) : il n’y a donc pas de bouton pause. Une nouvelle animation plus longue imposerait d’en rétablir un.
- Avec `prefers-reduced-motion: reduce`, la scène est statique et complète, sans animation d’entrée.
- Suspendre les animations quand la scène sort de l’écran ou quand l’onglet est masqué.
- L’animation d’entrée ne bloque ni la lecture ni l’interaction et ne gêne pas les transitions de vue existantes.

### Implémentation et accessibilité

- Implémentée dans `src/lib/components/HeroScene.svelte` (SVG inline, sans requête réseau ni image), placée dans le `.hero` de l’accueil comme île Astro hydratée en différé (`client:idle`) : sans JavaScript, le décor et ses animations CSS s’affichent, seule la suspension hors écran reste inactive. Le hero fournit la hauteur de la bande de paysage (`--hero-scene-band`) et la réserve en `padding-bottom` pour que les collines restent sous le texte. La scène déborde en pleine largeur (`100vw`, recentrée pour compenser la place du dock à gauche) ; `.app` coupe le débordement horizontal (`overflow-x: clip`).
- Le premier plan du paysage a la couleur du fond de page : le relief semble sortir de la page, sans bord visible avec la section suivante. Le haut du ciel suit le même principe.
- Le cycliste entre par la gauche et s’arrête au quart du paysage ; les oiseaux arrivent par la droite et restent en vol plané. Hors écran, les animations sont seulement suspendues. L’animation d’entrée n’est jamais gelée.
- Scène décorative : `aria-hidden="true"`, aucun élément focusable, `pointer-events: none`. Une interaction ludique éventuelle (par exemple un clic sur l’astre pour changer de thème) doit doubler une commande existante et rester accessible au clavier, jamais en être la seule voie.
- Les couleurs suivent `data-theme` sur `<html>` via les tokens, sans JavaScript, pour rester correctes dès le HTML généré au build et sans flash.
- Le composant ne doit pas perturber `snapBlocks` ni la hauteur du bloc `.hero`.

## Études de cas et visuels

Utiliser `CaseStudyLayout`, `ProjectTags` et `ProjectImage` pour conserver une présentation commune. Le contenu est écrit en Markdown (`src/content/projects/`) : sections, intertitres et images légendées suivent tous la même mise en forme, sans HTML ni style propre à une page.

- Introduire le projet par son objectif, son contexte et ma contribution.
- Développer les décisions importantes avec leur justification et une preuve lorsque disponible.
- Adapter les sections à la nature du projet : un produit en production, une recherche terrain et un exercice UI ne racontent pas la même démarche.
- Présenter les résultats et leurs limites avec précision. Une recommandation ou un objectif ne devient pas un gain mesuré.
- Choisir des captures réelles, lisibles et centrées sur le point expliqué. Préserver leurs proportions ; un recadrage de carte ne doit pas masquer un élément essentiel.
- Associer une légende aux images lorsque leur intérêt ou leur statut demande une explication : prototype, écran final ou exploration.
- Si aucun visuel n’est disponible, conserver une présentation textuelle propre et signaler ce besoin dans le compte rendu de travail. Ne pas publier un emplacement vide qui ressemble à une image cassée.
- Terminer par des liens utiles vers le produit, le code ou les livrables lorsque leur diffusion est autorisée, puis permettre de poursuivre vers un autre projet.

## Navigation et interactions

La navigation doit rester évidente : le dock a une place fixe et ne se déplace pas. Conserver les accès au contenu, au menu, aux projets et au contact.

- Le dock ne doit pas recouvrir un texte, une action ou un élément ayant le focus. Préserver l’espace nécessaire selon sa position.
- Sur ordinateur, le dock est vertical sur le bord gauche. En haut de l’accueil, il est horizontal et centré sur la ligne d’horizon du paysage (`dock-horizon.ts`, `data-horizon-y` sur le SVG du paysage). Au défilement, il s’efface puis réapparaît sur le bord gauche ; il revient sur l’horizon en haut de page.
- Aucune fonction ne dépend du glisser-déposer.
- Un carrousel affiche sa position et propose des contrôles utilisables au clavier et au toucher. Éviter le défilement automatique.
- Le défilement par sections doit laisser consulter librement les contenus longs et les zones disposant de leur propre défilement.
- Sur l’accueil, le passage d’une section à l’autre glisse en 0,6 à 0,95 s (`snap-blocks.ts`), avec un départ et une arrivée progressifs.
- Les sections de l’accueil s’empilent : chacune reste collée en haut de l’écran pendant que la suivante glisse par-dessus (`stackBlocks`). Le contenu de la section recouverte s’efface et a disparu avant que les deux contenus se superposent (dans le hero, seuls le texte et les encarts : le paysage reste visible derrière toute la page) ; effacé, il ne reçoit plus les clics, et le focus clavier la ramène à l’écran. Une section plus haute que l’écran ne se colle qu’une fois son bas atteint, pour rester lisible en entier. La dernière section reçoit la marge nécessaire pour s’aligner en haut de l’écran. Les ancres (`#projets`, `#profil`, `#contact`) sont des repères placés hors des sections collées.
- Distinguer les états disponibles, actifs, survolés et ayant le focus. Ne pas créer un élément qui semble cliquable sans action associée.
- Les transitions restent brèves et accompagnent un changement compréhensible. Respecter le mouvement réduit et conserver un comportement fonctionnel si une animation n’est pas disponible.

## Responsive

Adapter la structure à l’espace disponible plutôt que réduire uniformément les éléments. S’appuyer sur les points de rupture existants et tester leurs transitions.

| Format | Priorités |
| --- | --- |
| Mobile | Lecture dans une colonne principale, actions accessibles au toucher, titres adaptés, accès simple à la navigation. |
| Tablette | Utiliser plusieurs colonnes seulement si chaque contenu conserve une largeur confortable ; vérifier la place du dock à la largeur de bascule (`40rem`). |
| Ordinateur | Exploiter l’espace pour organiser les ensembles, en limitant la largeur des textes et en réservant la place du dock. |

Le contenu doit rester accessible au zoom et sur une largeur étroite, sans défilement horizontal général. Un carrousel peut disposer de son propre défilement horizontal clairement identifiable. L’ordre de lecture et les actions principales restent cohérents entre les formats.

## Accessibilité à préserver

- Contrastes suffisants dans les deux thèmes : viser au minimum 4,5:1 pour le texte courant et 3:1 pour le grand texte selon sa définition WCAG ; vérifier aussi les éléments d’interface concernés.
- Focus visible et non masqué, navigation clavier logique et noms accessibles explicites.
- Cibles tactiles confortables ; viser 44 × 44 pixels CSS pour les actions principales lorsque possible, comme objectif de confort.
- Information compréhensible sans dépendre exclusivement de la couleur, du survol ou du mouvement.
- Alternatives textuelles adaptées aux images et respect des préférences de mouvement réduit.

Ces règles constituent des objectifs de conception à vérifier. Elles ne sont pas une déclaration de conformité du site.

## Vérifier une évolution visuelle

Avant de considérer une modification comme terminée, contrôler :

1. La compréhension du contenu et l’identification de l’action principale.
2. La cohérence avec les composants, tokens et autres pages.
3. La lisibilité des captures, les alignements et l’absence de contenu coupé.
4. Le rendu sur mobile, à une largeur intermédiaire et sur ordinateur, en clair et en sombre.
5. Le clavier, le focus, le zoom et les interactions concernées, avec mouvement réduit si applicable.

Pour une évolution importante, comparer le résultat à l’intention du portfolio et expliquer les compromis. Si le rendu n’a pas pu être inspecté, l’indiquer explicitement. Mettre ce document à jour lorsqu’une décision de design durable change.
