import type { Plugin } from '@budarin/pluggable-serviceworker';

export interface ServeRootFromAssetConfig {
    cacheName: string;
    rootContentAssetPath: string;
    order?: number;
}

export function serveRootFromAsset(config: ServeRootFromAssetConfig): Plugin {
    const { cacheName, rootContentAssetPath, order = 0 } = config;

    return {
        order,
        name: 'serve-root-from-asset',

        async fetch(event, logger) {
            const url = new URL(event.request.url);

            const isNavigation =
                event.request.mode === 'navigate' ||
                event.request.headers.get('accept')?.includes('text/html');

            if (!isNavigation || url.pathname !== '/') {
                return undefined;
            }

            const cache = await caches.open(cacheName);
            const cached = await cache.match(rootContentAssetPath);

            if (!cached) {
                logger.warn(
                    `serve-root-from-asset: asset "${rootContentAssetPath}" not found in the cache "${cacheName}"`
                );
                return undefined;
            }

            return cached;
        },
    };
}
