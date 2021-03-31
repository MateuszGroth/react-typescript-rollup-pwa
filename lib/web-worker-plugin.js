import { createHash } from 'crypto';
import { readFile } from './utils/helper';

const importPrefix = 'web-worker:';

const getWorkerNameFromPath = path => {
    const workerFile = readFile(path);
    const fileHash = createHash('sha1');
    fileHash.update(workerFile);
    const hash = fileHash.digest('hex');
    const shortenedHash = hash.slice(0, 16);
    const workerName = JSON.stringify(path)
        .replace(/[\\]/g, '/')
        .split('/')
        .pop()
        .replace(/\.[tj]sx?"?$/g, '');

    if (workerName.includes('.worker')) {
        return `${workerName}-${shortenedHash}.js`;
    }

    return `${workerName}.worker-${shortenedHash}.js`;
};
export default function webWorkerPlugin() {
    return {
        name: 'web-worker',
        async resolveId(id, importer) {
            if (!id.startsWith(importPrefix)) return;
            const plainId = id.slice(importPrefix.length);
            const result = await this.resolve(plainId, importer);

            if (!result) return;

            return importPrefix + result.id;
        },
        augmentChunkHash(chunkInfo) {
            // we have to update hash of the file that imports workers, because rollup will not
            // change it whenever worker has changed, so even tho sw changes along with the imported worker name
            // (as well as the imported name within index-[hash].js)
            // the index-[hash].js name does not change
            // so if it is 'http cached', the deprecated file might be served
            if (!chunkInfo.isEntry) return '';
            const importedModulesKeys = Object.keys(chunkInfo.modules);
            const importedWorkers = importedModulesKeys.filter(moduleKey => moduleKey.startsWith(importPrefix));

            if (!importedWorkers.length) return '';

            const fileHash = createHash('sha1');
            const importedWorkersFiles = importedWorkers.map(workerKey =>
                readFile(workerKey.slice(importPrefix.length))
            );
            for (const workerFile of importedWorkersFiles) {
                fileHash.update(workerFile);
            }
            const hash = fileHash.digest('hex');
            return hash;
        },
        async load(id) {
            if (!id.startsWith(importPrefix)) return;
            const workerPath = id.slice(importPrefix.length);
            const workerName = await getWorkerNameFromPath(workerPath);
            const fileId = this.emitFile({
                type: 'chunk',
                fileName: `js/${workerName}`,
                id: workerPath,
            });
            return `export default import.meta.ROLLUP_FILE_URL_${fileId};`;
        },
    };
}
