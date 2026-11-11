---
title: "EasySAV"
order: 2
meta: "Startup · Symfony, Twig, EasyAdmin"
tags: ["2021–2025", "Expérience pro", "Développement web"]
description: "Formulaires métiers et interface d’administration."
stack: ["Symfony", "Twig", "EasyAdmin"]
role: "Développement web"
year: "2020-2025"
featured: true
image: "easysav.png"
imageAlt: "Interface de l’outil EasySAV"
---

## Contexte

EasySAV est une startup qui développe des outils métier pour les professionnels de la maintenance. Pendant mon alternance, j’ai travaillé au sein de l’équipe web sur une application utilisée notamment pour produire des attestations d’entretien.

## Problème

Les attestations sont des formulaires métier longs, avec de nombreuses informations techniques à renseigner sur le terrain. La difficulté était de réduire les saisies répétitives, les oublis et les erreurs tout en respectant les contraintes réglementaires et le fonctionnement existant de l’application.

## Mon rôle

Mon rôle était principalement technique : intégrer les évolutions dans l’application existante et proposer des solutions adaptées aux contraintes métier, en collaboration avec l’équipe, notamment l’UX designer lorsque les écrans étaient maquettés.

Je suis notamment intervenu sur la refactorisation du code et du CSS, la refonte de l’attestation d’entretien, l’amélioration de la recherche, le mode brouillon, le préremplissage et l’ajout de nouveaux types d’attestations.

## Démarche

Les besoins partaient de cas métier concrets remontés par l’équipe et les utilisateurs. Pour chaque évolution, il fallait comprendre le fonctionnement attendu, identifier ce qui pouvait être automatisé ou simplifié, puis intégrer la solution sans casser les attestations déjà en production.

## Décisions importantes

- **Réduire la saisie répétitive :** mettre en place du préremplissage pour réutiliser les informations déjà connues et accélérer la création d’une attestation.
- **Permettre de reprendre un travail interrompu :** ajouter un mode brouillon afin que l’utilisateur n’ait pas à finaliser l’ensemble du formulaire en une seule session.
- **Exploiter les équipements présents sur le terrain :** permettre le préremplissage via QR code, notamment pour les appareils compatibles comme ceux de Testo.
- **Améliorer la recherche sans refondre tout le socle :** intégrer Fuse.js pour rendre la recherche plus tolérante et plus efficace dans l’interface existante.

## Solution

Les évolutions ont été intégrées dans le socle Symfony / Twig / EasyAdmin afin de rester cohérent avec le produit existant. Les écrans d’attestation ont été structurés en étapes et en blocs métier : informations sur le modèle, points de contrôle, mesures et données techniques.

Le parcours intègre le mode brouillon, le préremplissage et le scan de QR code lorsque les données sont disponibles.

## Résultats

Ces évolutions ont enrichi un outil métier déjà utilisé en production en diminuant le nombre d’actions nécessaires pour certaines tâches et en sécurisant davantage la saisie. Mon rapport d’alternance ne contient pas de métriques quantitatives permettant d’attribuer un gain précis, je préfère donc retenir ici les améliorations fonctionnelles réellement livrées plutôt que d’inventer un impact chiffré.

## Apprentissages

EasySAV m’a appris qu’une amélioration utile n’est pas forcément une refonte complète.

Cette expérience m’a aussi appris à mieux traduire des contraintes métier en solutions techniques et à collaborer avec des profils design et métier sans confondre les rôles de chacun.
