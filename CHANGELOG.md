# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
