import type { Plugin } from '@budarin/pluggable-serviceworker';

export interface ServeRootFromAssetConfig {
    cacheName: string;
    rootContentAssetPath: string;
    order?: number;
    headers?:
        | HeadersInit
        | ((params: {
              request: Request;
              cached: Response;
          }) => HeadersInit);
}

const DEFAULT_HEADERS: HeadersInit = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
};

export function serveRootFromAsset(config: ServeRootFromAssetConfig): Plugin {
    const { cacheName, rootContentAssetPath, order = 0, headers } = config;

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

            const baseHeaders = new Headers(cached.headers);
            const defaultHeaders = new Headers(DEFAULT_HEADERS);

            defaultHeaders.forEach((value, key) => {
                baseHeaders.set(key, value);
            });

            if (headers) {
                const overrideHeaders = new Headers(
                    typeof headers === 'function'
                        ? headers({ request: event.request, cached })
                        : headers
                );

                overrideHeaders.forEach((value, key) => {
                    baseHeaders.set(key, value);
                });
            }

            return new Response(cached.body, {
                status: cached.status,
                statusText: cached.statusText,
                headers: baseHeaders,
            });
        },
    };
}
