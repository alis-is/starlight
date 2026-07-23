<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Vertical rule instead of horizontal. Ignored when a label is given. */
		vertical?: boolean;
		/** Optional centered label (horizontal only). */
		children?: Snippet;
		class?: string;
	}

	let { vertical = false, children, class: klass = '' }: Props = $props();
</script>

{#if children}
	<div class="sl-separator labelled {klass}" role="separator">
		<span class="sl-separator-label">{@render children()}</span>
	</div>
{:else}
	<div
		class="sl-separator {klass}"
		class:vertical
		role="separator"
		aria-orientation={vertical ? 'vertical' : 'horizontal'}
	></div>
{/if}

<style lang="sass">
.sl-separator
	--c: var(--separator-color, var(--frost-border-color))
	border: none
	background-color: var(--c)
	opacity: var(--separator-opacity, 0.5)

	&:not(.vertical):not(.labelled)
		width: 100%
		height: var(--separator-thickness, 1px)

	&.vertical
		align-self: stretch
		width: var(--separator-thickness, 1px)
		min-height: 1em

	&.labelled
		display: flex
		align-items: center
		gap: var(--spacing-f2)
		width: 100%
		background: none
		opacity: 1
		color: var(--hint-color)
		font-size: 0.82rem

		&::before, &::after
			content: ""
			flex: 1
			height: var(--separator-thickness, 1px)
			background-color: var(--c)
			opacity: var(--separator-opacity, 0.5)
</style>
