<script lang="ts">
	import CaseStudyLayout from '$lib/components/CaseStudyLayout.svelte';
	import CaseStudySection from '$lib/components/CaseStudySection.svelte';
	import { getProject } from '$lib/data/projects';

	const project = getProject('easysav');
</script>

{#if project}
	<CaseStudyLayout {project}>
		<CaseStudySection title="Contexte" id="contexte">
			<p>
				EasySAV est une startup qui développe des outils métier pour les professionnels de la
				maintenance. Pendant mon alternance, j’ai travaillé au sein de l’équipe web sur une
				application Symfony / Twig / EasyAdmin utilisée notamment pour produire des attestations
				d’entretien.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Problème" id="probleme">
			<p>
				Les attestations sont des formulaires métier longs, avec de nombreuses informations
				techniques à renseigner sur le terrain. La difficulté était de réduire les saisies répétitives,
				les oublis et les erreurs tout en respectant les contraintes réglementaires et le
				fonctionnement existant de l’application.
			</p>
			<p>
				L’enjeu n’était donc pas de refaire entièrement l’interface, mais d’améliorer progressivement
				les parcours les plus coûteux pour les utilisateurs et de rendre l’outil plus efficace dans
				un contexte professionnel.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Mon rôle" id="role">
			<p>
				Mon rôle était principalement technique : intégrer et développer les évolutions dans
				l’application existante, proposer des solutions adaptées aux contraintes métier et collaborer
				avec l’équipe, notamment l’UX designer lorsque les écrans étaient maquettés en amont.
			</p>
			<p>
				Je suis notamment intervenu sur la refactorisation du code et du CSS, la refonte de
				l’attestation d’entretien, l’amélioration de la recherche, le mode brouillon, le
				préremplissage et l’ajout de nouveaux types d’attestations.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Démarche" id="demarche">
			<p>
				Les besoins partaient de cas métier concrets remontés par l’équipe et les utilisateurs. Pour
				chaque évolution, il fallait comprendre le fonctionnement attendu, identifier ce qui pouvait
				être automatisé ou simplifié, puis intégrer la solution sans casser les attestations déjà en
				production.
			</p>
			<p>
				Le travail s’est fait par itérations : factoriser l’existant lorsque nécessaire, ajouter une
				fonctionnalité ciblée, la confronter aux contraintes du formulaire et ajuster l’intégration.
				Cette approche était particulièrement importante sur des écrans très denses utilisés dans un
				contexte terrain.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Décisions importantes" id="decisions">
			<ul>
				<li>
					<strong>Réduire la saisie répétitive :</strong> mettre en place du préremplissage pour
					réutiliser les informations déjà connues et accélérer la création d’une attestation.
				</li>
				<li>
					<strong>Permettre de reprendre un travail interrompu :</strong> ajouter un mode brouillon afin
					que l’utilisateur n’ait pas à finaliser l’ensemble du formulaire en une seule session.
				</li>
				<li>
					<strong>Exploiter les équipements présents sur le terrain :</strong> permettre le
					préremplissage via QR code, notamment pour les appareils compatibles comme ceux de Testo.
				</li>
				<li>
					<strong>Améliorer la recherche sans refondre tout le socle :</strong> intégrer Fuse.js pour
					rendre la recherche plus tolérante et plus efficace dans l’interface existante.
				</li>
			</ul>
		</CaseStudySection>

		<CaseStudySection title="Solution" id="solution">
			<p>
				Les évolutions ont été intégrées directement dans le socle Symfony / Twig / EasyAdmin afin de
				rester cohérent avec le produit existant. Les écrans d’attestation ont été structurés en
				étapes et en blocs métier : informations sur le modèle, points de contrôle, mesures et
				données techniques.
			</p>
			<p>
				Le parcours inclut notamment un mode brouillon, des champs préremplis lorsque les données sont
				disponibles et la possibilité de scanner un QR code pour récupérer certaines informations au
				lieu de les saisir manuellement.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Résultats" id="resultats">
			<p>
				Ces évolutions ont enrichi un outil métier déjà utilisé en production en diminuant le nombre
				d’actions nécessaires pour certaines tâches et en sécurisant davantage la saisie. Mon rapport
				d’alternance ne contient pas de métriques quantitatives permettant d’attribuer un gain précis,
				je préfère donc retenir ici les améliorations fonctionnelles réellement livrées plutôt que
				d’inventer un impact chiffré.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Apprentissages" id="apprentissages">
			<p>
				EasySAV m’a appris qu’une amélioration produit utile n’est pas forcément une refonte complète.
				Dans un outil métier, une bonne solution peut être une automatisation discrète, un champ
				prérempli ou la possibilité de reprendre un formulaire plus tard.
			</p>
			<p>
				Cette expérience m’a aussi appris à mieux traduire des contraintes métier en solutions
				techniques et à collaborer avec des profils design et métier sans confondre les rôles de
				chacun.
			</p>
		</CaseStudySection>
	</CaseStudyLayout>
{:else}
	<p>Projet introuvable. Vérifiez le slug <code>easysav</code> dans <code>projects.ts</code>.</p>
{/if}
