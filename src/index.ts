import xs, { Stream } from 'xstream';

export type Sinks = {
    [name : string]: Stream<any>
};

/**
 * Applies xs.merge to all sinks in the array
 * @param  {Sinks[]} ...sinks the sinks to be merged
 * @return {Sinks}            the new unified sink
 */
export function mergeSinks(...sinks : Sinks[]) : Sinks
{
    const drivers : string[] = sinks
        .map(s => Object.keys(s))
        .reduce((acc, curr) => [...acc, ...curr], [])
        .reduce((acc, curr) => acc.indexOf(curr) !== -1 ? [...acc, curr] : acc, []);

    const emptySinks : any = drivers
        .map(s => ({ [s]: [] }))
        .reduce((acc, curr) => Object.assign(acc, curr), {});

    return sinks
        .reduce((acc, curr) => {
            return Object.keys(acc)
                .map(s => ({ [s]: acc[s]}))
                .map(o => {
                    const name : string = Object.keys(o)[0];
                    return !curr[name] ? o : {
                        [name]: [...o[name], curr[name]]
                    };
                })
                .reduce((a, c) => Object.assign(a, c), {});
        }, emptySinks);
}

/**
 * Extracts the sinks from a Stream of Sinks
 * @param  {Stream<Sinks>} sinks$
 * @param  {string[]}      driverNames the names of all drivers that are possibly in the stream, it's best to use Object.keys() on your driver object
 * @return {Sinks}                     A sinks containing the streams of the last emission in the sinks$
 */
export function extractSinks(sinks$ : Stream<Sinks>, driverNames : string[]) : Sinks
{
    return driverNames
        .map(d => ({
        [d]: sinks$
            .map(s => s[d])
            .filter(b => b)
            .flatten()
        }))
        .reduce((acc, curr) => Object.assign(acc, curr), {});
}

/**
 * Just a wrapper around mergeSinks and extractSinks
 * @param  {Stream<Sinks>[]} ...sinks$
 * @return {Stream<Sinks>}
 */
export function mergeSinks$(...sinks$ : Stream<Sinks>[]) : Stream<Sinks>
{
    return xs.combine(...sinks$).map(sinks => mergeSinks(...sinks));
}

/**
 * Returns an object without the property named
 * @param  {Sinks}  sinks A normal sinks object
 * @param  {string} name  the name of the sink to be omitted
 * @return {Sinks}
 */
export function filterProp(sinks : Sinks, name : string) : Sinks
{
    return Object.keys(sinks)
        .filter(s => s !== name)
        .map(s => ({ [s]: sinks[s] }))
        .reduce((acc, curr) => Object.assign(acc, curr), {});
}
