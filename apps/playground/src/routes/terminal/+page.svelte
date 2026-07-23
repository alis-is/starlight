<script lang="ts">
	import { Button } from '@alis-is/starlight';
	// Terminal is heavy (xterm) and deliberately kept out of the barrel — import it directly.
	import Terminal from '@alis-is/starlight/components/Terminal.svelte';
	import { onMount } from 'svelte';

	let term = $state<Terminal>();

	const banner = () => {
		term?.write('\x1b[1;35mstarlight\x1b[0m:~$ echo "hello from xterm"\r\n');
		term?.write('hello from xterm\r\n');
		term?.write('\x1b[1;35mstarlight\x1b[0m:~$ \x1b[32mnpm run build\x1b[0m\r\n');
		term?.write('\x1b[90m✓ built in 428ms\x1b[0m\r\n');
		term?.write('\x1b[1;35mstarlight\x1b[0m:~$ \x1b[38;5;250m█\x1b[0m\r\n');
	};

	onMount(banner);

	function greet() {
		term?.write('\x1b[36m→ ping\x1b[0m ' + new Date().toLocaleTimeString() + '\r\n');
	}
</script>

<div class="demo-page">
	<h1>Terminal</h1>

	<section data-testid="section-terminal">
		<h2>xterm.js terminal</h2>
		<p class="tagline">
			Wraps <code>@xterm/xterm</code>. Loaded lazily (never during SSR) and kept out of the barrel —
			import it directly from <code>@alis-is/starlight/components/Terminal.svelte</code>.
		</p>
		<Terminal bind:this={term} --terminal-height="300px" />
		<div class="row" style="margin-top: var(--spacing)">
			<Button label="Write line" onclick={greet} />
			<Button label="Clear" onclick={() => term?.clear()} />
			<Button label="Replay banner" onclick={banner} />
		</div>
	</section>
</div>
