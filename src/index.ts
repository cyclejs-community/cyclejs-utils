import { Stream } from 'xstream';

export type Sinks = {
    [name : string]: Stream<any>
};

export function mergeSinks(...sinks : Sinks[]) : Sinks
{
    const drivers : string[] = sinks
        .map<string[]>(s => Object.keys(s))
        .reduce((acc, curr) => acc.indexOf(curr) !== -1 ? [...acc, curr] : acc, []);

    const emptySinks : any = drivers
        .map(s => ({ [s]: [] }))
        .reduce((acc, curr) => Object.assign(acc, curr), {});

    return sinks
        .reduce((acc, curr) => {
            return Object.keys(acc)
                .map(s => ({ [s]: acc[s]}))
                .map(o => {
                    const name = Object.keys(o)[0];
                    return !curr[name] ? o : {
                        [name]: [...o[name], curr[name]]
                    };
                })
                .reduce((acc, curr) => Object.assign(acc, curr), {});
        }, emptySinks);
}

export function extractSinks(sinks$ : Stream<Sinks>, driverNames : string) : Sinks
{
    return driverNames
        .map(d => ({
            [d]: sinks$.map(s => s[d]).filter(s => !s ? xs.of() : s).flatten()
        }))
        .reduce((acc, curr) => Object.assign(acc, curr), {});
}

export function mergeSinks$(...sinks$ : Stream<Sinks>[]) : Stream<Sinks>
{
    return xs.combine(...sinks$).map(arr => mergeSinks(...sinks));
}

