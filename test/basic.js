const test = require('ava');
const setStaleWhileRevalidate = require('../bundle.js');

test('async function ok', t => {
  let f = setStaleWhileRevalidate(async (...args) => args);
  return f(1, 2, 3).then(result => t.deepEqual(result, [ 1, 2, 3 ]));
});

test('sync function ok', t => {
  let f = setStaleWhileRevalidate((...args) => args);
  return f(1, 2, 3).then(result => t.deepEqual(result, [ 1, 2, 3 ]));
});

test('async function error', t => {
  let f = setStaleWhileRevalidate((...args) => { throw args; });
  return f(1, 2, 3).catch(result => t.deepEqual(result, [ 1, 2, 3 ]));
});

test('sync function error', t => {
  let f = setStaleWhileRevalidate((...args) => { throw args; });
  return f(1, 2, 3).catch(result => t.deepEqual(result, [ 1, 2, 3 ]));
});

test('async function from cache ignore error', async t => {
  let error = null;
  let f = setStaleWhileRevalidate(async () => {
    if (error) throw error;
    return 'ok';
  });
  t.is(await f(), 'ok');
  error = new Error('hehe');
  t.is(await f(), 'ok');
});

test('sync function from cache ignore error', async t => {
  let error = null;
  let f = setStaleWhileRevalidate(() => {
    if (error) throw error;
    return 'ok';
  });
  t.is(await f(), 'ok');
  error = new Error('hehe');
  t.is(await f(), 'ok');
});
