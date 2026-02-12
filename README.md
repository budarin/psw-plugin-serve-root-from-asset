# @budarin/psw-plugin-serve-root-from-asset

[Русская версия](https://github.com/budarin/psw-plugin-serve-root-from-asset/blob/master/README.ru.md)

Service Worker plugin for `@budarin/pluggable-serviceworker` that serves a configured cached HTML asset for root (`/`) navigation requests.

[![CI](https://github.com/budarin/psw-plugin-serve-root-from-asset/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/budarin/psw-plugin-serve-root-from-asset/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@budarin/psw-plugin-serve-root-from-asset?color=cb0000)](https://www.npmjs.com/package/@budarin/psw-plugin-serve-root-from-asset)
[![npm](https://img.shields.io/npm/dt/@budarin/psw-plugin-serve-root-from-asset)](https://www.npmjs.com/package/@budarin/psw-plugin-serve-root-from-asset)
[![bundle](https://img.shields.io/bundlephobia/minzip/@budarin/psw-plugin-serve-root-from-asset)](https://bundlephobia.com/result?p=@budarin/psw-plugin-serve-root-from-asset)
[![GitHub](https://img.shields.io/github/license/budarin/psw-plugin-serve-root-from-asset)](https://github.com/budarin/psw-plugin-serve-root-from-asset)

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
import { createPluggableServiceWorker, precache } from '@budarin/pluggable-serviceworker';

const cacheName = 'app-shell';

createPluggableServiceWorker(self, {
    plugins: [
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
});
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
