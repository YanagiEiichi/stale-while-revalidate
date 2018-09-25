var setStaleWhileRevalidate = function(statelessAsyncFunction, stale, maxAge) {

  // Check NaN and set "stale" defaults 60s
  if (+stale !== +stale) stale = 60;

  // Check NaN and set "maxAge" defaults 0s
  if (+maxAge !== +maxAge) maxAge = 0;

  // Unify ms
  stale *= 1000;
  maxAge *= 1000;

  // Create cache objects in closure
  var callingCache = {};
  var resultCache = {};

  var wrapper = function() {

    // Serialize all arguments as the cache key.
    var key = JSON.stringify(arguments);

    // Return the result from cache if existed and not yet expired with maxAge.
    if (key in resultCache && Date.now() - resultCache[key].timestamp < maxAge) {
      return resultCache[key].promise;
    }

    // Set calling cache if not existed and delete it after fulfilled.
    if (!(key in callingCache)) {

      // Call the stateless async function and fix non-thenable result
      try {
        callingCache[key] = statelessAsyncFunction.apply(this, arguments);
      } catch (error) {
        callingCache[key] = Promise.reject(error);
      }
      var then = callingCache[key].then;
      if (typeof then !== 'function') {
        callingCache[key] = Promise.resolve(callingCache[key]);
        then = callingCache[key].then;
      }

      // Waiting for async calling
      var theResultCache = resultCache;
      then.call(callingCache[key], function() {
        // Check lock state
        if (theResultCache !== resultCache) return;
        // Move calling cache to result cache and attach a timestamp.
        resultCache[key] = { promise: callingCache[key], timestamp: Date.now() };
        delete callingCache[key];
      }, function() {
        delete callingCache[key];
      });

    }

    // Return the result from cache if existed and not yet expired with SWR.
    if (key in resultCache && Date.now() - resultCache[key].timestamp < maxAge + stale) {
      return resultCache[key].promise;
    } else {
      return callingCache[key];
    }

  };

  // Expose a method to clean cache
  Object.defineProperty(wrapper, 'clean', {
    configurable: true,
    value: function() {
      callingCache = {};
      resultCache = {};
    }
  });

  return wrapper;

};
