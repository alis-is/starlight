<script lang="ts">
	import OverlayDialog from './Overlay.svelte';
	import type { PromiseFinalizers, ValidationRules } from '../types';
	import { USER_CANCELED } from '../internal/constants';
	import { validate } from '../internal/util';
	import Button from '../components/Button.svelte';
	import FileInput from '../components/FileInput.svelte';
	import type { Snippet } from 'svelte';

	interface FileDialogState {
		title: string;
		message: string;
		label: string;
		no_label: boolean;
		hint: string;
		value: FileList | undefined;
		rules: ValidationRules;
		multiple: boolean;
		confirm_text: string;
		cancel_text: string;
	}

	const default_state: FileDialogState = {
		title: 'Prompt',
		message: '',
		label: '',
		hint: 'Click or drag files here to upload.',
		value: undefined,
		rules: [],
		multiple: false,
		no_label: false,
		confirm_text: 'Confirm',
		cancel_text: 'Cancel'
	};

	let active_state = $state(default_state);

	interface Props {
		title?: Snippet<[any]>;
		message?: Snippet<[any]>;
		[key: string]: any;
	}

	let { title, message }: Props = $props();

	let is_open = $state(false);
	let prompt_finalizers: PromiseFinalizers = {
		resolve: () => close(),
		reject: () => close()
	};

	function close() {
		is_open = false;
	}

	export async function prompt(options: Partial<FileDialogState>): Promise<FileList> {
		is_open = true;
		active_state = { ...default_state, ...options };
		return new Promise<FileList>((resolve, reject) => {
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

	const is_valid = $derived(validate(active_state.value, active_state.rules ?? []) !== true);
</script>

<OverlayDialog bind:open={is_open} persistent>
	<div class="prompt-wrap sl-card">
		{#if title}
			{@render title(active_state)}
		{:else}
			<h3 class="title">{active_state.title}</h3>
		{/if}
		{#if message}
			{@render message(active_state)}
		{:else if active_state.message}
			<p class="message">{active_state.message}</p>
		{/if}
		<FileInput {...active_state} bind:value={active_state.value} />
		<div class="controls padding-top">
			<div class="control-button" style:grid-column="1">
				<Button
					label={active_state.cancel_text}
					onclick={() => prompt_finalizers.reject(USER_CANCELED)}
				/>
			</div>
			<div class="control-button" class:disabled={is_valid} style:grid-column="3">
				<Button
					label={active_state.confirm_text}
					onclick={() => prompt_finalizers.resolve(active_state.value)}
				/>
			</div>
		</div>
	</div>
</OverlayDialog>

<style lang="sass">
.prompt-wrap	
	position: relative
	display: grid
	grid-auto-rows: auto
	grid-template-columns: minmax(100px, 1fr)
	padding: var(--prompt-dialog-padding, var(--spacing-x2))
	gap: var(--spacing)
	
	width: var(--prompt-dialog-width, auto)
	min-width: var(--prompt-dialog-min-width, 280px)
	max-width: var(--prompt-dialog-max-width, 500px)

	.title 
		text-align: center

	.message
		margin-top: 0px

	.controls
		display: grid
		grid-template-columns: auto minmax(var(--spacing), 1fr) auto

		.control-button
			min-width: 100px
			--button-horizontal-spacing: var(--spacing-x2)
</style>
