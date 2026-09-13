<script lang="ts">
	import CaseStudyLayout from '$lib/components/CaseStudyLayout.svelte';
	import CaseStudySection from '$lib/components/CaseStudySection.svelte';
	import { getProject } from '$lib/data/projects';

	const project = getProject('les-bambinets');
</script>

{#if project}
	<CaseStudyLayout {project}>
		<CaseStudySection title="Contexte" id="contexte">
			<p>
				Les Bambinets est un projet réalisé dans le cadre de ma formation Product Designer. L’objectif
				était de concevoir une application éducative autour de la langue des signes, puis de
				l’assembler dans un prototype Figma cohérent.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Problème" id="probleme">
			<p>
				Le produit doit permettre de découvrir et mémoriser des signes simples sans surcharger
				l’utilisateur. Le défi était donc de proposer une interface suffisamment ludique pour un
				univers lié à la petite enfance, tout en gardant une navigation claire, des contenus faciles à
				lire et une faible charge cognitive.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Mon rôle" id="role">
			<p>
				J’ai pris en charge la conception UI du projet. Cela couvre la direction visuelle, la
				conception des interfaces, le design system, le prototype interactif et la prise en compte de
				l’accessibilité.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Démarche" id="demarche">
			<p>
				J’ai commencé par organiser le parcours et les écrans dans FigJam, puis défini une direction
				visuelle adaptée au sujet. Le moodboard a servi de base pour la palette pastel, les
				typographies Baloo 2 et Nunito, l’iconographie Lucide et un style d’illustrations simple et
				accessible.
			</p>
			<p>
				Les écrans ont ensuite été assemblés dans un prototype Figma afin de vérifier la cohérence de
				la navigation entre les principales fonctionnalités.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Décisions importantes" id="decisions">
			<ul>
				<li>
					<strong>Limiter la charge cognitive :</strong> privilégier des écrans simples, des actions
					claires et une hiérarchie visuelle régulière plutôt que multiplier les informations.
				</li>
				<li>
					<strong>Construire à partir de composants :</strong> créer un design system avec variants et
					états afin de garder les écrans cohérents et de faciliter les évolutions du prototype.
				</li>
				<li>
					<strong>Prévoir l’accessibilité dès la conception :</strong> travailler les contrastes, les
					tailles de texte, les zones interactives et ne pas faire reposer une information uniquement
					sur la couleur.
				</li>
				<li>
					<strong>Prévoir deux thèmes :</strong> décliner l’interface en clair et sombre à partir des
					variables et modes Figma plutôt que maintenir deux designs séparés.
				</li>
			</ul>
		</CaseStudySection>

		<CaseStudySection title="Solution" id="solution">
			<p>
				Le prototype s’articule autour de quelques parcours simples : un accueil donnant accès aux
				fonctions principales, un glossaire pour découvrir les signes, une fiche détaillée avec vidéo,
				un quiz pour vérifier ses connaissances, ainsi que des favoris et une FAQ.
			</p>
			<p>
				La fiche d’un signe met la démonstration vidéo au centre de l’écran, tandis que le quiz reprend
				le même contenu sous forme de question à choix. Cette réutilisation permet de conserver un
				modèle mental cohérent entre consultation et apprentissage.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Résultats" id="resultats">
			<p>
				Le projet aboutit à un flow FigJam, une direction visuelle documentée, un style guide, un
				design system Figma et un prototype haute fidélité.
			</p>
			<p>
				Ce projet de formation n’a pas produit de métriques d’usage réelles ; je le présente donc
				comme une démonstration de ma capacité à passer d’une intention graphique à un système
				d’interface cohérent et prototypé.
			</p>
		</CaseStudySection>

		<CaseStudySection title="Apprentissages" id="apprentissages">
			<p>
				Les Bambinets m’a permis de mieux comprendre l’intérêt d’un design system comme outil de
				conception, et pas seulement comme documentation finale. Les variables, composants et variants
				permettent de prendre des décisions une fois puis de les propager dans tout le produit.
			</p>
			<p>
				Le projet m’a également donné une base plus solide pour relier design et développement : la
				structure des tokens et des composants peut ensuite être transposée en variables CSS et en
				composants Svelte, ce qui réduit l’écart entre la maquette et l’implémentation.
			</p>
		</CaseStudySection>
	</CaseStudyLayout>
{:else}
	<p>Projet introuvable. Vérifiez le slug <code>les-bambinets</code> dans <code>projects.ts</code>.</p>
{/if}
