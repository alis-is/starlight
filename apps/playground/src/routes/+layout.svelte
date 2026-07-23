<script lang="ts">
	import '@alis-is/starlight/style.sass';
	import '../demo.sass';
	import { NavMenu, Toaster, type NavMenuItemType } from '@alis-is/starlight';
	import {
		HomeIcon,
		EditIcon,
		TableIcon,
		BellIcon,
		ThLargeIcon,
		WindowRestoreIcon,
		TerminalIcon,
		InfoIcon
	} from '@alis-is/starlight/la';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { THEMES, applyTheme, loadTheme, type Theme } from '$lib/theme';

	let { children } = $props();

	let theme = $state<Theme>('dark');
	onMount(() => {
		theme = loadTheme();
	});
	function setTheme(t: Theme) {
		theme = t;
		applyTheme(t);
	}

	const items: NavMenuItemType[] = [
		{ label: 'Overview', path: `${base}/`, icon: HomeIcon },
		{ label: 'Forms', path: `${base}/forms`, icon: EditIcon },
		{ label: 'Data', path: `${base}/data`, icon: TableIcon },
		{ label: 'Feedback', path: `${base}/feedback`, icon: BellIcon },
		{ label: 'Layout', path: `${base}/layout`, icon: ThLargeIcon },
		{ label: 'Overlays', path: `${base}/overlays`, icon: WindowRestoreIcon },
		{ label: 'Terminal', path: `${base}/terminal`, icon: TerminalIcon }
	];
	const bottomItems: NavMenuItemType[] = [
		{ label: 'About', path: `${base}/about`, icon: InfoIcon }
	];
</script>

<div class="app-layout">
	<NavMenu
		title="Starlight"
		{items}
		{bottomItems}
		currentPath={page.url.pathname}
		navigate={goto}
	/>

	<div class="theme-switch" data-testid="theme-switch">
		{#each THEMES as t (t)}
			<button
				type="button"
				class="theme-chip"
				class:active={theme === t}
				onclick={() => setTheme(t)}>{t}</button
			>
		{/each}
	</div>

	<main class="content">
		{#key page.url.pathname}
			<div in:fly={{ y: 12, duration: 220, easing: cubicOut }}>
				{@render children()}
			</div>
		{/key}
	</main>

	<Toaster position="bottom-right" />
</div>

<style lang="sass">
:global(body)
	margin: 0
	font-family: system-ui, -apple-system, sans-serif
	background-color: var(--page-background-color)
	background-image: var(--page-background-image)
	background-attachment: fixed
	color: var(--text-color)

.app-layout
	display: flex
	min-height: 100vh

.content
	flex: 1
	box-sizing: border-box
	padding: calc(var(--spacing) * 2)
	padding-left: calc(var(--nav-menu-size) + var(--spacing) * 3)
	padding-top: calc(var(--spacing) * 4)

.theme-switch
	position: fixed
	top: var(--spacing-f2)
	right: var(--spacing)
	z-index: 40
	display: flex
	flex-wrap: wrap
	justify-content: flex-end
	gap: var(--spacing-f2)
	background: var(--card-background-color)
	backdrop-filter: var(--blur-filter)
	border: 1px solid var(--frost-border-color)
	border-radius: 999px
	padding: var(--spacing-f2)

.theme-chip
	appearance: none
	cursor: pointer
	text-transform: capitalize
	font: inherit
	font-size: 0.8rem
	padding: 0.3em 0.75em
	border-radius: 999px
	border: 1px solid transparent
	background: transparent
	color: var(--text-color)
	transition: all 0.15s

	&.active
		background-color: var(--accent)
		border-color: var(--accent)
		color: var(--accent-contrast)

@media (max-width: 720px)
	.content
		padding: calc(var(--spacing) * 2)
		padding-left: calc(var(--spacing) * 2)
		padding-top: calc(var(--spacing) * 5)
</style>
