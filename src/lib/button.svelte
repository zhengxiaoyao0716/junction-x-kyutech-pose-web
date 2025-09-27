<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	export interface ButtonProps extends HTMLButtonAttributes {
		theme?: 'info' | 'pass' | 'warn' | 'error' | 'notes' | 'plain';
	}
	const { theme = 'info', children, ...props }: ButtonProps = $props();
</script>

<button type="button" {...props} data-theme={theme}>
	{@render children?.()}
</button>

<style>
	button {
		border: none;
		background: var(--mark-main);
		font-size: 0.8em;
		padding: 0.5em 1em;
		border-radius: 0.5em;
		user-select: none;
		display: flex;
		align-items: center;
	}
	button:active:not(:disabled) {
		outline: 1px solid var(--text-secondary);
	}
</style>
