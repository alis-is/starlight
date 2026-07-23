<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	interface Props extends HTMLButtonAttributes {
		label?: string;
		text?: string;
	}

	let {
		label = '',
		text = '',
		disabled = false,
		class: klass = '',
		children,
		...rest
	}: Props = $props();

	const actualText = $derived(text || label);
</script>

<button {...rest} class="button {klass}" {disabled} class:disabled>
	{#if children}{@render children()}{:else}
		{actualText}
	{/if}
</button>

<style lang="sass">
.button 
	cursor: pointer
	display: inline-block
	background-color: var(--button-background-color)
	background-image: var(--button-background-image)
	color: var(--button-text-color)
	padding: var(--button-vertical-spacing)  var(--button-horizontal-spacing)
	border-radius: var(--button-border-radius)
	font-size: var(--button-font-size)
	font-weight: var(--button-font-weight)
	white-space: var(--button-whitespace)
	text-transform: var(--button-text-transform)
	text-align: var(--button-text-align)
	text-decoration: var(--button-text-decoration)
	border: var(--button-border)
	outline: var(--button-outline)
	font-family: var(--button-font-family)
	overflow: var(--button-overflow)
	text-overflow: var(--button-text-overflow)
	letter-spacing: var(--button-letter-spacing)
	transition: var(--button-transition)
	background-size: var(--button-background-size)
	box-shadow: var(--button-box-shadow)
	background-position: var(--button-background-position)
	width: var(--button-width)
	height: var(--button-height)

	&:hover 
		color: var(--button-hover-text-color)
		background-color: var(--button-hover-background-color)
		background-image: var(--button-hover-background-image)
		box-shadow: var(--button-hover-box-shadow) !important

	&:active
		box-shadow: var(--button-active-box-shadow) !important

	&:disabled, &.disabled
		cursor: not-allowed
		opacity: 0.45
		background-image: none

		&:hover
			background-color: var(--button-background-color)

	:global(svg)
		fill: var(--button-text-color)
		stroke: var(--button-text-color)

</style>
