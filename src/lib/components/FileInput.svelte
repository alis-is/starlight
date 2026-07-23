<script lang="ts">
	import FileUpload from '../icons/file-upload.svelte';
	import { array_to_file_list, validate } from '../internal/util';
	import type { ValidationRules } from '../types';

	interface Props {
		id?: string;
		value?: FileList | undefined;
		label?: string;
		invalid?: boolean;
		disabled?: boolean;
		hint?: string;
		rules?: ValidationRules<any>;
		multiple?: boolean;
		[key: string]: any;
	}

	let {
		id = crypto.randomUUID(),
		value = $bindable(undefined),
		label = '',
		invalid = false,
		disabled = false,
		hint = 'Click or drag files here to upload.',
		rules = [],
		multiple = false,
		...rest
	}: Props = $props();

	let isInvalid = $derived(validate(value, rules) !== true);
	let invalidHint = $derived(
		invalid === true ? hint : isInvalid ? validate(value, rules).toString() : ''
	);

	const selectedFiles = $derived(value ? Array.from(value) : []);
	const hasFiles = $derived(selectedFiles.length > 0);
	function removeFile(index: number) {
		const next = selectedFiles.filter((_, i) => i !== index);
		value = next.length ? array_to_file_list(next) : undefined;
	}

	let pending_files: FileList | undefined;
	let input_element: HTMLInputElement;
	function select_file() {
		pending_files = value;
		input_element!.click();
	}
	function internal_input_value_change(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) {
			value = pending_files;
		}
		pending_files = undefined;
	}

	let drop_active = $state(false);
	function ondragover(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		drop_active = true;
	}
	function ondragleave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		drop_active = false;
	}
	function ondrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		drop_active = false;
		if (e.dataTransfer === null || e.dataTransfer.files.length === 0) return;
		value = multiple ? e.dataTransfer.files : array_to_file_list([e.dataTransfer.files[0]]);
	}
</script>

<div
	class="input-wrap"
	class:disabled
	class:drop-zone-active={drop_active}
	class:has-files={hasFiles}
	role="button"
	tabindex="0"
	aria-disabled={disabled}
	onclick={select_file}
	onkeydown={(e) => ['Enter', ' '].includes(e.key) && select_file()}
	{ondragover}
	ondragenter={ondragover}
	{ondragleave}
	ondragend={ondragleave}
	{ondrop}
>
	<div class="border"></div>
	<div class="upload-area">
		<input
			bind:this={input_element}
			{id}
			bind:files={value}
			{...rest}
			type="file"
			{multiple}
			hidden
			onchange={internal_input_value_change}
		/>
		<div class="upload-icon">
			<FileUpload />
		</div>
		<div class="label">
			{hasFiles
				? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
				: label}
		</div>
		{#if isInvalid && invalidHint}
			<span class="hint invalid-text hint-visible">{invalidHint}</span>
		{:else if hasFiles}
			<div class="files">
				{#each selectedFiles as file, i (file.name + i)}
					<span class="file-chip">
						<span class="file-name">{file.name}</span>
						<button
							type="button"
							class="file-remove"
							aria-label="Remove file"
							onclick={(e) => {
								e.stopPropagation();
								removeFile(i);
							}}>×</button
						>
					</span>
				{/each}
			</div>
		{:else}
			<span class="hint" class:hidden={disabled || !hint} class:hint-visible={hint}>{hint}</span>
		{/if}
	</div>
</div>

<style lang="sass">
	$animation-duration: 0.2s

	.drop-zone-active
		background-color: var(--input-background-highlight-color) !important

		.border
			opacity: 0.5 !important

		.upload-icon
			transform: scale(1.1)

	// files selected — accent the frame and shrink the icon a touch
	.has-files
		background-color: color-mix(in srgb, var(--accent) 7%, var(--input-background-color)) !important

		.border
			opacity: 1
			border-style: solid
			border-color: color-mix(in srgb, var(--accent) 40%, transparent)

		.upload-icon :global(svg)
			width: calc(var(--file-upload-icon-size, 4rem) * 0.6)
			height: calc(var(--file-upload-icon-size, 4rem) * 0.6)

	.input-wrap
		position: relative
		display: inline-block
		width: 100%
		box-sizing: border-box
		border-radius: var(--input-border-radius)
		background-color: var(--input-background-color)
		cursor: pointer
		user-select: none
		padding: var(--spacing)
		transition: background-color $animation-duration linear

		.border
			position: absolute
			top: var(--spacing-f2)
			left: var(--spacing-f2)
			right: var(--spacing-f2)
			bottom: var(--spacing-f2)
			border: 2px dashed var(--file-upload-border-color, color-mix(in srgb, var(--hint-color) 45%, transparent))
			border-radius: var(--input-border-radius)
			opacity: 0
			pointer-events: none
			transition: opacity $animation-duration linear

		&:hover
			background-color: var(--input-background-highlight-color) !important

			.upload-icon
				transform: scale(1.1)

		.upload-area
			display: flex
			flex-direction: column
			align-items: center
			justify-content: center
			gap: var(--spacing-f2)
			min-height: var(--file-upload-min-height, 150px)
			text-align: center
			pointer-events: none

			.upload-icon
				display: flex
				transition: transform $animation-duration linear
				justify-content: center
				align-items: center

				:global(svg)
					width: var(--file-upload-icon-size, 4rem)
					height: var(--file-upload-icon-size, 4rem)
					fill: var(--file-upload-icon-color, var(--accent))

			.label
				font-size: var(--font-size)
				color: var(--input-text-color, var(--text-color))
				font-weight: bold

			.files
				display: flex
				flex-wrap: wrap
				justify-content: center
				gap: var(--spacing-f2)
				max-width: 100%

				.file-chip
					display: inline-flex
					align-items: center
					gap: var(--spacing-f2)
					max-width: 100%
					padding: 0.2em 0.3em 0.2em 0.7em
					border-radius: 999px
					background: color-mix(in srgb, var(--accent) 16%, transparent)
					color: var(--accent)
					font-size: 0.85rem

				.file-name
					overflow: hidden
					text-overflow: ellipsis
					white-space: nowrap

				.file-remove
					pointer-events: auto
					flex: none
					cursor: pointer
					display: inline-flex
					align-items: center
					justify-content: center
					width: 1.35em
					height: 1.35em
					border: none
					border-radius: 50%
					background: transparent
					color: inherit
					font-size: 1.05em
					line-height: 1

					&:hover
						background: color-mix(in srgb, var(--accent) 28%, transparent)

			.hint
				color: var(--input-hint-color, var(--hint-color))
				font-size: var(--input-hint-font-size)
				opacity: 0
				transition: opacity $animation-duration linear

			.hint-visible
				opacity: 1

			.invalid-text
				font-weight: bold
				color: var(--error-color) !important
</style>
