<script lang="ts">
	import CaseStudyLayout from '$lib/components/CaseStudyLayout.svelte';
	import CaseStudySection from '$lib/components/CaseStudySection.svelte';
	import { getProject } from '$lib/data/projects';

	const project = getProject('vroum');
</script>

{#if project}
	<CaseStudyLayout {project}>
		<CaseStudySection title="Contexte" id="contexte">
			<p>
				Vroum est un outil collaboratif de covoiturage développé au sein de l'association LaToileScoute. Il aide les organisateurs scouts à répartir participants, véhicules et matériel pour les trajets aller et retour d'un événement.
			</p>
			<p>
				Le produit est utilisé en conditions réelles et évolue depuis 2023 en fonction des usages et des besoins rencontrés sur différents événements.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Problème" id="probleme">
			<p>
				La complexité d'un covoiturage varie fortement selon la taille et l'organisation d'un événement. Lors du rassemblement Clameurs, le grand nombre de véhicules a montré les limites d'une simple liste : l'information devenait difficile à parcourir et à organiser.
			</p>
			<p>
				D'autres événements ont ensuite fait apparaître des besoins plus complexes, avec des véhicules venant de différentes villes et circulant sur plusieurs jours. Il fallait prendre en charge ces usages sans complexifier inutilement les covoiturages plus simples.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Mon rôle" id="role">
			<p>
				Je suis le principal contributeur technique de Vroum. Je conçois et développe la majorité des évolutions du produit, du front-end SvelteKit au backend FastAPI, tout en participant aux choix produit et UX avec l'équipe de LaToileScoute.
			</p>
			<p>
				Je peux proposer une évolution, en concevoir et tester une première solution, puis la présenter à l'équipe. Les choix importants sont discutés collectivement avant validation et déploiement en production.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Démarche" id="demarche">
			<p>
				Vroum évolue de manière itérative à partir de sondages, de retours directs des utilisateurs, de bugs constatés et de propositions de l'équipe.
			</p>
			<p>
				Les besoins sont discutés collectivement et les solutions peuvent être pré-testées avant d'être retenues. L'objectif n'est pas d'ajouter systématiquement chaque fonctionnalité demandée, mais de trouver une réponse adaptée au besoin, à l'usage et à la maintenabilité du projet.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Décisions & arbitrages" id="decisions">
		<h4>Faire évoluer Vroum vers le multi-trajets</h4>
		<p>
			Lors du rassemblement Clameurs, le nombre important de véhicules rendait la liste difficile à parcourir. J'ai d'abord conçu une évolution permettant d'associer lieux et dates aux participants et véhicules sous forme de tags filtrables.
		</p>
		<p>
			Un événement ultérieur réunissant à Paris des véhicules venant de toute la France sur plusieurs jours a montré les limites de cette première réponse. J'ai alors conçu un mode multi-trajets avec notamment des regroupements par ville ou par date et une interface adaptée à cette complexité.
		</p>

		<p>
			La solution a été discutée avec l'équipe avant son déploiement, puis ajustée en fonction des usages.
		</p>
		<h4>Renoncer aux notifications push</h4>
		<p>
			Pour éviter aux organisateurs de revenir régulièrement vérifier les changements d'un covoiturage, j'ai proposé d'ajouter des notifications push.
		</p>
		<p>
			Après discussion avec l'équipe et expérimentation d'une première solution, les différences entre iOS et Android, les autorisations nécessaires et la complexité de maintenance nous ont semblé disproportionnées par rapport au besoin.
		</p>
		<p>
			Nous avons donc renoncé aux notifications push au profit d'e-mails ciblés lors des changements importants. Cette solution plus simple répondait au besoin sans introduire une infrastructure supplémentaire difficile à maintenir.
		</p>
		<h4>
			Migrer Flask vers FastAPI
		</h4>
		<p>
			J'ai proposé de remplacer le backend Flask par FastAPI afin d'améliorer les performances et de simplifier la maintenance. Après discussion et vote au sein de l'équipe, la migration a été validée et je l'ai mise en œuvre.
		</p>
		<p>
			FastAPI permettait notamment d'utiliser les WebSockets nativement et de supprimer Socket.IO côté client et serveur. La migration a également permis de réduire les dépendances backend de 26 à 8, un point important pour la pérennité d'un projet associatif maintenu sur la durée.
		</p>
		
		</CaseStudySection>

		<CaseStudySection title="Solution" id="solution">
		<p>
			Vroum repose aujourd'hui sur SvelteKit, FastAPI et PostgreSQL. L'application permet d'organiser participants, véhicules et matériel pour des covoiturages simples comme pour des événements impliquant plusieurs villes ou dates.
		</p>
		<p>
			Au fil des évolutions, l'interface a également été adaptée aux usages mobiles et à l'accessibilité, avec notamment une navigation au clavier et au lecteur d'écran, une meilleure gestion du focus et des interactions adaptées aux petits écrans.
		</p>
		</CaseStudySection>

		<CaseStudySection title="Résultats" id="resultats">
		<p>
			Vroum est utilisé en production pour organiser des covoiturages scouts et a dépassé 90 000 visites en 2025.
		</p>
		<p>
			Les retours d'utilisation ont directement alimenté plusieurs évolutions du produit, notamment le multi-trajets et les notifications par e-mail. Le produit continue d'évoluer à partir de situations rencontrées sur des événements réels.
		</p>
		</CaseStudySection>

		<CaseStudySection title="Apprentissages" id="apprentissages">
		<p>
			Vroum m'a appris à faire évoluer un produit dans la durée plutôt qu'à chercher une solution définitive dès la première version. Les usages réels font régulièrement apparaître des besoins difficiles à anticiper.
		</p>
		<p>
			Le projet m'a également appris qu'une bonne décision peut être un renoncement : la solution techniquement la plus ambitieuse n'est pas nécessairement celle qui répond le mieux au besoin ou aux contraintes de maintenance.
		</p>
		</CaseStudySection>
	</CaseStudyLayout>
{:else}
	<p>Projet introuvable. Vérifiez le slug <code>vroum</code> dans <code>projects.ts</code>.</p>
{/if}
