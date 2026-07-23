<script lang="ts">
	// xterm touches the DOM at import time, so it's loaded lazily on mount
	// (never during SSR). Writes before it's ready are queued.
	import type {
		ITerminalInitOnlyOptions,
		ITerminalOptions,
		Terminal as XTerminal
	} from '@xterm/xterm';
	import '@xterm/xterm/css/xterm.css';

	import { onDestroy, onMount } from 'svelte';

	let terminalContainer: HTMLDivElement;
	let term: XTerminal | undefined;
	let resizeObserver: ResizeObserver | undefined = undefined;
	let pending: string[] = [];

	interface Props {
		options?: ITerminalOptions | ITerminalInitOnlyOptions | undefined;
	}

	let {
		options = {
			convertEol: true
		}
	}: Props = $props();

	onMount(async () => {
		const [{ Terminal }, { FitAddon }] = await Promise.all([
			import('@xterm/xterm'),
			import('@xterm/addon-fit')
		]);
		term = new Terminal(options);
		const fitAddon = new FitAddon();
		term.loadAddon(fitAddon);
		term.open(terminalContainer);
		fitAddon.fit();

		resizeObserver = new ResizeObserver(() => fitAddon.fit());
		resizeObserver.observe(terminalContainer);

		for (const t of pending) term.write(t);
		pending = [];
	});

	onDestroy(() => {
		term?.dispose();
		resizeObserver?.disconnect();
	});

	export function write(text: string) {
		if (term) term.write(text);
		else pending.push(text);
	}

	export function clear() {
		if (term) term.clear();
		else pending = [];
	}
</script>

<div class="terminal-wrap">
	<div class="terminal" bind:this={terminalContainer}></div>
</div>

<style lang="sass">
.terminal-wrap
	width: var(--terminal-width, 100%)
	height: var(--terminal-height, 320px)
	box-sizing: border-box
	padding: var(--terminal-padding, var(--spacing-f2))
	border-radius: var(--terminal-border-radius, var(--border-radius))
	background: var(--terminal-background, #0b0e14)
	overflow: hidden

	.terminal
		width: 100%
		height: 100%
</style>
