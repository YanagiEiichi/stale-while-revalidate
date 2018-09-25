const test = require('ava');
const setStaleWhileRevalidate = require('../src');

test('max-age for async function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(async () => inc++, 60, 1);
  t.is(await f(), 0); // first call
  t.is(await f(), 0); // read from cache
  t.is(await f(), 0); // read from cache
  await new Promise(resolve => setTimeout(resolve, 1000));
  t.is(await f(), 0); // read from cache and revalidate
  t.is(await f(), 1); // read from cache
});

test('max-age for sync function', async t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(() => inc++, 60, 1);
  t.is(await f(), 0); // first call
  t.is(await f(), 0); // read from cache
  t.is(await f(), 0); // read from cache
  await new Promise(resolve => setTimeout(resolve, 1000));
  t.is(await f(), 0); // read from cache and revalidate
  t.is(await f(), 1); // read from cache
});
