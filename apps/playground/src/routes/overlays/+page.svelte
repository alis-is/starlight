<script lang="ts">
	import { Button, AlertDialog, ConfirmDialog, PromptDialog } from '@alis-is/starlight';

	let alertDialog: AlertDialog;
	let confirmDialog: ConfirmDialog;
	let promptDialog: PromptDialog;
	let dialogResult = $state('');

	async function doAlert() {
		await alertDialog.alert({ title: 'Hello', message: 'This is an alert dialog.' });
		dialogResult = 'alert closed';
	}
	async function doConfirm() {
		try {
			await confirmDialog.request_confirmation({ title: 'Delete?', message: 'Are you sure?' });
			dialogResult = 'confirmed';
		} catch {
			dialogResult = 'cancelled';
		}
	}
	async function doPrompt() {
		try {
			const value = await promptDialog.prompt<string>({ title: 'Your name?', value: '' });
			dialogResult = `prompt: ${value}`;
		} catch {
			dialogResult = 'prompt cancelled';
		}
	}
</script>

<div class="demo-page">
	<h1>Overlays</h1>

	<section data-testid="section-dialogs">
		<h2>Dialogs</h2>
		<div class="row">
			<Button label="Alert" onclick={doAlert} />
			<Button label="Confirm" onclick={doConfirm} />
			<Button label="Prompt" onclick={doPrompt} />
		</div>
		<p class="result">result: <span data-testid="dialog-result">{dialogResult}</span></p>
	</section>
</div>

<AlertDialog bind:this={alertDialog} />
<ConfirmDialog bind:this={confirmDialog} />
<PromptDialog bind:this={promptDialog} />
