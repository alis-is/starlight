<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import TimesIcon from '../la/icons/times-solid.svelte';
	import PlusIcon from '../la/icons/plus-solid.svelte';

	interface Props {
		items?: T[];
		/** Show the search box. */
		searchable?: boolean;
		searchPlaceholder?: string;
		/** String used for searching and default display. */
		text?: (item: T) => string;
		/** Custom match predicate (overrides `text`-based contains match). */
		filterFn?: (item: T, query: string) => boolean;
		/** Show an add-item input + button. */
		addable?: boolean;
		addPlaceholder?: string;
		/** Called with the typed text; parent is responsible for appending. */
		onadd?: (text: string) => void;
		/** When set, each row shows a remove button. */
		onremove?: (item: T, index: number) => void;
		onselect?: (item: T, index: number) => void;
		/** Custom row renderer. */
		item?: Snippet<[{ item: T; index: number }]>;
		empty?: Snippet;
		class?: string;
	}

	let {
		items = $bindable([]),
		searchable = true,
		searchPlaceholder = 'Search…',
		text = (item: T) => String(item),
		filterFn,
		addable = false,
		addPlaceholder = 'Add item…',
		onadd,
		onremove,
		onselect,
		item,
		empty,
		class: klass = ''
	}: Props = $props();

	let query = $state('');
	let draft = $state('');

	const match = (it: T, q: string) =>
		filterFn ? filterFn(it, q) : text(it).toLowerCase().includes(q.toLowerCase());

	const visible = $derived(
		query.trim() === ''
			? items.map((it, i) => ({ it, i }))
			: items.map((it, i) => ({ it, i })).filter(({ it }) => match(it, query))
	);

	function add() {
		const value = draft.trim();
		if (!value) return;
		onadd?.(value);
		draft = '';
	}
</script>

<div class="sl-list {klass}">
	{#if searchable || (addable && onadd)}
		<div class="sl-list-controls">
			{#if searchable}
				<input
					class="sl-list-input search"
					type="search"
					placeholder={searchPlaceholder}
					bind:value={query}
					aria-label="Search list"
				/>
			{/if}
			{#if addable && onadd}
				<div class="sl-list-add">
					<input
						class="sl-list-input"
						type="text"
						placeholder={addPlaceholder}
						bind:value={draft}
						onkeydown={(e) => e.key === 'Enter' && add()}
						aria-label="New item"
					/>
					<Button
						class="sl-list-add-btn"
						onclick={add}
						disabled={!draft.trim()}
						aria-label="Add item"
						style="--button-width: auto"
					>
						<PlusIcon />
					</Button>
				</div>
			{/if}
		</div>
	{/if}

	<ul class="sl-list-items" role="listbox">
		{#each visible as { it, i } (i)}
			<li class="sl-list-item" class:clickable={!!onselect} role="option" aria-selected="false">
				{#if onselect}
					<div
						class="sl-list-item-body"
						role="button"
						tabindex="0"
						onclick={() => onselect(it, i)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onselect(it, i)}
					>
						{#if item}{@render item({ item: it, index: i })}{:else}{text(it)}{/if}
					</div>
				{:else}
					<div class="sl-list-item-body">
						{#if item}{@render item({ item: it, index: i })}{:else}{text(it)}{/if}
					</div>
				{/if}
				{#if onremove}
					<button class="sl-list-remove" aria-label="Remove item" onclick={() => onremove(it, i)}>
						<TimesIcon />
					</button>
				{/if}
			</li>
		{:else}
			<li class="sl-list-empty">
				{#if empty}{@render empty()}{:else}{query.trim() ? 'No matches' : 'No items'}{/if}
			</li>
		{/each}
	</ul>
</div>

<style lang="sass">
.sl-list
	display: flex
	flex-direction: column
	gap: var(--spacing-f2)
	width: 100%
	color: var(--text-color)

	.sl-list-controls
		display: flex
		flex-direction: column
		gap: var(--spacing-f2)

	.sl-list-add
		display: flex
		gap: var(--spacing-f2)

		:global(.sl-list-add-btn)
			aspect-ratio: 1
			display: inline-flex
			align-items: center
			justify-content: center
			padding: 0
			width: auto
			min-width: calc(var(--input-line-height) + var(--input-vertical-spacing) * 2)

		:global(.sl-list-add-btn svg)
			width: 1.15rem
			height: 1.15rem

	.sl-list-input
		flex: 1
		min-width: 0
		box-sizing: border-box
		padding: var(--input-vertical-spacing, 0.75rem) var(--input-horizontal-spacing, 1rem)
		border-radius: var(--input-border-radius, var(--border-radius))
		border: 1px solid var(--frost-border-color)
		background-color: var(--input-background-color)
		color: var(--input-text-color, inherit)
		font-family: inherit
		font-size: var(--font-size, 1rem)
		outline: none
		transition: background-color 0.15s, border-color 0.15s

		&::placeholder
			color: var(--input-hint-color, var(--hint-color))

		&:focus
			background-color: var(--input-background-highlight-color)
			border-color: var(--accent)

	.sl-list-items
		list-style: none
		margin: 0
		padding: 0
		display: flex
		flex-direction: column
		gap: var(--list-item-gap, 0)
		overflow: auto

	.sl-list-item
		display: flex
		align-items: center
		gap: var(--spacing-f2)
		padding: var(--list-item-padding, var(--spacing-f2) var(--spacing))
		border-radius: var(--list-item-border-radius, 0)
		border-bottom: var(--list-item-border, 1px solid rgba(127, 127, 127, 0.2))

		&:last-child
			border-bottom: none

		&.clickable .sl-list-item-body
			cursor: pointer

		.sl-list-item-body
			flex: 1
			min-width: 0
			overflow: hidden
			text-overflow: ellipsis

	.sl-list-remove
		cursor: pointer
		flex: none
		background: none
		border: none
		display: inline-flex
		align-items: center
		justify-content: center
		width: 2rem
		height: 2rem
		border-radius: calc(var(--border-radius) / 2)
		color: var(--hint-color)
		opacity: 0.65
		transition: background-color 0.12s, color 0.12s, opacity 0.12s

		&:hover
			opacity: 1
			color: var(--text-color)
			background-color: color-mix(in srgb, var(--text-color) 12%, transparent)

		:global(svg)
			width: 1.05rem
			height: 1.05rem
			fill: currentColor
			transition: transform 0.12s

		&:hover :global(svg)
			transform: scale(1.15)

	.sl-list-empty
		list-style: none
		padding: var(--spacing)
		text-align: center
		opacity: 0.7
</style>
