<script lang="ts">
	interface Props {
		message?: string;
		hint?: string;
		progress?: number | 'indeterminate';
		total?: number;
		class?: string;
	}

	let {
		message = 'Loading...',
		hint = '',
		progress = 0,
		total = 100,
		class: klass = ''
	}: Props = $props();

	const indeterminate = $derived(progress === 'indeterminate');
	const ratio = $derived(
		indeterminate ? 0 : Math.min(Math.max((Number(progress) / total) * 100, 0), 100)
	);
	const percentage = $derived(indeterminate ? '' : `${ratio.toFixed(0)}%`);
</script>

<div class="sl-progressbar {klass}">
	{#if message || !indeterminate}
		<div class="sl-progressbar-head">
			{#if message}<span class="sl-progressbar-message">{message}</span>{/if}
			{#if !indeterminate}<span class="sl-progressbar-percent">{percentage}</span>{/if}
		</div>
	{/if}
	<div
		class="sl-progressbar-track"
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : ratio}
	>
		<div
			class="sl-progressbar-fill"
			class:indeterminate
			style:width={indeterminate ? undefined : percentage}
		></div>
	</div>
	{#if hint}<div class="sl-progressbar-hint">{hint}</div>{/if}
</div>

<style lang="sass">
.sl-progressbar
	display: flex
	flex-direction: column
	gap: var(--spacing-f2)
	width: var(--progress-bar-width, 100%)

	.sl-progressbar-head
		display: flex
		align-items: baseline
		justify-content: space-between
		gap: var(--spacing)

	.sl-progressbar-percent
		font-variant-numeric: tabular-nums
		color: var(--hint-color)

	.sl-progressbar-track
		width: 100%
		height: var(--progress-bar-line-height, 6px)
		border-radius: 999px
		background-color: var(--progress-bar-background-color)
		overflow: hidden

	.sl-progressbar-fill
		height: 100%
		border-radius: inherit
		background-color: var(--progress-bar-progress-color)
		transition: width 0.3s ease

		&.indeterminate
			width: 40%
			background: linear-gradient(90deg, transparent, var(--progress-bar-progress-color), transparent)
			animation: sl-progress-indeterminate 1.3s ease-in-out infinite

	.sl-progressbar-hint
		font-size: var(--progress-bar-hint-font-size)
		color: var(--hint-color)

@keyframes sl-progress-indeterminate
	0%
		transform: translateX(-120%)
	100%
		transform: translateX(320%)
</style>
