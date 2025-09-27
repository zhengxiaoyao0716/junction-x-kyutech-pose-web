<script lang="ts" module>
	export interface CaptureProps {
		stream: MediaStream;
	}

	export async function getAvailableCameras() {
		const available = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
		if (!available) return [];
		const devices = await navigator.mediaDevices.enumerateDevices();
		return devices.filter((device) => device.kind === 'videoinput');
	}
	export async function openCameraStream(deviceId: string) {
		return await navigator.mediaDevices.getUserMedia({
			video: { deviceId: { exact: deviceId } }
		});
	}

	export async function captureCameraStream(video: HTMLVideoElement) {
		const canvas = new OffscreenCanvas(video.videoWidth, video.videoHeight);
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		return await canvas.convertToBlob({ type: 'image/png' });
	}

	export { NoCamera };
</script>

<script>
	const { stream }: CaptureProps = $props();
</script>

<div id="capture">
	<video
		{@attach (video) => {
			video.srcObject = stream;
			video.play();
		}}
	>
		<track kind="captions" srclang="en" label="English captions" src="" />
	</video>
</div>

{#snippet NoCamera()}
	<div id="capture">
		<img alt="no-camera" src="/images/photo_camera.svg" style:opacity={0.3} />
	</div>
{/snippet}

<style>
	#capture {
		width: 100%;
		height: 100%;
		border: 1px solid var(--text-primary);
	}
	img,
	video {
		width: 100%;
		height: 100%;
	}
</style>
