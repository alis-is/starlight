<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'info' | 'success' | 'warning' | 'error';
		title?: string;
		/** Optional leading icon (kept icon-agnostic — pass any snippet). */
		icon?: Snippet;
		/** Show a dismiss button; fires `ondismiss`. */
		dismissible?: boolean;
		ondismiss?: () => void;
		children?: Snippet;
		class?: string;
	}

	let {
		variant = 'info',
		title,
		icon,
		dismissible = false,
		ondismiss,
		children,
		class: klass = ''
	}: Props = $props();
</script>

<div class="sl-alert {variant} {klass}" role="alert">
	{#if icon}
		<span class="sl-alert-icon">{@render icon()}</span>
	{/if}
	<div class="sl-alert-body">
		{#if title}<div class="sl-alert-title">{title}</div>{/if}
		{#if children}<div class="sl-alert-message">{@render children()}</div>{/if}
	</div>
	{#if dismissible}
		<button class="sl-alert-dismiss" aria-label="Dismiss" onclick={() => ondismiss?.()}>×</button>
	{/if}
</div>

<style lang="sass">
.sl-alert
	--c: var(--accent)
	display: flex
	align-items: flex-start
	gap: var(--spacing-f2)
	padding: var(--alert-padding, var(--spacing))
	border-radius: var(--border-radius)
	border: 1px solid color-mix(in srgb, var(--c) 35%, transparent)
	background: var(--alert-background, color-mix(in srgb, var(--c) 12%, transparent))
	color: var(--text-color)

	&.success
		--c: var(--success-color)
	&.warning
		--c: var(--warning-color)
	&.error
		--c: var(--error-color)

	.sl-alert-icon
		display: inline-flex
		flex: none
		color: var(--c)
		fill: var(--c)
		width: 1.25rem
		height: 1.25rem
		margin-top: 0.05rem

		:global(svg)
			width: 100%
			height: 100%
			fill: currentColor

	.sl-alert-body
		flex: 1
		min-width: 0
		display: flex
		flex-direction: column
		gap: 0.15rem

	.sl-alert-title
		font-weight: 600
		color: var(--c)

	.sl-alert-message
		color: var(--hint-color)
		font-size: 0.92rem

	.sl-alert-dismiss
		flex: none
		cursor: pointer
		background: none
		border: none
		color: var(--hint-color)
		font-size: 1.2rem
		line-height: 1
		padding: 0 0.15em
		border-radius: calc(var(--border-radius) / 2)
		transition: color 0.12s

		&:hover
			color: var(--c)
</style>
