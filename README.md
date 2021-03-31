## PWA setup - react (typescript), rollup, nodejs

This setup lets you load web workers and service workers efficiently, with the use of http caching and caches api.
Static assets are automatically passed to service worker file.

You can find example usage of service worker loader at `./src/sw/register.ts` and the service worker file at `./src/sw/index.ts`.

An example of a web worker is located at `./src/web-worker/test.worker.ts`. It is loaded within `./src/index.tsx`.

### Usage

Define the entry point at `rollup.config.js` input (currently `./src/index.tsx`).

Use any of the available build commands:

```shell
    npm run bulld
```

or (builds on every detected change within the output dir)

```shell
    npm run bulld:watch
```

or (dev server that uses live reload)

```shell
    npm run start:dev
```

### Rollup custom plugins

Feel free to modify the rollup plugins located at `./lib`. They are made so they worked for me.
