<script lang="ts">
	import {
		Button,
		Card,
		Tabs,
		Expander,
		Island,
		Avatar,
		Separator,
		Breadcrumbs
	} from '@alis-is/starlight';

	let tab = $state<string>('overview');
</script>

<div class="demo-page">
	<h1>Layout</h1>

	<section data-testid="section-containers">
		<h2>Containers</h2>
		<Card title="A card">
			<p style="margin: 0">Cards group related content with a header, body and footer.</p>
			{#snippet footer()}
				<Button label="Action" />
			{/snippet}
		</Card>

		<div style="margin-top: var(--spacing)">
			<Tabs
				tabs={[
					{ label: 'Overview', value: 'overview' },
					{ label: 'Details', value: 'details' },
					{ label: 'Disabled', value: 'nope', disabled: true }
				]}
				bind:value={tab}
			>
				{#snippet panel({ value })}
					<p style="margin: 0">Active tab: <b>{value}</b></p>
				{/snippet}
			</Tabs>
		</div>

		<div style="margin-top: var(--spacing)">
			<Expander title="Expander header">
				<p>Hidden content revealed on expand.</p>
			</Expander>
		</div>

		<div class="row" style="margin-top: var(--spacing); gap: var(--spacing)">
			<Island>
				{#snippet island_icon()}⭐{/snippet}
				<span>Collapsed island — click to expand.</span>
			</Island>
			<Island isOpen>
				{#snippet island_icon()}⭐{/snippet}
				<span>Expanded island content.</span>
			</Island>
		</div>
	</section>

	<section data-testid="section-navigation">
		<h2>Navigation & display</h2>
		<div class="stack">
			<Breadcrumbs
				items={[
					{ label: 'Home', href: '#' },
					{ label: 'Library', href: '#' },
					{ label: 'Components' }
				]}
			/>

			<Separator />

			<div class="row" style="align-items: center; gap: var(--spacing)">
				<Avatar name="Ada Lovelace" />
				<Avatar name="Grace Hopper" />
				<Avatar src="https://i.pravatar.cc/80?img=5" alt="Remote user" name="Remote User" />
				<Separator vertical />
				<Avatar name="Katherine Johnson" size="3.5rem" />
			</div>
		</div>
	</section>
</div>
