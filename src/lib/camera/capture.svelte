<script lang="ts" module>
	export interface CaptureProps {
		stream: MediaStream;
	}

	export async function getAvailableCameras() {
		const available = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
		if (!available) return [];
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		const devices = await navigator.mediaDevices.enumerateDevices();
		stream.getTracks().forEach((track) => track.stop());
		return devices.filter((device) => device.kind === 'videoinput');
	}
	export async function openCameraStream(deviceId: string) {
		return await navigator.mediaDevices.getUserMedia({
			video: { deviceId: { exact: deviceId } }
		});
	}

	export async function takeVideoSnapshot() {
		const video = document.querySelector('video') as HTMLVideoElement;
		if (!video) return;
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

	$effect(() => {
		return () => {
			stream.getTracks().forEach((track) => track.stop());
		};
	});
</script>

<video
	{@attach (video) => {
		video.srcObject = stream;
		video.play();
	}}
>
	<track kind="captions" srclang="en" label="English captions" src="" />
</video>

{#snippet NoCamera()}
	<img alt="no-camera" src="/images/photo_camera.svg" style:opacity={0.3} />
{/snippet}

<style>
	img,
	video {
		width: 100%;
		height: 100%;
	}
</style>
