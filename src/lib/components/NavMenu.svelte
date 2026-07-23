<script lang="ts">
	import type { NavMenuItemType } from '../types';
	import NavMenuItem from './NavMenuItem.svelte';
	import NavHamburgerIcon from './NavHamburgerIcon.svelte';

	interface Props {
		title?: string;
		items?: Array<NavMenuItemType>;
		bottomItems?: Array<NavMenuItemType>;
		/** Current path, forwarded to items to derive their active state. */
		currentPath?: string | null;
		/** Framework-agnostic navigation hook forwarded to items (e.g. SvelteKit `goto`). */
		navigate?: (path: string) => void;
	}

	let {
		title = 'Menu',
		items = [],
		bottomItems = [],
		currentPath = null,
		navigate
	}: Props = $props();
	let expanded = $state(false);
</script>

<div class="menu-layout" class:expanded>
	<div class="menu-items-wrap">
		<NavMenuItem text={title} onclick={() => (expanded = !expanded)}>
			<NavHamburgerIcon {expanded} />
		</NavMenuItem>
		<div class="gap"></div>
		<div class="items-list">
			{#each items as item (item.path ?? item.label)}
				<!-- if not item.hidden -->
				{#if !item.hidden}
					<NavMenuItem
						text={item.label}
						icon_info={item.icon}
						isDisabled={item.disabled}
						path={item.path}
						isActive={typeof item.isActive === 'function'
							? item.isActive(currentPath ?? '')
							: item.isActive}
						{currentPath}
						{navigate}
						onclick={item.click}
					/>
				{/if}
			{/each}
		</div>
	</div>
	<div class="items-list">
		{#each bottomItems as item (item.path ?? item.label)}
			<!-- if not item.hidden -->
			{#if !item.hidden}
				<NavMenuItem
					text={item.label}
					icon_info={item.icon}
					isDisabled={item.disabled}
					path={item.path}
					onclick={item.click}
				/>
			{/if}
		{/each}
	</div>
</div>

<style lang="sass">
.menu-layout
	position: fixed
	// Above page content; dialogs (z-index 100) and top-layer popovers stay above it.
	z-index: var(--nav-menu-z-index, 50)
	left: var(--spacing-f2)
	top: var(--spacing-f2)
	display: grid
	grid-template-rows: 1fr auto
	height: calc(100vh - var(--spacing) * 2)
	width: var(--nav-menu-size)
	max-width: 100vw
	padding: var(--spacing-f2) 0
	
	background-image: var(--nav-menu-background-image)
	transition: 0.2s
	transition-timing-function: ease-in-out
	box-shadow: var(--nav-menu-box-shadow)
	overflow-x: hidden
	padding: var(--nav-menu-spacing)
	background-color: var(--nav-menu-background-color)
	backdrop-filter: var(--blur-filter)
	border-radius: var(--nav-menu-border-radius)
	border-top-left-radius: var(--nav-menu-border-radius-tl, var(--nav-menu-border-radius, 0px))
	border-bottom-left-radius: var(--nav-menu-border-radius-bl, var(--nav-menu-border-radius, 0px))
	border-top-right-radius: var(--nav-menu-border-radius-tr, var(--nav-menu-border-radius, 0px))
	border-bottom-right-radius: var(--nav-menu-border-radius-br, var(--nav-menu-border-radius, 0px))

	.menu-items-wrap
		overflow: auto
		overflow-x: hidden

		.gap
			height: var(--nav-menu-spacing)

	.items-list
		display: grid
		grid-auto-rows: var(--nav-menu-item-height)
		overflow-x: hidden
		row-gap: var(--nav-menu-spacing)
		


	&.expanded
		width: var(--nav-menu-expanded-size)



</style>
