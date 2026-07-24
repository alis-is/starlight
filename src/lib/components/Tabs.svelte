<script lang="ts" generics="T extends string | number">
	import type { Snippet } from 'svelte';

	type Tab = { label: string; value: T; disabled?: boolean };

	interface Props {
		tabs: Tab[];
		value?: T;
		onchange?: (value: T) => void;
		/** Optional panel content for the active tab. */
		panel?: Snippet<[{ value: T }]>;
		class?: string;
	}

	let { tabs, value = $bindable(), onchange, panel, class: klass = '' }: Props = $props();

	// Default to the first non-disabled tab.
	$effect(() => {
		if (value === undefined && tabs.length) {
			const first = tabs.find((t) => !t.disabled) ?? tabs[0];
			value = first.value;
		}
	});

	function select(tab: Tab) {
		if (tab.disabled) return;
		value = tab.value;
		onchange?.(tab.value);
	}

	function onKeydown(e: KeyboardEvent, index: number) {
		const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
		if (!dir) return;
		e.preventDefault();
		const n = tabs.length;
		for (let step = 1; step <= n; step++) {
			const next = tabs[(index + dir * step + n * step) % n];
			if (next && !next.disabled) {
				select(next);
				break;
			}
		}
	}
</script>

<div class="sl-tabs {klass}">
	<div class="sl-tablist" role="tablist">
		{#each tabs as tab, i (tab.value)}
			<button
				type="button"
				class="sl-tab"
				class:active={value === tab.value}
				role="tab"
				aria-selected={value === tab.value}
				tabindex={value === tab.value ? 0 : -1}
				disabled={tab.disabled}
				onclick={() => select(tab)}
				onkeydown={(e) => onKeydown(e, i)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
	{#if panel && value !== undefined}
		<div class="sl-tabpanel" role="tabpanel">{@render panel({ value })}</div>
	{/if}
</div>

<style lang="sass">
.sl-tabs
	display: flex
	flex-direction: column
	gap: var(--spacing)
	width: 100%

	.sl-tablist
		display: flex
		gap: var(--spacing-f2)
		border-bottom: 1px solid var(--tabs-border-color, rgba(127, 127, 127, 0.25))
		// scroll the tab bar on narrow screens instead of clipping/wrapping tabs
		overflow-x: auto
		scrollbar-width: none

	.sl-tablist::-webkit-scrollbar
		display: none

	.sl-tab
		appearance: none
		background: none
		border: none
		font: inherit
		cursor: pointer
		color: var(--hint-color)
		padding: var(--spacing-f2) var(--spacing)
		// don't let tab labels squish/wrap when the bar scrolls
		flex: none
		white-space: nowrap
		border-bottom: 2px solid transparent
		margin-bottom: -1px
		transition: color 0.15s, border-color 0.15s

		&:hover:not(:disabled)
			color: var(--text-color)

		&.active
			color: var(--tabs-active-color, var(--accent))
			border-bottom-color: var(--tabs-indicator-color, var(--accent))

		&:disabled
			opacity: 0.5
			cursor: not-allowed
</style>
