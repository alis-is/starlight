<script lang="ts">
	interface Props {
		/** Diameter in pixels. */
		size?: number;
		/** Stroke thickness in pixels. */
		thickness?: number;
		label?: string;
		class?: string;
	}

	let { size = 24, thickness = 3, label = 'Loading', class: klass = '' }: Props = $props();
</script>

<span
	class="sl-spinner {klass}"
	role="status"
	aria-label={label}
	style:--sl-spinner-size="{size}px"
	style:--sl-spinner-thickness="{thickness}px"
></span>

<style lang="sass">
.sl-spinner
	display: inline-block
	width: var(--sl-spinner-size)
	height: var(--sl-spinner-size)
	border: var(--sl-spinner-thickness) solid var(--spinner-track-color, rgba(127, 127, 127, 0.2))
	border-top-color: var(--spinner-color, var(--accent))
	border-radius: 50%
	animation: sl-spin 0.7s linear infinite

@keyframes sl-spin
	to
		transform: rotate(360deg)

@media (prefers-reduced-motion: reduce)
	.sl-spinner
		animation-duration: 2s
</style>
