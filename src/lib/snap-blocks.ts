import { on } from 'svelte/events';
import type { Attachment } from 'svelte/attachments';

const alignTolerance = 24;
const trackpadThreshold = 72;
const gestureIdleMs = 220;
const nativeHoldMs = 480;
const fastDelta = 180;
const longExtraDelta = 140;
// Écart minimal d'un cran de molette : les petits écarts de l'inertie d'un trackpad n'en sont pas.
const wheelNotchDelta = 40;
// Durée du glissement vers le bloc suivant, proportionnelle à la distance.
const minDurationMs = 600;
const maxDurationMs = 950;
const durationPerPx = 0.75;
// Écart toléré entre la position attendue et la position réelle avant de considérer
// que l'utilisateur a repris la main (barre de défilement, recherche dans la page…).
const takeoverTolerance = 3;

function parseLength(value: string) {
	const parsed = parseFloat(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

function getScrollPadding() {
	const styles = getComputedStyle(document.documentElement);
	return {
		top: parseLength(styles.scrollPaddingTop),
		bottom: parseLength(styles.scrollPaddingBottom)
	};
}

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canUseWheelSnap() {
	return (
		window.matchMedia('(min-width: 40rem)').matches &&
		window.matchMedia('(pointer: fine)').matches
	);
}

function isInsideScrollable(target: EventTarget | null, deltaY: number) {
	if (!(target instanceof Element)) {
		return false;
	}

	let element: Element | null = target;
	while (element && element !== document.documentElement) {
		const style = getComputedStyle(element);
		const overflowY = style.overflowY;
		if (
			(overflowY === 'auto' || overflowY === 'scroll') &&
			element.scrollHeight > element.clientHeight + 1
		) {
			if (deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1) {
				return true;
			}

			if (deltaY < 0 && element.scrollTop > 1) {
				return true;
			}
		}

		element = element.parentElement;
	}

	return false;
}

function maxScrollY() {
	return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function currentIndex(blocks: HTMLElement[]) {
	if (window.scrollY >= maxScrollY() - 8) {
		return blocks.length - 1;
	}

	const probe = getScrollPadding().top + alignTolerance;
	let index = 0;

	for (let i = 0; i < blocks.length; i += 1) {
		if (blocks[i].getBoundingClientRect().top <= probe) {
			index = i;
		}
	}

	return index;
}

function hasOverflowInDirection(block: HTMLElement, direction: 1 | -1) {
	const { top, bottom } = getScrollPadding();
	const rect = block.getBoundingClientRect();
	const viewBottom = window.innerHeight - bottom;

	if (direction > 0) {
		return rect.bottom > viewBottom + 8 && rect.top < viewBottom;
	}

	return rect.top < top - alignTolerance && rect.bottom > top;
}

function easeInOutCubic(t: number) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Position du bloc dans le flux, même lorsqu'il est collé (`position: sticky`) à l'écran.
function flowTop(block: HTMLElement) {
	const previous = block.style.position;
	block.style.position = 'static';
	const top = block.getBoundingClientRect().top + window.scrollY;
	block.style.position = previous;
	return top;
}

function blockScrollTop(block: HTMLElement) {
	const top = flowTop(block) - getScrollPadding().top;
	return Math.min(Math.max(0, top), maxScrollY());
}

function normalizeDelta(event: WheelEvent) {
	if (event.deltaMode === 1) {
		return event.deltaY * 16;
	}

	if (event.deltaMode === 2) {
		return event.deltaY * window.innerHeight;
	}

	return event.deltaY;
}

export const snapBlocks: Attachment<HTMLElement> = (root) => {
	let nativeUntil = 0;
	let accumulated = 0;
	let lastEventAt = 0;
	let extraAfterSnap = 0;
	let frame = 0;
	// Après l'animation, la molette reste verrouillée jusqu'à une pause de `gestureIdleMs`,
	// le temps que l'inertie du trackpad s'épuise.
	let settling = false;

	function resetGesture() {
		accumulated = 0;
		extraAfterSnap = 0;
	}

	function stopAnimation() {
		if (frame) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
	}

	function release() {
		stopAnimation();
		settling = false;
	}

	function useNativeScroll(now: number) {
		nativeUntil = now + nativeHoldMs;
		release();
		resetGesture();
	}

	function animateTo(top: number) {
		stopAnimation();
		const startY = window.scrollY;
		const distance = top - startY;
		if (Math.abs(distance) < 1) {
			return;
		}

		const duration = Math.min(
			maxDurationMs,
			Math.max(minDurationMs, Math.abs(distance) * durationPerPx)
		);
		const startedAt = performance.now();
		let expectedY = startY;
		settling = false;

		const step = (time: number) => {
			if (Math.abs(window.scrollY - expectedY) > takeoverTolerance) {
				release();
				return;
			}

			const progress = Math.min(1, Math.max(0, (time - startedAt) / duration));
			// `instant` contourne le `scroll-behavior: smooth` de la page.
			window.scrollTo({ top: startY + distance * easeInOutCubic(progress), behavior: 'instant' });
			expectedY = window.scrollY;

			if (progress < 1) {
				frame = requestAnimationFrame(step);
			} else {
				frame = 0;
				settling = true;
			}
		};

		frame = requestAnimationFrame(step);
	}

	function onWheel(event: WheelEvent) {
		if (event.ctrlKey || event.shiftKey || event.defaultPrevented) {
			return;
		}

		if (prefersReducedMotion() || !canUseWheelSnap()) {
			return;
		}

		if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) {
			return;
		}

		if (isInsideScrollable(event.target, event.deltaY)) {
			return;
		}

		const now = performance.now();
		const delta = normalizeDelta(event);

		if (now - lastEventAt > gestureIdleMs) {
			resetGesture();
			settling = false;
		}

		lastEventAt = now;

		if (now < nativeUntil || Math.abs(delta) >= fastDelta) {
			useNativeScroll(now);
			return;
		}

		if (frame || settling) {
			event.preventDefault();
			// Plusieurs crans de molette juste après l'arrivée : rendre le défilement libre.
			if (settling && Math.abs(delta) >= wheelNotchDelta) {
				extraAfterSnap += Math.abs(delta);
				if (extraAfterSnap >= longExtraDelta) {
					useNativeScroll(now);
				}
			}
			return;
		}

		const blocks = [...root.querySelectorAll<HTMLElement>('.snap-block')];
		if (blocks.length < 2) {
			return;
		}

		const direction = delta > 0 ? 1 : -1;
		const index = currentIndex(blocks);
		const current = blocks[index];
		if (hasOverflowInDirection(current, direction)) {
			resetGesture();
			return;
		}

		const snapLine = getScrollPadding().top;
		const pastStart = current.getBoundingClientRect().top < snapLine - alignTolerance;
		const canAlignToStart = pastStart && window.scrollY > 8;
		const target = direction < 0 && canAlignToStart ? current : blocks[index + direction];
		if (!target) {
			resetGesture();
			return;
		}

		event.preventDefault();

		if (Math.sign(accumulated) !== 0 && Math.sign(accumulated) !== direction) {
			accumulated = 0;
		}

		if (event.deltaMode === 0 && Math.abs(event.deltaY) < wheelNotchDelta) {
			accumulated += event.deltaY;
			if (Math.abs(accumulated) < trackpadThreshold) {
				return;
			}
		}

		resetGesture();
		animateTo(target === blocks[0] ? 0 : blockScrollTop(target));
	}

	// Toute autre interaction interrompt le glissement et rend la main.
	const interruptions = (['pointerdown', 'touchstart', 'keydown'] as const).map((type) =>
		on(window, type, release, { passive: true })
	);
	const offWheel = on(window, 'wheel', onWheel, { passive: false });

	return () => {
		release();
		offWheel();
		for (const off of interruptions) {
			off();
		}
	};
};

/**
 * Empilement : chaque bloc reste collé en haut de l'écran pendant que le suivant glisse
 * par-dessus, et s'efface avant que leurs contenus se superposent (opacité exposée en
 * `--stack-opacity`). Un bloc plus haut que l'écran ne se colle qu'une fois son bas atteint, pour
 * rester lisible jusqu'au bout. Le dernier bloc reçoit la marge nécessaire pour pouvoir
 * s'aligner en haut comme les autres. Sans ce script, les blocs défilent normalement.
 */
export const stackBlocks: Attachment<HTMLElement> = (root) => {
	const blocks = [...root.querySelectorAll<HTMLElement>('.snap-block')];
	const last = blocks[blocks.length - 1];
	// Défilement, depuis le moment où un bloc se colle, au bout duquel le contenu du
	// suivant atteint le sien : marge entre eux et espacements intérieurs.
	let fadeLengths: number[] = [];
	let gaps: number[] = [];
	let frame = 0;

	function layout() {
		const { top, bottom } = getScrollPadding();
		const available = window.innerHeight - bottom;
		last.style.removeProperty('margin-bottom');
		const styles = blocks.map((block) => getComputedStyle(block));
		gaps = styles.map((style) => parseLength(style.marginBottom));
		fadeLengths = blocks.slice(0, -1).map((_, i) => {
			const current = styles[i];
			const next = styles[i + 1];
			return Math.max(
				1,
				gaps[i] +
					parseLength(current.paddingBottom) +
					parseLength(current.borderBottomWidth) +
					parseLength(next.paddingTop) +
					parseLength(next.borderTopWidth)
			);
		});
		for (const block of blocks) {
			const stackTop = Math.min(top, available - block.offsetHeight);
			block.style.setProperty('--stack-top', `${stackTop}px`);
		}

		const extra = flowTop(last) - top - maxScrollY();
		if (extra > 0) {
			last.style.marginBottom = `${gaps[gaps.length - 1] + extra}px`;
		}
		fade();
	}

	function fade() {
		frame = 0;
		for (let i = 0; i < blocks.length - 1; i += 1) {
			// Avancée du bloc suivant depuis que celui-ci est collé.
			const advance =
				blocks[i].getBoundingClientRect().bottom +
				gaps[i] -
				blocks[i + 1].getBoundingClientRect().top;
			const progress = Math.min(1, Math.max(0, advance / fadeLengths[i]));
			// Sous 1 px d'avancée (arrondis de position), le bloc reste entièrement visible.
			// Le CSS de la page choisit les éléments du bloc qui s'effacent.
			if (advance > 1) {
				blocks[i].style.setProperty('--stack-opacity', (1 - progress).toFixed(3));
			} else {
				blocks[i].style.removeProperty('--stack-opacity');
			}
			blocks[i].toggleAttribute('data-covered', progress >= 0.5);
		}
	}

	function requestFade() {
		if (!frame) {
			frame = requestAnimationFrame(fade);
		}
	}

	// Le focus clavier sur un bloc effacé ramène ce bloc à l'écran.
	function onFocusIn(event: FocusEvent) {
		const block = blocks.find(
			(item) => item.hasAttribute('data-covered') && event.target instanceof Node && item.contains(event.target)
		);
		if (block) {
			window.scrollTo({ top: block === blocks[0] ? 0 : blockScrollTop(block) });
		}
	}

	layout();
	root.setAttribute('data-stacked', '');
	const observer = new ResizeObserver(layout);
	for (const block of blocks) {
		observer.observe(block);
	}
	const offs = [
		on(window, 'resize', layout),
		on(window, 'scroll', requestFade, { passive: true }),
		on(root, 'focusin', onFocusIn)
	];

	return () => {
		observer.disconnect();
		cancelAnimationFrame(frame);
		for (const off of offs) {
			off();
		}
		root.removeAttribute('data-stacked');
		for (const block of blocks) {
			block.style.removeProperty('--stack-top');
			block.style.removeProperty('--stack-opacity');
			block.style.removeProperty('margin-bottom');
			block.removeAttribute('data-covered');
		}
	};
};

/**
 * Section courante, exposée sur `<html>` en `data-section` (valeur du `data-section` du
 * bloc) pour l'état actif du dock : le dernier bloc dont le haut a passé le milieu de
 * l'écran. Avec l'empilement, c'est celui qui vient de recouvrir les précédents.
 */
export const trackSection: Attachment<HTMLElement> = (root) => {
	const html = document.documentElement;
	const blocks = [...root.querySelectorAll<HTMLElement>('.snap-block[data-section]')];
	let frame = 0;

	function update() {
		frame = 0;
		const middle = window.innerHeight / 2;
		let current = blocks[0];
		for (const block of blocks) {
			if (block.getBoundingClientRect().top <= middle) {
				current = block;
			}
		}

		if (window.scrollY >= maxScrollY() - 8) {
			current = blocks[blocks.length - 1];
		}

		const section = current?.dataset.section;
		if (section && html.dataset.section !== section) {
			html.dataset.section = section;
		}
	}

	function requestUpdate() {
		if (!frame) {
			frame = requestAnimationFrame(update);
		}
	}

	update();
	const offs = [
		on(window, 'scroll', requestUpdate, { passive: true }),
		on(window, 'resize', requestUpdate)
	];

	return () => {
		cancelAnimationFrame(frame);
		for (const off of offs) {
			off();
		}
		delete html.dataset.section;
	};
};
