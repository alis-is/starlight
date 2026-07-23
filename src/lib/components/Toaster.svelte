<script lang="ts">
	import { fly } from 'svelte/transition';
	import Alert from './Alert.svelte';
	import { getToasts, dismissToast } from './toast.svelte';

	interface Props {
		position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom';
		class?: string;
	}

	let { position = 'bottom-right', class: klass = '' }: Props = $props();

	const fromTop = $derived(position.startsWith('top'));
</script>

<div class="sl-toaster {position} {klass}" role="region" aria-label="Notifications">
	{#each getToasts() as t (t.id)}
		<div class="sl-toast" transition:fly={{ y: fromTop ? -16 : 16, duration: 200 }}>
			<Alert variant={t.variant} title={t.title} dismissible ondismiss={() => dismissToast(t.id)}>
				{t.message}
			</Alert>
		</div>
	{/each}
</div>

<style lang="sass">
.sl-toaster
	position: fixed
	z-index: var(--toaster-z-index, 200)
	display: flex
	flex-direction: column
	gap: var(--spacing-f2)
	width: min(var(--toast-width, 360px), calc(100vw - 2 * var(--spacing)))
	pointer-events: none

	&.top-left, &.top-right, &.top
		top: var(--spacing)
	&.bottom-left, &.bottom-right, &.bottom
		bottom: var(--spacing)
		flex-direction: column-reverse
	&.top-left, &.bottom-left
		left: var(--spacing)
	&.top-right, &.bottom-right
		right: var(--spacing)
	&.top, &.bottom
		left: 50%
		transform: translateX(-50%)

	.sl-toast
		pointer-events: auto
		border-radius: var(--border-radius)
		background: var(--menu-background-color)
		backdrop-filter: var(--blur-filter)
		box-shadow: var(--menu-box-shadow, 0 8px 24px rgba(0, 0, 0, 0.25))
</style>
