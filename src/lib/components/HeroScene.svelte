<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { Vehicle } from '#lib/hero-runner.js';
	import { on } from 'svelte/events';
	import Button from './Button.svelte';

	type Star = {
		x: number;
		y: number;
		r: number;
		opacity: number;
		twinkle: boolean;
		duration: number;
		delay: number;
	};

	/** Générateur pseudo-aléatoire déterministe : même ciel au pré-rendu et à l’hydratation. */
	function seeded(seed: number) {
		let value = seed;
		return () => {
			value = (value * 16807) % 2147483647;
			return (value - 1) / 2147483646;
		};
	}

	function round(value: number) {
		return Math.round(value * 10) / 10;
	}

	function createStars(count: number): Star[] {
		const random = seeded(11);
		const result: Star[] = [];

		while (result.length < count) {
			const x = random() * 1440;
			const y = random() * 420;
			// Pas d’étoile derrière le texte du hero (zone gauche, sous l’en-tête).
			if (x < 900 && y > 30 && y < 380) {
				continue;
			}

			result.push({
				x: round(x),
				y: round(y),
				r: round(0.6 + random() * 1.2),
				opacity: round(0.45 + random() * 0.5),
				twinkle: result.length % 3 === 0,
				// Un seul scintillement, terminé avant 5 s (au plus 1,4 + 3,5 s).
				duration: round(2 + random() * 1.5),
				delay: round(random() * 1.4)
			});
		}

		return result;
	}

	const stars = createStars(46);

	let inView = $state(true);

	const watchVisibility: Attachment<HTMLElement> = (node) => {
		const observer = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
		});
		observer.observe(node);
		return () => observer.disconnect();
	};

	/*
	 * Easter-egg : un clic sur le cycliste au repos le fait saluer et ouvre une bulle qui
	 * propose de jouer (mini-jeu : HeroRunner.svelte, chargé à la demande). Volontairement hors
	 * de la navigation (souris seulement, pas d’arrêt de tabulation) et proposé seulement sur
	 * ordinateur, dans le hero, hors mouvement réduit.
	 */
	const deviceQuery =
		'(min-width: 40rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
	let allowed = $state(false);
	let riderReady = $state(false);
	const playable = $derived(allowed && riderReady);

	/** Repos, invitation, partie en cours, fin de partie (bulle du score). */
	type Phase = 'idle' | 'invite' | 'playing' | 'over';
	let phase = $state<Phase>('idle');
	/** Numéro de partie : « Rejouer » recrée la partie. */
	let gameRound = $state(0);
	/** Hauteur du saut et distance parcourue, transmises par la partie en cours. */
	let lift = $state(0);
	let travel = $state(0);
	/** Véhicule en cours (vélo au repos) et clignotement après un choc. */
	let vehicle = $state<Vehicle>('bike');
	let hurt = $state(false);

	/** Largeur du dessin du paysage : le relief se répète tous les deux dessins (reflet compris). */
	const landWidth = 1440;

	/** Décalage d’un plan du relief qui défile à `factor` fois la vitesse du vélo. */
	function loopOffset(factor: number) {
		return (travel * factor) % (2 * landWidth);
	}

	const clouds = [
		{ x: 940, y: 70, scale: 1 },
		{ x: 1290, y: 420, scale: 0.8 },
		{ x: 620, y: 470, scale: 0.6 }
	];

	/** Position d’un nuage : il ressort à droite après avoir quitté le ciel à gauche. */
	function cloudX(cloud: (typeof clouds)[number]) {
		const span = landWidth + 200;
		const x = cloud.x + 100 - travel * 0.05 * cloud.scale;
		return ((x % span) + span) % span - 100;
	}
	let finalDistance = $state('');
	let runnerModule = $state<Promise<typeof import('./HeroRunner.svelte')>>();
	let anchor = $state({ x: 0, y: 0 });
	let scene = $state<HTMLElement>();
	let rider: SVGGElement | undefined;
	let riderHit: SVGRectElement | undefined;

	/*
	 * Conditions du jeu : ordinateur à pointeur fin, réglage « Réduire les animations » du site
	 * inactif et hero affiché (`data-section` sur <html>). Une condition qui cesse arrête le jeu.
	 */
	const watchConditions: Attachment<HTMLElement> = (node) => {
		scene = node;
		const html = document.documentElement;
		const device = matchMedia(deviceQuery);
		const read = () => {
			allowed = device.matches && !html.hasAttribute('data-reduced-motion') &&
				(html.dataset.section ?? 'accueil') === 'accueil';
			if (!allowed) {
				backToRest();
			}
		};
		read();
		const observer = new MutationObserver(read);
		observer.observe(html, { attributes: true, attributeFilter: ['data-reduced-motion', 'data-section'] });
		const off = on(device, 'change', read);
		return () => {
			observer.disconnect();
			off();
			scene = undefined;
		};
	};

	const keepRiderHit: Attachment<SVGRectElement> = (node) => {
		riderHit = node;
		return () => {
			riderHit = undefined;
		};
	};

	// Cycliste « au repos » : une fois son entrée terminée (immédiat si déjà jouée).
	const watchRider: Attachment<SVGGElement> = (node) => {
		rider = node;
		let active = true;
		Promise.allSettled(node.getAnimations().map((animation) => animation.finished)).then(() => {
			if (active) {
				riderReady = true;
			}
		});
		return () => {
			active = false;
		};
	};

	/*
	 * Haut du casque, dans le repère du hero : l’ancêtre positionné de la scène et de la bulle
	 * (leur parent direct est l’<astro-island>, en `display: contents`, sans boîte à mesurer).
	 */
	function placeBubble() {
		const hero = scene?.offsetParent;
		// Casque du véhicule affiché : sa place change d’un véhicule à l’autre.
		const helmet = rider?.querySelector<SVGGraphicsElement>('.helmet');
		const matrix = helmet?.getScreenCTM();
		if (!hero || !helmet || !matrix) {
			return;
		}
		const box = helmet.getBBox();
		const head = new DOMPoint(box.x + box.width / 2, box.y - 1.5).matrixTransform(matrix);
		const bounds = hero.getBoundingClientRect();
		anchor = { x: head.x - bounds.left, y: head.y - bounds.top };
	}

	function toggleInvitation() {
		if (!playable) {
			return;
		}
		if (phase === 'idle') {
			placeBubble();
			// Chargé dès l’invitation : la partie démarre sans attente au clic sur « Jouer ».
			runnerModule ??= import('./HeroRunner.svelte');
			phase = 'invite';
		} else if (phase === 'invite') {
			phase = 'idle';
		}
	}

	/** Bulle fermée, partie abandonnée : décor fixe, cycliste au sol. */
	function backToRest() {
		phase = 'idle';
		lift = 0;
		travel = 0;
		vehicle = 'bike';
		hurt = false;
	}

	function play() {
		lift = 0;
		travel = 0;
		vehicle = 'bike';
		hurt = false;
		gameRound += 1;
		phase = 'playing';
	}

	function endGame(distance: string) {
		finalDistance = distance;
		placeBubble();
		phase = 'over';
	}

	/*
	 * Bulle ouverte : le focus passe sur son premier bouton (la suite se fait aussi au clavier) ;
	 * Échap ou un clic ailleurs la ferme ; elle suit le cycliste au redimensionnement.
	 */
	const bubble: Attachment<HTMLElement> = (node) => {
		node.querySelector('button')?.focus({ preventScroll: true });
		const offs = [
			on(document, 'pointerdown', (event) => {
				const target = event.target;
				if (target instanceof Node && (node.contains(target) || riderHit?.contains(target))) {
					return;
				}
				backToRest();
			}),
			on(document, 'keydown', (event) => {
				if (event.key === 'Escape') {
					backToRest();
				}
			}),
			on(window, 'resize', placeBubble)
		];
		return () => {
			for (const off of offs) {
				off();
			}
		};
	};
</script>

<div
	class={[
		'scene',
		{ offscreen: !inView, playable, waving: phase === 'invite', running: phase === 'playing', hurt: phase === 'playing' && hurt }
	]}
	aria-hidden="true"
	{@attach watchVisibility}
	{@attach watchConditions}
>
	<!-- Tout le décor, agrandi vers le vélo en bas de l'accueil (voir contact-bubble.ts). -->
	<div class="zoom">
		<div class="sky"></div>

		<svg class="sky-layer" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMin slice" focusable="false">
			<defs>
				<linearGradient id="hero-scene-trail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-110" y2="0">
					<stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
					<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
				</linearGradient>
			</defs>

			<g class="night">
				{#each stars as star, index (index)}
					<circle
						class={['star', { twinkle: star.twinkle }]}
						cx={star.x}
						cy={star.y}
						r={star.r}
						opacity={star.opacity}
						style:--duration="{star.duration}s"
						style:--delay="{star.delay}s"
					/>
				{/each}

				<g transform="translate(1260 60) rotate(152)">
					<g class="meteor">
						<line x1="0" y1="0" x2="-110" y2="0" stroke="url(#hero-scene-trail)" stroke-width="2" stroke-linecap="round" />
						<circle r="1.8" fill="#ffffff" />
					</g>
				</g>
			</g>

			<g class="day">
				<!-- Pendant le mini-jeu, les nuages dérivent lentement, les plus petits (lointains) moins vite. -->
				{#each clouds as cloud, index (index)}
					<g class="cloud" transform="translate({cloudX(cloud)} {cloud.y}) scale({cloud.scale})">
						<rect x="-46" y="0" width="112" height="24" rx="12" />
						<circle cx="-10" cy="2" r="18" />
						<circle cx="22" cy="-4" r="24" />
					</g>
				{/each}
			</g>
		</svg>

		<!-- data-horizon-y : ligne du sol (où roule le cycliste), lue par dock-horizon.ts. -->
		<svg
			class="land"
			viewBox="0 0 1440 320"
			preserveAspectRatio="xMidYMax slice"
			focusable="false"
			data-horizon-y="289"
		>
			<defs>
				<linearGradient id="hero-scene-beam" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="100" y2="0">
					<stop offset="0" stop-color="var(--scene-lamp)" stop-opacity="0.5" />
					<stop offset="1" stop-color="var(--scene-lamp)" stop-opacity="0" />
				</linearGradient>
				<mask id="hero-scene-moon-mask" maskUnits="userSpaceOnUse">
					<rect x="960" y="40" width="100" height="100" fill="#ffffff" />
					<circle cx="1024" cy="82" r="22" fill="#000000" />
				</mask>
			</defs>

			<!-- Astre : le soleil se couche et la lune se lève quand le thème passe en sombre. -->
			<g class="layer astre-rise" style:--depth-offset="16px">
				<g class="astre sun">
					<circle cx="1010" cy="92" r="62" fill="var(--scene-sun-glow)" />
					<circle cx="1010" cy="92" r="38" fill="var(--scene-sun)" />
				</g>
				<g class="astre moon">
					<circle cx="1010" cy="92" r="52" fill="var(--scene-moon-glow)" />
					<circle cx="1010" cy="92" r="28" fill="var(--scene-moon)" mask="url(#hero-scene-moon-mask)" />
				</g>
			</g>

			<!--
				Pendant le mini-jeu, chaque plan du relief défile à sa vitesse (parallaxe) : le dessin
				est répété en boucle, en alternant avec son reflet pour que les bords se raccordent.
			-->
			{#snippet head(dx: number, dy: number)}
				<!-- .helmet : repère de la bulle (placeBubble). -->
				<g transform="translate({dx} {dy})">
					<circle cx="10" cy="-60" r="6.5" fill="var(--scene-rider)" />
					<path class="helmet" d="M2.4,-61 A7.7,7.7 0 0 1 17.8,-61.6 L19.5,-60.4 Z" fill="var(--scene-helmet)" />
				</g>
			{/snippet}

			{#snippet looping(drawing: Snippet, factor: number)}
				<g transform="translate({-loopOffset(factor)} 0)">
					{@render drawing()}
					{#if phase !== 'idle'}
						<g transform="translate({2 * landWidth} 0) scale(-1 1)">{@render drawing()}</g>
						<g transform="translate({2 * landWidth} 0)">{@render drawing()}</g>
					{/if}
				</g>
			{/snippet}

			{#snippet far()}
				<path
					fill="var(--scene-far)"
					d="M0 210 L120 150 L210 185 L330 110 L440 170 L560 122 L690 180 L800 136 L930 175 L1050 105 L1180 165 L1300 130 L1440 172 L1440 320 L0 320 Z"
				/>
				<path fill="var(--scene-snow)" d="M330 110 L303.6 126.5 L316 122 L326 128 L338 121 L354.2 123.2 Z" />
				<path fill="var(--scene-snow)" d="M1050 105 L1023.6 120.4 L1036 117 L1046 123 L1060 116 L1078.6 118.2 Z" />
			{/snippet}

			{#snippet mid()}
				<path
					fill="var(--scene-mid)"
					d="M0 230 C160 190 300 200 420 220 C560 245 700 195 860 200 C1010 205 1120 240 1260 225 C1350 215 1400 205 1440 210 L1440 320 L0 320 Z"
				/>
			{/snippet}

			{#snippet near()}
				<path
					fill="var(--scene-near)"
					d="M0 250 C120 222 250 214 370 236 C450 251 520 266 620 270 C760 274 840 262 960 248 C1080 234 1200 230 1300 242 C1370 250 1410 256 1440 258 L1440 320 L0 320 Z"
				/>

				<g fill="var(--scene-tree-shade)">
					<path d="M1246 178 L1226 238 L1266 238 Z" />
					<path d="M1278 200 L1264 240 L1292 240 Z" />
				</g>

				<rect x="415" y="196" width="10" height="52" rx="3" fill="var(--scene-trunk)" />
				<circle cx="420" cy="178" r="34" fill="var(--scene-tree)" />
				<circle cx="394" cy="194" r="24" fill="var(--scene-tree-shade)" />
				<circle cx="448" cy="192" r="26" fill="var(--scene-tree)" />
			{/snippet}

			{#snippet ground()}
				<path fill="var(--scene-ground)" d="M0 292 C300 286 600 288 720 288 C900 288 1200 286 1440 290 L1440 320 L0 320 Z" />
			{/snippet}

			<g class="layer" style:--depth-offset="12px">
				{@render looping(far, 0.12)}
			</g>

			<g class="day">
				<g class="flock">
					<!-- Chaque oiseau est dessiné autour de son corps (0, 0) : seules les ailes bougent. -->
					<path class="bird" transform="translate(12 0)" d="M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5" />
					<g transform="translate(40 -14) scale(0.83)">
						<path class="bird bird-b" d="M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5" />
					</g>
					<g transform="translate(52 8) scale(0.67)">
						<path class="bird bird-c" d="M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5" />
					</g>
				</g>
			</g>

			<g class="layer" style:--depth-offset="7px">
				{@render looping(mid, 0.28)}
			</g>

			<g class="layer" style:--depth-offset="3px">
				{@render looping(near, 0.55)}
			</g>

			<g class="layer">
				{@render looping(ground, 1)}
			</g>

			<!-- Mini-jeu : obstacles, repères au sol et distance, sous le cycliste. -->
			{#if (phase === 'playing' || phase === 'over') && runnerModule && scene}
				{#await runnerModule then { default: HeroRunner }}
					{#key gameRound}
						<HeroRunner
							surface={scene}
							onframe={(frame) => {
								lift = frame.lift;
								travel = frame.distance;
								vehicle = frame.vehicle;
								hurt = frame.hurt;
							}}
							onend={endGame}
							onquit={backToRest}
						/>
					{/key}
				{/await}
			{/if}

			<!-- Le cycliste monte de la hauteur du saut pendant le mini-jeu. -->
			<g transform="translate(0 {289 - lift})">
				<g class="rider" {@attach watchRider}>
					<!-- Véhicule du mini-jeu ; au repos, toujours le vélo. Clignote après un choc (.hurt). -->
					<g class="vehicle">
						{#if vehicle === 'bike'}
							<!-- Faisceau du phare avant, dont la pointe part de la lampe. -->
							<polygon class="night beam" points="19,-33 100,-17 100,0" fill="url(#hero-scene-beam)" />
							<g fill="none" stroke="var(--scene-bike)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="-20" cy="-11" r="11" />
								<circle cx="20" cy="-11" r="11" />
								<!-- Rayons : 12 par roue (6 diamètres tous les 30°), moyeu au centre. -->
								<g class="spokes" stroke-width="0.8">
									<path d="M-29.5 -11H-10.5M-28.23 -15.75L-11.77 -6.25M-24.75 -19.23L-15.25 -2.77M-20 -20.5V-1.5M-15.25 -19.23L-24.75 -2.77M-11.77 -15.75L-28.23 -6.25" />
									<circle cx="-20" cy="-11" r="1.6" fill="var(--scene-bike)" />
								</g>
								<g class="spokes" stroke-width="0.8">
									<path d="M10.5 -11H29.5M11.77 -15.75L28.23 -6.25M15.25 -19.23L24.75 -2.77M20 -20.5V-1.5M24.75 -19.23L15.25 -2.77M28.23 -15.75L11.77 -6.25" />
									<circle cx="20" cy="-11" r="1.6" fill="var(--scene-bike)" />
								</g>
								<polyline points="-20,-11 -2,-12 -8,-30 -20,-11" />
								<polyline points="-8,-30 14,-31 -2,-12" />
								<polyline points="14,-31 20,-11" />
								<polyline points="14,-31 17,-37 22,-37" />
								<line x1="-12" y1="-32" x2="-4" y2="-32" />
							</g>
							<!-- Phare avant, sur le tube de direction (allumé la nuit). -->
							<rect x="15.5" y="-35" width="4" height="3.4" rx="1.2" fill="var(--scene-bike)" />
							<circle class="night" cx="19" cy="-33.3" r="1.7" fill="var(--scene-lamp)" />
							<!-- Feu arrière, sur le hauban : visible seulement la nuit. -->
							<circle class="night" cx="-11" cy="-25.3" r="3.8" fill="var(--scene-rear-glow)" />
							<rect class="night" x="-12.3" y="-26.5" width="2.6" height="2.4" rx="0.8" fill="var(--scene-rear)" />
							<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
								<!-- Bras qui reste sur le guidon (épaule, coude, main), derrière le buste. -->
								<polyline points="6,-50 11,-41 19,-37" />
								<polyline points="-8,-35 2,-24 -1,-12" />
								<polyline points="-8,-35 6,-52" />
							</g>
							{@render head(0, 0)}
							<!--
								Bras qui fait coucou : même forme que le bras du guidon, avec lequel il se confond au
								repos. Il tourne à l'épaule (.wave-arm) et l'avant-bras se déplie au coude
								(.wave-forearm). Dessiné après la tête pour passer devant le casque.
							-->
							<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(6 -50)">
								<g class="wave-arm">
									<polyline points="0,0 5,9" />
									<g transform="translate(5 9)">
										<polyline class="wave-forearm" points="0,0 8,4" />
									</g>
								</g>
							</g>
						{:else if vehicle === 'unicycle'}
							<!-- Monocycle : il oscille autour du point de contact (.wobble), bras écartés. -->
							<g class="wobble">
								<g fill="none" stroke="var(--scene-bike)" stroke-width="2.5" stroke-linecap="round">
									<circle cx="0" cy="-13" r="12" />
									<g class="spokes" stroke-width="0.8">
										<path d="M-11.5 -13L11.5 -13M-9.96 -18.75L9.96 -7.25M-5.75 -22.96L5.75 -3.04M0 -24.5L0 -1.5M5.75 -22.96L-5.75 -3.04M9.96 -18.75L-9.96 -7.25" />
										<circle cx="0" cy="-13" r="1.6" fill="var(--scene-bike)" />
									</g>
									<line x1="0" y1="-13" x2="0" y2="-36" />
									<line x1="-6" y1="-37" x2="6" y2="-37" />
								</g>
								<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="0,-39 -3,-27 -4,-14" />
									<polyline points="0,-39 6,-28 3,-17" />
									<polyline points="0,-39 2,-58" />
									<polyline points="2,-56 -8,-52 -15,-56" />
									<polyline points="2,-56 11,-50 18,-53" />
								</g>
								{@render head(-4, -6)}
							</g>
						{:else if vehicle === 'skateboard'}
							<!-- Skateboard : planche à deux roues, cycliste debout de profil. -->
							<path d="M-24 -10 Q-22 -6 -17 -6 L17 -6 Q22 -6 24 -10" fill="none" stroke="var(--scene-bike)" stroke-width="3" stroke-linecap="round" />
							<circle cx="-13" cy="-2.5" r="2.5" fill="var(--scene-bike)" />
							<circle cx="13" cy="-2.5" r="2.5" fill="var(--scene-bike)" />
							<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="0,-34 -5,-21 -9,-9" />
								<polyline points="0,-34 6,-22 8,-9" />
								<polyline points="0,-34 3,-54" />
								<polyline points="3,-52 -7,-46 -14,-44" />
								<polyline points="3,-52 12,-46 19,-42" />
							</g>
							{@render head(-3, -2)}
						{:else if vehicle === 'hoverboard'}
							<!-- Hoverboard : planche sans roues qui flotte (.hover), lueur dessous. -->
							<g class="hover">
								<ellipse cx="0" cy="-2" rx="20" ry="2.5" fill="var(--scene-hover-glow)" />
								<rect x="-24" y="-12" width="48" height="5" rx="2.5" fill="var(--scene-bike)" />
								<rect x="-16" y="-8" width="32" height="2" rx="1" fill="var(--scene-hover-light)" />
								<g transform="translate(0 -4)">
									<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="0,-34 -5,-21 -9,-9" />
										<polyline points="0,-34 6,-22 8,-9" />
										<polyline points="0,-34 3,-54" />
										<polyline points="3,-52 -7,-46 -14,-44" />
										<polyline points="3,-52 12,-46 19,-42" />
									</g>
									{@render head(-3, -2)}
								</g>
							</g>
						{:else}
							<!-- À pied : course, jambes et bras en balancier (.stride). -->
							<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
								<g transform="translate(5 -50)">
									<g class="stride stride-b"><polyline points="0,0 -3,10 3,17" /></g>
								</g>
								<g transform="translate(0 -32)">
									<g class="stride stride-a"><polyline points="0,0 3,16 0,31" /></g>
									<g class="stride stride-b"><polyline points="0,0 3,16 0,31" /></g>
								</g>
								<polyline points="0,-32 5,-52" />
								<g transform="translate(5 -50)">
									<g class="stride stride-a"><polyline points="0,0 -3,10 3,17" /></g>
								</g>
							</g>
							{@render head(-1, 0)}
						{/if}
					</g>
					<!--
						Zone cliquable de l’easter-egg, transparente, active seulement quand le jeu est
						proposé (.playable). Souris seulement, à dessein : la scène reste hors de la
						navigation et des technologies d’assistance.
					-->
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<rect class="rider-hit" x="-34" y="-72" width="66" height="74" {@attach keepRiderHit} onclick={toggleInvitation} />
				</g>
			</g>
		</svg>
	</div>
</div>

{#if phase === 'invite' || phase === 'over'}
	<div
		class="invitation"
		role="dialog"
		aria-labelledby="hero-invitation-title"
		style:--anchor-x="{anchor.x}px"
		style:--anchor-y="{anchor.y}px"
		{@attach bubble}
	>
		{#if phase === 'invite'}
			<p id="hero-invitation-title" class="invitation-title ds-body-l">Salut&nbsp;! Une petite balade&nbsp;?</p>
			<div class="invitation-actions">
				<Button onclick={play}>Jouer</Button>
				<Button variant="secondary" onclick={backToRest}>Non merci</Button>
			</div>
		{:else}
			<p id="hero-invitation-title" class="invitation-title ds-body-l">Fin de la balade&nbsp;: {finalDistance}&nbsp;!</p>
			<div class="invitation-actions">
				<Button onclick={play}>Rejouer</Button>
				<Button href="#contact" variant="secondary">Me contacter</Button>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Décor pleine largeur, derrière le contenu du hero (qui fournit --hero-scene-band). */
	.scene {
		--band: var(--hero-scene-band, 16rem);
		position: absolute;
		z-index: -1;
		top: calc(-1 * var(--spacing-8));
		bottom: 0;
		left: 50%;
		width: 100vw;
		translate: -50% 0;
		overflow: hidden;
		pointer-events: none;
	}

	@media (min-width: 40rem) {
		.scene {
			margin-left: calc(var(--dock-gutter) / -2);
		}
	}

	/*
	 * Bas de l'accueil (section Contact affichée) : le décor s'agrandit vers le vélo
	 * (`--zoom-origin`, posé par contact-bubble.ts) et le cycliste fait coucou.
	 */
	.zoom {
		position: absolute;
		inset: 0;
		transform-origin: var(--zoom-origin, 25% 100%);
	}

	@media (min-width: 40rem) {
		:global(html[data-section='contact']) .zoom {
			scale: var(--zoom-scale, 1.6);
		}
	}

	@media (min-width: 40rem) and (prefers-reduced-motion: no-preference) {
		.sky-layer {
			--depth-offset: 20px;
		}

		.sky-layer,
		.layer {
			transition: translate 900ms cubic-bezier(0.4, 0, 0.2, 1);
		}

		:global(html[data-section='contact']:not([data-reduced-motion])) :is(.sky-layer, .layer) {
			translate: 0 var(--depth-offset, 0px);
		}
	}

	/* Zone cliquable du cycliste : inerte tant que le jeu n’est pas proposé. */
	.rider-hit {
		fill: transparent;
	}

	.playable .rider-hit {
		pointer-events: auto;
		cursor: pointer;
	}

	/* Partie en cours : un clic dans le paysage fait sauter (HeroRunner). */
	.scene.running {
		pointer-events: auto;
	}

	/*
	 * Bulle d’invitation : même dessin que la bulle de Contact (index.astro), pointe en bas à
	 * gauche vers le casque (--anchor-x / --anchor-y, dans le repère du hero).
	 */
	.invitation {
		--bubble-ink: var(--text-primary);
		--pointer-x: 2rem;
		--pointer-size: 1.5rem;
		position: absolute;
		z-index: 1;
		top: calc(var(--anchor-y) - var(--pointer-size) - 0.625rem);
		left: calc(var(--anchor-x) - var(--pointer-x));
		translate: 0 -100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-4);
		width: max-content;
		max-width: min(24rem, calc(100vw - var(--anchor-x)));
		padding: var(--spacing-5);
		border: 2px solid var(--bubble-ink);
		border-radius: var(--radius-xl);
		background: var(--surface-elevated);
		box-shadow: 4px 4px 0 var(--bubble-ink);
		transform-origin: var(--pointer-x) calc(100% + var(--pointer-size));
		transition:
			opacity 250ms ease 300ms,
			scale 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 300ms;
	}

	/* Apparition pendant que le bras se lève, avec un léger rebond. */
	@starting-style {
		.invitation {
			opacity: 0;
			scale: 0.6;
		}
	}

	:global(html[data-theme='dark']) .invitation {
		--bubble-ink: var(--text-secondary);
	}

	/* Pointe : un triangle bordé (contour) et un triangle plein (fond) superposés. */
	.invitation::before,
	.invitation::after {
		content: '';
		position: absolute;
		top: 100%;
		left: var(--pointer-x);
		width: 0;
		height: 0;
		border-style: solid;
	}

	.invitation::before {
		border-width: var(--pointer-size) var(--pointer-size) 0 0;
		border-color: var(--bubble-ink) transparent transparent transparent;
	}

	.invitation::after {
		margin-top: -3px;
		margin-left: 2px;
		border-width: calc(var(--pointer-size) - 4px) calc(var(--pointer-size) - 4px) 0 0;
		border-color: var(--surface-elevated) transparent transparent transparent;
	}

	.invitation-title {
		margin: 0;
		color: var(--text-primary);
		font-family: var(--font-heading);
		font-weight: 600;
	}

	.invitation-actions {
		display: flex;
		gap: var(--spacing-3);
	}

	/*
	 * Bras qui fait coucou : rotations autour de l'épaule et du coude (origine de leur groupe).
	 * De même pour le monocycle (autour du point de contact) et la foulée (hanche, épaule).
	 */
	.wave-arm,
	.wave-forearm,
	.wobble,
	.stride {
		transform-box: view-box;
		transform-origin: 0 0;
	}

	.sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			var(--scene-sky-top) 0%,
			var(--scene-sky-top) 20%,
			var(--scene-sky-horizon) 100%
		);
		transition:
			--scene-sky-top 900ms ease,
			--scene-sky-horizon 900ms ease;
	}

	.sky-layer,
	.land {
		position: absolute;
		left: 0;
		display: block;
		width: 100%;
	}

	.sky-layer {
		top: 0;
		height: 100%;
	}

	/* Légèrement débordante pour éviter un liseré de ciel sous le sol. */
	.land {
		bottom: -2px;
		height: calc(var(--band) + 2px);
	}

	/* Hero sur une colonne : le texte occupe toute la largeur, le ciel reste uni derrière. */
	@media (max-width: 63.99rem) {
		.sky-layer {
			mask-image: linear-gradient(to bottom, transparent 50%, #000 72%);
		}
	}

	/* Jour / nuit */
	.day,
	.night {
		transition: opacity 900ms ease;
	}

	.night {
		opacity: 0;
	}

	:global(html[data-theme='dark']) .night {
		opacity: 1;
	}

	:global(html[data-theme='dark']) .day {
		opacity: 0;
	}

	.astre {
		transition:
			transform 1400ms cubic-bezier(0.45, 0, 0.25, 1),
			opacity 1400ms ease;
	}

	.moon,
	:global(html[data-theme='dark']) .sun {
		transform: translateY(190px);
		opacity: 0;
	}

	:global(html[data-theme='dark']) .moon {
		transform: none;
		opacity: 1;
	}

	/* Éléments */
	.star {
		fill: var(--scene-star);
	}

	.cloud {
		fill: var(--scene-cloud);
	}

	.bird {
		fill: none;
		stroke: var(--scene-bike);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.flock {
		transform: translate(640px, 58px);
	}

	.meteor {
		opacity: 0;
	}

	/* Position d’arrivée du cycliste, au quart du paysage (aussi le décor fixe). */
	.rider {
		transform: translateX(360px);
	}

	.spokes {
		transform-box: fill-box;
		transform-origin: center;
	}

	/*
	 * Animations : uniquement transform et opacity. Chaque élément bouge une seule fois et
	 * s’arrête avant 5 s à la place qu’il occupe dans le décor fixe (WCAG 2.2.2).
	 * Le relief, l’arbre et les nuages restent fixes : le paysage est complet dès la
	 * première image et seuls l’astre, le ciel nocturne, les oiseaux et le cycliste s’animent.
	 */
	@media (prefers-reduced-motion: no-preference) {
		.astre-rise {
			animation: astre-rise 1800ms cubic-bezier(0.2, 0.7, 0.2, 1) 200ms both;
		}

		.twinkle {
			animation: twinkle var(--duration) ease-in-out var(--delay) both;
		}

		.meteor {
			animation: meteor 900ms ease-in 3s both;
		}

		/*
		 * Vol à vitesse constante depuis la gauche du soleil, puis ralentissement
		 * progressif (voir @keyframes fly) ; posé avant 5 s.
		 */
		.flock {
			animation: fly 4.4s linear both;
		}

		/*
		 * Battement d’ailes par morphose du tracé, pendant le vol seulement : un nombre pair
		 * d’allers-retours finit ailes déployées. Sans support de `d` en CSS, vol plané.
		 */
		.bird {
			animation: flap 440ms ease-in-out 10 alternate;
		}

		.bird-b {
			animation-delay: -180ms;
		}

		.bird-c {
			animation-delay: -340ms;
		}

		/* Passage unique du cycliste, qui ralentit et s’arrête au quart avant 5 s (WCAG 2.2.2). */
		.rider,
		.spokes {
			animation: ride 4s cubic-bezier(0.25, 0.6, 0.3, 1) 400ms both;
		}

		.spokes {
			animation-name: roll;
		}

		/*
		 * Déjà jouées dans la session (retour arrière, nouvelle visite de l’accueil) :
		 * décor fixe directement (`data-scene-played`, posé avant le rendu par `index.astro`).
		 */
		:global(html[data-scene-played]) .scene * {
			animation: none;
		}

		.zoom {
			transition: scale 900ms cubic-bezier(0.4, 0, 0.2, 1);
		}

		/*
		 * Coucou, à chaque arrivée en bas de page pendant le zoom : le bras quitte le guidon
		 * (où il se confond avec l’autre bras, et reste en mouvement réduit), se lève, fait six
		 * allers-retours, puis redescend (fini en 3,3 s). Chaque étape ne s'applique qu'une fois commencée (`forwards`), la suivante prenant le relais.
		 * Plus précis que la règle des animations déjà jouées, qui ne le concerne pas.
		 */
		:global(html[data-section='contact']) .scene .wave-arm {
			animation:
				raise 450ms cubic-bezier(0.3, 0, 0.2, 1) 600ms both,
				wave 300ms ease-in-out 1050ms 6 alternate forwards,
				lower 450ms ease-in-out 2850ms forwards;
		}

		/* L'avant-bras se déplie pendant la montée et se replie à la descente. */
		:global(html[data-section='contact']) .scene .wave-forearm {
			animation:
				unfold 450ms cubic-bezier(0.3, 0, 0.2, 1) 600ms both,
				fold 450ms ease-in-out 2850ms forwards;
		}

		/*
		 * Coucou de l’easter-egg, au clic sur le cycliste : mêmes étapes que celui de Contact,
		 * sans attendre de zoom (fini en 2,7 s). Plus précis que la règle des animations déjà jouées.
		 */
		.scene.waving .wave-arm {
			animation:
				raise 450ms cubic-bezier(0.3, 0, 0.2, 1) both,
				wave 300ms ease-in-out 450ms 6 alternate forwards,
				lower 450ms ease-in-out 2250ms forwards;
		}

		.scene.waving .wave-forearm {
			animation:
				unfold 450ms cubic-bezier(0.3, 0, 0.2, 1) both,
				fold 450ms ease-in-out 2250ms forwards;
		}

		/*
		 * Partie en cours : les roues tournent tant qu’elle dure (lancée et arrêtée par le
		 * visiteur, d’où l’exception à la règle des 5 s). Plus précis que la règle des
		 * animations déjà jouées.
		 */
		.scene.running .rider .spokes {
			animation: spin 240ms linear infinite;
		}

		/*
		 * Véhicules du mini-jeu : oscillation du monocycle, flottement du hoverboard, foulée à pied,
		 * clignotement après un choc.
		 */
		.scene.running .rider .wobble {
			animation: wobble 700ms ease-in-out infinite alternate;
		}

		.scene.running .rider .hover {
			animation: hover 600ms ease-in-out infinite alternate;
		}

		.scene.running .rider .stride {
			animation: stride 300ms ease-in-out infinite alternate;
		}

		.scene.running .rider .stride-b {
			animation-delay: -300ms;
		}

		.scene.hurt .rider .vehicle {
			animation: blink 200ms steps(2, jump-none) infinite;
		}

		/* Hors écran : suspension, l’animation reprend là où elle s’était arrêtée. */
		.offscreen,
		.offscreen * {
			animation-play-state: paused;
		}
	}

	@keyframes astre-rise {
		from {
			transform: translateY(150px);
		}
	}

	@keyframes twinkle {
		50% {
			opacity: 0.15;
		}
	}

	@keyframes meteor {
		0% {
			transform: translateX(0);
			opacity: 0;
		}

		18% {
			opacity: 1;
		}

		100% {
			transform: translateX(340px);
			opacity: 0;
		}
	}

	/*
	 * Départ juste à gauche du halo du soleil (bord gauche à x = 948 ; la nuée s’étend jusqu’à
	 * +60 px de son origine), pour ne pas croiser l’astre pendant son lever. Ligne droite
	 * jusqu’à la place de la nuée dans le décor fixe. 60 % du temps à vitesse constante (75 % du trajet), puis une décélération constante
	 * (courbe quadratique) dont la vitesse de départ égale celle du vol (pente initiale : 2),
	 * pour éviter une cassure et un freinage sec.
	 */
	@keyframes fly {
		from {
			transform: translate(880px, 53px);
			animation-timing-function: linear;
		}

		60% {
			transform: translate(700px, 56.75px);
			animation-timing-function: cubic-bezier(0.33, 0.67, 0.67, 1);
		}
	}

	@keyframes flap {
		from {
			d: path('M-12 -5 Q-6 -7 0 0 Q6 -7 12 -5');
		}

		to {
			d: path('M-10 5 Q-5 -2 0 1 Q5 -2 10 5');
		}
	}

	@keyframes ride {
		from {
			transform: translateX(-140px);
		}
	}

	/* 500 px parcourus pour une roue de 69 px de circonférence : environ 7,25 tours. */
	@keyframes roll {
		from {
			transform: rotate(-2610deg);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes wobble {
		from {
			transform: rotate(-6deg);
		}

		to {
			transform: rotate(6deg);
		}
	}

	@keyframes hover {
		from {
			transform: translateY(1px);
		}

		to {
			transform: translateY(-3px);
		}
	}

	@keyframes stride {
		from {
			transform: rotate(-28deg);
		}

		to {
			transform: rotate(28deg);
		}
	}

	@keyframes blink {
		from {
			opacity: 1;
		}

		to {
			opacity: 0.25;
		}
	}

	/*
	 * Bras du coucou dessiné comme le bras du guidon (0°). Levé : bras tourné à −169° à
	 * l’épaule, avant-bras déplié de 48° au coude ; il bat ensuite jusqu’à −199°.
	 * Les deux extrémités sont explicites : une extrémité omise prendrait la valeur laissée
	 * par les animations précédentes de la liste (le bras ne redescendrait pas).
	 */
	@keyframes raise {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(-169deg);
		}
	}

	@keyframes lower {
		from {
			transform: rotate(-169deg);
		}

		to {
			transform: rotate(0deg);
		}
	}

	@keyframes wave {
		from {
			transform: rotate(-169deg);
		}

		to {
			transform: rotate(-199deg);
		}
	}

	@keyframes unfold {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(48deg);
		}
	}

	@keyframes fold {
		from {
			transform: rotate(48deg);
		}

		to {
			transform: rotate(0deg);
		}
	}
</style>
