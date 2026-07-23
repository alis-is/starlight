<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		label?: string;
		checked?: boolean;
		/** Tri-state: shows a dash. Ignored once `checked` is true. */
		indeterminate?: boolean;
		crossedOutIfNotChecked?: boolean;
		class?: string;
	}

	let {
		label = '',
		checked = $bindable(false),
		indeterminate = false,
		crossedOutIfNotChecked = false,
		class: kclass = '',
		onchange,
		...rest
	}: Props = $props();

	// Controlled: force the DOM to follow the `checked` prop (so parent state like
	// DataGrid selection drives it — a plain `bind:`/`{checked}` on a $bindable
	// prop doesn't reliably re-reflect parent changes). Clicks update the bindable
	// value and forward the user's onchange.
	let inputEl: HTMLInputElement | undefined = $state();
	$effect(() => {
		if (!inputEl) return;
		inputEl.checked = checked;
		inputEl.indeterminate = !checked && indeterminate;
	});
	function handleChange(e: Event & { currentTarget: HTMLInputElement }) {
		checked = e.currentTarget.checked;
		onchange?.(e as any);
	}
</script>

<label class="checkbox-container {kclass}" class:disabled={rest.disabled}>
	<div class="checkmark-container">
		<input bind:this={inputEl} type="checkbox" onchange={handleChange} {...rest} />
		<span class="checkmark"></span>
	</div>
	{#if label}
		<div class="label" class:crossed-out={crossedOutIfNotChecked && !checked}>{label}</div>
	{/if}
</label>

<style lang="sass">
.checkbox-container
	cursor: pointer
	display: inline-flex
	user-select: none
	align-items: center
	width: 100%

	&.disabled
		cursor: not-allowed
		opacity: 0.5
		pointer-events: none

	.checkmark-container 
		position: relative
		background-color: var(--checkbox-background-color)
		border-radius: var(--checkbox-border-radius)
		box-shadow: var(--checkbox-box-shadow)
		border: var(--checkbox-border)
		width: var(--checkbox-box-size)
		height: var(--checkbox-box-size)
		
	.label 
		margin-left: var(--spacing-f2)

		&.crossed-out 
			text-decoration: line-through

	input 
		width: var(--checkbox-box-size)
		height: var(--checkbox-box-size)
		opacity: 0
		cursor: pointer
		margin: 0

	.checkmark
		position: absolute
		inset: 0
		border-radius: inherit
		transition: background-color 0.12s

	input:checked ~ .checkmark, input:indeterminate ~ .checkmark
		background-color: var(--checkbox-checked-background-color)
		box-shadow: var(--checkbox-checked-box-shadow)

	// indeterminate dash
	.checkmark:before
		content: ""
		position: absolute
		left: 50%
		top: 50%
		width: 55%
		height: 3px
		border-radius: 2px
		background-color: var(--checkbox-checkmark-color)
		transform: translate(-50%, -50%)
		opacity: 0

	input:indeterminate ~ .checkmark:before
		opacity: 1

	input:focus-visible ~ .checkmark
		box-shadow: 0 0 0 2px var(--checkbox-focus-shadow, rgba(100, 150, 255, 0.5))

	.checkmark:after 
		content: ""
		position: absolute
		opacity: 0
		transition: opacity 0.1s ease-in-out

	input:checked ~ .checkmark:after 
		opacity: 1

	.checkmark:after 
		left: 9px
		top: 5px
		width: 5px
		height: 10px
		border: solid var(--checkbox-checkmark-color)
		border-width: 0 3px 3px 0
		transform: rotate(45deg)
</style>
