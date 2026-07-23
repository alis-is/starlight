<script lang="ts">
	interface Props {
		label?: string;
		checked?: boolean;
		crossedOutIfNotChecked?: boolean;
		class?: string;
	}

	let {
		label = '',
		checked = $bindable(false),
		crossedOutIfNotChecked = false,
		class: _class = ''
	}: Props = $props();
</script>

<label class="toggle-container {_class}">
	<div class="slider-container">
		<input type="checkbox" bind:checked />
		<span class="slider"></span>
	</div>
	{#if label}
		<div class="label" class:crossed-out={crossedOutIfNotChecked && !checked}>{label}</div>
	{/if}
</label>

<style lang="sass">
.toggle-container 
	cursor: pointer
	display: inline-flex
	user-select: none
	align-items: center
	width: 100%

	.slider-container 
		position: relative
		border: var(--toggle-border)
		min-width: calc(var(--toggle-size) * 1.75)
		height: var(--toggle-size)
		
	.label 
		margin-left: var(--checkbox-label-padding-left)

		&.crossed-out 
			text-decoration: line-through

	.slider
		position: absolute
		cursor: pointer
		top: 0
		left: 0
		right: 0
		bottom: 0
		width: calc(var(--toggle-size) * 1.75)
		background-color: var(--toggle-background-color)
		border-radius: var(--toggle-border-radius)
		transition: .1s

	.slider:before 
		position: absolute
		content: ""
		height: calc(var(--toggle-size) * .8)
		width: calc(var(--toggle-size) * .8)
		left: calc(var(--toggle-size) * .1)
		bottom: calc(var(--toggle-size) * .1)
		background-color: var(--toggle-knob-color)
		transition: .1s
		border-radius: var(--toggle-border-radius)
	
	input
		opacity: 0

	input:checked + .slider
		background-color: var(--toggle-checked-background-color)
		

	input:focus-visible + .slider
		box-shadow: 0 0 0 2px var(--toggle-focus-shadow, rgba(100, 150, 255, 0.5))
		

	input:checked + .slider:before
		transform: translateX(calc(var(--toggle-size) * .75))
		background-color: var(--toggle-checked-knob-color)


</style>
