const test = require('ava');
const setStaleWhileRevalidate = require('../bundle.js');

test('async function debounce', t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(async () => inc++);
  return Promise.all(Array.from({ length: 3 }, () => f())).then(result => t.deepEqual(result, [ 0, 0, 0 ]));
});

test('sync function debounce', t => {
  let inc = 0;
  let f = setStaleWhileRevalidate(() => inc++);
  return Promise.all(Array.from({ length: 3 }, () => f())).then(result => t.deepEqual(result, [ 0, 0, 0 ]));
});
