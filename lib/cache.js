
var BrisaCache = function(views) {
  this.configs = {};
  this.caches = {};
};

BrisaCache.prototype.Register = function(name, config) {
  this.configs[name] = config;
  this.caches[name] = {};
};

BrisaCache.prototype.Store = function(name, key, item, stamp) {
  if (stamp == undefined) stamp = (new Date()).getTime();
  this.caches[name][key] = {
    stamp: stamp,
    item: item,
  };
};

BrisaCache.prototype.get = function(name, key, cache_args) {
  var needs_refresh = false;
  var from_store = this.caches[name][key];
  if (cache_args == true) { // force refresh
    needs_refresh = true;
  } else if (!from_store) { // no cache exists
    needs_refresh = true;
  //} else if (cache_args.age) { // check age
  //   if (from_store.stamp > cache_args.age) needs_refresh = true;
  } else if (cache_args) { // check stamp
    if (from_store.stamp <= cache_args) needs_refresh = true;
  } else { needs_refresh = true; }

  if (needs_refresh) {
    return this.configs[name]['lookup'](key).then(function(r) {
      this.Store(name, key, r, (new Date()).getTime());
      return r;
    }.bind(this));
  } else {
    return new Promise(function(res) { res(from_store.item) });
  }
};

export default BrisaCache
