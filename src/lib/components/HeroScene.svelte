<script lang="ts">
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	type Star = {
		x: number;
		y: number;
		r: number;
		opacity: number;
		twinkle: boolean;
		duration: number;
		delay: number;
	};

	const storageKey = 'scene-paused';

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
				duration: round(3 + random() * 4),
				delay: round(-random() * 6)
			});
		}

		return result;
	}

	const stars = createStars(46);

	let userPaused = $state(false);
	let inView = $state(true);

	onMount(() => {
		try {
			userPaused = localStorage.getItem(storageKey) === '1';
		} catch {
			// Stockage indisponible : l’animation reste active.
		}
	});

	function toggleMotion() {
		userPaused = !userPaused;
		try {
			if (userPaused) {
				localStorage.setItem(storageKey, '1');
			} else {
				localStorage.removeItem(storageKey);
			}
		} catch {
			// Préférence non mémorisée, sans conséquence.
		}
	}

	const watchVisibility: Attachment<HTMLElement> = (node) => {
		const observer = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
		});
		observer.observe(node);
		return () => observer.disconnect();
	};
</script>

<div class={['scene', { stilled: userPaused, offscreen: !inView }]} aria-hidden="true" {@attach watchVisibility}>
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
			<g class="cloud cloud-a" transform="translate(940 70)">
				<rect x="-46" y="0" width="112" height="24" rx="12" />
				<circle cx="-10" cy="2" r="18" />
				<circle cx="22" cy="-4" r="24" />
			</g>
			<g class="cloud cloud-b" transform="translate(1290 420) scale(0.8)">
				<rect x="-46" y="0" width="112" height="24" rx="12" />
				<circle cx="-10" cy="2" r="18" />
				<circle cx="22" cy="-4" r="24" />
			</g>
			<g class="cloud cloud-c" transform="translate(620 470) scale(0.6)">
				<rect x="-46" y="0" width="112" height="24" rx="12" />
				<circle cx="-10" cy="2" r="18" />
				<circle cx="22" cy="-4" r="24" />
			</g>
		</g>
	</svg>

	<svg class="land" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" focusable="false">
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
		<g class="layer astre-rise">
			<g class="astre sun">
				<circle cx="1010" cy="92" r="62" fill="var(--scene-sun-glow)" />
				<circle cx="1010" cy="92" r="38" fill="var(--scene-sun)" />
			</g>
			<g class="astre moon">
				<circle cx="1010" cy="92" r="52" fill="var(--scene-moon-glow)" />
				<circle cx="1010" cy="92" r="28" fill="var(--scene-moon)" mask="url(#hero-scene-moon-mask)" />
			</g>
		</g>

		<g class="layer" style:--i="1">
			<path
				fill="var(--scene-far)"
				d="M0 210 L120 150 L210 185 L330 110 L440 170 L560 122 L690 180 L800 136 L930 175 L1050 105 L1180 165 L1300 130 L1440 172 L1440 320 L0 320 Z"
			/>
			<path fill="var(--scene-snow)" d="M330 110 L303.6 126.5 L316 122 L326 128 L338 121 L354.2 123.2 Z" />
			<path fill="var(--scene-snow)" d="M1050 105 L1023.6 120.4 L1036 117 L1046 123 L1060 116 L1078.6 118.2 Z" />
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

		<g class="layer" style:--i="2">
			<path
				fill="var(--scene-mid)"
				d="M0 230 C160 190 300 200 420 220 C560 245 700 195 860 200 C1010 205 1120 240 1260 225 C1350 215 1400 205 1440 210 L1440 320 L0 320 Z"
			/>
		</g>

		<g class="layer" style:--i="3">
			<path
				fill="var(--scene-near)"
				d="M0 250 C120 222 250 214 370 236 C450 251 520 266 620 270 C760 274 840 262 960 248 C1080 234 1200 230 1300 242 C1370 250 1410 256 1440 258 L1440 320 L0 320 Z"
			/>

			<g fill="var(--scene-tree-shade)">
				<path d="M1246 178 L1226 238 L1266 238 Z" />
				<path d="M1278 200 L1264 240 L1292 240 Z" />
			</g>

			<rect x="415" y="196" width="10" height="52" rx="3" fill="var(--scene-trunk)" />
			<g class="foliage">
				<circle cx="420" cy="178" r="34" fill="var(--scene-tree)" />
				<circle cx="394" cy="194" r="24" fill="var(--scene-tree-shade)" />
				<circle cx="448" cy="192" r="26" fill="var(--scene-tree)" />
			</g>
		</g>

		<g class="layer" style:--i="4">
			<path fill="var(--scene-ground)" d="M0 292 C300 286 600 288 720 288 C900 288 1200 286 1440 290 L1440 320 L0 320 Z" />
		</g>

		<g transform="translate(0 289)">
			<g class="rider">
				<polygon class="night beam" points="20,-31 100,-14 100,0" fill="url(#hero-scene-beam)" />
				<g fill="none" stroke="var(--scene-bike)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="-20" cy="-11" r="11" />
					<circle cx="20" cy="-11" r="11" />
					<g class="spokes">
						<line x1="-28" y1="-11" x2="-12" y2="-11" />
						<line x1="-20" y1="-19" x2="-20" y2="-3" />
					</g>
					<g class="spokes">
						<line x1="12" y1="-11" x2="28" y2="-11" />
						<line x1="20" y1="-19" x2="20" y2="-3" />
					</g>
					<polyline points="-20,-11 -2,-12 -8,-30 -20,-11" />
					<polyline points="-8,-30 14,-31 -2,-12" />
					<polyline points="14,-31 20,-11" />
					<polyline points="14,-31 17,-37 22,-37" />
					<line x1="-12" y1="-32" x2="-4" y2="-32" />
				</g>
				<g fill="none" stroke="var(--scene-rider)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="-8,-35 2,-24 -1,-12" />
					<polyline points="-8,-35 6,-52" />
					<polyline points="6,-50 20,-37" />
				</g>
				<circle cx="10" cy="-60" r="6.5" fill="var(--scene-rider)" />
				<circle class="night" cx="21" cy="-34" r="2.2" fill="var(--scene-lamp)" />
			</g>
		</g>
	</svg>
</div>

<button
	type="button"
	class="motion-toggle"
	aria-label={userPaused ? 'Reprendre l’animation du décor' : 'Mettre en pause l’animation du décor'}
	title={userPaused ? 'Reprendre l’animation du décor' : 'Mettre en pause l’animation du décor'}
	onclick={toggleMotion}
>
	<svg class="motion-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
		{#if userPaused}
			<path d="M6 4.5 L15.5 10 L6 15.5 Z" fill="currentColor" />
		{:else}
			<rect x="5" y="4.5" width="3.5" height="11" rx="1" fill="currentColor" />
			<rect x="11.5" y="4.5" width="3.5" height="11" rx="1" fill="currentColor" />
		{/if}
	</svg>
</button>

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
		:global(html[data-dock='left']) .scene {
			margin-left: calc(var(--dock-gutter) / -2);
		}

		:global(html[data-dock='right']) .scene {
			margin-left: calc(var(--dock-gutter) / 2);
		}
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

	.rider {
		transform: translateX(880px);
	}

	.spokes,
	.foliage {
		transform-box: fill-box;
		transform-origin: center;
	}

	.foliage {
		transform-origin: 50% 100%;
	}

	/* Animations : uniquement transform et opacity. Les boucles d’ambiance s’arrêtent avec .stilled. */
	@media (prefers-reduced-motion: no-preference) {
		.layer {
			animation: rise 1100ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
			animation-delay: calc(var(--i, 0) * 120ms);
		}

		.astre-rise {
			animation: astre-rise 1800ms cubic-bezier(0.2, 0.7, 0.2, 1) 200ms both;
		}

		.twinkle {
			animation: twinkle var(--duration) ease-in-out var(--delay) infinite alternate;
		}

		.meteor {
			animation: meteor 11s ease-in 3s infinite both;
		}

		.cloud-a {
			animation: drift 46s ease-in-out infinite alternate;
		}

		.cloud-b {
			animation: drift 38s ease-in-out -12s infinite alternate-reverse;
		}

		.cloud-c {
			animation: drift 52s ease-in-out -20s infinite alternate;
		}

		.flock {
			animation: fly 34s linear 5s infinite both;
		}

		/* Battement d’ailes par morphose du tracé ; sans support de `d` en CSS, l’oiseau reste en vol plané. */
		.bird {
			animation: flap 440ms ease-in-out infinite alternate;
		}

		.bird-b {
			animation-delay: -180ms;
		}

		.bird-c {
			animation-delay: -340ms;
		}

		.foliage {
			animation: sway 7s ease-in-out infinite alternate;
		}

		.rider {
			animation: ride 26s linear 1.6s infinite both;
		}

		.spokes {
			animation: spin 900ms linear infinite;
		}

		/* Pause demandée : décor statique complet, comme en mouvement réduit. */
		.stilled :is(.twinkle, .meteor, .cloud, .flock, .bird, .foliage, .rider, .spokes) {
			animation: none;
		}

		/* Hors écran : suspension, l’animation reprend là où elle s’était arrêtée. */
		.offscreen,
		.offscreen * {
			animation-play-state: paused;
		}
	}

	@keyframes rise {
		from {
			transform: translateY(32px);
			opacity: 0;
		}
	}

	@keyframes astre-rise {
		from {
			transform: translateY(150px);
		}
	}

	@keyframes twinkle {
		to {
			opacity: 0.15;
		}
	}

	@keyframes meteor {
		0% {
			transform: translateX(0);
			opacity: 0;
		}

		1.5% {
			opacity: 1;
		}

		8% {
			transform: translateX(340px);
			opacity: 0;
		}

		100% {
			transform: translateX(340px);
			opacity: 0;
		}
	}

	@keyframes drift {
		to {
			translate: 60px 0;
		}
	}

	@keyframes fly {
		0% {
			transform: translate(1520px, 58px);
		}

		55% {
			transform: translate(-120px, 40px);
		}

		100% {
			transform: translate(-120px, 40px);
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

	@keyframes sway {
		from {
			transform: rotate(-1.5deg);
		}

		to {
			transform: rotate(1.5deg);
		}
	}

	@keyframes ride {
		0% {
			transform: translateX(-140px);
		}

		62% {
			transform: translateX(1580px);
		}

		100% {
			transform: translateX(1580px);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Bouton pause : seulement utile quand le décor bouge. */
	.motion-toggle {
		position: absolute;
		right: 0;
		bottom: var(--spacing-3);
		z-index: 1;
		display: none;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: var(--spacing-2);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-full);
		background: var(--surface-elevated);
		color: var(--text-primary);
		cursor: pointer;
	}

	.motion-toggle:hover {
		background: var(--surface-subtle);
		border-color: var(--border-strong);
	}

	.motion-toggle:focus-visible {
		outline: 2px solid var(--action-focus);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.motion-toggle {
			display: inline-flex;
		}
	}

	.motion-icon {
		display: block;
		width: 1rem;
		height: 1rem;
	}
</style>
