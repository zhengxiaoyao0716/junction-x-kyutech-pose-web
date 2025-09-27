<script lang="ts">
	import Button from '$lib/button.svelte';
	import Capture, {
		getAvailableCameras,
		NoCamera,
		openCameraStream,
		takeVideoSnapshot
	} from '$lib/camera/capture.svelte';
	import Preview, { NoImage } from '$lib/camera/preview.svelte';
	import { uploadImage } from '$lib/camera/upload.js';
	import Icon from '$lib/icon.svelte';

	const { data } = $props();

	let cameraIndex = $state(0);
	const cameraDevices = getAvailableCameras();
	let recordTimer = $state(0);
	let snapshotImage = $state('');
	let previewSource = $state('');

	const onRecord = async () => {
		recordTimer = 1000.0 / 15.0;
		if (snapshotImage) URL.revokeObjectURL(snapshotImage);
		snapshotImage = '';
	};

	const snapshot = async () => {
		if (snapshotImage) URL.revokeObjectURL(snapshotImage);
		const blob = await takeVideoSnapshot();
		if (!blob) return;
		recordTimer = 0;
		snapshotImage = URL.createObjectURL(blob);
		await uploadImage(data.api.upload, blob);
		setTimeout(() => {
			previewSource = data.api.download + `?t=${Math.random()}`;
		}, 100);
	};

	$effect(() => {
		if (recordTimer <= 0) return;
		let i = 0;
		let timer = setInterval(async () => {
			const blob = await takeVideoSnapshot();
			if (!blob) return;
			await uploadImage(data.api.upload, blob);
			previewSource = data.api.download + `?t=${++i}`;
		}, recordTimer);
		return () => {
			clearInterval(timer);
		};
	});
	$effect(() => {
		return () => {
			if (snapshotImage) URL.revokeObjectURL(snapshotImage);
		};
	});

	const stopAll = () => {
		recordTimer = 0;
		if (snapshotImage) {
			URL.revokeObjectURL(snapshotImage);
			snapshotImage = '';
		}
		previewSource = '';
	};
</script>

<div id="page">
	<h3>Skeleton-based Action Recognition</h3>
	<h3>for Sports/Training Venues</h3>
	{#await cameraDevices}
		<div id="head"></div>
		<div id="body">
			<section>{@render NoCamera()}</section>
		</div>
		<div id="foot">
			<h2>`MediaDevices` is not available.</h2>
		</div>
	{:then cameras}
		{@const camera = cameras[cameraIndex]}
		<div id="head">
			<label>
				<b>Camera:</b>
				<select name="camera" bind:value={cameraIndex}>
					{#each cameras as camera, index}
						<option value={index}>{camera.label || 'Unknown'}</option>
					{/each}
					<option value={-1}>None (close)</option>
				</select>
			</label>
		</div>
		<div id="body">
			<section>
				{#if camera}
					{@const stream = openCameraStream(camera.deviceId)}
					{#await stream}
						{@render NoCamera()}
					{:then stream}
						<Capture {stream} />
						{#if snapshotImage}
							<Preview source={snapshotImage} />
						{/if}
					{/await}
				{:else}
					{@render NoCamera()}
				{/if}
			</section>
			<section>
				{#if previewSource}
					<Preview source={previewSource} />
				{:else if snapshotImage}
					<Preview source={snapshotImage} />
				{:else}
					{@render NoImage()}
				{/if}
			</section>
		</div>
		<div id="foot">
			<Button disabled={!camera || recordTimer > 0} onclick={onRecord}>
				<Icon name={recordTimer > 0 ? 'screen_record' : 'play_circle'} />
				<span>Record</span>
			</Button>
			<Button disabled={!camera} onclick={snapshot}>
				<Icon name="camera" />
				<span>Snapshot</span>
			</Button>
			<hr />
			<Button onclick={stopAll}>
				<Icon name="stop_circle" />
				<span>Stop</span>
			</Button>
		</div>
	{/await}
</div>

<style>
	#page {
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		font-size: 1.5em;
	}
	#page > h3 {
		margin: 0.2em;
	}

	#head {
		margin: 0.5em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;
		width: 88svw;
	}
	#head select {
		font-size: 0.8em;
		border: none;
		background: none;
		outline: none;
		border-bottom: 1px solid var(--text-primary);
		color: var(--text-primary);
	}

	#body {
		display: flex;
		gap: 0.5em;
		max-height: calc(100% - 10em);
		position: relative;
	}
	#body > section {
		width: 44svw;
		height: 33svw;
		max-height: 100%;
		position: relative;
	}
	@media screen and (orientation: portrait) {
		#body {
			flex: 1 1 auto;
			flex-direction: column;
		}
		#body > section {
			flex: 1 1 auto;
			width: 88svw;
		}
	}

	section > :global(img),
	section > :global(video) {
		position: absolute;
		width: 100%;
		height: 100%;
		border: 1px solid var(--text-primary);
	}

	#foot {
		margin: 0.5em;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}
</style>
