import { Express, RequestHandler } from 'express'
import { RouteHandlers } from '../libs/routes'

export function Route(
    method: keyof Express,
    path: string = '',
    ...middleware: RequestHandler[]
) {
    return (target: object, _key: string, descriptor: PropertyDescriptor) => {
        const routePath = path
        const routeHandlers: RouteHandlers =
            Reflect.getMetadata('routeHandlers', target) || new Map()

        if (!routeHandlers.has(method)) {
            routeHandlers.set(method, new Map())
        }

        routeHandlers
            .get(method)
            ?.set(routePath, [...middleware, descriptor.value])

        Reflect.defineMetadata('routeHandlers', routeHandlers, target)
    }
}
