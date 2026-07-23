<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let { title, header, footer, children, class: klass = '' }: Props = $props();
</script>

<section class="sl-card sl-card-block {klass}">
	{#if header}
		<header class="sl-card-header">{@render header()}</header>
	{:else if title}
		<header class="sl-card-header"><h3 class="sl-card-title">{title}</h3></header>
	{/if}
	{#if children}
		<div class="sl-card-body">{@render children()}</div>
	{/if}
	{#if footer}
		<footer class="sl-card-footer">{@render footer()}</footer>
	{/if}
</section>

<style lang="sass">
.sl-card-block
	display: flex
	flex-direction: column
	gap: var(--spacing-f2)

	.sl-card-header
		display: flex
		align-items: center
		justify-content: space-between

	.sl-card-title
		margin: 0
		font-size: 1.1rem

	.sl-card-footer
		display: flex
		align-items: center
		justify-content: flex-end
		gap: var(--spacing-f2)
		padding-top: var(--spacing-f2)
</style>
