import { Express } from 'express'
import { RouteHandlers } from '../core/libs/routes'
import logging from '../core/config/logger'

type Constructor<T = object> = new (...args: unknown[]) => T

export function defineRoutes(
    controllers: Constructor[],
    application: Express,
    addApi: boolean = true,
    version: number = 1,
) {
    for (let i = 0; i < controllers.length; i++) {
        const controller = new controllers[i]()

        const routeHandlers: RouteHandlers = Reflect.getMetadata(
            'routeHandlers',
            controller,
        )
        const controllerPath: string = Reflect.getMetadata(
            'baseRoute',
            controller.constructor,
        )
        const methods = Array.from(routeHandlers.keys())

        for (let j = 0; j < methods.length; j++) {
            const method = methods[j]
            const routes = routeHandlers.get(method)

            if (routes) {
                const routeNames = Array.from(routes.keys())

                for (let k = 0; k < routeNames.length; k++) {
                    const handlers = routes.get(routeNames[k])

                    if (handlers) {
                        const versionText =
                            version && addApi ? `/v${version}` : ''
                        const route = `${addApi ? '/api' : ''}${versionText}${controllerPath + routeNames[k]}`
                        application[method](route, handlers)
                        logging.info(
                            'Loading Route',
                            method.toString().toUpperCase(),
                            route,
                        )
                    }
                }
            }
        }
    }
}
