export function blobToBase64(blob: Blob) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}
export interface UploadRespJson {
	input_url: string;
	output_url: string;
}

export async function uploadImage(url: string, image: Blob) {
	const base64 = await blobToBase64(image);
	const formData = new FormData();
	formData.set('image', base64);
	const resp = await fetch(url, { method: 'POST', body: formData });
	return (await resp.json()) as UploadRespJson;
}
