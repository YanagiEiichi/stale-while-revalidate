module.exports = function(statelessAsyncFunction, seconds) {

  // Check NaN and set "seconds" defaults 60s
  if (+seconds !== +seconds) seconds = 60;

  // Create cache objects in closure
  var callingCache = {};
  var resultCache = {};

  return function() {

    // Serialize all arguments as the cache key.
    var key = JSON.stringify(arguments);

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
      then.call(callingCache[key], function() {
        // Move calling cache to result cache and attach a timestamp.
        resultCache[key] = { promise: callingCache[key], timestamp: Date.now() };
        delete callingCache[key];
      }, function() {
        delete callingCache[key];
      });

    }

    // Return the result from cache if existed and not yet expired.
    if (key in resultCache && Date.now() - resultCache[key].timestamp < seconds * 1000) {
      return resultCache[key].promise;
    } else {
      return callingCache[key];
    }

  };

};
