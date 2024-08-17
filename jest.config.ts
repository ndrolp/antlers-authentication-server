import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    maxWorkers: 1,
    moduleNameMapper: {
        '^core/(.*)$': '<rootDir>/src/core/$1',
        '^users/(.*)$': '<rootDir>/src/users/$1',
        '^auth/(.*)$': '<rootDir>/src/auth/$1',
    },
    detectOpenHandles: true,
}

export default config
