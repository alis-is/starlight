<script lang="ts">
	import type { Icon } from '../types';

	interface Props {
		icon: Icon;
		class?: string;
		onclick?: () => void;
	}

	let { icon, class: kclass = '', onclick }: Props = $props();
</script>

{#if onclick}
	<button type="button" class="icon {kclass}" {onclick}>
		{#if 'family' in icon}
			<i class="{icon.family} {icon.id}"></i>
		{:else}
			{@const Comp = icon}
			<Comp />
		{/if}
	</button>
{:else}
	<div class="icon {kclass}">
		{#if 'family' in icon}
			<i class="{icon.family} {icon.id}"></i>
		{:else}
			{@const Comp = icon}
			<Comp />
		{/if}
	</div>
{/if}

<style lang="sass">
	.icon
		width: var(--icon-size)
		height: var(--icon-size)
		fill: var(--icon-color)

	button.icon
		background: none
		border: none
		padding: 0
		cursor: pointer
		display: inline-flex
		align-items: center
		justify-content: center
</style>
