const test = require('ava');
const setStaleWhileRevalidate = require('../bundle.js');

test('revalidate for async function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(async () => inc++, 0);
  t.is(await f(), 0); // first call
  t.is(await f(), 1); // cache expired and revalidate
  t.is(await f(), 2); // cache expired and revalidate
  t.is(await f(), 3); // cache expired and revalidate
});

test('revalidate for sync function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(() => inc++, 0);
  t.is(await f(), 0); // first call
  t.is(await f(), 1); // cache expired and revalidate
  t.is(await f(), 2); // cache expired and revalidate
  t.is(await f(), 3); // cache expired and revalidate
});
