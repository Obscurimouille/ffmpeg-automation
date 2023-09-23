export function Statement(data: { identifier: string }) {
    return function(decoratedClass: any) {
        decoratedClass['IDENTIFIER'] = data.identifier;
    }
}