## stale-while-revalidate

An implementation of "[stale-while-revalidate](https://tools.ietf.org/html/rfc5861)" caching policy.

## Usage

### setStaleWhileRevalidate(statelessAsyncFunction, stale = 60, maxAge = 0)

Wrap a stateless async function with "stale-while-revalidate" caching policy.

* **statelessAsyncFunction** `<Function>` A stateless async function.
* **stale** `<Number>` Max age of stale content.
* **maxAge** `<Number>` Max age of cache.
