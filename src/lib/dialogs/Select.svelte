<script lang="ts">
	import OverlayDialog from './Overlay.svelte';
	import type { PromiseFinalizers, SelectItem } from '../types';
	import { USER_CANCELED } from '../internal/constants';
	import Button from '../components/Button.svelte';
	import Select from '../components/Select.svelte';
	import type { Snippet } from 'svelte';

	interface SelectDialogState<TValue> {
		title: string;
		message: string;
		hint: string;
		value: TValue;
		options: Array<SelectItem<TValue> | TValue>;
		confirmText: string;
		cancelText: string;
	}

	const default_state: SelectDialogState<any> = {
		title: 'Select',
		message: '',
		hint: '',
		value: '',
		options: [],
		confirmText: 'Confirm',
		cancelText: 'Cancel'
	};

	let active_state = $state(default_state);
	let is_open = $state(false);

	interface Props {
		title?: Snippet<[any]>;
		message?: Snippet<[any]>;
	}
	let { title, message }: Props = $props();

	let value: SelectItem<any> | undefined = $state(undefined);
	let options: Array<SelectItem<any>> = $state([]);

	let prompt_finalizers: PromiseFinalizers = $state({
		resolve: () => close(),
		reject: () => close()
	});

	function close() {
		is_open = false;
	}

	export async function prompt<TValue>(
		promptOptions: Partial<SelectDialogState<TValue>>
	): Promise<TValue> {
		is_open = true;
		options = (promptOptions.options ?? []).map((v) => {
			if (typeof v === 'object') {
				return v as SelectItem<TValue>;
			}
			return { label: v, value: v } as SelectItem<TValue>;
		});

		active_state = { ...default_state, ...promptOptions };
		value = options.find(
			(v) => (v as SelectItem<TValue>).value === active_state.value
		) as SelectItem<TValue>;

		return new Promise<TValue>((resolve, reject) => {
			prompt_finalizers = {
				resolve: () => {
					close();
					resolve(value?.value);
				},
				reject: (e) => {
					close();
					reject(e);
				}
			};
		});
	}

	let isValid = $derived(active_state.options.includes(value));
</script>

<OverlayDialog bind:open={is_open} persistent>
	<div class="prompt-wrap sl-card">
		{#if title}{@render title(active_state)}{:else}
			<h3 class="title">{active_state.title}</h3>
		{/if}
		{#if message}{@render message(active_state)}{:else if active_state.message}
			<p class="message">{active_state.message}</p>
		{/if}
		<Select bind:value {options} />
		<div class="controls padding-top">
			<div class="control-button" style:grid-column="1">
				<Button
					label={active_state.cancelText}
					onclick={() => prompt_finalizers.reject(USER_CANCELED)}
				/>
			</div>
			<div class="control-button" class:disabled={isValid} style:grid-column="3">
				<Button
					label={active_state.confirmText}
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
	gap: var(--spacing)
	
	width: var(--select-dialog-width, auto)
	min-width: var(--select-dialog-min-width, 280px)
	max-width: var(--select-dialog-max-width, 500px)

	.title 
		text-align: center

	.message
		margin-top: 0px

	.controls
		display: grid
		grid-template-columns: auto 1fr auto

		.control-button
			min-width: 100px
			--button-horizontal-spacing: var(--spacing-x2)
</style>
