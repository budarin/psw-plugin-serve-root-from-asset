import type { Plugin } from '@budarin/pluggable-serviceworker';

export interface ServeRootFromAssetConfig {
    cacheName: string;
    rootContentAssetPath: string;
}

export function serveRootFromAsset(config: ServeRootFromAssetConfig): Plugin {
    const { cacheName, rootContentAssetPath: assetPath } = config;

    return {
        name: 'serve-root-from-asset',
        order: -10,

        async fetch(event, logger) {
            const url = new URL(event.request.url);

            if (url.pathname !== '/') {
                return undefined;
            }

            const cache = await caches.open(cacheName);
            const cached = await cache.match(assetPath);

            if (!cached) {
                logger.warn(
                    `serve-root-from-asset: "${assetPath}" не найден в кэше "${cacheName}"`
                );
                return undefined;
            }

            return cached;
        },
    };
}
