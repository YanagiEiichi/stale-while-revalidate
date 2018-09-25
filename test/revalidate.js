const test = require('ava');
const setStaleWhileRevalidate = require('../bundle.js');

test('revalidate for async function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(async () => inc++);
  t.is(await f(), 0); // first call
  t.is(await f(), 0); // read from cache and revalidate
  t.is(await f(), 1); // read from cache and revalidate
  t.is(await f(), 2); // read from cache and revalidate
  t.is(await f(), 3); // read from cache and revalidate
});

test('revalidate for sync function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(() => inc++);
  t.is(await f(), 0); // first call
  t.is(await f(), 0); // read from cache and revalidate
  t.is(await f(), 1); // read from cache and revalidate
  t.is(await f(), 2); // read from cache and revalidate
  t.is(await f(), 3); // read from cache and revalidate
});
