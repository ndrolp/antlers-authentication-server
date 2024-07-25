export const DEVELOPMENT = process.env.NODE_ENV === 'development'
export const TEST = process.env.NODE_ENV === 'test'
export const PRODUCTION = process.env.NODE_ENV === 'production'
export const SERVER_HOST_NAME = process.env.SERVER_HOST_NAME
export const SERVER_HOST_PORT = process.env.SERVER_HOST_NAME

export const server = {
    SERVER_HOST_NAME,
    SERVER_HOST_PORT,
}
