<script lang="ts">
	import '$lib/assets/styles/material-symbols-outlined.css';
	import '$lib/assets/styles/root.css';
	import '$lib/assets/styles/theme.css';
	import { iconFontCssUrl } from '$lib/icon.svelte';
	import { type ClassValue } from 'svelte/elements';

	let { data, children } = $props();

	$effect(() => console.log('Icon Font CSS URL:', iconFontCssUrl));
</script>

<svelte:head>
	<!-- <link rel="stylesheet" href={iconFontCssUrl} /> -->
	<title>{data.env['win.title']}</title>
</svelte:head>

<div id="root">
	<div class="bg full" style:background-image="url('/images/bg0.webp')"></div>
	{@render background({ cls: 'wander1' })}
	{@render background({ cls: 'wander2' })}
	<div
		id="nasa"
		{@attach () => {
			// @ts-ignore-line
			globalThis.particlesJS.load('nasa', '/styles/particlesjs-config.json');
		}}
	></div>
	{@render children?.()}
</div>

{#snippet background({
	width = '512px',
	height = '512px',
	cls = []
}: {
	width?: string;
	height?: string;
	cls?: ClassValue;
})}
	<div
		class={['bg', cls]}
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
	.bg:global(.wander1) {
		left: 0;
		top: 0;
		animation: wander1 17s infinite linear;
	}
	.bg:global(.wander2) {
		right: 0%;
		bottom: 0%;
		animation: wander2 13s infinite linear;
	}
	/* prettier-ignore */
	@keyframes wander1 {
		0%   { translate: 0 0; }
		30%  { translate: 80svw 20svw; }
		70%  { translate: 20svw 80svw; }
		100% { translate: 0 0; }
	}
	/* prettier-ignore */
	@keyframes wander2 {
		0%   { translate: 0 0; }
		20%  { translate: -10svw -30vw; }
		45%  { translate: -60svw -10vw; }
		75%  { translate: -40svw 10vw; }
		100% { translate: 0 0; }
	}
	#nasa {
		position: absolute;
		pointer-events: none;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		opacity: 0.3;
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
