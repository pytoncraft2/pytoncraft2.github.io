import type { Element, ElementContent, Root, RootContent, Text } from 'hast';

/**
 * Transforme le HTML issu du Markdown des études de cas pour reproduire la structure
 * des anciens composants CaseStudySection et ProjectImage, sans HTML dans le contenu :
 *
 * - `## Titre {#id}` ouvre une `<section id="id">` titrée (aria-labelledby) qui regroupe
 *   tout le contenu jusqu’au `##` suivant ; l’identifiant explicite garde les ancres stables ;
 * - une image seule dans son paragraphe devient une `<figure>`, son titre Markdown
 *   (`![alt](/image.webp "Légende")`) devient la légende ;
 * - les liens externes s’ouvrent dans un nouvel onglet ;
 * - les chemins absolus (`/image.webp`) reçoivent le chemin de base du site.
 */
export type CaseStudyOptions = {
	base?: string;
};

const explicitId = /\s*\{#([\w-]+)\}\s*$/;

function element(tagName: string, properties: Element['properties'], children: ElementContent[]): Element {
	return { type: 'element', tagName, properties, children };
}

function isElement(node: RootContent | ElementContent, tagName?: string): node is Element {
	return node.type === 'element' && (tagName === undefined || node.tagName === tagName);
}

function isBlankText(node: RootContent | ElementContent): boolean {
	return node.type === 'text' && node.value.trim() === '';
}

function textContent(node: Element): string {
	return node.children
		.map((child) => (child.type === 'text' ? child.value : isElement(child) ? textContent(child) : ''))
		.join('');
}

function slugify(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** Retire le suffixe `{#id}` du titre et renvoie l’identifiant de section. */
function takeSectionId(heading: Element): string {
	const last = heading.children.at(-1);
	if (last?.type === 'text') {
		const match = last.value.match(explicitId);
		if (match) {
			(last as Text).value = last.value.replace(explicitId, '');
			return match[1];
		}
	}

	return slugify(textContent(heading));
}

function withBase(base: string, value: unknown): unknown {
	if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
		return value;
	}

	return `${base.replace(/\/$/, '')}${value}`;
}

function toFigure(paragraph: Element): Element | null {
	const meaningful = paragraph.children.filter((child) => !isBlankText(child));
	const image = meaningful[0];
	if (meaningful.length !== 1 || !image || !isElement(image, 'img')) {
		return null;
	}

	const caption = image.properties.title;
	delete image.properties.title;
	image.properties.loading = 'lazy';

	const children: ElementContent[] = [image];
	if (typeof caption === 'string' && caption) {
		children.push(element('figcaption', { className: ['ds-body-s'] }, [{ type: 'text', value: caption }]));
	}

	return element('figure', { className: ['case-figure'] }, children);
}

function visit(node: Element, base: string): void {
	if (node.tagName === 'a') {
		const href = node.properties.href;
		if (typeof href === 'string' && /^https?:\/\//.test(href)) {
			node.properties.target = '_blank';
			node.properties.rel = ['noopener', 'noreferrer'];
		} else {
			node.properties.href = withBase(base, href) as string;
		}
	}

	if (node.tagName === 'img') {
		node.properties.src = withBase(base, node.properties.src) as string;
	}

	node.children = node.children.map((child) => {
		if (!isElement(child)) {
			return child;
		}

		const figure = child.tagName === 'p' ? toFigure(child) : null;
		const next = figure ?? child;
		visit(next, base);
		return next;
	});
}

export function rehypeCaseStudy(options: CaseStudyOptions = {}) {
	const base = options.base ?? '/';

	return (tree: Root) => {
		const result: RootContent[] = [];
		let content: ElementContent[] | null = null;

		for (const node of tree.children) {
			if (isElement(node, 'h2')) {
				const id = takeSectionId(node);
				node.properties.id = `${id}-title`;
				node.properties.className = ['ds-h2'];
				content = [];
				result.push(
					element('section', { className: ['case-section'], id, ariaLabelledBy: [`${id}-title`] }, [
						node,
						element('div', { className: ['case-content'] }, content)
					])
				);
				continue;
			}

			if (content && node.type !== 'doctype' && node.type !== 'comment') {
				if (!isBlankText(node)) {
					content.push(node as ElementContent);
				}
				continue;
			}

			result.push(node);
		}

		tree.children = result;
		for (const node of tree.children) {
			if (isElement(node)) {
				visit(node, base);
			}
		}
	};
}
