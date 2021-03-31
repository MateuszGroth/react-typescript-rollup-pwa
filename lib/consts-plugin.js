export default function constsPlugin(consts) {
    const importPrefix = 'consts:';
    return {
        name: 'consts-plugin',
        resolveId(id) {
            if (id.startsWith(importPrefix)) return id;
        },
        load(id) {
            if (!id.startsWith(importPrefix)) return;
            const key = id.slice(importPrefix.length);
            return `export default ${JSON.stringify(consts[key])}`;
        },
    };
}
