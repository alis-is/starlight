<script lang="ts">
	import ExpandingContainer from './ExpandingContainer.svelte';
	import AngleDown from '../svg/angle-down.svelte';
	import Button from './Button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet;
		header_title?: Snippet<[{ title?: string }]>;
		children: Snippet;
		icon?: Snippet;
		title?: string;
		is_open?: boolean;
	}

	let { children, header, is_open = $bindable(false), title, header_title, icon }: Props = $props();

	export function open() {
		is_open = true;
	}
</script>

<div class="expander-wrap">
	<div class="expander-grid sl-card">
		<div class="expander-header">
			{#if header}
				{@render header()}
			{:else}
				<Button onclick={() => (is_open = !is_open)}>
					<div class="expander-header">
						<div class="header-content" class:open={is_open}>
							{#if header_title}
								{@render header_title({ title })}
							{:else}
								{title}
							{/if}
						</div>
						<div class="header-icon">
							{#if icon}
								{@render icon()}
							{:else}
								<div class="icon" class:open={is_open}>
									<AngleDown />
								</div>
							{/if}
						</div>
					</div>
				</Button>
			{/if}
		</div>

		<ExpandingContainer isOpen={is_open}>
			<div class="expander-content">
				{@render children?.()}
			</div>
		</ExpandingContainer>
	</div>
</div>

<style lang="sass">
.expander-wrap
	--card-vertical-spacing: 0
	--card-horizontal-spacing: 0

.expander-header
	--button-background-color: var(--expander-header-background-color)
	--button-background-image: var(--expander-header-background-image)
	--button-hover-background-color: var(--expander-header-hover-background)

.expander-grid
	display: grid
	grid-template-columns: 1fr
	grid-template-rows: auto 1fr
	grid-template-areas: "header" "content"

	.expander-header
		grid-area: header
		cursor: pointer
		display: grid
		grid-template-columns: 1fr auto
		grid-template-areas: "title icon"
		grid-template-rows: auto
		width: 100%
		color: var(--text-color)
		
		.header-content
			grid-area: title
			display: flex
			align-items: center
			justify-content: center
			height: 100%
			width: 100%
			font-size: var(--font-size)
			font-weight: 500
			text-transform: uppercase

			&.open
				color: var(--primary-color)

		.header-icon
			grid-area: icon
			display: flex
			justify-content: center
			align-items: center
			height: 100%

			.icon
			
				fill: var(--text-color)
				width: var(--font-size)
				
				transition: transform 0.2s ease-in-out

				&.open
					transform: scaleY(-1)



	.expander-content
		grid-area: content
		padding: var(--spacing)
</style>
