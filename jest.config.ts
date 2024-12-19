import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    maxWorkers: 1,
    moduleNameMapper: {
        '^features/(.*)$': '<rootDir>/src/features/$1',
        '^core/(.*)$': '<rootDir>/src/core/$1',
        '^auth/(.*)$': '<rootDir>/src/auth/$1',
    },
    detectOpenHandles: true,
}

export default config
