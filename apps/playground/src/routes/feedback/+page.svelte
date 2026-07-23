<script lang="ts">
	import {
		Button,
		ProgressBar,
		Spinner,
		Badge,
		Tooltip,
		Alert,
		Skeleton,
		toast
	} from '@alis-is/starlight';
	import { InfoIcon } from '@alis-is/starlight/la';

	let progress = $state(40);
	let loading = $state(true);
</script>

<div class="demo-page">
	<h1>Feedback</h1>

	<section data-testid="section-progress">
		<h2>Progress & status</h2>
		<ProgressBar message="Uploading files…" {progress} total={100} hint="3 of 8 files" />
		<div class="row" style="margin-top: var(--spacing)">
			<Button label="-10" onclick={() => (progress = Math.max(0, progress - 10))} />
			<Button label="+10" onclick={() => (progress = Math.min(100, progress + 10))} />
			<Spinner />
		</div>
		<div class="row" style="margin-top: var(--spacing)">
			<Badge variant="accent">accent</Badge>
			<Badge variant="success">success</Badge>
			<Badge variant="warning">warning</Badge>
			<Badge variant="error">error</Badge>
			<Badge outline>outline</Badge>
			<Tooltip text="I'm a tooltip">
				<Badge>hover me</Badge>
			</Tooltip>
		</div>
	</section>

	<section data-testid="section-alerts">
		<h2>Alerts</h2>
		<div style="display: flex; flex-direction: column; gap: var(--spacing)">
			<Alert variant="info" title="Heads up">
				{#snippet icon()}<InfoIcon />{/snippet}
				This is an inline informational callout.
			</Alert>
			<Alert variant="success" title="Saved">Your changes were saved successfully.</Alert>
			<Alert variant="warning">Your trial ends in 3 days.</Alert>
			<Alert variant="error" title="Error" dismissible>Something went wrong. Try again.</Alert>
		</div>
	</section>

	<section data-testid="section-toasts">
		<h2>Toasts</h2>
		<div class="row">
			<Button label="Info" onclick={() => toast.info('Just so you know.')} />
			<Button label="Success" onclick={() => toast.success('Saved!', { title: 'Done' })} />
			<Button label="Warning" onclick={() => toast.warning('Careful with that.')} />
			<Button label="Error" onclick={() => toast.error('That failed.', { title: 'Oops' })} />
		</div>
	</section>

	<section data-testid="section-skeleton">
		<h2>Skeleton</h2>
		<div class="row" style="margin-bottom: var(--spacing)">
			<Button
				label={loading ? 'Show content' : 'Show skeleton'}
				onclick={() => (loading = !loading)}
			/>
		</div>
		{#if loading}
			<div class="row" style="align-items: center; gap: var(--spacing)">
				<Skeleton circle width="3rem" />
				<div style="flex: 1; display: flex; flex-direction: column; gap: var(--spacing-f2)">
					<Skeleton width="40%" height="1.1rem" />
					<Skeleton width="75%" />
					<Skeleton width="60%" />
				</div>
			</div>
		{:else}
			<p style="margin: 0">Content loaded. Toggle to see the skeleton again.</p>
		{/if}
	</section>
</div>
