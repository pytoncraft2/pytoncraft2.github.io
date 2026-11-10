---
title: "SportSee"
order: 7
meta: "Formation Product Design · Figma · Zeroheight"
tags: ["2026", "Formation", "UI Design", "Design System"]
description: "Conception des écrans de connexion, dashboard et profil sur trois formats, avec un Design System réutilisable documenté dans Zeroheight."
stack: ["Figma", "Zeroheight"]
role: "Conception UI, responsive et documentation du Design System"
year: "2026"
featured: true
image: "sportsee.png"
imageAlt: "Projet de conception d’interface SportSee"
---

## Contexte {#contexte}

Dans le cadre de ma formation Product Designer chez OpenClassrooms, j’ai conçu l’interface de SportSee, une application de suivi d’activité sportive. La mission consistait à passer d’une structure fonctionnelle à des maquettes haute fidélité, puis à documenter un Design System réutilisable.

Le périmètre couvre trois écrans : connexion, dashboard et profil, déclinés sur ordinateur, tablette et mobile. Il s’agit d’un projet de conception, sans application développée ou mise en production à ce stade.

## Problème {#probleme}

Comment rendre les performances sportives faciles à comprendre, tout en conservant une interface motivante et cohérente sur plusieurs formats ? L’enjeu était de hiérarchiser les données essentielles et de permettre une lecture plus détaillée sans surcharger le dashboard.

## Mon rôle {#role}

J’ai analysé le brief, les parcours utilisateurs et les wireframes annotés, réalisé le mini-benchmark et le moodboard, défini les fondations visuelles, construit les composants Figma et adapté les maquettes aux trois formats. J’ai également effectué les contrôles de conception et documenté le système dans Zeroheight.

## Démarche {#demarche}

### Comparer pour choisir

J’ai étudié Strava, Komoot et Fitbit pour comparer la présentation des objectifs, la hiérarchie des données et la lecture de la progression. J’ai retenu des chiffres prioritaires bien identifiés, des graphiques simples et une motivation mesurée. Les classements sociaux, la cartographie et les scores médicaux sortaient du périmètre du projet.

### Définir une direction graphique

Le moodboard associe une identité sportive à des surfaces claires et aérées. Le rouge sert d’accent pour les actions et les informations importantes. Manrope donne du caractère aux titres et aux données, tandis qu’Inter accompagne les textes d’interface.

### Construire et appliquer le système

J’ai traduit cette direction en couleurs, typographies, espacements et composants réutilisables. Les wireframes ont servi de base à la structure ; Figma Make m’a aidé à explorer une direction visuelle, ensuite adaptée manuellement au Design System et aux contraintes responsive. Les maquettes finales constituent le livrable de référence.

## Décisions & arbitrages {#decisions}

### Hiérarchiser avant de détailler

La connexion concentre l’attention sur l’identification. Le dashboard présente d’abord les indicateurs clés, puis les graphiques pour approfondir la lecture. Le profil regroupe les informations personnelles et les statistiques globales avec les mêmes repères visuels.

### Réorganiser selon le format

Les grilles passent de 12 colonnes sur ordinateur à 8 sur tablette et 4 sur mobile. La navigation devient plus compacte, les cartes se réorganisent et les graphiques s’empilent. Les espacements et les titres s’adaptent à la largeur disponible, en conservant la priorité des informations.

### Centraliser les styles

Les variables Figma portent les valeurs partagées. Modifier la couleur principale commence par la variable concernée : les composants et les instances liés héritent de sa nouvelle valeur. Les boutons, champs, éléments de navigation et cartes peuvent ensuite être réutilisés pour composer de nouveaux écrans.

## Accessibilité et contrôle qualité {#accessibilite}

J’ai contrôlé les principales associations de couleurs pour préserver la lisibilité. Les composants prévoient des focus visibles, des labels de formulaire et des erreurs qui ne reposent pas uniquement sur la couleur. Sur tablette et mobile, les principales cibles tactiles mesurent au moins 44 pixels.

Les graphiques associent couleurs, titres, unités et informations textuelles. J’ai également vérifié les neuf maquettes pour repérer les débordements, les problèmes d’espacement et les incohérences entre composants.

Ces contrôles portent sur la conception. La navigation au clavier, les technologies d’assistance et le comportement réel devront être vérifiés lors du développement ; ils ne constituent pas une validation de l’accessibilité d’une application en production.

## Résultats et livrables {#resultats}

Le projet aboutit à un mini-benchmark, un moodboard, des fondations visuelles, des composants Figma et neuf maquettes haute fidélité. Un prototype relie les écrans et permet d’explorer la navigation.

La documentation Zeroheight rassemble le démarrage, les fondations (couleurs, typographies, espacements, tokens et iconographie) ainsi que les usages, variantes et bonnes pratiques des composants. Elle accompagne le fichier Figma pour faciliter la prise en main du système.

Aucun gain d’usage n’a été mesuré auprès d’utilisateurs à ce stade. Une prochaine étape serait de tester les parcours et la compréhension des données avant l’implémentation.

## Apprentissages {#apprentissages}

Ce projet m’a permis de relier une direction graphique à des règles concrètes et réutilisables. En tant que développeur web, cette démarche renforce mon autonomie pour concevoir mes propres interfaces et préparer leur implémentation avec des composants et des valeurs partagés.

J’ai aussi appris à distinguer une exploration visuelle d’un livrable final : une proposition issue de Figma Make doit être adaptée, structurée et contrôlée pour s’intégrer au produit.

## Explorer le projet {#ressources}

- [Consulter les maquettes et le prototype dans Figma](https://www.figma.com/design/7oIV2vJHunlZkKaxUFk9iv/Sportsee-wireframes-annot%C3%A9s--Copy-?node-id=0-1)
- [Explorer le Design System dans Zeroheight](https://zeroheight.com/09f44adcf)
