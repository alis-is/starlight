<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		src?: string;
		alt?: string;
		/** Used to derive initials when there is no `src`. */
		name?: string;
		/** Any CSS size (e.g. `2.5rem`); overrides the `--avatar-size` token. */
		size?: string;
		/** Custom fallback content (icon, etc.). */
		children?: Snippet;
		class?: string;
	}

	let { src, alt, name, size, children, class: klass = '' }: Props = $props();

	const initials = $derived(
		(name ?? '')
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((w) => w[0]?.toUpperCase() ?? '')
			.join('')
	);

	let failed = $state(false);
</script>

<span class="sl-avatar {klass}" style:--avatar-size={size} role="img" aria-label={alt ?? name}>
	{#if src && !failed}
		<img {src} alt={alt ?? name ?? ''} onerror={() => (failed = true)} />
	{:else if children}
		{@render children()}
	{:else if initials}
		<span class="sl-avatar-initials">{initials}</span>
	{/if}
</span>

<style lang="sass">
.sl-avatar
	display: inline-flex
	align-items: center
	justify-content: center
	flex: none
	width: var(--avatar-size, 2.5rem)
	height: var(--avatar-size, 2.5rem)
	border-radius: var(--avatar-radius, 50%)
	overflow: hidden
	background: var(--avatar-background, var(--accent-soft))
	color: var(--avatar-color, var(--accent))
	font-weight: 600
	font-size: calc(var(--avatar-size, 2.5rem) * 0.4)
	line-height: 1
	user-select: none

	img
		width: 100%
		height: 100%
		object-fit: cover
</style>
