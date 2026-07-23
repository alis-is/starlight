<script lang="ts">
	import AngleRight from '../icons/angle-right.svelte';
	import AngleLeft from '../icons/angle-left.svelte';
	import { ExpandingContainerDirection } from '../types';
	import Button from './Button.svelte';
	import ExpandingContainer from './ExpandingContainer.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen?: boolean;
		island_icon?: Snippet;
		children?: Snippet;
	}

	let { isOpen = $bindable(false), island_icon, children }: Props = $props();
</script>

<div class="island-wrap">
	<div class="island sl-card">
		<div class="island-icon">
			<Button onclick={() => (isOpen = !isOpen)}>
				<div class="island-icon-content custom" class:open={isOpen}>
					{#if island_icon}{@render island_icon()}{:else}
						<AngleLeft />
					{/if}
				</div>
				<div class="island-icon-content chevron" class:open={isOpen}>
					<AngleRight />
				</div>
			</Button>
		</div>

		<ExpandingContainer direction={ExpandingContainerDirection.horizontal} {isOpen}>
			<div class="island-content" class:open={isOpen}>
				{@render children?.()}
			</div>
		</ExpandingContainer>
	</div>
</div>

<style lang="sass">
.island-wrap
	--card-vertical-spacing: 0
	--card-horizontal-spacing: 0
.island
	display: grid
	grid-template-columns: 1fr auto
	grid-template-areas: "tools-menu tools-icon"
	align-items: stretch

	// the toggle is a subtle, full-height ghost handle so the whole island reads
	// as one surface (the card clips the outer corners)
	--button-vertical-spacing: 0
	--button-horizontal-spacing: 0
	--button-border-radius: 0
	--button-height: 100%
	--button-width: var(--island-collapsed-width)
	--button-background-color: transparent
	--button-background-image: none
	--button-text-color: var(--accent)
	--button-hover-background-color: var(--accent-soft)
	--button-hover-text-color: var(--accent)

	.island-icon
		cursor: pointer
		position: relative
		min-height: var(--island-collapsed-height)
		width: var(--island-collapsed-width)
		align-self: stretch
		justify-content: center
		align-items: center
		display: flex
		grid-area: tools-icon

		.island-icon-content
			position: absolute
			inset: 0
			display: flex
			justify-content: center
			align-items: center

		.chevron
			opacity: 0
			transform: scale(0.5)
			transition: all 0.2s ease-in-out

			&.open
				opacity: 1
				transform: scale(1)

		.custom
			opacity: 1
			transition: all 0.2s ease-in-out

			&.open
				opacity: 0
				transform: scale(0.5)

		:global(svg)
			fill: var(--button-text-color, var(--accent-contrast))
			width: var(--island-icon-width)
			height: var(--island-icon-height)

	.island-content
		display: flex
		align-items: center
		height: 100%
		box-sizing: border-box
		white-space: nowrap
		padding: 0

		&.open
			padding: var(--island-content-padding, var(--spacing-f2) var(--spacing))
			border-right: 1px solid var(--frost-border-color)

</style>
