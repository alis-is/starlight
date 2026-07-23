<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { MenuItem } from '../types';
	import Button from './Button.svelte';

	interface Props {
		align?: 'left' | 'right';
		items?: Array<MenuItem>;
		disabled?: boolean;
		/** `below` opens under the trigger; `cover` overlays it and matches its width (combobox style). */
		placement?: 'below' | 'cover';
		/** Minimum menu width; defaults to the trigger width. */
		minWidth?: number;
		menu_button?: Snippet<[{ open: () => void; toggle: () => void; isOpen: boolean }]>;
		menuButtonContent?: Snippet;
		menu_item?: Snippet<[{ select: () => void; item: MenuItem }]>;
		onselect?: (item: MenuItem) => void;
	}

	let {
		align = 'left',
		items = [],
		disabled = false,
		placement = 'below',
		minWidth = 150,
		menu_button,
		menuButtonContent,
		menu_item,
		onselect
	}: Props = $props();

	let ownerElement: HTMLDivElement;
	let menuElement: HTMLDivElement;
	let isOpen = $state(false);

	const GAP = 4;
	const EDGE = 8;

	// Move the menu to <body> so it escapes any clipping / backdrop-filter
	// ancestor, while staying a normal fixed element (below the nav, unlike a
	// top-layer popover which would always paint above it).
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	function position() {
		const owner = ownerElement.getBoundingClientRect();

		if (placement === 'cover') {
			menuElement.style.width = `${owner.width}px`;
		} else {
			menuElement.style.width = '';
			menuElement.style.minWidth = `${Math.max(owner.width, minWidth)}px`;
		}

		const menu = menuElement.getBoundingClientRect();

		let left = placement === 'cover' || align === 'left' ? owner.left : owner.right - menu.width;
		left = Math.max(EDGE, Math.min(left, window.innerWidth - menu.width - EDGE));

		let top = placement === 'cover' ? owner.top : owner.bottom + GAP;
		if (top + menu.height > window.innerHeight - EDGE) {
			top = Math.max(EDGE, window.innerHeight - menu.height - EDGE);
		}

		menuElement.style.left = `${left}px`;
		menuElement.style.top = `${top}px`;
	}

	const onOutsidePointer = (e: PointerEvent) => {
		if (ownerElement.contains(e.target as Node) || menuElement.contains(e.target as Node)) return;
		close();
	};
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') close();
	};
	// A fixed menu detaches from its trigger on scroll/resize — re-anchor it
	// (keeps it glued to the trigger, and is robust to programmatic scrolls).
	let reflowScheduled = false;
	const onReflow = () => {
		if (reflowScheduled) return;
		reflowScheduled = true;
		requestAnimationFrame(() => {
			reflowScheduled = false;
			if (isOpen) position();
		});
	};

	async function open() {
		if (disabled || isOpen) return;
		isOpen = true;
		await tick(); // element is now displayed and measurable (before paint)
		position();
		document.addEventListener('pointerdown', onOutsidePointer, true);
		document.addEventListener('keydown', onKey, true);
		window.addEventListener('scroll', onReflow, true);
		window.addEventListener('resize', onReflow);
	}

	function close() {
		if (!isOpen) return;
		isOpen = false;
		document.removeEventListener('pointerdown', onOutsidePointer, true);
		document.removeEventListener('keydown', onKey, true);
		window.removeEventListener('scroll', onReflow, true);
		window.removeEventListener('resize', onReflow);
	}

	function toggle() {
		if (isOpen) close();
		else open();
	}

	function select(item: MenuItem) {
		if (item.disabled) return;
		onselect?.(item);
		close();
	}
</script>

<div class="container" bind:this={ownerElement}>
	{#if menu_button}
		{@render menu_button({ open, toggle, isOpen })}
	{:else}
		<Button class="owner" {disabled} onclick={toggle} aria-haspopup="menu" aria-expanded={isOpen}>
			{#if menuButtonContent}{@render menuButtonContent()}{:else}Menu{/if}
		</Button>
	{/if}

	<div
		class="menu-popover sl-card"
		class:open={isOpen}
		bind:this={menuElement}
		use:portal
		role="menu"
	>
		{#each items as item (item.value ?? item.label)}
			{#if menu_item}
				{@render menu_item({ select: () => select(item), item })}
			{:else}
				<button
					type="button"
					class="menu-item unstyle-button"
					class:disabled={item.disabled}
					disabled={item.disabled}
					role="menuitem"
					onclick={() => select(item)}
				>
					{#if item.icon}
						{#if 'family' in item.icon}
							<i class="menu-item-icon {item.icon.family} {item.icon.id}"></i>
						{:else}
							{@const Icon = item.icon}
							<div class="menu-item-icon"><Icon /></div>
						{/if}
					{/if}
					<span class="item-label">{item.label}</span>
				</button>
			{/if}
		{/each}
	</div>
</div>

<style lang="sass">
.container
	display: inline-block
	width: 100%
	height: auto

.menu-popover
	position: fixed
	box-sizing: border-box
	// Above page content, but below the nav (z 50) and dialogs (z 100).
	z-index: var(--menu-z-index, 45)
	display: flex
	flex-direction: column
	gap: var(--menu-item-gap, 2px)
	margin: 0
	padding: var(--menu-padding, var(--spacing-f2))
	border: var(--menu-border, none)
	max-height: var(--menu-max-height, calc(100vh - 2 * var(--spacing)))
	max-width: var(--menu-max-width, calc(100vw - 2 * var(--spacing)))
	overflow-y: auto
	background-color: var(--menu-background-color)
	backdrop-filter: var(--menu-backdrop-filter, var(--blur-filter))
	box-shadow: var(--menu-box-shadow, rgba(0, 0, 0, 0.25) 0px 8px 24px)
	// animate both in and out (transitions, not a one-shot keyframe)
	transform-origin: top center
	opacity: 0
	visibility: hidden
	transform: translateY(-6px) scale(0.98)
	pointer-events: none
	transition: opacity var(--menu-animation-duration, 0.14s) ease, transform var(--menu-animation-duration, 0.14s) ease, visibility var(--menu-animation-duration, 0.14s)

	&.open
		opacity: 1
		visibility: visible
		transform: none
		pointer-events: auto

	.menu-item
		display: flex
		align-items: center
		gap: var(--spacing-f2)
		width: 100%
		padding: var(--menu-item-padding, var(--spacing-f2) var(--spacing))
		border-radius: var(--menu-item-border-radius, calc(var(--border-radius) / 2))
		justify-content: var(--menu-justify-content, flex-start)
		color: var(--text-color)
		text-transform: none
		transition: background-color 0.1s

		&:hover
			background-color: var(--menu-item-hover-background-color, var(--accent-soft))

		&.disabled
			opacity: 0.5
			cursor: not-allowed

		.item-label
			overflow: hidden
			text-overflow: ellipsis
			white-space: nowrap

		.menu-item-icon
			display: inline-flex
			color: var(--text-color)
			fill: var(--text-color)
			width: var(--menu-item-icon-size, 1.25rem)
			height: var(--menu-item-icon-size, 1.25rem)
</style>
