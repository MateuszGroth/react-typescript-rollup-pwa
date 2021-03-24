const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');

module.exports = {
    'setupFilesAfterEnv': ['./setupTestFramework.js'],
    'testEnvironment': 'node',
    'roots': ['<rootDir>/src'],
    'testMatch': ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    'transform': {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
};
