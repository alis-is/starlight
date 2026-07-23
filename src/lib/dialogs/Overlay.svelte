<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		persistent?: boolean;
		class?: string;
		children?: Snippet<[{ close: () => void }]>;
	}
	let {
		open = $bindable(false),
		persistent = false,
		class: klass = '',
		children
	}: Props = $props();

	let dialog: HTMLDialogElement;

	// `visible` drives the actual <dialog open> so we can keep it mounted through
	// the exit animation. When `open` flips to false (from a button, the backdrop,
	// Escape — anywhere) we play the hide animation, then unmount.
	let visible = $state(false);
	let closing = $state(false);
	$effect(() => {
		if (open) {
			visible = true;
			closing = false;
		} else if (visible) {
			closing = true;
		}
	});

	function onAnimationEnd() {
		if (closing) {
			visible = false;
			closing = false;
		}
	}

	function close() {
		open = false;
	}

	let background_element: HTMLDivElement;
	function background_onclick(event: Event) {
		if (persistent) return;
		if (event.target !== background_element) return;
		close();
	}
</script>

<dialog
	class={klass}
	bind:this={dialog}
	open={visible}
	class:hide={closing}
	onanimationend={onAnimationEnd}
>
	<div
		bind:this={background_element}
		class="content-wrap"
		onclick={background_onclick}
		role="button"
		onkeydown={(e) => e.key === 'Escape' && close()}
		tabindex="0"
	>
		{@render children?.({ close })}
	</div>
</dialog>

<style lang="sass">
dialog
	position: fixed
	top: 0
	left: 0
	width: 100vw
	height: 100vh
	padding: 0px
	margin: 0px 
	border: 0px
	background-color: var(--dialog-background-color)
	backdrop-filter: var(--dialog-backdrop-filter, var(--blur-filter))
	overflow: hidden
	z-index: 100

	.content-wrap
		display: flex
		align-items: center
		justify-content: center
		height: 100%
		width: 100%

dialog[open]
	animation: show-dialog .2s ease-in-out forwards

dialog.hide
	animation: hide-dialog .2s ease-in-out forwards

@keyframes show-dialog
	from
		opacity: 0
	to
		opacity: 1

@keyframes hide-dialog
	from
		opacity: 1
	to 
		opacity: 0


</style>
