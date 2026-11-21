// Distances in the coordinate system of the hero SVG.
const tileWidth = 480;
const sceneWidth = 1440;
const svgNS = 'http://www.w3.org/2000/svg';

function path(parent: SVGGElement, outline: string, color: string) {
	const shape = document.createElementNS(svgNS, 'path');
	shape.setAttribute('d', outline);
	shape.setAttribute('fill', 'var(--scene-' + color + ')');
	parent.append(shape);
}

export function createGameLandscape(land: SVGSVGElement) {
	const planes = [
		{ color: 'far', speed: 0.14, edge: 172, amplitude: 62 },
		{ color: 'mid', speed: 0.43, edge: 210, amplitude: 25 },
		{ color: 'near', speed: 0.9, edge: 258, amplitude: 26 }
	].map(config => {
		const group = land.querySelector<SVGPathElement>('path[fill="var(--scene-' + config.color + ')"]')!.parentElement!;
		return { ...config, group, tiles: new Map<number, SVGGElement>() };
	});

	function draw(distance: number) {
		for (const plane of planes) {
			const offset = distance * plane.speed;
			plane.group.style.translate = -offset + 'px 0';
			const first = Math.max(0, Math.floor((offset - sceneWidth) / tileWidth));
			const last = Math.floor(offset / tileWidth) + 1;
			for (const [index, tile] of plane.tiles) {
				if (index >= first && index <= last) continue;
				tile.remove();
				plane.tiles.delete(index);
			}
			for (let index = first; index <= last; index++) {
				if (plane.tiles.has(index)) continue;
				const tile = document.createElementNS(svgNS, 'g');
				tile.setAttribute('transform', 'translate(' + (sceneWidth + index * tileWidth) + ' 0)');
				const { edge, amplitude, color } = plane;
				const crest = edge - amplitude * (0.55 + Math.random() * 0.45);
				const center = 120 + Math.random() * 200;
				const ridge = color === 'far'
					? `L${center} ${crest} l80 43 92 -27 L480 ${edge}`
					: `C52 ${edge} ${center - 60} ${crest} ${center} ${crest} S410 ${edge} 480 ${edge}`;
				path(tile, `M0 ${edge} ${ridge} V320 H0 Z`, color);
				if (color === 'near') {
					const tree = document.createElementNS(svgNS, 'g');
					tree.setAttribute('transform', `translate(${center} ${crest + 2}) scale(${0.55 + Math.random() * 0.48})`);
					if (Math.random() < 0.5) {
						path(tree, 'M-4 0v-50h8V0Z', 'trunk');
						path(tree, 'M-34 -39a22 22 0 0 1 4-40 27 27 0 0 1 51-4 24 24 0 1 1 1 46Z', 'tree');
						path(tree, 'M-16 -40a18 18 0 1 1 0-36 18 18 0 0 1 0 36Z', 'tree-shade');
					} else {
						path(tree, 'M-22 0 0-67 22 0Z M26 1 40-44 55 1Z', 'tree-shade');
					}
					tile.append(tree);
				}
				plane.group.append(tile);
				plane.tiles.set(index, tile);
			}
		}
	}

	function reset() {
		for (const plane of planes) {
			plane.group.style.removeProperty('translate');
			for (const tile of plane.tiles.values()) tile.remove();
			plane.tiles.clear();
		}
	}
	return { draw, reset };
}
