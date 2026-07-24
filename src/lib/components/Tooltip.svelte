<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text: string;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		children: Snippet;
		class?: string;
	}

	let { text, placement = 'top', children, class: klass = '' }: Props = $props();
</script>

<span class="sl-tooltip {placement} {klass}">
	{@render children()}
	<span class="sl-tooltip-bubble" role="tooltip">{text}</span>
</span>

<style lang="sass">
.sl-tooltip
	position: relative
	display: inline-flex
	outline: none

	.sl-tooltip-bubble
		position: absolute
		z-index: 50
		pointer-events: none
		opacity: 0
		transform: scale(0.96)
		transition: opacity 0.12s, transform 0.12s
		background-color: var(--tooltip-background-color, #1e293b)
		color: var(--tooltip-text-color, #f8fafc)
		font-size: 0.8rem
		line-height: 1.3
		padding: 0.35em 0.6em
		border-radius: calc(var(--border-radius) / 2)
		// wrap long text instead of running off narrow screens
		width: max-content
		max-width: var(--tooltip-max-width, min(18rem, 80vw))
		box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 12px

	&:hover .sl-tooltip-bubble,
	&:focus-within .sl-tooltip-bubble
		opacity: 1
		transform: scale(1)

	&.top .sl-tooltip-bubble
		bottom: calc(100% + 6px)
		left: 50%
		translate: -50% 0
	&.bottom .sl-tooltip-bubble
		top: calc(100% + 6px)
		left: 50%
		translate: -50% 0
	&.left .sl-tooltip-bubble
		right: calc(100% + 6px)
		top: 50%
		translate: 0 -50%
	&.right .sl-tooltip-bubble
		left: calc(100% + 6px)
		top: 50%
		translate: 0 -50%
</style>
