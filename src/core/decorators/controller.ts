export function Controller(baseRoute: string = '') {
    return (target: object) => {
        Reflect.defineMetadata('baseRoute', baseRoute, target)
    }
}

export default Controller
