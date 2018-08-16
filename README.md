# cyclejs-utils

A few helper functions for dealing with sinks

## Links

git repository:         https://github.com/cyclejs-community/cyclejs-util

npm package:            https://www.npmjs.com/package/cyclejs-utils

typedoc documentation:  https://cyclejs-community.github.io/cyclejs-utils/

## Usage

The most useful functions are `mergeSinks` and `extractSinks`.

```ts
import { ChildComponent } from 'XXX'
import { Sinks, mergeSinks, filterProp, extractSinks } from 'cyclejs-utils'

const drivers = { /* ... */ };
const driverNames = Object.keys(drivers);

function main(sources)
{
    const children$ : Stream<Sinks[]> = sources.state
        .map(s => s.childState.map(c => ChildComponent(sources)));

    //Create a combined DOM of the children
    const vdom$ : Stream<VNode> = children$
        .map(arr => xs.combine(...arr.map(s => s.DOM)))
        .flatten()
        .map(div); //Just display the children in a div

    //Merge all children Sinks automaticly
    const child$ : Stream<Sinks> = children$.map(arr => mergeSinks(...arr));

    const childSink : Sinks = filterProp(
        extractSinks(child$, driverNames), //Transform a Stream of Sinks to a normal Sinks object
        'DOM'
    ); //give me a driver object without the DOM property

    return Object.assign({}, childSink, { DOM: vdom$ });
}
```
