<script lang="ts">
	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		label?: string;
		/** Show the current value next to the label. */
		showValue?: boolean;
		class?: string;
		[key: string]: any;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		label = '',
		showValue = false,
		class: klass = '',
		...rest
	}: Props = $props();

	const percent = $derived(max === min ? 0 : ((value - min) / (max - min)) * 100);
</script>

<div class="sl-slider {klass}" class:disabled style:--sl-slider-fill="{percent}%">
	{#if label || showValue}
		<div class="sl-slider-head">
			{#if label}<span class="sl-slider-label">{label}</span>{/if}
			{#if showValue}<span class="sl-slider-value">{value}</span>{/if}
		</div>
	{/if}
	<input type="range" bind:value {min} {max} {step} {disabled} {...rest} />
</div>

<style lang="sass">
.sl-slider
	width: 100%

	&.disabled
		opacity: 0.5

	.sl-slider-head
		display: flex
		justify-content: space-between
		align-items: baseline
		margin-bottom: var(--spacing-f2)

	.sl-slider-label
		font-size: var(--input-label-font-size)
		font-weight: var(--input-label-font-weight)
		text-transform: uppercase
		color: var(--hint-color)

	.sl-slider-value
		font-variant-numeric: tabular-nums
		color: var(--text-color)

	input[type="range"]
		--track: var(--slider-track-color, var(--progress-bar-background-color))
		-webkit-appearance: none
		appearance: none
		width: 100%
		height: var(--slider-thumb-size, 18px)
		background: transparent
		cursor: pointer

		&:disabled
			cursor: not-allowed

		// track (WebKit)
		&::-webkit-slider-runnable-track
			height: var(--slider-track-height, 5px)
			border-radius: 999px
			background: linear-gradient(to right, var(--accent) var(--sl-slider-fill), var(--track) var(--sl-slider-fill))

		&::-moz-range-track
			height: var(--slider-track-height, 5px)
			border-radius: 999px
			background: var(--track)

		&::-moz-range-progress
			height: var(--slider-track-height, 5px)
			border-radius: 999px
			background: var(--accent)

		// thumb
		&::-webkit-slider-thumb
			-webkit-appearance: none
			appearance: none
			width: var(--slider-thumb-size, 18px)
			height: var(--slider-thumb-size, 18px)
			margin-top: calc((var(--slider-track-height, 5px) - var(--slider-thumb-size, 18px)) / 2)
			border-radius: 50%
			background: var(--slider-thumb-color, var(--accent))
			border: 2px solid var(--slider-thumb-border-color, var(--accent-contrast))
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3)

		&::-moz-range-thumb
			width: var(--slider-thumb-size, 18px)
			height: var(--slider-thumb-size, 18px)
			border-radius: 50%
			background: var(--slider-thumb-color, var(--accent))
			border: 2px solid var(--slider-thumb-border-color, var(--accent-contrast))
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3)

		&:focus-visible::-webkit-slider-thumb
			box-shadow: 0 0 0 3px var(--accent-soft)

		&:focus-visible::-moz-range-thumb
			box-shadow: 0 0 0 3px var(--accent-soft)
</style>
