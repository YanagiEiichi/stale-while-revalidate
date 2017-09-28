## stale-while-revalidate

An implementation of "stale-while-revalidate" caching policy.

## Usage

### setStaleWhileRevalidate(statelessAsyncFunction, seconds = 60)

Wrap a stateless async function with "stale-while-revalidate" caching policy.

* **statelessAsyncFunction** `<Function>` A stateless async function.
* **seconds** `<Number>` Max age of the cache.
