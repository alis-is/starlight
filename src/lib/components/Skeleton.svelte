<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		/** Render as a circle (uses `width` as the diameter). */
		circle?: boolean;
		radius?: string;
		class?: string;
	}

	let { width, height, circle = false, radius, class: klass = '' }: Props = $props();
</script>

<div
	class="sl-skeleton {klass}"
	class:circle
	style:width
	style:height={circle ? width : height}
	style:border-radius={circle ? '50%' : radius}
	aria-hidden="true"
></div>

<style lang="sass">
.sl-skeleton
	width: 100%
	height: 1em
	border-radius: var(--skeleton-radius, calc(var(--border-radius) / 2))
	background: var(--skeleton-color, color-mix(in srgb, var(--hint-color) 22%, transparent))
	background-image: linear-gradient(90deg, transparent 0%, var(--skeleton-shine, color-mix(in srgb, var(--hint-color) 14%, transparent)) 50%, transparent 100%)
	background-size: 200% 100%
	animation: sl-skeleton-shimmer 1.4s ease-in-out infinite

@keyframes sl-skeleton-shimmer
	0%
		background-position: 200% 0
	100%
		background-position: -200% 0
</style>
