# cyclejs-utils

A few helper functions for dealing with sinks

## Links

git repository:         https://github.com/cyclejs-community/cyclejs-util

npm package:            https://www.npmjs.com/package/cyclejs-utils

typedoc documentation:  https://cyclejs-community.github.io/cyclejs-util/index.html


## Usage

```ts
import { ChildComponent } from 'XXX'
import { Sinks, mergeSinks$, filterProp, extractSinks } from 'cyclejs-utils'

const drivers = { /* ... */ };
const driverNames = Object.keys(drivers);

function main(sources)
{
    const children$ : Stream<Sinks[]> = sources.state
        .map(s => s.childState.map(c => ChildComponent(sources)));

    const vdom$ : Stream<VNode> = children$
        .map(arr => xs.combine(...arr.map(s => s.DOM)))
        .flatten()
        .map(arr => div([...arr])); //Just display the children in a div

    const child$ : Stream<Sinks> = children$.map(arr => mergeSinks(...arr));

    const childSink : Sinks = filterProp(
        extractSinks(child$, driverNames),
        'DOM'
    ); //give me a driver object without the DOM property

    return Object.assign({}, childSink, { DOM: vdom$ });
}
```
