# @budarin/psw-plugin-serve-root-from-asset

## Описание

`@budarin/psw-plugin-serve-root-from-asset` — плагин для `@budarin/pluggable-serviceworker`, который отдает заранее закэшированный HTML‑ассет в ответ на навигационные запросы к корню (`/`).

## Установка

```bash
npm install @budarin/psw-plugin-serve-root-from-asset
# или
yarn add @budarin/psw-plugin-serve-root-from-asset
# или
pnpm add @budarin/psw-plugin-serve-root-from-asset
```

## Пример использования

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

Плагин перехватывает `fetch`‑события для пути `/` и отвечает содержимым HTML‑файла, который уже лежит в Cache Storage под указанным ключом.
Если ассет не найден в кеше, плагин возвращает `undefined`, и обработка запроса может быть продолжена другими плагинами или дефолтной логикой.

## API

### `serveRootFromAsset(config)`

Создает экземпляр плагина.

#### `config: ServeRootFromAssetConfig`

- `cacheName: string`
  **Обязательно.** Имя кеша (Cache Storage), в котором хранится корневой HTML‑ассет.

- `rootContentAssetPath: string`
  **Обязательно.** Ключ/путь, под которым ассет лежит в кеше (например, `/index.html`).

- `order`
  **Опционально** Порядковый номер плагина. По-умочанию - 0;

## Поведение

- Обрабатываются только навигационные запросы, у которых `URL.pathname === '/'`.
- Для всех остальных путей плагин сразу возвращает `undefined`.
- Для `/`:
    - открывается кеш с именем `cacheName`;
    - выполняется поиск ответа по ключу `rootContentAssetPath`;
    - если ответ найден — он возвращается как результат;
    - если нет — через `logger` пишется предупреждение и возвращается `undefined`.

## Ограничения

- Плагин **не** наполняет кеш сам по себе. Ожидается, что где‑то еще в сервис‑воркере (например, на этапе предзагрузки/прекаша) нужный ассет уже добавлен в Cache Storage.
- Плагин влияет только на запросы к корню (`/`); все остальные запросы проходят дальше без изменений.
