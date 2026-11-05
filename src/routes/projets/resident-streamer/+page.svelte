<script lang="ts">
	import CaseStudyLayout from '#lib/components/CaseStudyLayout.svelte';
	import CaseStudySection from '#lib/components/CaseStudySection.svelte';
	import { getProject } from '#lib/data/projects.js';

	const project = getProject('resident-streamer');
</script>

{#if project}
	<CaseStudyLayout {project}>
		<CaseStudySection title="Contexte" id="contexte">
			<p>Resident Streamer est un projet libre réalisé en binôme durant ma formation Epitech. Nous avons choisi de concevoir un jeu vidéo coopératif jouable dans le navigateur, avec pour objectif de rapprocher streamers et viewers autour de défis de speedrun.</p>
			<p>Le concept : une équipe de 2 à 4 joueurs traverse plusieurs pièces et affronte des boss pour terminer le parcours le plus rapidement possible. Quatre personnages aux capacités différentes favorisent la coopération.</p>
		</CaseStudySection>

		<CaseStudySection title="Problème" id="probleme">
			<p>Comment proposer une expérience multijoueur accessible depuis un navigateur, sans installation ni création de compte, tout en synchronisant les actions des joueurs et la logique du jeu ?</p>
			<p>Le cahier des charges prévoyait également une approche communautaire : des parties à rejoindre par un lien et un classement fondé sur le temps de réalisation.</p>
		</CaseStudySection>

		<CaseStudySection title="Mon rôle" id="role">
			<p>J'ai assuré le rôle de chef de projet et de développeur au sein d'un binôme. Mon partenaire intervenait principalement sur les graphismes, les personnages et les animations. Nous avons collaboré sur la conception et l'évolution du jeu.</p>
		</CaseStudySection>

		<CaseStudySection title="Démarche" id="demarche">
			<h4>Définir le concept et ses utilisateurs</h4>
			<p>Nous avons formalisé le besoin dans un cahier des charges et recueilli des retours de streamers et de viewers sur l'intérêt d'un jeu communautaire. Cette étape a orienté le concept vers des sessions courtes, coopératives et accessibles.</p>
			<h4>Construire le jeu et le multijoueur</h4>
			<p>Le projet utilise Phaser 3 pour le gameplay 2D et les interactions, TypeScript pour le code applicatif et Colyseus avec Node.js pour les sessions multijoueurs et les échanges en temps réel. Phaser Editor 2D a également été utilisé pour la création des scènes.</p>
		</CaseStudySection>

		<CaseStudySection title="Décisions techniques" id="decisions">
			<h4>Choisir une architecture adaptée au jeu en ligne</h4>
			<p>Nous avons retenu une architecture client-serveur pour gérer les parties et la synchronisation entre joueurs. Le cahier des charges envisageait une logique de jeu côté serveur afin de limiter la confiance accordée au client.</p>
			<h4>Concevoir des personnages complémentaires</h4>
			<p>Le jeu met en scène quatre profils : combat rapproché, attaque à distance, pièges et soin. Cette répartition permet de varier les interactions et d'encourager la coopération.</p>
		</CaseStudySection>

		<CaseStudySection title="Réalisation et limites" id="resultats">
			<p>Le dépôt contient le code du jeu, des captures d'écran, des vidéos de démonstration et des instructions pour lancer séparément le serveur et le client. Il constitue une réalisation technique concrète au-delà du seul cahier des charges.</p>
			<p>Le README mentionne toutefois des éléments restant à finaliser, notamment le boss final, certaines optimisations et la personnalisation des pseudos et noms d'équipe. Je présente donc ce projet comme un prototype jouable et non comme un jeu commercial finalisé.</p>
		</CaseStudySection>

		<CaseStudySection title="Apprentissages" id="apprentissages">
			<p>Ce projet m'a permis de travailler sur une application interactive temps réel différente d'un site web classique, en articulant logique de jeu, synchronisation réseau et interface. Le travail en binôme a également demandé de coordonner développement et création graphique.</p>
		</CaseStudySection>

		<CaseStudySection title="Explorer le projet" id="ressources">
			<ul>
				<li><a href="https://github.com/pytoncraft2/resident-streamer" target="_blank" rel="noopener noreferrer">Consulter le code source sur GitHub</a></li>
				<li><a href="https://youtu.be/2GCkF1rgLWI" target="_blank" rel="noopener noreferrer">Voir une démonstration vidéo</a></li>
				<li><a href="https://youtu.be/VZUTvlFXNag" target="_blank" rel="noopener noreferrer">Voir une deuxième démonstration</a></li>
			</ul>
		</CaseStudySection>
	</CaseStudyLayout>
{/if}
