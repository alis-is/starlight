<script lang="ts">
	import { getContext } from 'svelte';
	import { RADIO_GROUP, type RadioGroupContext } from '../internal/radio-context';

	interface Props {
		value: unknown;
		label?: string;
		disabled?: boolean;
		/** Standalone binding when used without a <RadioGroup>. */
		group?: unknown;
		/** Standalone group name (ignored inside a <RadioGroup>). */
		name?: string;
		class?: string;
	}

	let {
		value,
		label = '',
		disabled = false,
		group = $bindable(),
		name,
		class: klass = ''
	}: Props = $props();

	const ctx = getContext<RadioGroupContext | undefined>(RADIO_GROUP);
	const selected = $derived(ctx ? ctx.value === value : group === value);
	const isDisabled = $derived(disabled || (ctx?.disabled ?? false));
	const groupName = $derived(ctx?.name ?? name);

	function select() {
		if (isDisabled) return;
		if (ctx) ctx.value = value;
		else group = value;
	}
</script>

<label class="sl-radio {klass}" class:disabled={isDisabled}>
	<span class="sl-radio-box" class:checked={selected}>
		<input
			type="radio"
			name={groupName}
			checked={selected}
			disabled={isDisabled}
			onchange={select}
		/>
		<span class="sl-radio-dot"></span>
	</span>
	{#if label}<span class="sl-radio-label">{label}</span>{/if}
</label>

<style lang="sass">
.sl-radio
	display: inline-flex
	align-items: center
	gap: var(--spacing-f2)
	cursor: pointer
	user-select: none

	&.disabled
		cursor: not-allowed
		opacity: 0.5

	.sl-radio-box
		position: relative
		flex: none
		width: var(--radio-size, var(--common-line-height))
		height: var(--radio-size, var(--common-line-height))
		border-radius: 50%
		background-color: var(--checkbox-background-color)
		transition: background-color 0.12s, box-shadow 0.12s

		&.checked
			background-color: var(--checkbox-checked-background-color, var(--accent))

	input
		position: absolute
		inset: 0
		margin: 0
		opacity: 0
		cursor: inherit

	input:focus-visible ~ .sl-radio-dot
		box-shadow: 0 0 0 2px var(--checkbox-focus-shadow, rgba(100, 150, 255, 0.5))

	.sl-radio-dot
		position: absolute
		inset: 0
		border-radius: 50%
		display: flex

		&::after
			content: ""
			margin: auto
			width: 38%
			height: 38%
			border-radius: 50%
			background-color: var(--checkbox-checkmark-color, var(--accent-contrast))
			transform: scale(0)
			transition: transform 0.12s ease-in-out

	.sl-radio-box.checked .sl-radio-dot::after
		transform: scale(1)

	.sl-radio-label
		line-height: var(--common-line-height)
</style>
