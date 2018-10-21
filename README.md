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
import { mergeSinks, extractSinks } from 'cyclejs-utils'

const drivers = { /* ... */ };
const driverNames = Object.keys(drivers);

function main(sources)
{
    const children$: Stream<Sinks[]> = sources.state
        .map(s => s.childState.map(c => ChildComponent(sources)));

    // Merge all children Sinks automaticly, but combine DOM and display in div
    const child$: Stream<Sinks> = children$.map(arr => mergeSinks(arr, {
        DOM: arr => xs.combine(...arr).map(div)
    }));

    return extractSinks(child$, driverNames),
}
```
