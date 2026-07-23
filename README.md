# @alis-is/starlight

> This library is used for our internal projects. Support is limited and we
> review contributions at our own pace. If you'd like to contribute, please keep
> PRs under 500 lines and match the existing style.

A themeable **Svelte 5** UI component library.

## Install

The package is published to GitHub Packages. Point the `@alis-is` scope at the
GitHub registry in your `.npmrc`:

```
@alis-is:registry=https://npm.pkg.github.com
```

```bash
pnpm add @alis-is/starlight svelte
# Optional — only if you use the <Terminal> component:
pnpm add @xterm/xterm @xterm/addon-fit
```

## Usage

```svelte
<script>
	import '@alis-is/starlight/style.sass'; // themes + CSS variables (once, app root)
	import { Button, DataGrid, List } from '@alis-is/starlight';
</script>

<Button label="Hello" onclick={() => alert('hi')} />
```

Import the stylesheet once at your app root and pick a theme by setting the
class on `<html>`. Built-in themes: **`dark`** (default), **`light`**,
**`midnight`** (deep blue), **`black`** (AMOLED), **`nebula`** (cosmic gradient
accent) and **`aurora`** (teal). All use a frosted-glass surface treatment
(translucent + backdrop blur), driven by `--blur-filter` / `--frost-border-color`.

```js
document.documentElement.className = 'nebula';
```

## What's inside

**Components** — `Button`, `CheckBox`, `Toggle`, `Input`, `Textarea`, `FileInput`,
`Select`, `Icon`, `List`, `DataGrid`, `Menu`, `Tabs`, `Card`, `Badge`, `Spinner`,
`Tooltip`, `Expander`, `ExpandingContainer`, `Island`, `ProgressBar`, `NavMenu`,
`NavMenuItem`, `NavHamburgerIcon`.

`Menu` (and therefore `Select`) renders its dropdown into `<body>` as a
`position: fixed` layer, so it escapes clipping/`overflow` ancestors without
affecting page scroll. It sits at `z-index: 45` — above page content but below
`NavMenu` (50) and dialogs (100) — and closes on outside-click, Esc or scroll.

**Dialogs** (suffixed to avoid name clashes) — `AlertDialog`, `ConfirmDialog`,
`PromptDialog`, `SelectDialog`, `FileDialog`, `ProgressDialog`, `Overlay`.

**Terminal** — `Terminal` and `TerminalDialog` depend on the optional
`@xterm/xterm` + `@xterm/addon-fit` peers, so they're **not** in the main barrel
(importing it never drags in xterm). Import them directly and install the peers:

```js
import Terminal from '@alis-is/starlight/components/Terminal.svelte';
import TerminalDialog from '@alis-is/starlight/dialogs/Terminal.svelte';
```

**Icons** — the [Line Awesome](https://icons8.com/line-awesome) set:

```js
import { HomeIcon, CogIcon } from '@alis-is/starlight/la';
```

### DataGrid

```svelte
<script lang="ts">
	import { DataGrid, type DataGridColumn } from '@alis-is/starlight';

	type Row = { name: string; age: number };
	const columns: DataGridColumn<Row>[] = [
		{ key: 'name', sortable: true, filterable: true },
		{ key: 'age', sortable: true, align: 'right' }
	];
	let selected = $state<Row[]>([]);
</script>

<DataGrid data={rows} {columns} selectMode="multiple" bind:selected filter="" />
```

### List (searchable, addable)

```svelte
<script>
	let items = $state(['one', 'two']);
</script>

<List
	bind:items
	addable
	onadd={(t) => (items = [...items, t])}
	onremove={(_, i) => (items = items.filter((_, j) => j !== i))}
/>
```

## Theming

Everything is driven by CSS custom properties defined in `style.sass`. Override
any variable to restyle without forking components — e.g.
`--button-background-color`, `--data-grid-header-background-color`,
`--list-item-border`.

## Framework-agnostic navigation

`NavMenu` / `NavMenuItem` don't depend on SvelteKit. Pass `currentPath` and a
`navigate` callback (e.g. SvelteKit's `goto`) to wire up routing.

## License

MIT. Bundled icons: Line Awesome by Icons8 — see
[`src/lib/la/ATTRIBUTION.md`](src/lib/la/ATTRIBUTION.md).
