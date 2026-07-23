<script lang="ts">
	import OverlayDialog from './Overlay.svelte';
	import ProgressBar from '../components/ProgressBar.svelte';
	import type { ProgressValue } from '../types';
	import type { Snippet } from 'svelte';

	interface ProgressDialogState {
		title: string;
		progress: ProgressValue;
		message: string;
		hint: string;
		total: number;
	}

	let isOpen = $state(false);
	const defaultState: ProgressDialogState = {
		title: 'Progress',
		progress: 0,
		message: '',
		hint: '',
		total: 100
	};
	let progress_state = $state(defaultState);

	interface Props {
		progress_bar?: Snippet<[ProgressDialogState]>;
	}

	let { progress_bar }: Props = $props();

	export function show(options: Partial<ProgressDialogState>) {
		isOpen = true;
		progress_state = { ...defaultState, ...options };
	}

	export function update_progress(options: Partial<ProgressDialogState>) {
		progress_state = { ...progress_state, ...options };
	}

	export function hide() {
		isOpen = false;
	}
</script>

<OverlayDialog bind:open={isOpen} persistent>
	<div class="progress-wrap sl-card">
		<div class="title">
			<h3>{progress_state.title}</h3>
		</div>
		{#if progress_bar}{@render progress_bar(progress_state)}{:else}
			<ProgressBar {...progress_state} />
		{/if}
	</div>
</OverlayDialog>

<style lang="sass">
.progress-wrap
	width: var(--progress-dialog-width, auto)
	min-width: var(--progress-dialog-min-width, 280px)
	max-width: var(--progress-dialog-max-width, 500px)

	
	.title
		display: flex
		justify-content: center
		align-items: center

</style>
