# @budarin/psw-plugin-serve-root-from-asset

Плагин для [@budarin/pluggable-serviceworker](https://www.npmjs.com/package/@budarin/pluggable-serviceworker): отдаёт заранее закэшированный HTML‑ассет в ответ на навигационные запросы к корню (`/`).

## Описание

Во многих продакшен-сборках весь фронтенд попадает в отдельную папку (например `assets/` или `static/`): оттуда раздаются скрипты, стили и главная HTML-страница. При этом запрос к корню сайта (`/`) ожидает `index.html` в корне, тогда как физически он лежит среди ассетов. Этот плагин даёт возможность отвечать на запросы к `/` заранее закэшированным HTML-ассетом, чтобы приложение корректно открывалось по корневому URL и при обновлении страницы.

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

- `order: number`
  **Опционально.** Порядковый номер плагина. По умолчанию — 0.

- `headers: HeadersInit | (params: { request: Request; cached: Response }) => HeadersInit`
  **Опционально.** Дополнительные заголовки, которые будут добавлены или переопределены при отдаче ответа из кеша для `/`.  
  Можно передать:
  - статический объект/массив/`Headers`,
  - или функцию, которая получит текущий `request` и найденный `cached`‑ответ и вернёт набор заголовков.  
  Плагин всегда устанавливает дефолтные заголовки, отключающие кэширование в браузере (`Cache-Control: no-cache, no-store, must-revalidate`, `Pragma: no-cache`, `Expires: 0`), чтобы избежать коллизий между HTTP-кэшем браузера и Cache Storage Service Worker. Заголовки из этого поля накладываются поверх дефолтных и могут их переопределить.

  **Примеры:**

  Статический объект:
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

  Функция с динамическими заголовками:
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

## Поведение

- Обрабатываются только навигационные запросы, у которых `URL.pathname === '/'`.
- Для всех остальных путей плагин сразу возвращает `undefined`.
- Для `/`:
    - открывается кеш с именем `cacheName`;
    - выполняется поиск ответа по ключу `rootContentAssetPath`;
    - если ответ найден — он возвращается как результат;
    - если нет — логируется предупреждение и возвращается `undefined`.

## Ограничения

- Плагин **не** наполняет кеш сам по себе. Ожидается, что где‑то еще в сервис‑воркере (например, на этапе предзагрузки/прекаша) нужный ассет уже добавлен в Cache Storage.
- Плагин влияет только на запросы к корню (`/`); все остальные запросы проходят дальше без изменений.

## 🤝 License

MIT © budarin
