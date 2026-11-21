import { on } from 'svelte/events';
import type { Attachment } from 'svelte/attachments';

// Pied du vélo arrêté dans le dessin du paysage (repère du SVG `.land`, 1440 × 320) et
// hauteur du cycliste au-dessus de ce point, casque compris.
const riderHeight = 70;
const helmetOffsetX = 10;
// Agrandissement du décor en bas de page (`--zoom-scale`, lu par HeroScene).
const zoomScale = 1.6;
// Écart entre le haut de la tête du cycliste et la pointe de la bulle.
const bubbleGap = 36;

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
	let positioned = false;

	function place() {
		frame = 0;
		// Garder l’ancrage de la bulle pendant son fondu de sortie.
		if (positioned && document.documentElement.dataset.section !== 'contact') {
			return;
		}
		const rider = land?.querySelector<SVGGElement>('.rider');
		const html = document.documentElement;
		const fromCareer = html.dataset.section === 'contact' &&
			(html.hasAttribute('data-career-started') || html.hasAttribute('data-career-finished'));
		const matrix = fromCareer ? land?.getScreenCTM() : rider?.getScreenCTM();
		if (!hero || !land || !scene || !zoomLayer || !matrix) {
			return;
		}

		// Le zoom peut être en cours (arrivée directe en bas de page) : on retire son facteur
		// courant, autour de son centre courant, pour retrouver le vélo hors zoom.
		const sceneRect = scene.getBoundingClientRect();
		const zoom = getComputedStyle(zoomLayer);
		const currentScale = parseFloat(zoom.scale) || 1;
		const [originX = 0, originY = 0] = zoom.transformOrigin.split(' ').map(parseFloat);
		// Pendant le fondu, la caméra vise déjà la position finale du vélo.
		const destination = fromCareer
			? new DOMPoint(
				parseFloat(getComputedStyle(hero).getPropertyValue('--contact-arrival')) || 360,
				Number(land.dataset.horizonY)
			)
			: new DOMPoint();
		const zoomed = destination.matrixTransform(matrix);
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
		const headX = point.x + helmetOffsetX * drawingScale * zoomScale;
		section.style.setProperty('--bubble-x', `${headX - sectionRect.left}px`);
		section.style.setProperty('--bubble-y', `${headY - bubbleGap - sectionRect.top}px`);
		positioned = true;
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
	const sectionChanges = new MutationObserver(requestPlace);
	sectionChanges.observe(document.documentElement, { attributes: true, attributeFilter: ['data-section', 'data-career-finished'] });
	const offs = [on(window, 'resize', requestPlace), on(window, 'scroll', requestPlace, { passive: true })];

	return () => {
		cancelAnimationFrame(frame);
		observer.disconnect();
		sectionChanges.disconnect();
		for (const off of offs) {
			off();
		}
		hero?.style.removeProperty('--zoom-origin');
		hero?.style.removeProperty('--zoom-scale');
		section.style.removeProperty('--bubble-x');
		section.style.removeProperty('--bubble-y');
	};
};
