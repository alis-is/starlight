<script lang="ts">
	import AngleDownIcon from '../icons/angle-down.svelte';
	import { onMount } from 'svelte';
	import type { SelectItem } from '../types';
	import Menu from './Menu.svelte';

	interface Props {
		label?: string;
		options?: SelectItem[];
		value?: SelectItem | undefined;
		selectedItemIndex?: any;
		disabled?: boolean;
		menuButtonContent?: import('svelte').Snippet;
		onselected?: (item: SelectItem) => void;
	}

	let {
		label = 'Options',
		options = [],
		value = $bindable(undefined),
		selectedItemIndex = -1,
		disabled = false,
		onselected = (_: SelectItem) => {},
		menuButtonContent: selectMenuButtonContent = undefined
	}: Props = $props();

	const onselect = (item: SelectItem) => {
		value = item;
		onselected(item);
	};
	onMount(() => {
		if (selectedItemIndex >= 0) {
			value = options[selectedItemIndex];
		}
	});
</script>

<div class="container" class:disabled>
	<Menu items={options} {onselect} {disabled} placement="cover" align="left">
		{#snippet menu_button({ toggle, isOpen })}
			{#if selectMenuButtonContent}
				<button type="button" class="select-trigger unstyle-button" onclick={toggle} {disabled}>
					{@render selectMenuButtonContent()}
				</button>
			{:else}
				<button
					type="button"
					class="select-trigger unstyle-button"
					class:open={isOpen}
					onclick={toggle}
					{disabled}
					aria-haspopup="menu"
					aria-expanded={isOpen}
				>
					<span class="field">
						<span class="label" class:floated={value}>{label}</span>
						{#if value}
							<span class="value">{value?.label}</span>
						{/if}
					</span>

					<span class="arrow" class:flip={isOpen}>
						<AngleDownIcon />
					</span>
				</button>
			{/if}
		{/snippet}
	</Menu>
</div>

<style lang="sass">
.container
	position: relative
	width: 100%

	&.disabled
		opacity: 0.5
		pointer-events: none

.select-trigger
	display: grid
	grid-template-columns: minmax(0, 1fr) auto
	align-items: center
	gap: var(--spacing-f2)
	width: 100%
	box-sizing: border-box
	padding: var(--input-vertical-spacing) var(--input-horizontal-spacing)
	min-height: calc(var(--input-line-height) + var(--input-vertical-spacing) * 2)
	border-radius: var(--input-border-radius)
	border: 1px solid var(--frost-border-color)
	background-color: var(--input-background-color)
	color: var(--text-color)
	cursor: pointer
	text-align: left
	transition: background-color 0.12s, border-color 0.12s

	&:hover
		background-color: var(--input-background-highlight-color)

	&.open
		background-color: var(--input-background-highlight-color)
		border-color: var(--accent)

	.field
		position: relative
		display: block
		min-height: var(--input-line-height)
		text-transform: none

	.label
		position: absolute
		left: 0
		top: 50%
		transform: translateY(-50%)
		color: var(--hint-color)
		text-transform: uppercase
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis
		max-width: 100%
		pointer-events: none
		transition: 0.2s

		&.floated
			top: 0
			transform: translateY(-0.7rem)
			font-size: var(--input-label-font-size)
			font-weight: var(--input-label-font-weight)

	.value
		display: block
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap
		transform: translateY(0.45rem)

	.arrow
		display: inline-flex
		color: var(--hint-color)
		fill: var(--hint-color)
		width: var(--select-item-icon-size, 1.25rem)
		min-width: var(--select-item-icon-size, 1.25rem)
		height: var(--select-item-icon-size, 1.25rem)
		transition: transform 0.2s

		&.flip
			transform: rotate(180deg)
</style>
