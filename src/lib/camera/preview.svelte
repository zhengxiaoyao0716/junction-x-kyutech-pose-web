<script lang="ts" module>
	export interface PreviewProps {
		source: string;
	}
	export { NoImage };
</script>

<script>
	const { source }: PreviewProps = $props();
</script>

<img alt="preview" src={source} />

{#snippet NoImage()}
	<img alt="no-preview" src="/images/broken_image.svg" style:opacity={0.3} />
{/snippet}

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
