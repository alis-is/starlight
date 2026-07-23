<script lang="ts">
	import type { Icon } from '../types';
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string;
		icon_info?: Icon;
		isDisabled?: boolean;
		isActive?: boolean | undefined;
		path?: string | null;
		/** Current path, used to derive the active state when `isActive` is not given. */
		currentPath?: string | null;
		/** Framework-agnostic navigation hook. When provided, default anchor navigation is prevented and this is called instead (e.g. SvelteKit `goto`). */
		navigate?: (path: string) => void;
		children?: Snippet;
		onclick?: () => void;
	}

	let {
		text = '',
		icon_info: icon = { id: 'las-home', family: 'la' },
		isDisabled = false,
		isActive = undefined,
		path = null,
		currentPath = null,
		navigate,
		children,
		onclick
	}: Props = $props();

	const handleClick = (event: Event) => {
		onclick?.();
		if (path && path !== '.' && navigate) {
			event.preventDefault();
			navigate(path);
		}
	};

	let active = $derived(isActive !== undefined ? isActive : !!path && currentPath === path);
</script>

<div class="menu-item-wrap" class:disabled={isDisabled} class:active>
	<a class="menu-item" href={path} onclick={handleClick}>
		{#if children}
			{@render children()}
		{:else}
			<div class="menu-item-icon svg-icon">
				{#if 'family' in icon}
					<i class="{icon.family} {icon.id}"></i>
				{:else}
					{@const Icon = icon}
					<Icon />
				{/if}
			</div>
		{/if}
		<div class="menu-item-text">
			<span>{text}</span>
		</div>
	</a>
</div>

<style lang="sass">
.menu-item-wrap
	overflow: hidden
	position: relative
	color: var(--nav-menu-text-color)
	
	.menu-item 
		display: grid
		grid-template-columns: var(--nav-menu-size) minmax(40px, 1fr)
		grid-template-areas: "icon text"
		height: var(--nav-menu-item-height)
		border-radius: var(--nav-menu-item-border-radius)
		width: 100%
		transition: var(--nav-menu-item-transition)
		cursor: pointer
		text-decoration: none
		background-color: var(--nav-menu-item-background-color)
		
		&:hover
			background-color: var(--nav-menu-item-hover-background-color)

		.menu-item-icon
			grid-area: icon
			display: flex
			justify-content: center
			align-items: center
			position: relative
	
			--svg-icon-width: var(--nav-menu-icon-size)
			--svg-icon-height: var(--nav-menu-icon-size)
			--svg-icon-fill: var(--nav-menu-text-color)

			i
				font-size: var(--nav-menu-icon-size)


		.menu-item-text
			grid-area: text
			display: flex
			justify-content: flex-start
			align-items: center
			color: var(--nav-menu-text-color)
			margin-right: var(--spacing)

			span
				overflow: hidden
				text-overflow: ellipsis
				text-align: left
				white-space: nowrap
				font-size: var(--nav-menu-font-size)

	.disabled
		pointer-events: none
		filter: grayscale(100%) opacity(50%)

.active
	.menu-item
		background-color: var(--nav-menu-item-active-background-color, transparent)
		color: var(--nav-menu-item-active-text-color, var(--nav-menu-text-color))

		&:hover
			background-color: var(--nav-menu-item-active-hover-background-color, var(--nav-menu-item-hover-background-color))

	span
		font-weight: var(--nav-menu-item-active-font-weight, bold)
</style>
