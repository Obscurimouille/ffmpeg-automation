export function Selector(data: { regexp: RegExp }) {
    return function(decoratedClass: any) {
        decoratedClass['REGEX'] = data.regexp;
    }
}