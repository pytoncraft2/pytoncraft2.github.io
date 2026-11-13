import { on } from 'svelte/events';
import type { Attachment } from 'svelte/attachments';

// Défilement au-delà duquel le dock quitte l'horizon pour sa place choisie.
const leaveAfterPx = 8;
// Changement de forme (dock à gauche ou à droite) : sortie, puis entrée à la nouvelle place.
const switchOutMs = 180;
const switchInMs = 220;

function canUseHorizon() {
	return window.matchMedia('(min-width: 40rem)').matches;
}

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Ordonnée à l'écran de la ligne du sol du paysage : `data-horizon-y` est exprimé dans
 * le repère du dessin, recadré par `preserveAspectRatio="xMidYMax slice"` (le dessin
 * couvre le SVG et s'aligne sur son bas).
 */
function horizonLine(land: SVGSVGElement) {
	const box = land.viewBox.baseVal;
	const rect = land.getBoundingClientRect();
	const lineY = parseFloat(land.dataset.horizonY ?? '');
	if (!box || !box.width || !box.height || !Number.isFinite(lineY)) {
		return rect.bottom;
	}

	const scale = Math.max(rect.width / box.width, rect.height / box.height);
	return rect.bottom - (box.y + box.height - lineY) * scale;
}

/**
 * Accueil, page en haut : le dock, horizontal, est centré sur la ligne d'horizon du
 * paysage. Au défilement, il rejoint la place choisie (gauche, droite ou bas), et revient
 * sur l'horizon en haut de page. Expose sur `<html>` :
 * - `data-dock-horizon` : dock sur l'horizon (posé avant le rendu par `index.astro`) ;
 * - `--dock-lift` : décalage vers le haut depuis la place du dock en bas ;
 * - `data-dock-switch` (`out`, puis `in`) : changement de forme en cours.
 * Le dock fait le reste en CSS. Sur mobile, ou sans place sous l'horizon, rien ne change.
 */
export const dockHorizon: Attachment<HTMLElement> = (hero) => {
	const html = document.documentElement;
	const land = hero.querySelector<SVGSVGElement>('svg[data-horizon-y]');
	let frame = 0;
	let timer = 0;
	let switching = false;

	const isOnHorizon = () => html.hasAttribute('data-dock-horizon');
	const getDock = () => document.getElementById('menu');

	function wantsHorizon(dock: HTMLElement | null): dock is HTMLElement {
		return (
			dock !== null &&
			land !== null &&
			canUseHorizon() &&
			window.scrollY <= leaveAfterPx
		);
	}

	/** Calcule `--dock-lift` (dock déjà sur l'horizon) ; faux s'il n'y a pas la place. */
	function measureLift(dock: HTMLElement) {
		if (!land) {
			return false;
		}

		// Ordonnée du centre du dock à sa place en bas, puis écart avec la ligne du sol.
		const restingBottom = window.innerHeight - parseFloat(getComputedStyle(dock).bottom || '0');
		const lift = restingBottom - dock.offsetHeight / 2 - horizonLine(land);
		if (!Number.isFinite(lift) || lift <= 0) {
			return false;
		}

		html.style.setProperty('--dock-lift', `${Math.round(lift)}px`);
		return true;
	}

	function setOnHorizon(onHorizon: boolean) {
		html.toggleAttribute('data-dock-horizon', onHorizon);
	}

	function place(onHorizon: boolean, dock: HTMLElement) {
		setOnHorizon(onHorizon);
		if (onHorizon && !measureLift(dock)) {
			setOnHorizon(false);
		}
	}

	/** Change de place : direct pour le dock en bas, sortie puis entrée pour les côtés. */
	function moveTo(onHorizon: boolean, dock: HTMLElement) {
		if (html.dataset.dock === 'bottom' || prefersReducedMotion()) {
			place(onHorizon, dock);
			return;
		}

		switching = true;
		html.setAttribute('data-dock-switch', 'out');
		timer = window.setTimeout(() => {
			// Nouvelle place, encore invisible et décalée : on peut la mesurer.
			html.setAttribute('data-dock-switch', 'in');
			place(onHorizon, dock);
			void dock.offsetWidth;
			html.removeAttribute('data-dock-switch');
			timer = window.setTimeout(() => {
				switching = false;
				requestUpdate();
			}, switchInMs);
		}, switchOutMs);
	}

	function update() {
		frame = 0;
		if (switching) {
			return;
		}

		const dock = getDock();
		// Pendant un déplacement du dock, rien ne bouge ; la dépose relance la mise à jour.
		if (dock?.classList.contains('dragging')) {
			return;
		}

		if (!wantsHorizon(dock)) {
			if (dock && isOnHorizon()) {
				moveTo(false, dock);
			}
			return;
		}

		if (!isOnHorizon()) {
			moveTo(true, dock);
		} else if (!measureLift(dock)) {
			moveTo(false, dock);
		}
	}

	function requestUpdate() {
		if (!frame) {
			frame = requestAnimationFrame(update);
		}
	}

	// Premier passage sans animation : le dock est déjà sur l'horizon, ou doit le quitter.
	const dock = getDock();
	if (isOnHorizon() && (!wantsHorizon(dock) || !measureLift(dock))) {
		setOnHorizon(false);
	}

	// Le dock peut être déplacé ailleurs après le chargement.
	const observer = new MutationObserver(requestUpdate);
	observer.observe(html, { attributes: true, attributeFilter: ['data-dock'] });
	const offs = [
		on(window, 'scroll', requestUpdate, { passive: true }),
		on(window, 'resize', requestUpdate)
	];

	return () => {
		cancelAnimationFrame(frame);
		window.clearTimeout(timer);
		observer.disconnect();
		for (const off of offs) {
			off();
		}
		setOnHorizon(false);
		html.removeAttribute('data-dock-switch');
		html.style.removeProperty('--dock-lift');
	};
};
