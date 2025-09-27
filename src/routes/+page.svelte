<script lang="ts">
	import Button from '$lib/button.svelte';
	import Capture, {
		captureCameraStream as captureVideoStream,
		getAvailableCameras,
		NoCamera,
		openCameraStream
	} from '$lib/camera/capture.svelte';
	import Preview, { NoImage } from '$lib/camera/preview.svelte';
	import { uploadImage } from '$lib/camera/upload.js';

	const { data } = $props();

	let cameraIndex = $state(0);
	const cameraDevices = getAvailableCameras();
	let captureImage = $state('');
	let previewImage = $state('');

	const onCapture = async () => {
		if (captureImage) URL.revokeObjectURL(captureImage);
		const video = document.querySelector('#capture video') as HTMLVideoElement;
		const blob = await captureVideoStream(video);
		if (!blob) return;
		captureImage = URL.createObjectURL(blob);
		const { output_url } = await uploadImage(data.api.upload, blob);
		previewImage = output_url;
	};

	$effect(() => {
		return () => {
			if (captureImage) URL.revokeObjectURL(captureImage);
		};
	});

	const reset = () => {
		if (captureImage) {
			URL.revokeObjectURL(captureImage);
			captureImage = '';
		}
		previewImage = '';
	};
</script>

<div id="page">
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
			<Button onclick={reset}>RESET</Button>
		</div>
		<div id="body">
			<section>
				{#if camera}
					{@const stream = openCameraStream(camera.deviceId)}
					{#await stream}
						{@render NoCamera()}
					{:then stream}
						{#if captureImage}
							<Preview image={captureImage} />
						{:else}
							<Capture {stream} />
						{/if}
					{/await}
				{:else}
					{@render NoCamera()}
				{/if}
			</section>
			<section>
				{#if previewImage}
					<Preview image={previewImage} />
				{:else}
					{@render NoImage()}
				{/if}
			</section>
		</div>
		<div id="foot">
			<Button disabled={!camera} onclick={onCapture}>
				<span>Capture</span>
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

	#head {
		margin: 0.5em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;
		width: 96svw;
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
	}
	#body > section {
		width: 48svw;
		height: 36svw;
	}

	#foot {
		margin: 0.5em;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}
</style>
