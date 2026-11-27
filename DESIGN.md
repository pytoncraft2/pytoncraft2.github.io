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

L’accueil ajoute une touche plus personnelle : une scène illustrée de paysage (voir « Scène d’accueil »), héritée de mon premier portfolio. La carte Profil laisse apparaître cette même scène entre les technologies et la frise. Les autres pages restent sobres.

- Conserver une base neutre et un accent bleu pour les actions et repères interactifs, conformément aux tokens du portfolio.
- Employer les bordures discrètes et les arrondis partagés pour regrouper les contenus.
- Donner de la profondeur uniquement lorsqu’elle clarifie une interaction ou une superposition.
- Garder les couleurs propres aux projets dans leurs captures et leurs visuels. Elles ne remplacent pas les couleurs de navigation du portfolio.
- Privilégier les icônes existantes, avec un style et des dimensions cohérents. Ajouter un libellé lorsque le sens n’est pas évident.
- Éviter les effets décoratifs qui concurrencent les projets : accumulation de badges, grands dégradés, animations permanentes ou multiplication des encadrements. Seule exception : la scène d’accueil, dans le cadre défini plus bas.

## Couleurs et thèmes

Utiliser les tokens sémantiques selon leur fonction : `--text-primary`, `--text-secondary`, `--surface-default`, `--surface-subtle`, `--surface-elevated`, `--border-default`, `--action-primary` et `--action-focus`, notamment.

Le thème sombre conserve la même hiérarchie et les mêmes informations. Vérifier séparément les textes secondaires, bordures, états interactifs et logos sombres. Des surfaces proches peuvent être distinguées par leur espacement et leurs bordures sans multiplier les nuances.

Le thème se choisit dans le panneau Paramètres de l’en-tête : Système (par défaut, suit `prefers-color-scheme` et ses changements), Clair ou Sombre. Seuls Clair et Sombre sont mémorisés ; revenir à Système efface le choix.

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

Les projets sélectionnés constituent la preuve principale. Chaque carte présente un titre, ses technologies principales (champ `stack`, quatre en général, davantage pour un projet majeur comme Vroum, les plus parlantes en premier : un recruteur les repère d’un coup d’œil), des tags utiles, une description courte et un lien explicite vers l’étude de cas. Un visuel sert à identifier le projet et à comprendre sa nature.

Les compétences, le parcours et les moyens de contact complètent cette lecture. Ne pas multiplier les sections qui répètent la même information. Toute affirmation chiffrée doit rester vérifiable et correctement contextualisée.

L’horizon garde la même hauteur entre Accueil, Projets et Profil. La frise réserve l’espace sous le sol. Au pied du Profil, le vélo relie les quatre étapes du parcours en un passage lorsque les repères sous ses roues entrent à l’écran. La frise reste entièrement lisible après le passage, et s’affiche directement en mouvement réduit.

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
| Vie | — | Arbre, cycliste qui traverse le chemin, nuages ou oiseaux de jour |
| Entrée | Rideau noir de 2 s | Paysage complet dès la première image ; seuls l’astre, les étoiles, les oiseaux et le cycliste s’animent |

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
- Animations d’ambiance de faible amplitude, jouées une seule fois à l’arrivée : chaque élément (lever de l’astre, étoiles, étoile filante, oiseaux, cycliste) bouge puis s’arrête à la place qu’il occupe dans le décor fixe. Le relief, l’arbre et les nuages restent fixes : un décor qui s’anime en entier disperse l’attention et laisse le hero vide pendant les premières images ; le cycliste reste le seul mouvement du premier plan. Aucune boucle infinie. Les animations ne jouent qu’à la première arrivée sur l’accueil dans la session (onglet) : au retour arrière ou à une nouvelle visite, le décor fixe s’affiche directement (`data-scene-played`, `sessionStorage`).
- Toute animation est terminée en moins de 5 secondes (WCAG 2.2.2) : il n’y a donc pas de bouton pause. Une nouvelle animation plus longue imposerait d’en rétablir un.
- Avec `prefers-reduced-motion: reduce`, la scène est statique et complète, sans animation d’entrée.
- Suspendre les animations quand la scène sort de l’écran ou quand l’onglet est masqué.
- L’animation d’entrée ne bloque ni la lecture ni l’interaction et ne gêne pas les transitions de vue existantes.

### Implémentation et accessibilité

- Implémentée dans `src/lib/components/HeroScene.svelte` (SVG inline, sans requête réseau ni image), placée dans le `.hero` de l’accueil comme île Astro hydratée en différé (`client:idle`) : sans JavaScript, le décor et ses animations CSS s’affichent, seule la suspension hors écran reste inactive. Le hero fournit la hauteur de la bande de paysage (`--hero-scene-band`) et la réserve en `padding-bottom` pour que les collines restent sous le texte. La scène déborde en pleine largeur (`100vw`, recentrée pour compenser la place du dock à gauche) ; `.app` coupe le débordement horizontal (`overflow-x: clip`).
- Le premier plan du paysage a la couleur du fond de page : le relief semble sortir de la page, sans bord visible avec la section suivante. Le haut du ciel suit le même principe.
- Le cycliste entre par la gauche et s’arrête au quart du paysage ; les oiseaux partent juste à gauche du soleil, pour ne pas croiser l’astre pendant son lever, volent à vitesse constante en battant des ailes, ralentissent progressivement (sans freinage sec) puis restent en vol plané. Hors écran, les animations sont seulement suspendues. L’animation d’entrée n’est jamais gelée.
- Scène décorative : `aria-hidden="true"`, aucun élément focusable, `pointer-events: none`. Une interaction ludique éventuelle (par exemple un clic sur l’astre pour changer de thème) doit doubler une commande existante et rester accessible au clavier, jamais en être la seule voie. Seule exception : l’easter-egg du cycliste (ci-dessous).
- Les couleurs suivent `data-theme` sur `<html>` via les tokens, sans JavaScript, pour rester correctes dès le HTML généré au build et sans flash.
- Le composant ne doit pas perturber `snapBlocks` ni la hauteur du bloc `.hero`.

### Easter-egg du cycliste

Un clic sur le cycliste du hero, une fois son entrée terminée, le fait saluer (même coucou que sur Contact, fini en 2,7 s) et ouvre au-dessus de sa tête une bulle de BD : « Salut ! Une petite balade ? », avec [Jouer] et [Non merci]. [Jouer] lance un mini-jeu dans la bande de paysage, sans zoom, le texte du hero restant affiché.

- Proposé seulement dans le hero (`data-section="accueil"`), sur un écran d’au moins `40rem` avec un pointeur fin (`hover: hover`, `pointer: fine`), hors mouvement réduit (préférence système et réglage du site). Ailleurs, le cycliste n’est pas cliquable.
- Volontairement hors de la navigation : une zone transparente sur le cycliste, cliquable à la souris seulement, sans arrêt de tabulation ; la scène reste `aria-hidden`. C’est un écart assumé à la règle « utilisable au clavier », acceptable parce que l’easter-egg n’est pas un contenu essentiel.
- La bulle, hors de la scène, contient de vrais boutons et reçoit le focus à l’ouverture (sur [Jouer]) : la suite se fait aussi au clavier. Échap, un clic ailleurs, un second clic sur le cycliste ou la sortie du hero la ferment. Une condition qui cesse (fenêtre réduite, réglage activé) la ferme aussi.
- Même dessin que la bulle de Contact (contour, ombre décalée, pointe vers le casque), apparition avec un léger rebond pendant que le bras se lève.

Mini-jeu (version minimale) :

- Runner horizontal : le vélo reste au quart du paysage et ses roues tournent selon la distance parcourue. Leurs 12 rayons se ressemblent tous les 30° : au-delà d’un quart d’écart par image (7,5°), la roue semble hésiter puis tourner à l’envers (effet stroboscopique), or le jeu va plus vite. La rotation affichée est donc plafonnée à 7,5° par image et le surplus se lit comme un léger flou (rayons un peu estompés, 75 % d’opacité au plus fort) ; le paysage défile en parallaxe (sol, repères et obstacles à la vitesse du vélo, collines proches avec les arbres un peu plus lentement, collines du milieu, montagnes, puis nuages de plus en plus lentement ; astre, étoiles et oiseaux fixes). Chaque plan répète son dessin en alternant avec son reflet, pour que les bords se raccordent sans cassure ; le décor fixe revient tel quel à la fermeture de la bulle. Des obstacles (rocher, cône de travaux, tronc, falaise) arrivent par la droite, de plus en plus vite. La falaise est un trou dans le chemin : on y tombe si l’on est au sol quand le centre du véhicule passe au-dessus ; comme un obstacle, elle fait perdre un véhicule. Espace, ↑ ou un clic dans le paysage font sauter ; Échap quitte.
- Échelle des véhicules : chaque obstacle touché fait descendre d’un cran, vélo → monocycle → skateboard → à pied ; à pied, c’est la chute et la fin de la partie. Chaque véhicule va plus lentement que le précédent (allure 1 ; 0,85 ; 0,75 ; 0,6 de la vitesse de base) : plus on perd de véhicules, plus c’est facile. Chacun a son saut : vélo équilibré, monocycle plus bas (et il oscille), skateboard court et vif, à pied le plus haut. Après un choc, le cycliste clignote 1,2 s, les obstacles ne comptent pas et la consigne laisse place à « Aïe ! On continue en monocycle » (etc.). Au repos et à chaque nouvelle partie, c’est le vélo. Les réglages sont vérifiés par simulation : pour chaque véhicule, un moment de saut permet de tenir 3 minutes sur 200 tirages.
- Bonus : une pile (éclair dans un disque, qui flotte doucement) apparaît parfois au milieu d’un grand écart entre deux obstacles, assez haut pour qu’il faille sauter pour l’attraper. Elle fait remonter d’un cran, avec « Super ! On repart à vélo » (etc.) à la place de la consigne. Le hoverboard, en haut de l’échelle, ne s’obtient que comme ça : le plus rapide (allure 1,15), il flotte avec une lueur dessous et saute bas mais retombe lentement ; un choc le fait redescendre au vélo. Plus de pile en hoverboard. En simulation, un joueur qui va chercher chaque pile ne tombe pas pour autant : la prise de risque reste un choix.
- La distance s’affiche en haut à droite de la bande, avec la consigne jusqu’au premier obstacle. À la chute, la bulle affiche « Fin de la balade : X km ! » avec [Rejouer] (focus) et [Me contacter] (`#contact`).
- Exceptions aux règles de la scène, limitées à la partie, que le visiteur lance et peut arrêter à tout moment : boucle `requestAnimationFrame` (pas de temps plafonné, suspendue avec l’onglet), relief, arbres et nuages qui bougent, animation de plus de 5 s, scène qui reçoit les clics. La partie s’arrête aussi en quittant le hero ou quand une condition cesse.
- Code chargé seulement à l’invitation (`import()` de `HeroRunner.svelte`) ; logique sans DOM dans `src/lib/hero-runner.ts`. Couleurs des obstacles, de la falaise, des piles et du hoverboard : tokens `--scene-rock*`, `--scene-log*`, `--scene-cone*`, `--scene-gap`, `--scene-bonus*`, `--scene-hover-*`.

## Études de cas et visuels

Utiliser `CaseStudyLayout`, `ProjectStack`, `ProjectTags` et `ProjectImage` pour conserver une présentation commune. L’en-tête reprend les éléments de la carte dans le même ordre (visuel, titre, technologies, tags, résumé) : un visiteur arrivé directement sur l’étude de cas voit aussi la stack, et chaque élément de la carte se transforme en son équivalent pendant la transition de vue. Le contenu est écrit en Markdown (`src/content/projects/`) : sections, intertitres et images légendées suivent tous la même mise en forme, sans HTML ni style propre à une page.

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
- Sur ordinateur, le dock reste vertical sur le bord gauche dès l’arrivée sur le site et pendant le défilement.
- Aucune fonction ne dépend du glisser-déposer.
- Un carrousel affiche sa position et propose des contrôles utilisables au clavier et au toucher. Éviter le défilement automatique.
- Le carrousel de l’accueil présente toutes les études de cas, groupées par domaine : le développement web d’abord (projets professionnels, puis académiques), puis la conception UX/UI, puis l’IoT. Le visiteur qui cherche une technologie continue de faire défiler les cartes sans changer de page. Les projets les plus solides de chaque groupe passent en premier.
- Le défilement par sections doit laisser consulter librement les contenus longs et les zones disposant de leur propre défilement.
- Sur l’accueil, le passage d’une section à l’autre glisse en 0,6 à 0,95 s (`snap-blocks.ts`), avec un départ et une arrivée progressifs.
- À partir de `40rem` (dock à gauche), les sections de l’accueil s’empilent : chacune reste collée en haut de l’écran pendant que la suivante glisse par-dessus (`stackBlocks`). Le contenu de la section recouverte s’efface et a disparu avant que les deux contenus se superposent ; sous une section opaque ou vide pendant sa glissade (Contact, `data-stack-empty`), il s’efface sur la première moitié de la course, pour un passage aussi progressif que depuis le hero (dans le hero, seuls le texte et les encarts : le paysage reste visible derrière toute la page) ; effacé, il ne reçoit plus les clics, et le focus clavier la ramène à l’écran. Une section plus haute que l’écran ne se colle qu’une fois son bas atteint, pour rester lisible en entier. La dernière section (Contact) est la fin du trajet : transparente, elle occupe la hauteur de l’écran jusqu’au pied de page au-dessus du paysage, et la section qu’elle recouvre a fini de s’effacer à son arrivée. Sur ordinateur, le décor s’agrandit alors vers le vélo (×1,6, 0,9 s), le cycliste lève le bras, fait coucou et le redescend (fini en 3,3 s, à chaque arrivée) et le contenu de Contact sort de sa tête en bulle de BD (`contact-bubble.ts`) ; la bulle contient les vrais liens (e-mail, LinkedIn, CV) et s’affiche aussi dès qu’elle reçoit le focus. Sur ordinateur, le pied de page se superpose au bas de Contact pour que la fin de page garde la hauteur de l’écran et que le paysage ne soit pas repoussé vers le haut. Sur mobile, les sections défilent dans le flux, comme en mouvement réduit : sur un petit écran, l’effacement d’une section pendant la lecture au doigt gêne plus qu’il n’apporte. Le paysage remonte avec le hero, et Contact est une carte qui suit le Profil, sans zoom. En mouvement réduit, la bulle s’affiche directement dans la section. Les ancres (`#projets`, `#profil`, `#contact`) sont des repères placés hors des sections collées.
- Distinguer les états disponibles, actifs, survolés et ayant le focus. Ne pas créer un élément qui semble cliquable sans action associée.
- Le réglage « Réduire les animations », dans le panneau Paramètres en haut à droite, s’applique à tout le site et se mémorise dans le navigateur. La préférence système est prioritaire. En mouvement réduit, les sections défilent dans le flux normal, la frise est lisible d’emblée et les coordonnées de Contact sont affichées dans le contenu de la page.
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
