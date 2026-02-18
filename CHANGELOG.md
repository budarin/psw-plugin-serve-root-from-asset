# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-02-18

### Changed

- **Performance:** Reuse a single `Headers` instance for default cache-control headers instead of allocating a new one on every request.

## [1.1.0] - 2026-02-18

### Added

- **`headers` option:** Added optional `headers` field to `ServeRootFromAssetConfig` that allows setting or overriding HTTP headers when serving the cached root asset. Supports both static `HeadersInit` objects and dynamic functions that receive the current `request` and `cached` response.

### Changed

- **Default headers:** The plugin now always sets default headers (`Cache-Control: no-cache, no-store, must-revalidate`, `Pragma: no-cache`, `Expires: 0`) to disable browser caching and avoid conflicts between the browser's HTTP cache and Service Worker Cache Storage. User-provided headers are merged on top of these defaults and can override them.

## [1.0.10] - 2026-02-17

### Changed

- Version bump only; no functional changes.

## [1.0.9] - 2026-02-16

### Fixed

- **README:** Replace GitHub license badge with npm license badge so the badge shows "MIT" instead of "invalid" (shields.io sometimes fails on GitHub license detection when LICENSE contains non-ASCII).

## [1.0.8] - 2026-02-16

### Added

- **Documentation:** Preamble in README and README.ru describing the use case: frontend built into an `assets/` (or similar) folder with no physical `index.html` at root, and how the plugin serves the cached HTML for `/` requests.

## [1.0.7] - 2026-02-16

### Fixed

- **Documentation:** Align README and README.ru with `@budarin/pluggable-serviceworker` API:
  - Use `initServiceWorker(plugins, options)` instead of non-existent `createPluggableServiceWorker(self, { plugins })`.
  - Import `initServiceWorker` from `@budarin/pluggable-serviceworker` and `precache` from `@budarin/pluggable-serviceworker/plugins`.
  - Include required `version` in init options in examples.
- **README.ru.md:** Typo "По-умочанию" → "По умолчанию" in `order` option description.

## [1.0.6] - (previous)

Initial or prior releases.
