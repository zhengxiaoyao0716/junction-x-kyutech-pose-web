<script lang="ts" module>
	const ICON_NAMES = [
		'camera',
		'play_circle',
		'screen_record',
		'stop_circle'
		//
	] as const;
	export type IconName = (typeof ICON_NAMES)[number];

	const fontArgs = `:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${ICON_NAMES.join(',')}`;
	export const iconFontCssUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined${fontArgs}`;
</script>

<script lang="ts" generics="Tag extends keyof SvelteHTMLElements">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type IconProps = SvelteHTMLElements[Tag] & {
		tag?: Tag;
		name: IconName;
		white?: boolean;
	};
	export type { IconProps };

	const { tag = 'i' as Tag, name, white, class: cls, ...props }: IconProps = $props();
</script>

<svelte:element this={tag} {...props} class={['icon', 'material-symbols-outlined', { white }, cls]}>
	{name}
</svelte:element>

<style lang="postcss">
	.icon {
		font-family: 'Material Symbols Outlined';
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
		font-size: inherit;
	}
	a,
	button {
		background: none;
		border: none;
		text-decoration: none;
		outline: none;
		cursor: pointer;
		padding: 0;

		& {
			color: var(--text-secondary);

			&:hover,
			&:focus {
				color: var(--text-primary);
			}
			&:active {
				color: var(--text-stress);
			}
		}

		&.white {
			color: var(--mark-text-primary);

			&:active,
			&:hover {
				color: var(--mark-text-stress);
			}
		}
	}
</style>
