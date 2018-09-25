const test = require('ava');
const setStaleWhileRevalidate = require('../bundle.js');

test('clean for async function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(async () => inc++, 60, 1);
  t.is(await f(), 0); // first call
  t.is(await f(), 0); // read from cache
  t.is(await f(), 0); // read from cache
  f.clean();
  t.is(await f(), 1); // read from cache
});

test('clean for sync function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(() => inc++, 60, 1);
  t.is(await f(), 0); // first call
  t.is(await f(), 0); // read from cache
  t.is(await f(), 0); // read from cache
  f.clean();
  t.is(await f(), 1); // read from cache
});
