<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLTextareaAttributes, 'value'> {
		value?: string;
		label?: string;
		hint?: string;
		invalid?: boolean;
		/** Grow to fit content instead of scrolling. */
		autosize?: boolean;
		class?: string;
	}

	let {
		value = $bindable(''),
		label = '',
		hint = '',
		invalid = false,
		autosize = false,
		rows = 3,
		id = crypto.randomUUID(),
		class: klass = '',
		...rest
	}: Props = $props();

	function autosizeAction(node: HTMLTextAreaElement) {
		const resize = () => {
			node.style.height = 'auto';
			node.style.height = `${node.scrollHeight}px`;
		};
		$effect(() => {
			void value;
			if (autosize) resize();
		});
	}
</script>

<div class="sl-textarea {klass}" class:invalid>
	{#if label}<label class="sl-textarea-label" for={id}>{label}</label>{/if}
	<textarea
		{id}
		{rows}
		bind:value
		class:autosize
		use:autosizeAction
		aria-invalid={invalid}
		{...rest}></textarea>
	{#if hint}<span class="sl-textarea-hint">{hint}</span>{/if}
</div>

<style lang="sass">
.sl-textarea
	display: flex
	flex-direction: column
	gap: var(--spacing-f2)
	width: 100%

	.sl-textarea-label
		font-size: var(--input-label-font-size, 0.8rem)
		font-weight: var(--input-label-font-weight, bold)
		text-transform: uppercase
		color: var(--hint-color)

	textarea
		width: 100%
		box-sizing: border-box
		resize: vertical
		font-family: inherit
		font-size: var(--font-size, 1rem)
		color: var(--input-text-color, inherit)
		padding: var(--input-vertical-spacing, 0.75rem) var(--input-horizontal-spacing, 1rem)
		border-radius: var(--input-border-radius, var(--border-radius))
		border: 1px solid var(--frost-border-color)
		background-color: var(--input-background-color)
		outline: none
		transition: background-color 0.15s, border-color 0.15s

		&.autosize
			resize: none
			overflow: hidden

		&::placeholder
			color: var(--input-hint-color, var(--hint-color))

		&:focus
			background-color: var(--input-background-highlight-color)
			border-color: var(--accent)

	&.invalid textarea
		border-color: var(--error-color)

	.sl-textarea-hint
		font-size: var(--input-hint-font-size, 0.8rem)
		color: var(--hint-color)
</style>
