<script lang="ts">
	import '$lib/assets/styles/root.css';
	import '$lib/assets/styles/theme.css';
	import { iconFontCssUrl } from '$lib/icon.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="stylesheet" href={iconFontCssUrl} />
	<title>{data.env['win.title']}</title>
</svelte:head>

<div id="root">
	<div class="bg full" style:background-image="url('/images/bg0.webp')"></div>
	{@render background('0', '0')}
	{@render background('60%', '50%')}
	{@render children?.()}
</div>

{#snippet background(left: string, top: string, width = '512px', height = '512px')}
	<div
		class="bg"
		style:left
		style:top
		style:width
		style:height
		style:background-image="url('/images/bg1.webp')"
	></div>
{/snippet}

<style lang="postcss">
	.bg {
		position: absolute;
		pointer-events: none;
		opacity: 0.3;
		background-repeat: no-repeat;
		background-size: contain;
		z-index: -1;
	}
	.bg.full {
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-repeat: repeat;
		background-size: auto;
	}

	:global(body) {
		color: var(--text-primary);
	}
	:global(button),
	:global(.mark) {
		color: var(--text-primary);
		cursor: pointer;

		&:hover {
			color: var(--text-stress);
		}
		&:disabled {
			color: var(--text-secondary);
			cursor: default;
			pointer-events: none;
		}
	}
</style>
