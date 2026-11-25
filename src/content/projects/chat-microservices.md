---
title: "Chat en microservices"
order: 16
meta: "Web@cadémie · Lumen, Express, Slim + Guzzle"
tags: ["2021", "Projet académique", "Architecture"]
description: "Application de chat dont le back-end est découpé en services indépendants, reliés par une passerelle qui relaie les requêtes de l’interface."
summary: >-
  Ce chat repose sur plusieurs services : une API PHP pour les comptes et les messages, une API Node.js pour les salons, et une passerelle qui reçoit toutes les requêtes de l’interface.
  J’ai réalisé seul l’ensemble du projet, des trois services à l’interface React.
stack: ["PHP / Lumen", "Node.js / Express", "Slim + Guzzle", "JWT", "MySQL", "MongoDB", "React"]
role: "Conception de l’architecture et développement de tous les services, seul"
year: "2021"
featured: false
image: "microservices.webp"
imageAlt: "Schéma de principe : l’interface React envoie ses requêtes avec un jeton JWT à une passerelle Slim + Guzzle, qui transmet le jeton et appelle l’API Lumen (comptes et messages, MySQL) ou l’API Express (salons, MongoDB)"
---

## Contexte

Ce projet a été réalisé seul en décembre 2021, pendant la Web@cadémie d’Epitech, dans un module consacré aux microservices. Il s’agissait de construire une application de chat dont le back-end n’est pas un bloc unique, mais un ensemble de services indépendants qui communiquent entre eux.

## Problème

Dans une application classique, un seul serveur gère les comptes, les messages et les salons, avec une seule base de données. Découper ce serveur en services pose de nouvelles questions : comment l’interface sait à qui s’adresser, comment un service reconnaît un utilisateur connecté ailleurs, et comment chaque service garde ses propres données sans dépendre des autres.

## Mon rôle

J’ai réalisé tout le projet : les 80 commits du dépôt sont les miens, du 7 au 19 décembre 2021. J’ai conçu le découpage en services, développé les deux API et la passerelle, puis l’interface de chat en React qui les utilise.

## Architecture

L’application repose sur trois services, chacun lancé séparément sur son propre port :

- **API Lumen (PHP)** : inscription, connexion et gestion des comptes, ainsi que les messages, enregistrés dans une base MySQL. La connexion renvoie un jeton JWT.
- **API Express (Node.js)** : création, affichage, renommage et suppression des salons de discussion, enregistrés dans MongoDB avec Mongoose.
- **Passerelle (PHP, Slim et Guzzle)** : le seul point d’entrée de l’interface. Elle reçoit chaque requête et la relaie au service concerné avec le client HTTP Guzzle.

Chaque service garde sa propre base de données : l’API des salons ne lit jamais la base des comptes, et inversement.

## Décisions

### Une passerelle comme seul point d’entrée

L’interface React ne connaît qu’une adresse, celle de la passerelle. C’est elle qui sait quel service traite les messages et lequel traite les salons. L’interface n’a donc pas à changer si un service est déplacé, et les règles d’accès (en-têtes CORS notamment) sont gérées à un seul endroit.

### Identifier l’utilisateur auprès de l’API des comptes

Les routes des messages et du compte exigent le jeton JWT, que la passerelle transmet à l’API Lumen. Pour plusieurs d’entre elles, la passerelle interroge d’abord l’API Lumen (route `me`) pour savoir quel utilisateur est connecté : elle peut ainsi afficher ses propres messages, lui attribuer ceux qu’il écrit, et modifier ou supprimer son compte sans que l’interface ait à envoyer son identifiant.

### Deux technologies, deux bases

Les comptes et les messages sont dans une base relationnelle MySQL gérée par Lumen. Les salons sont dans MongoDB, gérée par Express. Ce découpage m’a obligé à faire communiquer des services écrits dans deux langages différents, uniquement par HTTP.

## Résultat et limites

À la fin du projet, l’interface React permettait de s’inscrire, de se connecter, de gérer les salons et d’écrire, modifier ou supprimer ses messages, en passant uniquement par la passerelle.

Il s’agit cependant d’un projet de formation, avec des limites que je ferais autrement aujourd’hui :

- les routes des salons ne demandent pas de jeton, contrairement à celles des messages et du compte
- la modification et la suppression d’un message vérifient que l’utilisateur est connecté, mais pas qu’il en est l’auteur
- les adresses et les ports des services sont écrits dans le code, et une clé de signature y est restée en clair
- certaines routes de l’API Express reçoivent leurs données dans l’adresse plutôt que dans le corps de la requête, et des routes de test sont restées en place
- il n’y a ni tests automatisés, ni documentation, ni fichier pour lancer les trois services ensemble
- le code de l’interface React était dans un dépôt séparé : le dépôt du projet n’en garde qu’une référence, ce qui explique l’absence de captures sur cette page.

## Apprentissages

Ce projet m’a fait découvrir ce qu’implique une architecture en microservices : chaque fonctionnalité traverse plusieurs services, et l’authentification doit être pensée une seule fois pour tous. Il m’a aussi montré que la difficulté n’est pas seulement d’écrire chaque service, mais de les faire fonctionner ensemble : configuration, lancement et vérification des appels entre eux.
