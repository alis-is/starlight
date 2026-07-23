<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Crumb {
		label: string;
		href?: string;
		onclick?: () => void;
	}

	interface Props {
		items?: Crumb[];
		/** Separator between crumbs; defaults to a chevron glyph. */
		separator?: string;
		/** Custom crumb renderer. */
		item?: Snippet<[{ crumb: Crumb; last: boolean }]>;
		class?: string;
	}

	let { items = [], separator = '›', item, class: klass = '' }: Props = $props();
</script>

<nav class="sl-breadcrumbs {klass}" aria-label="Breadcrumb">
	<ol>
		{#each items as crumb, i (i)}
			{@const last = i === items.length - 1}
			<li>
				{#if item}
					{@render item({ crumb, last })}
				{:else if last}
					<span class="sl-crumb current" aria-current="page">{crumb.label}</span>
				{:else if crumb.href}
					<a class="sl-crumb" href={crumb.href} onclick={crumb.onclick}>{crumb.label}</a>
				{:else}
					<button class="sl-crumb" type="button" onclick={crumb.onclick}>{crumb.label}</button>
				{/if}
				{#if !last}<span class="sl-crumb-sep" aria-hidden="true">{separator}</span>{/if}
			</li>
		{/each}
	</ol>
</nav>

<style lang="sass">
.sl-breadcrumbs
	ol
		list-style: none
		margin: 0
		padding: 0
		display: flex
		flex-wrap: wrap
		align-items: center
		gap: var(--spacing-f2)

	li
		display: inline-flex
		align-items: center
		gap: var(--spacing-f2)

	.sl-crumb
		font: inherit
		background: none
		border: none
		padding: 0
		cursor: pointer
		color: var(--hint-color)
		text-decoration: none
		border-radius: calc(var(--border-radius) / 2)
		transition: color 0.12s

		&:hover
			color: var(--accent)

		&.current
			color: var(--text-color)
			cursor: default
			font-weight: 600

	.sl-crumb-sep
		color: var(--hint-color)
		opacity: 0.6
</style>
