<script lang="ts">
	interface Props {
		/** Current page, 1-based. */
		page?: number;
		/** Total number of pages. Alternatively pass `total` + `perPage`. */
		pageCount?: number;
		total?: number;
		perPage?: number;
		/** Page numbers to show on each side of the current page. */
		siblingCount?: number;
		onchange?: (page: number) => void;
		class?: string;
	}

	let {
		page = $bindable(1),
		pageCount,
		total,
		perPage = 10,
		siblingCount = 1,
		onchange,
		class: klass = ''
	}: Props = $props();

	const count = $derived(pageCount ?? Math.max(1, Math.ceil((total ?? 0) / perPage)));

	// Build the visible page list with `…` gaps. `-1` marks an ellipsis.
	const pages = $derived.by<number[]>(() => {
		const c = count;
		if (c <= 1) return [1];
		const lo = Math.max(2, page - siblingCount);
		const hi = Math.min(c - 1, page + siblingCount);
		const out: number[] = [1];
		if (lo > 2) out.push(-1);
		for (let i = lo; i <= hi; i++) out.push(i);
		if (hi < c - 1) out.push(-1);
		out.push(c);
		return out;
	});

	function go(p: number) {
		const next = Math.min(count, Math.max(1, p));
		if (next === page) return;
		page = next;
		onchange?.(next);
	}
</script>

<nav class="sl-pagination {klass}" aria-label="Pagination">
	<button
		class="sl-page-btn nav"
		type="button"
		disabled={page <= 1}
		aria-label="Previous page"
		onclick={() => go(page - 1)}>‹</button
	>
	{#each pages as p, i (i)}
		{#if p === -1}
			<span class="sl-page-ellipsis" aria-hidden="true">…</span>
		{:else}
			<button
				class="sl-page-btn"
				class:active={p === page}
				type="button"
				aria-current={p === page ? 'page' : undefined}
				onclick={() => go(p)}>{p}</button
			>
		{/if}
	{/each}
	<button
		class="sl-page-btn nav"
		type="button"
		disabled={page >= count}
		aria-label="Next page"
		onclick={() => go(page + 1)}>›</button
	>
</nav>

<style lang="sass">
.sl-pagination
	--size: var(--pagination-size, 2.25rem)
	display: flex
	align-items: center
	justify-content: var(--pagination-justify, center)
	// wrap onto a second row on narrow screens instead of overflowing
	flex-wrap: var(--pagination-wrap, wrap)
	gap: var(--pagination-gap, var(--spacing-f2))

	.sl-page-btn
		flex: none
		width: var(--size)
		height: var(--size)
		padding: 0
		cursor: pointer
		font: inherit
		font-variant-numeric: tabular-nums
		color: var(--text-color)
		background: var(--pagination-background, transparent)
		border: 1px solid var(--frost-border-color)
		border-radius: var(--border-radius)
		transition: background-color 0.12s, border-color 0.12s, color 0.12s, transform 0.1s

		&:hover:not(:disabled):not(.active)
			background: var(--accent-soft)

		&:active:not(:disabled)
			transform: scale(0.92)

		&.active
			background: var(--accent)
			border-color: var(--accent)
			color: var(--accent-contrast)
			font-weight: 600

		&:disabled
			opacity: 0.4
			cursor: not-allowed

	.sl-page-ellipsis
		flex: none
		width: var(--size)
		text-align: center
		color: var(--hint-color)
</style>
