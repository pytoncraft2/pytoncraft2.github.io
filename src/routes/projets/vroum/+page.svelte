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
				Vroum aide les organisateurs scouts à répartir participants, matériel et véhicules pour les
				trajets aller et retour d’un événement. Le projet est développé au sein de l’association
				LaToileScoute.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Problème" id="probleme">
			<p>
				Organiser un covoiturage de groupe devient vite complexe : plusieurs conducteurs, des
				places limitées, du matériel à transporter et des participants qui ne partent pas toujours
				du même lieu ou à la même date. L’enjeu était de rendre cette coordination lisible sans
				transformer l’outil en logiciel de planification lourd.
			</p>
			<p>
				L’usage majoritairement mobile renforçait cette contrainte : les informations essentielles
				devaient rester compréhensibles et manipulables sur un petit écran, y compris lorsque le
				nombre de participants ou de véhicules augmente.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Mon rôle" id="role">
			<p>
				J’interviens principalement comme développeur web, tout en participant aux décisions
				produit prises collectivement dans l’association. Je contribue à l’implémentation des
				fonctionnalités, aux évolutions d’interface, aux choix techniques et aux arbitrages avec les
				autres profils de l’équipe, notamment DevOps.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Démarche" id="demarche">
			<p>
				Le produit évolue de manière itérative à partir des usages réels. Les retours du sondage et
				des échanges avec les utilisateurs servent à identifier les irritants, puis à prioriser les
				corrections avec l’équipe.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Décisions importantes" id="decisions">
			<ul>
				<li>
					<strong>Adapter l’interface aux usages mobiles :</strong> simplifier la lecture des trajets,
					participants et véhicules afin de rendre les actions principales accessibles sur smartphone.
				</li>
				<li>
					<strong>Faire évoluer Vroum vers le multi-trajets :</strong> permettre plusieurs lieux et
					dates de départ pour un même événement, au lieu d’imposer un trajet unique à tout le groupe.
				</li>
				<li>
					<strong>Faire évoluer le socle technique :</strong> migrer progressivement vers FastAPI afin
					de disposer d’un backend plus adapté à l’évolution du projet tout en conservant SvelteKit
					pour l’interface.
				</li>
			</ul>
		</CaseStudySection>

		<CaseStudySection title="Solution" id="solution">
			<p>
				L’application s’appuie aujourd’hui sur SvelteKit côté interface, FastAPI côté backend et
				PostgreSQL pour les données. Elle permet de créer les trajets aller et retour, d’ajouter les
				participants, le matériel et les véhicules, puis de répartir les personnes dans les places
				disponibles.
			</p>
			<p>
				Le mode multi-trajets organise les départs par date et par ville : l’organisateur peut
				distinguer plusieurs départs vers un même camp, puis retrouver les véhicules correspondants
				sans perdre la vue d’ensemble.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Résultats" id="resultats">
			<p>
				Le sondage a permis d’identifier puis de corriger une grande partie des irritants remontés
				par les utilisateurs. Le projet a dépassé les 90 000 visites en 2025, ce qui confirme son
				usage à une échelle significative pour un outil associatif spécialisé.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Apprentissages" id="apprentissages">
			<p>
				Ce projet m’a surtout appris à faire évoluer un produit dans la durée plutôt qu’à livrer une
				interface figée.
			</p>
			<p>
				J’ai dû trouver un équilibre entre besoins utilisateurs, dette technique et simplicité de
				maintenance.
			</p>
		</CaseStudySection>
	</CaseStudyLayout>
{:else}
	<p>Projet introuvable. Vérifiez le slug <code>vroum</code> dans <code>projects.ts</code>.</p>
{/if}
