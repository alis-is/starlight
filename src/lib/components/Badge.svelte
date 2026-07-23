<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
		/** Render as an outline pill instead of a filled/soft one. */
		outline?: boolean;
		children?: Snippet;
		class?: string;
	}

	let { variant = 'default', outline = false, children, class: klass = '' }: Props = $props();
</script>

<span class="sl-badge {variant} {klass}" class:outline>
	{@render children?.()}
</span>

<style lang="sass">
.sl-badge
	display: inline-flex
	align-items: center
	gap: var(--spacing-f2)
	padding: 0.15em 0.6em
	border-radius: 999px
	font-size: var(--badge-font-size, 0.78rem)
	font-weight: 600
	line-height: 1.4
	white-space: nowrap
	--c: var(--hint-color)

	&.accent
		--c: var(--accent)
	&.success
		--c: var(--success-color)
	&.warning
		--c: var(--warning-color)
	&.error
		--c: var(--error-color)

	background-color: color-mix(in srgb, var(--c) 16%, transparent)
	color: var(--c)

	&.outline
		background-color: transparent
		border: 1px solid color-mix(in srgb, var(--c) 60%, transparent)
</style>
