import React from 'react';
import ReactDOM from 'react-dom';
import { wrap } from 'comlink';

import 'style/main.scss';

import App from './components/App';
import isDev from 'consts:isDev';
import { registerSw } from './sw/register';
import workerUrl from 'web-worker:./web-worker/test.worker';

if (!isDev) {
    const testWorker: any = wrap(new Worker(workerUrl, { type: 'module' }));
    setTimeout(async () => console.log(await testWorker()), 5000);
    registerSw();
}

ReactDOM.render(<App />, document.querySelector('#root'));
