<script lang="ts" module>
	export interface PreviewProps {
		image: string;
	}

	export { NoImage };
</script>

<script>
	const { image } = $props();
</script>

<div id="preview">
	<img alt="preview" src={image} />
</div>

{#snippet NoImage()}
	<div id="preview">
		<img alt="no-preview" src="/images/broken_image.svg" style:opacity={0.3} />
	</div>
{/snippet}

<style>
	#preview {
		width: 100%;
		height: 100%;
		border: 1px solid var(--text-primary);
	}
	img {
		width: 100%;
		height: 100%;
	}
</style>
