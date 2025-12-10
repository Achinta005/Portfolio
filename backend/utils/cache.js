const NodeCache = require("node-cache");

// TTL = 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

module.exports = {
  getCache: (key) => cache.get(key),
  setCache: (key, value) => cache.set(key, value),
  clearCache: () => cache.flushAll()
};
