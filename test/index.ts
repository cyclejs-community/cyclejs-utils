import xs, {Stream} from 'xstream';
import { makeCollection } from '@cycle/state';

import { mergeSinks, pickMergeSinks, extractSinks } from '../src/index';

// ***************** mergeSinks ***************** //
const sinks1 = { DOM: xs.of("test"), HTTP: xs.of({ url: '/api' }) };
const sinks2 = { DOM: xs.of("foo") };
const sinks3 = { HTTP: xs.of({ url: '/test' }), foo: xs.never() };

const res = mergeSinks([sinks1, sinks2, sinks3]);
res.foo.subscribe({});
res.DOM.subscribe({});
res.HTTP.subscribe({});

// typings:expect-error
res.bar.subscribe({});

function merger(doms: Stream<string>[]): Stream<string> {
    return xs.merge(...doms);
}

const res2 = mergeSinks([sinks1, sinks2, sinks3], {
    DOM: merger
});

const res3 = mergeSinks([sinks1, sinks2, sinks3], {
    // typings:expect-error
    bar: merger
});

const res4 = mergeSinks([sinks1, sinks2, sinks3], {
    // typings:expect-error
    HTTP: merger
});

// ***************** pickMergeSinks ***************** //
const component = makeCollection({
    item: () => ({ DOM: xs.of("foo"), HTTP: xs.of({ url: '/bar'}) }),
    collectSinks: pickMergeSinks(['DOM', 'HTTP', 'foo'])
});
const component2 = makeCollection({
    item: () => ({ DOM: xs.of("foo"), HTTP: xs.of({ url: '/bar'}) }),
    collectSinks: pickMergeSinks(['DOM', 'HTTP', 'foo'], {
        DOM: ins => ins.pickMerge('foo')
    })
});

// ***************** extractSinks ***************** //
const sinks$ = xs.of({ DOM: xs.of("hello"), HTTP: xs.of({ url: '/foo' }) });

const driverNames = ['DOM', 'HTTP', 'foo'];

const extract = extractSinks(sinks$, driverNames);
extract.DOM.subscribe({});
extract.HTTP.subscribe({});
// typings:expect-error
extract.foo.subscribe({});
