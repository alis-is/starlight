<script lang="ts">
	import { resolve } from '$app/paths';
	import { Card, Badge } from '@alis-is/starlight';

	const categories = [
		{ label: 'Forms', path: resolve('/forms'), desc: 'Buttons, inputs, selects, toggles, menus.' },
		{ label: 'Data', path: resolve('/data'), desc: 'Searchable list and the data grid.' },
		{ label: 'Feedback', path: resolve('/feedback'), desc: 'Progress, spinner, badges, tooltips.' },
		{ label: 'Layout', path: resolve('/layout'), desc: 'Card, tabs, expander, island.' },
		{ label: 'Overlays', path: resolve('/overlays'), desc: 'Alert, confirm and prompt dialogs.' }
	];
</script>

<div class="demo-page">
	<header>
		<h1>Starlight</h1>
		<p class="tagline">A themeable lightweight Svelte 5 UI component library.</p>
	</header>

	<section>
		<p style="margin-top: 0">
			Pick a category in the sidebar to browse components, and switch themes from the top-right.
			Four themes ship in the box: <Badge>dark</Badge>
			<Badge>light</Badge>
			<Badge>black</Badge>
			<Badge variant="accent">candy</Badge>.
		</p>
	</section>

	<div class="cards">
		{#each categories as c (c.path)}
			<a class="card-link" href={c.path}>
				<Card title={c.label}>
					<p style="margin: 0; color: var(--hint-color)">{c.desc}</p>
				</Card>
			</a>
		{/each}
	</div>
</div>

<style lang="sass">
.cards
	display: grid
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))
	gap: var(--spacing)

.card-link
	text-decoration: none
	color: inherit
	transition: transform 0.12s

	&:hover
		transform: translateY(-2px)
</style>
