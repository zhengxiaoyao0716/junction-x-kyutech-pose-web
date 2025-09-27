/// <reference types="@sveltejs/kit" />
import { build, files, version } from "$service-worker";

// 为此部署创建唯一的缓存名称
const CACHE = `cache-${version}`;

const ASSETS = [
  ...build, // 应用程序本身
  ...files, // `static` 中的所有内容
];

self.addEventListener("install", (event) => {
  // 创建新缓存并添加所有文件
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", (event) => {
  // 从磁盘删除以前的缓存数据
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

self.addEventListener("fetch", (event) => {
  // 忽略 POST 请求等
  if (event.request.method !== "GET") return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // `build`/`files` 始终可以从缓存中提供服务
    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);

      if (response) {
        return response;
      }
    }

    // 对于其他所有内容，首先尝试网络
    // 但如果我们离线，则回退到缓存
    try {
      const response = await fetch(event.request);

      // 如果我们离线，fetch 可能返回非 Response 值
      // 而不是抛出错误 - 我们不能将这个非 Response 传递给 respondWith
      if (!(response instanceof Response)) {
        throw new Error("invalid response from fetch");
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(event.request);

      if (response) {
        return response;
      }

      // 如果没有缓存，就直接报错
      // 因为我们无法对这个请求做任何响应
      throw err;
    }
  }

  event.respondWith(respond());
});
