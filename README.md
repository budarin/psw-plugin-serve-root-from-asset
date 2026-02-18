# @budarin/psw-plugin-serve-root-from-asset

[Русская версия](https://github.com/budarin/psw-plugin-serve-root-from-asset/blob/master/README.ru.md)

Service Worker plugin for [@budarin/pluggable-serviceworker](https://www.npmjs.com/package/@budarin/pluggable-serviceworker) that serves a configured cached HTML asset for root (`/`) navigation requests.

[![CI](https://github.com/budarin/psw-plugin-serve-root-from-asset/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/budarin/psw-plugin-serve-root-from-asset/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@budarin/psw-plugin-serve-root-from-asset?color=cb0000)](https://www.npmjs.com/package/@budarin/psw-plugin-serve-root-from-asset)
[![npm](https://img.shields.io/npm/dt/@budarin/psw-plugin-serve-root-from-asset)](https://www.npmjs.com/package/@budarin/psw-plugin-serve-root-from-asset)
[![bundle](https://img.shields.io/bundlephobia/minzip/@budarin/psw-plugin-serve-root-from-asset)](https://bundlephobia.com/result?p=@budarin/psw-plugin-serve-root-from-asset)
[![license](https://img.shields.io/npm/l/@budarin/psw-plugin-serve-root-from-asset)](https://github.com/budarin/psw-plugin-serve-root-from-asset/blob/master/LICENSE)

In many production setups the frontend build is emitted entirely into a dedicated directory (e.g. `assets/` or `static/`). Scripts, styles, and the main HTML are served from that path. Browsers and links, however, typically request the entry page from the site root (`/`), where no physical `index.html` exists—the real file lives inside the assets folder. This plugin lets your Service Worker respond to root navigation requests with a cached copy of that HTML asset, so the app loads correctly when users open the root URL or refresh on `/`.

## Installation

```bash
npm install @budarin/psw-plugin-serve-root-from-asset
# or
yarn add @budarin/psw-plugin-serve-root-from-asset
# or
pnpm add @budarin/psw-plugin-serve-root-from-asset
```

## Usage

```ts
import { serveRootFromAsset } from '@budarin/psw-plugin-serve-root-from-asset';
import { initServiceWorker } from '@budarin/pluggable-serviceworker';
import { precache } from '@budarin/pluggable-serviceworker/plugins';

const cacheName = 'app-shell';

initServiceWorker(
    [
        precache({
            cacheName,
            assets: [
                '/assets/index.html',
                '/assets/main.js',
                '/assets/styles.css',
                ...
            ],
        }),
        serveRootFromAsset({
            cacheName,
            rootContentAssetPath: '/assets/index.html',
        }),
    ],
    { version: '1.0.0' }
);
```

The plugin intercepts `fetch` events for the root path `/` and responds with a cached asset from the specified cache.
If the asset is not found in the cache, the plugin returns `undefined`, allowing other plugins or the default handler to process the request.

## API

### `serveRootFromAsset(config)`

Creates a plugin instance.

#### `config: ServeRootFromAssetConfig`

- `cacheName: string`
  **Required.** Name of the cache where the root asset is stored (used with the Cache Storage API).

- `rootContentAssetPath: string`
  **Required.** Request path/key of the asset inside the cache (for example, `/index.html`).

- `order: number`
  **Optional.** Plugin order. Default — 0.

- `headers: HeadersInit | (params: { request: Request; cached: Response }) => HeadersInit`
  **Optional.** Extra headers that will be added or overridden on the cached response for `/`.  
  You may provide:
  - a static `HeadersInit` (object/array/`Headers`),
  - or a function that receives the current `request` and the found `cached` response and returns headers to apply.  
  These headers are merged on top of the headers from the cached response.

  **Examples:**

  Static object:
  ```ts
  serveRootFromAsset({
      cacheName,
      rootContentAssetPath: '/assets/index.html',
      headers: {
          'Cache-Control': 'no-cache',
          'X-Custom-Header': 'value',
      },
  });
  ```

  Function with dynamic headers:
  ```ts
  serveRootFromAsset({
      cacheName,
      rootContentAssetPath: '/assets/index.html',
      headers: ({ request, cached }) => ({
          'Cache-Control': request.url.includes('preview') ? 'no-store' : 'public, max-age=3600',
          'X-Served-From': 'service-worker',
      }),
  });
  ```

## Behavior

- Only navigation requests with `URL.pathname === '/'` are handled.
- For other paths, the plugin returns `undefined` immediately.
- For `/`:
    - opens the cache with `cacheName`;
    - looks up a response by `rootContentAssetPath`;
    - if found, returns the cached response;
    - if not found, logs a warning and returns `undefined`.

## Limitations

- The plugin **does not** populate the cache. It assumes that another part of your Service Worker (e.g. a precache phase) has already added the root asset into the cache.
- The plugin only affects root (`/`) navigation; all other requests pass through.

## 🤝 License

MIT © budarin
