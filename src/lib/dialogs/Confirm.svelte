<script lang="ts">
	import OverlayDialog from './Overlay.svelte';
	import type { PromiseFinalizers } from '../types';
	import { USER_CANCELED } from '../internal/constants';
	import Button from '../components/Button.svelte';
	import type { Snippet } from 'svelte';

	interface ConfirmDialogState {
		title: string;
		message: string;
		note?: string;
		confirmText: string;
		cancelText: string;
	}

	const default_context: ConfirmDialogState = {
		title: 'Confirm',
		message: '',
		note: '',
		confirmText: 'Confirm',
		cancelText: 'Cancel'
	};
	let active_state = $state(default_context);
	let is_open = $state(false);

	interface Props {
		title?: Snippet<[any]>;
		message?: Snippet<[any]>;
		note?: Snippet<[any]>;
	}
	let { title, message, note }: Props = $props();

	let prompt_finalizers: PromiseFinalizers = $state({
		resolve: () => close(),
		reject: () => close()
	});

	function close() {
		is_open = false;
	}

	export async function request_confirmation<TValue>(
		options: Partial<ConfirmDialogState>
	): Promise<TValue> {
		is_open = true;
		active_state = { ...default_context, ...options };
		return new Promise<TValue>((resolve, reject) => {
			prompt_finalizers = {
				resolve: (v) => {
					close();
					resolve(v);
				},
				reject: (e) => {
					close();
					reject(e);
				}
			};
		});
	}
</script>

<OverlayDialog bind:open={is_open} persistent>
	<div class="confirm-wrap sl-card">
		{#if title}{@render title(active_state)}{:else}
			<h3 class="title">{active_state.title}</h3>
		{/if}
		{#if message}{@render message(active_state)}{:else if active_state.message}
			<p class="message">{active_state.message}</p>
		{/if}
		{#if note}{@render note(active_state)}{:else if active_state.note}
			<p class="note">{active_state.note}</p>
		{/if}
		<div class="controls padding-top">
			<div class="control-button" style:grid-column="1">
				<Button
					label={active_state.cancelText}
					onclick={() => prompt_finalizers.reject(USER_CANCELED)}
				/>
			</div>
			<div class="control-button" style:grid-column="3">
				<Button label={active_state.confirmText} onclick={() => prompt_finalizers.resolve()} />
			</div>
		</div>
	</div>
</OverlayDialog>

<style lang="sass">
.confirm-wrap	
	position: relative
	display: grid
	grid-auto-rows: auto
	grid-template-columns: minmax(100px, 1fr)
	gap: var(--spacing)
	
	width: var(--confirm-dialog-width, auto)
	min-width: var(--confirm-dialog-min-width, 280px)
	max-width: var(--confirm-dialog-max-width, 500px)
	padding: var(--confirm-dialog-padding, var(--spacing-x2))

	.title 
		text-align: center

	.message
		padding: var(--spacing), 0
		text-align: var(--confirm-dialog-message-align, center)
		font-weight: var(--confirm-dialog-font-weight-message)
		color: var(--confirm-dialog-message-color)

	.note
		padding: var(--spacing), 0
		text-align: var(--confirm-dialog-note-align, center)
		font-weight: var(--confirm-dialog-font-weight-note)
		color: var(--confirm-dialog-note-color, var(--hint-color))

	.controls
		display: grid
		grid-template-columns: auto 1fr auto
		gap: var(--spacing)

		.control-button
			min-width: 100px
			--button-horizontal-spacing: var(--spacing-x2)

</style>
