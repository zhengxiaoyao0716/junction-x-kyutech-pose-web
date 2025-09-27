import type { LayoutLoad } from './$types';

export const prerender = true; // true: 静态页面, false: 单页应用
export const ssr = false;

export const load: LayoutLoad = async () => {
	const env = {
		'win.title': 'Pose-Web'
	};
	const host = '';
	const api = {
		upload: `${host}/api/upload_frame/`,
		download: `${host}/api/download_frame`
	};
	return { env, api };
};
