<script lang="ts" module>
	export type DataGridColumn<T> = {
		/** Key into the row object; also the default sort/filter accessor. */
		key: keyof T & string;
		label?: string;
		hidden?: boolean;
		sortable?: boolean;
		filterable?: boolean;
		width?: string;
		align?: 'left' | 'center' | 'right';
		/** Derive the displayed/sorted/filtered value from the row. */
		value?: (row: T) => unknown;
		/** Custom sort comparator (overrides `value`). */
		sort?: (a: T, b: T) => number;
	};
</script>

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import CheckBox from './CheckBox.svelte';
	import ArrowDown from '../icons/arrow-down.svelte';

	type SortState = { key: string; direction: 'asc' | 'desc' };
	type SelectMode = 'none' | 'single' | 'multiple';

	interface Props {
		data: T[];
		columns?: DataGridColumn<T>[];
		/** Free-text filter applied across `filterable` columns (or all, if none flagged). */
		filter?: string;
		filterFn?: (row: T, filter: string) => boolean;
		sort?: SortState | null;
		selectMode?: SelectMode;
		/** Bound set of selected rows. */
		selected?: T[];
		rowKey?: (row: T) => unknown;
		onrowclick?: (row: T) => void;
		/** Custom cell body per column key. */
		cell?: Snippet<[{ row: T; column: DataGridColumn<T> }]>;
		empty?: Snippet;
		class?: string;
	}

	let {
		data,
		columns,
		filter = '',
		filterFn,
		sort = $bindable(null),
		selectMode = 'none',
		selected = $bindable([]),
		// Default key is proxy-safe: objects put into the reactive `selected` array
		// become Svelte proxies, so raw-vs-proxy identity (`===`) never matches.
		// Serialising object rows yields a stable key on both sides. Pass an
		// explicit `rowKey` (e.g. a row id) for large grids or duplicate rows.
		rowKey = (row: T) =>
			row && typeof row === 'object' ? JSON.stringify($state.snapshot(row)) : row,
		onrowclick,
		cell,
		empty,
		class: klass = ''
	}: Props = $props();

	const selectable = $derived(selectMode !== 'none');

	// Infer columns from the first row when none are given.
	const cols = $derived<DataGridColumn<T>[]>(
		columns?.filter((c) => !c.hidden) ??
			Object.keys((data[0] ?? {}) as object).map((key) => ({
				key: key as keyof T & string,
				sortable: true,
				filterable: true
			}))
	);

	function cellValue(row: T, column: DataGridColumn<T>): unknown {
		return column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
	}

	function defaultFilter(row: T, needle: string): boolean {
		const lc = needle.toLowerCase();
		const searchable = cols.some((c) => c.filterable) ? cols.filter((c) => c.filterable) : cols;
		return searchable.some((c) => {
			const v = cellValue(row, c);
			return v != null && String(v).toLowerCase().includes(lc);
		});
	}

	const filtered = $derived(
		filter.trim() === '' ? data : data.filter((row) => (filterFn ?? defaultFilter)(row, filter))
	);

	function compare(a: T, b: T, column: DataGridColumn<T>): number {
		if (column.sort) return column.sort(a, b);
		const av = cellValue(a, column);
		const bv = cellValue(b, column);
		if (av == null) return 1;
		if (bv == null) return -1;
		return av > bv ? 1 : av < bv ? -1 : 0;
	}

	const rows = $derived.by(() => {
		if (!sort) return filtered;
		const column = cols.find((c) => c.key === sort!.key);
		if (!column) return filtered;
		const dir = sort.direction === 'asc' ? 1 : -1;
		return filtered.toSorted((a, b) => compare(a, b, column) * dir);
	});

	function toggleSort(column: DataGridColumn<T>) {
		if (!column.sortable) return;
		if (sort?.key === column.key) {
			sort = { key: column.key, direction: sort.direction === 'asc' ? 'desc' : 'asc' };
		} else {
			sort = { key: column.key, direction: 'asc' };
		}
	}

	function isSelected(row: T): boolean {
		const k = rowKey(row);
		return selected.some((s) => rowKey(s) === k);
	}

	function toggleRow(row: T) {
		if (selectMode === 'single') {
			selected = isSelected(row) ? [] : [row];
			return;
		}
		selected = isSelected(row)
			? selected.filter((s) => rowKey(s) !== rowKey(row))
			: [...selected, row];
	}

	// Header select-all reflects the whole dataset, not just the filtered view —
	// otherwise it ticks when every *visible* row is selected while hidden rows
	// are not. `indeterminate` covers the partial case.
	const allSelected = $derived(data.length > 0 && data.every(isSelected));
	const someSelected = $derived(selected.length > 0 && !allSelected);
	function toggleAll() {
		selected = allSelected ? [] : [...data];
	}

	const gridTemplate = $derived(
		[selectable ? 'auto' : '', ...cols.map((c) => c.width ?? '1fr')].filter(Boolean).join(' ')
	);
</script>

<div class="sl-data-grid {klass}" style:--sl-grid-columns={gridTemplate} role="grid">
	<div class="row header" role="row">
		{#if selectable}
			<div class="cell select-cell" role="columnheader">
				{#if selectMode === 'multiple'}
					<CheckBox checked={allSelected} indeterminate={someSelected} onchange={toggleAll} />
				{/if}
			</div>
		{/if}
		{#each cols as column (column.key)}
			<div
				class="cell header-cell"
				class:sortable={column.sortable}
				style:text-align={column.align ?? 'left'}
				role="columnheader"
				aria-sort={sort?.key === column.key
					? sort.direction === 'asc'
						? 'ascending'
						: 'descending'
					: 'none'}
				tabindex={column.sortable ? 0 : -1}
				onclick={() => toggleSort(column)}
				onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSort(column)}
			>
				<span class="label">{column.label ?? column.key}</span>
				{#if column.sortable}
					<span
						class="sort-arrow"
						class:active={sort?.key === column.key}
						class:asc={sort?.key === column.key && sort.direction === 'asc'}
					>
						<ArrowDown />
					</span>
				{/if}
			</div>
		{/each}
	</div>

	{#if rows.length === 0}
		<div class="no-data">
			{#if empty}{@render empty()}{:else}No data{/if}
		</div>
	{:else}
		{#each rows as row, i (rowKey(row))}
			<div
				class="row body"
				class:even={i % 2 === 0}
				class:selected={isSelected(row)}
				class:clickable={!!onrowclick}
				role="row"
			>
				{#if selectable}
					<div class="cell select-cell" role="gridcell">
						<CheckBox checked={isSelected(row)} onchange={() => toggleRow(row)} />
					</div>
				{/if}
				{#each cols as column (column.key)}
					<div
						class="cell"
						style:text-align={column.align ?? 'left'}
						role="gridcell"
						tabindex={onrowclick ? 0 : -1}
						onclick={() => onrowclick?.(row)}
						onkeydown={(e) => onrowclick && e.key === 'Enter' && onrowclick(row)}
					>
						{#if cell}{@render cell({ row, column })}{:else}{cellValue(row, column) ?? '-'}{/if}
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</div>

<style lang="sass">
.sl-data-grid
	display: grid
	grid-template-columns: var(--sl-grid-columns)
	width: 100%
	color: var(--text-color)
	border-radius: var(--border-radius)
	overflow: auto

	.row
		display: contents

	.cell
		display: flex
		align-items: center
		gap: var(--spacing-f2)
		padding: var(--data-grid-cell-padding, var(--spacing))
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis

	.header .cell
		position: sticky
		top: 0
		z-index: 1
		font-weight: bold
		text-transform: var(--data-grid-header-text-transform, uppercase)
		border-bottom: 1px solid var(--data-grid-border-color, currentColor)
		background-color: var(--data-grid-header-background-color, var(--card-background-color))
		user-select: none

	.header-cell.sortable
		cursor: pointer

		.sort-arrow
			display: inline-flex
			align-items: center
			opacity: 0.35
			transition: opacity 0.2s, transform 0.2s

		&:hover .sort-arrow
			opacity: 0.7

		.sort-arrow.active
			opacity: 1
			color: var(--accent)
			fill: var(--accent)

		.sort-arrow.asc
			transform: rotate(180deg)

	.select-cell
		justify-content: center

	.body.even .cell
		background-color: var(--data-grid-even-row-background-color, transparent)

	.body.selected .cell
		background-color: var(--data-grid-selected-row-background-color, rgba(127, 127, 127, 0.15))

	.body.clickable .cell
		cursor: pointer

	.no-data
		grid-column: 1 / -1
		padding: var(--spacing)
		text-align: center
		opacity: 0.7

	.sort-arrow
		color: var(--hint-color)
		fill: currentColor

	.sort-arrow :global(svg)
		width: calc(var(--font-size, 1rem) * 1.1)
		fill: currentColor
</style>
