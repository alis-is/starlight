<script lang="ts">
	import OverlayDialog from './Overlay.svelte';
	import Button from '../components/Button.svelte';
	import type { Snippet } from 'svelte';

	interface AlertDialogState {
		title: string;
		message: string;
		hint: string;
	}

	const default_state: AlertDialogState = {
		title: 'Prompt',
		message: '',
		hint: ''
	};
	let active_state = $state(default_state);
	let is_open = $state(false);

	interface Props {
		title?: Snippet<[any]>;
		message?: Snippet<[any]>;
	}
	let { title, message }: Props = $props();

	let close_finalizer: () => void = $state(() => {});
	function close() {
		is_open = false;
	}

	export async function alert(options: Partial<AlertDialogState>): Promise<void> {
		is_open = true;
		active_state = { ...default_state, ...options };
		return new Promise((resolve) => {
			close_finalizer = () => {
				close();
				resolve();
			};
		});
	}
</script>

<OverlayDialog bind:open={is_open}>
	<div class="alert-wrap sl-card">
		{#if title}{@render title(active_state)}{:else}
			<h2 class="title">{active_state.title}</h2>
		{/if}
		{#if message}{@render message(active_state)}{:else if active_state.message}
			<p class="message">{active_state.message}</p>
		{/if}
		<div class="controls padding-top">
			<div class="control-button" style:grid-column="3">
				<Button label="close" onclick={() => close_finalizer()} />
			</div>
		</div>
	</div>
</OverlayDialog>

<style lang="sass">
.alert-wrap	
	position: relative
	display: grid
	grid-auto-rows: auto
	grid-template-columns: minmax(100px, 1fr)
	gap: var(--spacing)
	
	width: var(--alert-dialog-width, auto)
	min-width: var(--alert-dialog-min-width, 280px)
	max-width: var(--alert-dialog-max-width, 500px)

	.title 
		text-align: center


	.message
		margin: var(--spacing-x2)
		margin-top: 0px
		margin-bottom: 0px

	.controls
		display: flex
		justify-content: center
		align-items: center

		.control-button
			min-width: 150px
			--button-horizontal-spacing: var(--spacing-x2)
</style>
