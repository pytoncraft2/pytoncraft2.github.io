---
title: "Resident Streamer"
order: 3
meta: "Projet Epitech · Phaser 3, TypeScript, Colyseus"
tags: ["2022", "Projet académique", "Développement web", "Temps réel"]
description: "Jeu de speedrun coopératif en 2D pour 2 à 4 joueurs, développé en binôme avec une architecture multijoueur."
stack: ["Phaser 3", "TypeScript", "Colyseus", "Node.js"]
role: "Chef de projet et développeur, en binôme avec un designer de personnages"
year: "2022"
featured: true
image: "resident-streamer.jpg"
imageAlt: "Capture du jeu Resident Streamer : salle futuriste avec personnages et interface de jeu"
---

## Contexte

Resident Streamer est un projet libre réalisé en binôme durant ma formation Epitech. Nous avons choisi de concevoir un jeu vidéo coopératif jouable dans le navigateur, avec pour objectif de rapprocher streamers et viewers autour de défis de speedrun.

Le concept : une équipe de 2 à 4 joueurs traverse plusieurs pièces et affronte des boss pour terminer le parcours le plus rapidement possible. Quatre personnages aux capacités différentes favorisent la coopération.

## Problème

Comment proposer une expérience multijoueur accessible depuis un navigateur, sans installation ni création de compte, tout en synchronisant les actions des joueurs et la logique du jeu ?

Le cahier des charges prévoyait également une approche communautaire : des parties à rejoindre par un lien et un classement fondé sur le temps de réalisation.

## Mon rôle

J'ai assuré le rôle de chef de projet et de développeur au sein d'un binôme. Mon partenaire intervenait principalement sur les graphismes, les personnages et les animations. Nous avons collaboré sur la conception et l'évolution du jeu.

## Démarche

### Définir le concept et ses utilisateurs

Nous avons formalisé le besoin dans un cahier des charges et recueilli des retours de streamers et de viewers sur l'intérêt d'un jeu communautaire. Cette étape a orienté le concept vers des sessions courtes, coopératives et accessibles.

### Construire le jeu et le multijoueur

Le projet utilise Phaser 3 pour le gameplay 2D et les interactions, TypeScript pour le code applicatif et Colyseus avec Node.js pour les sessions multijoueurs et les échanges en temps réel. Phaser Editor 2D a également été utilisé pour la création des scènes.

## Décisions techniques

### Choisir une architecture adaptée au jeu en ligne

Nous avons retenu une architecture client-serveur pour gérer les parties et la synchronisation entre joueurs. Le cahier des charges envisageait une logique de jeu côté serveur afin de limiter la confiance accordée au client.

### Concevoir des personnages complémentaires

Le jeu met en scène quatre profils : combat rapproché, attaque à distance, pièges et soin. Cette répartition permet de varier les interactions et d'encourager la coopération.

## Réalisation et limites

Le dépôt contient le code du jeu, des captures d'écran, des vidéos de démonstration et des instructions pour lancer séparément le serveur et le client. Il constitue une réalisation technique concrète au-delà du seul cahier des charges.

Le README mentionne toutefois des éléments restant à finaliser, notamment le boss final, certaines optimisations et la personnalisation des pseudos et noms d'équipe. Je présente donc ce projet comme un prototype jouable et non comme un jeu commercial finalisé.

## Apprentissages

Ce projet m'a permis de travailler sur une application interactive temps réel différente d'un site web classique, en articulant logique de jeu, synchronisation réseau et interface. Le travail en binôme a également demandé de coordonner développement et création graphique.

## Explorer le projet

- [Consulter le code source sur GitHub](https://github.com/pytoncraft2/resident-streamer)
- [Voir une démonstration vidéo](https://youtu.be/2GCkF1rgLWI)
- [Voir une deuxième démonstration](https://youtu.be/VZUTvlFXNag)
