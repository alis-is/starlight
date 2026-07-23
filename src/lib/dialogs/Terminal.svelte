<script lang="ts">
	import OverlayDialog from './Overlay.svelte';
	import Button from '../components/Button.svelte';
	import Terminal from '../components/Terminal.svelte';
	interface Props {
		title?: import('svelte').Snippet<[any]>;
	}

	let { title }: Props = $props();

	interface TerminalDialogState {
		title: string;
		allow_close: boolean;
		close_text: string;
	}

	const default_state: TerminalDialogState = {
		title: 'Terminal',
		allow_close: true,
		close_text: 'Cancel'
	};

	let terminal: ReturnType<typeof Terminal> | undefined = $state(undefined);
	let active_state = $state(default_state);
	let is_open = $state(false);

	let close_finalizer: () => void = $state(() => {});

	function close() {
		is_open = false;
	}

	export async function hide() {
		close();
	}

	export async function write(data: string) {
		terminal!.write(data);
	}

	export async function clear() {
		terminal!.clear();
	}

	export async function update_context(options: Partial<TerminalDialogState>) {
		active_state = { ...active_state, ...options };
	}

	export async function show(dialogOptions: Partial<TerminalDialogState>): Promise<void> {
		is_open = true;
		active_state = { ...default_state, ...dialogOptions };

		return new Promise((resolve) => {
			close_finalizer = () => {
				close();
				resolve();
			};
		});
	}
</script>

<OverlayDialog bind:open={is_open} persistent>
	<div class="terminal-wrap sl-card">
		{#if title}{@render title(active_state)}{:else}
			<h3 class="title">{active_state.title}</h3>
		{/if}
		<div class="terminal">
			<Terminal bind:this={terminal} />
		</div>
		<div class="controls padding-top">
			<div class="control-button" class:disabled={!active_state.allow_close} style:grid-column="2">
				<Button label={active_state.close_text} onclick={() => close_finalizer()} />
			</div>
		</div>
	</div>
</OverlayDialog>

<style lang="sass">
.terminal-wrap	
	position: relative
	display: grid
	grid-auto-rows: auto 1fr auto
	grid-template-columns: minmax(100px, 1fr)
	gap: var(--spacing)
	
	height: var(--terminal-dialog-height, 80vh)
	min-height: var(--terminal-dialog-min-height, 280px)
	max-height: var(--terminal-dialog-max-height)
	width: var(--terminal-dialog-width, 80vw)
	min-width: var(--terminal-dialog-min-width, 280px)
	max-width: var(--terminal-dialog-max-width)

	.title 
		text-align: center

	.terminal
		margin: var(--spacing)

	.controls
		display: grid
		grid-template-columns: auto 1fr auto

		.control-button
			min-width: 150px
			--button-horizontal-spacing: var(--spacing-x2)
</style>
