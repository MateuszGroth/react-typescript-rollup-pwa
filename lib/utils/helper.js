import * as fs from 'fs';

export const readFile = (path, options = {}) => {
    const { encoding = 'utf8' } = options;

    return fs.readFileSync(path, { encoding });
};
