import { on } from 'svelte/events';
import type { Attachment } from 'svelte/attachments';

// Pied du vélo arrêté dans le dessin du paysage (repère du SVG `.land`, 1440 × 320) et
// hauteur du cycliste au-dessus de ce point, tête comprise.
const bikeX = 370;
const bikeY = 289;
const riderHeight = 68;
// Agrandissement du décor en bas de page (`--zoom-scale`, lu par HeroScene).
const zoomScale = 1.6;
// Écart entre le haut de la tête du cycliste et la pointe de la bulle.
const bubbleGap = 20;

/**
 * Bas de l'accueil : le décor s'agrandit vers le vélo et une bulle de BD (le contenu de la
 * section Contact) sort de la tête du cycliste. Calcule sur l'accueil :
 * - `--zoom-origin` et `--zoom-scale` (sur le hero) : centre et facteur du zoom de HeroScene ;
 * - `--bubble-x` et `--bubble-y` (sur la section) : pointe de la bulle, dans la section.
 * Mesuré en direct (défilement, redimensionnement) : en fin de page, le hero peut être
 * repoussé vers le haut par la fin de l'empilement.
 * La mesure retire le zoom courant (même en cours de transition). Le zoom et l'apparition
 * de la bulle suivent `data-section` en CSS.
 */
export const contactBubble: Attachment<HTMLElement> = (section) => {
	const hero = document.querySelector<HTMLElement>('.hero');
	const land = hero?.querySelector<SVGSVGElement>('svg.land');
	const scene = hero?.querySelector<HTMLElement>('.scene');
	const zoomLayer = scene?.querySelector<HTMLElement>('.zoom');
	let frame = 0;

	function place() {
		frame = 0;
		const matrix = land?.getScreenCTM();
		if (!hero || !land || !scene || !zoomLayer || !matrix) {
			return;
		}

		// Le zoom peut être en cours (arrivée directe en bas de page) : on retire son facteur
		// courant, autour de son centre courant, pour retrouver le vélo hors zoom.
		const sceneRect = scene.getBoundingClientRect();
		const zoom = getComputedStyle(zoomLayer);
		const currentScale = parseFloat(zoom.scale) || 1;
		const [originX = 0, originY = 0] = zoom.transformOrigin.split(' ').map(parseFloat);
		const zoomed = new DOMPoint(bikeX, bikeY).matrixTransform(matrix);
		const point = {
			x: sceneRect.left + originX + (zoomed.x - sceneRect.left - originX) / currentScale,
			y: sceneRect.top + originY + (zoomed.y - sceneRect.top - originY) / currentScale
		};
		// Échelle du dessin à l'écran, hors zoom.
		const drawingScale = matrix.a / currentScale;
		hero.style.setProperty('--zoom-origin', `${point.x - sceneRect.left}px ${point.y - sceneRect.top}px`);
		hero.style.setProperty('--zoom-scale', String(zoomScale));

		// Tête du cycliste une fois le zoom fini, dans le repère de la section.
		const sectionRect = section.getBoundingClientRect();
		const headY = point.y - riderHeight * drawingScale * zoomScale;
		section.style.setProperty('--bubble-x', `${point.x - sectionRect.left}px`);
		section.style.setProperty('--bubble-y', `${headY - bubbleGap - sectionRect.top}px`);
	}

	function requestPlace() {
		if (!frame) {
			frame = requestAnimationFrame(place);
		}
	}

	place();
	const observer = new ResizeObserver(requestPlace);
	observer.observe(section);
	if (hero) {
		observer.observe(hero);
	}
	const offs = [on(window, 'resize', requestPlace), on(window, 'scroll', requestPlace, { passive: true })];

	return () => {
		cancelAnimationFrame(frame);
		observer.disconnect();
		for (const off of offs) {
			off();
		}
		hero?.style.removeProperty('--zoom-origin');
		hero?.style.removeProperty('--zoom-scale');
		section.style.removeProperty('--bubble-x');
		section.style.removeProperty('--bubble-y');
	};
};
