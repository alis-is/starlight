<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { RADIO_GROUP, type RadioGroupContext } from '../internal/radio-context';
	import Radio from './Radio.svelte';

	interface Option {
		label: string;
		value: unknown;
		disabled?: boolean;
	}

	interface Props {
		value?: unknown;
		name?: string;
		disabled?: boolean;
		/** Convenience: render radios from a list. Nested <Radio> also works. */
		options?: Option[];
		orientation?: 'vertical' | 'horizontal';
		children?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(),
		name = crypto.randomUUID(),
		disabled = false,
		options,
		orientation = 'vertical',
		children,
		class: klass = ''
	}: Props = $props();

	// Getters keep the shared name/value/disabled reactive across the context.
	const ctx: RadioGroupContext = {
		get name() {
			return name;
		},
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		},
		get disabled() {
			return disabled;
		}
	};
	setContext(RADIO_GROUP, ctx);
</script>

<div class="sl-radio-group {orientation} {klass}" role="radiogroup">
	{#if options}
		{#each options as opt (opt.value)}
			<Radio value={opt.value} label={opt.label} disabled={opt.disabled} />
		{/each}
	{/if}
	{@render children?.()}
</div>

<style lang="sass">
.sl-radio-group
	display: flex
	gap: var(--radio-group-gap, var(--spacing-f2))

	&.vertical
		flex-direction: column

	&.horizontal
		flex-direction: row
		flex-wrap: wrap
		gap: var(--radio-group-gap, var(--spacing))
</style>
