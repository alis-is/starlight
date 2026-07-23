<script lang="ts">
	import {
		Button,
		CheckBox,
		Toggle,
		Input,
		Textarea,
		Select,
		Menu,
		RadioGroup,
		Slider,
		FileInput
	} from '@alis-is/starlight';
	import type { SelectItem } from '@alis-is/starlight';

	let checked = $state(true);
	let toggled = $state(false);
	let plan = $state('pro');
	let volume = $state(60);
	let files = $state<FileList | undefined>(undefined);
	const fileNames = $derived(
		files
			? Array.from(files)
					.map((f) => f.name)
					.join(', ')
			: ''
	);
	let name = $state('');
	let age = $state<number | string>(30);
	let email = $state('');
	let bio = $state('');
	const emailRule = (v: string) => !v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'Invalid email';
	let fruit = $state<SelectItem | undefined>(undefined);
	const fruitOptions: SelectItem[] = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Cherry', value: 'cherry' }
	];

	const menuItems: SelectItem[] = [
		{ label: 'Duplicate', value: 'dup' },
		{ label: 'Archive', value: 'archive' },
		{ label: 'Delete', value: 'delete' }
	];
	let lastMenu = $state('');
	let clickResult = $state('');
</script>

<div class="demo-page">
	<h1>Forms</h1>

	<section data-testid="section-buttons">
		<h2>Buttons & menu</h2>
		<div class="row">
			<Button label="Primary" />
			<Button
				label="Primary (hover)"
				style="--button-background-color: var(--button-hover-background-color); --button-background-image: var(--button-hover-background-image); --button-text-color: var(--button-hover-text-color)"
			/>
			<Button label="Disabled" disabled />
			<Button onclick={() => (clickResult = 'clicked')}>Custom child</Button>
			<Menu items={menuItems} onselect={(i) => (lastMenu = String(i.value))}>
				{#snippet menuButtonContent()}Actions ▾{/snippet}
			</Menu>
		</div>
		<p class="result">
			result: <span data-testid="dialog-result">{clickResult}</span>, menu:
			<span data-testid="menu-result">{lastMenu}</span>
		</p>
	</section>

	<section data-testid="section-inputs">
		<h2>Inputs & toggles</h2>
		<div class="stack">
			<div class="field-grid">
				<Input label="Name" bind:value={name} hint="Type something" />
				<Input label="Age" type="number" bind:value={age} hint="Numbers only" />
				<Input label="Email" bind:value={email} rules={[emailRule]} hint="name@example.com" />
				<Input label="Read-only" value="Locked value" disabled />
				<Select label="Fruit" options={fruitOptions} bind:value={fruit} />
			</div>
			<Textarea label="Bio" bind:value={bio} autosize placeholder="Tell us about yourself…" />
			<div class="field-grid">
				<div>
					<span class="field-label">Plan</span>
					<RadioGroup
						bind:value={plan}
						orientation="horizontal"
						options={[
							{ label: 'Free', value: 'free' },
							{ label: 'Pro', value: 'pro' },
							{ label: 'Team', value: 'team' }
						]}
					/>
				</div>
				<Slider label="Volume" bind:value={volume} showValue />
			</div>
			<div class="row" style="gap: calc(var(--spacing) * 2)">
				<CheckBox label="Checkbox" bind:checked />
				<Toggle label="Toggle" bind:checked={toggled} />
			</div>
			<div data-testid="section-file">
				<span class="field-label">Attachment</span>
				<FileInput label="Upload a file" bind:value={files} multiple />
				<p class="result">files=<span data-testid="file-value">{fileNames}</span></p>
			</div>
			<p class="result">
				plan={plan}, volume={volume}, name=<span data-testid="name-value">{name}</span>, fruit=<span
					data-testid="fruit-value">{fruit?.value ?? ''}</span
				>, checked={checked}, toggled={toggled}
			</p>
		</div>
	</section>
</div>
