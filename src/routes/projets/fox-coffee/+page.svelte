<script lang="ts">
	import CaseStudyLayout from '$lib/components/CaseStudyLayout.svelte';
	import CaseStudySection from '$lib/components/CaseStudySection.svelte';
	import { getProject } from '$lib/data/projects';

	const project = getProject('fox-coffee');
</script>

{#if project}
	<CaseStudyLayout {project}>
		<CaseStudySection title="Contexte" id="contexte">
			<p>Dans le cadre d’un projet de formation en Product Design chez OpenClassrooms, j’ai étudié l’expérience des clients de Fox Coffee, un café situé à Metz. Avec l’accord de l’établissement, j’ai mené une recherche sur place pour identifier des points forts, des difficultés et des possibilités d’amélioration.</p>
			<p>La mission portait sur un service physique, et non sur la refonte d’une application. Les recommandations constituent des pistes à évaluer, pas des changements déjà déployés.</p>
		</CaseStudySection>
		<CaseStudySection title="Problème" id="probleme">
			<p>L’accueil et l’ambiance du café sont appréciés, mais certaines étapes peuvent demander des repères supplémentaires : comprendre les offres, circuler autour du comptoir ou choisir les éléments du petit-déjeuner lorsque l’espace est occupé.</p>
			<p>La question retenue pour guider l’idéation était : « Comment pourrait-on rendre l’expérience chez Fox Coffee plus simple et agréable pour les personnes qui viennent pour la première fois ? »</p>
		</CaseStudySection>
		<CaseStudySection title="Mon rôle" id="role">
			<p>J’ai préparé le protocole de recherche et le guide d’entretien, réalisé les observations et les entretiens, synthétisé les enseignements, construit deux personas et leurs parcours actuels, puis préparé et animé un atelier d’idéation à distance.</p>
		</CaseStudySection>
		<CaseStudySection title="Démarche" id="demarche">
			<h4>Observer et écouter</h4>
			<p>Le 27 octobre 2026, j’ai documenté huit situations clients et réalisé cinq entretiens qualitatifs volontaires. Les observations portaient notamment sur l’arrivée, la commande, l’attente, les déplacements et l’utilisation des espaces.</p>
			<h4>Analyser les parcours</h4>
			<p>J’ai rapproché les comportements observés et les témoignages pour dégager des besoins, puis représenté deux profils synthétiques et deux parcours « as is ». Camille, cliente fidèle, recherche le calme et un accueil familier, tandis que Thomas, nouveau visiteur, doit découvrir les repères du service. Ces personas sont des synthèses fictives, et non des portraits individuels.</p>
			<h4>Faire émerger des solutions</h4>
			<p>J’ai animé un atelier de 40 minutes sur Miro avec trois participants, dont une personne précédemment interviewée. Après une phase individuelle, les idées ont été discutées, regroupées et priorisées collectivement.</p>
		</CaseStudySection>
		<CaseStudySection title="Décisions & arbitrages" id="decisions">
			<h4>Concentrer la recherche sur les nouveaux visiteurs</h4>
			<p>Les habitués interrogés connaissaient déjà le fonctionnement du lieu. J’ai donc privilégié une question ouverte sur la simplicité de la première visite, sans imposer de solution dès le départ. Cette orientation reste exploratoire : davantage d’entretiens avec de nouveaux visiteurs seraient nécessaires pour la confirmer.</p>
			<h4>Privilégier des améliorations proportionnées</h4>
			<p>Des propositions d’ajout de tables ou de nouvelles salles ont été discutées, mais leur coût et leurs implications sur l’organisation semblaient plus importants. Le groupe a retenu trois pistes à approfondir.</p>
			<h4>Ne pas surinterpréter le vote</h4>
			<p>La priorisation a été en partie réalisée manuellement. J’ai conservé l’ordre des trois idées retenues, sans présenter les nombres de votes comme des mesures précises.</p>
		</CaseStudySection>
		<CaseStudySection title="Recommandations" id="solution">
			<h4>1. Clarifier la circulation</h4>
			<p>Tester des cordons modulables associés à des flèches au sol pour rendre le cheminement plus lisible pendant les périodes d’affluence, sous réserve de préserver les accès, la sécurité et le confort de déplacement.</p>
			<h4>2. Rendre le menu plus accessible</h4>
			<p>Étudier un QR code donnant accès à un menu lisible et agrandissable sur téléphone, sans remplacer les supports physiques existants. L’accessibilité du menu numérique resterait à vérifier.</p>
			<h4>3. Repenser l’espace petit-déjeuner</h4>
			<p>Explorer un buffet plus confortable, permettant de choisir les produits et de poser son plateau sans perturber la circulation.</p>
		</CaseStudySection>
		<CaseStudySection title="Résultats et limites" id="resultats">
			<p>Le projet a abouti à une synthèse de recherche, deux personas, deux parcours utilisateurs « as-is », un atelier d’idéation et un plan de conception UX/UI sur 12 mois. Ce dernier prévoit l’étude de faisabilité, le prototypage, les tests utilisateurs et une éventuelle mise en œuvre. L’enveloppe de 100 000 € est une hypothèse pédagogique, pas un budget réel de Fox Coffee.</p>
			<p>Il s’agit d’une recherche qualitative menée sur une seule matinée, avec cinq entretiens. L’atelier a réuni trois participants au lieu des quatre prévus. Les recommandations n’ont pas encore été testées ou installées : les objectifs et indicateurs proposés restent hypothétiques, sans gain mesuré à ce stade.</p>
		</CaseStudySection>
		<CaseStudySection title="Apprentissages" id="apprentissages">
			<p>Ce projet m’a permis de mener une démarche UX complète sur un service du quotidien, en reliant observation, entretiens, analyse et idéation. Il m’a aussi appris à distinguer une difficulté observée, une hypothèse de solution et une amélioration effectivement démontrée.</p>
			<p>Une suite pertinente serait de confronter les propositions aux contraintes du personnel, de l’espace, du budget et de l’accessibilité, puis de les tester à petite échelle avant tout aménagement définitif.</p>
			<p><a href="https://miro.com/app/board/uXjVEUCdxGE=/?share_link_id=78960370666" target="_blank" rel="noopener noreferrer">Consulter le tableau d’idéation Miro</a></p>
		</CaseStudySection>
	</CaseStudyLayout>
{/if}
