import { on } from 'svelte/events';
import type { Attachment } from 'svelte/attachments';

const alignTolerance = 24;
const trackpadThreshold = 72;
const snapLockMs = 650;
const gestureIdleMs = 220;
const nativeHoldMs = 480;
const fastDelta = 180;
const longExtraDelta = 140;

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
	let lockedUntil = 0;
	let nativeUntil = 0;
	let accumulated = 0;
	let lastEventAt = 0;
	let extraAfterSnap = 0;

	function resetGesture() {
		accumulated = 0;
		extraAfterSnap = 0;
	}

	function useNativeScroll(now: number) {
		nativeUntil = now + nativeHoldMs;
		lockedUntil = 0;
		resetGesture();
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
		}

		lastEventAt = now;

		if (now < nativeUntil || Math.abs(delta) >= fastDelta) {
			useNativeScroll(now);
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

		if (now < lockedUntil) {
			extraAfterSnap += Math.abs(delta);
			if (extraAfterSnap >= longExtraDelta) {
				useNativeScroll(now);
				return;
			}

			event.preventDefault();
			return;
		}

		event.preventDefault();

		if (Math.sign(accumulated) !== 0 && Math.sign(accumulated) !== direction) {
			accumulated = 0;
		}

		if (event.deltaMode === 0 && Math.abs(event.deltaY) < 40) {
			accumulated += event.deltaY;
			if (Math.abs(accumulated) < trackpadThreshold) {
				return;
			}
		}

		accumulated = 0;
		extraAfterSnap = 0;
		lockedUntil = now + snapLockMs;
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	return on(window, 'wheel', onWheel, { passive: false });
};
