var BrisaIDB = function(db) {
  this.db_name = db;
  this.dbP = idb.open(db, 2, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
        Brisa.brisa_first_run = true;
        upgradeDb.createObjectStore('entries', {keyPath: 'id', autoIncrement: true});
        upgradeDb.createObjectStore('models', {keyPath: 'id', autoIncrement: true});
        upgradeDb.createObjectStore('user_settings', {keyPath: 'id', autoIncrement: true});
      case 1:
        upgradeDb.createObjectStore('groups', {keyPath: 'id', autoIncrement: true});
    }
  }.bind(this));
  return this;
};

BrisaIDB.actions = {};

BrisaIDB.action = function(action, store, method, cb) {
  BrisaIDB.actions[action] = {
    action: action, store: store, method: method, cb: cb,
  };
};

BrisaIDB.handlers = {
  destroy: function(action, args, resolve, reject) {
    delete args['action'];
    this.dbP.then(function(db) {
      var tx = db.transaction(action.store, 'readwrite');
      var store = tx.objectStore(action.store);
      var key = action.cb(args);
      store.delete(key).then(function(r) {
        resolve({data: r});
      }).catch(function(e) { console.log("Destroy error", e); reject(e) });
      return tx.complete;
    });
  },
  create: function(action, args, resolve, reject) {
    delete args['action'];
    this.dbP.then(function(db) {
      var tx = db.transaction(action.store, 'readwrite');
      var store = tx.objectStore(action.store);
      var data = action.cb(args);
      store.add(data).then(function(r) {
        console.log("Added", r, data);
        data.id = r;
        resolve({data: data});
      }).catch(function(e) { console.log("Err", e); resolve({}) });
      return tx.complete;
    });
    //resolve({data: {setting: {}, metadata:{theme: ''}}});
  },
  iter: function(action, args, resolve, reject) {
    console.log("Iterating over ", action.store, action.action, this.dbP);
    var results = [];
    this.dbP.then(function(db) {
      var tx = db.transaction(action.store, 'readonly');
      var store = tx.objectStore(action.store);
      return store.openCursor();
    }).then(function iterAddItem(cursor) {
      if (!cursor) return;
      var new_ent = {id: cursor.key};
      for (var f in cursor.value) new_ent[f] = cursor.value[f];
      if (action.cb(new_ent, args))
        results.push(new_ent);
      return cursor.continue().then(iterAddItem);
    }).then(function() {
      console.log("Results", results);
      resolve({data: results});
    });
  },
  update: function(action, args, resolve, reject) {
    delete args['action'];
    this.dbP.then(function(db) {
      var tx = db.transaction(action.store, 'readwrite');
      var store = tx.objectStore(action.store);
      var data = action.cb(args);
      store.put(data).then(function(r) {
        console.log("Updated", r, data);
        resolve({data: data});
      }).catch(function(e) { console.log("Err", e); resolve({}) });
      return tx.complete;
    });
  },
  custom: function(action, args, resolve, reject) {
    return action.cb.bind(this)(action, args, resolve, reject);
  },
};

BrisaIDB.prototype.dispatch = function(action, args) {
  var act = BrisaIDB.actions[action];
  console.log(action, args, act);
  if (!act)
    return new Promise(function(resolve, reject) {
      console.log("IDB Action Not Found", action, args);
      reject({error: 'Action ' + action + ' not found.'});
    });

  var resolve, reject;
  var promise = new Promise(function(res, rej) { resolve = res; reject = rej });
  BrisaIDB.handlers[act.method].bind(this)(act, args, resolve, reject);
  return promise;
};

BrisaIDB.action('User:status', '', 'custom', function(act, args, resolve, reject) {
  resolve({data: {logged_in: true, user_id: 1, alias: 'Preview', email: 'Preview'}});
});

BrisaIDB.action('User:groups', 'groups', 'iter', function(obj) { return true });

BrisaIDB.action('Group:create', 'groups', 'create', function(obj) {
  return {name: obj.name, shares: [], settings: {}};
});

BrisaIDB.action('Model:all', 'models', 'iter', function(obj, args) {
  if (obj.group_id == args.group_id) return true;
  return false;
});

BrisaIDB.action('Model:create', 'models', 'create', function(obj) {
  if (obj.data.config == undefined) obj.data.config = {};
  obj.data.user_id = 1;
  if (!obj.data.group_id) obj.data.group_id = null;
  return obj.data;
});
BrisaIDB.action('Model:update', 'models', 'update', function(args) {
  return args.data;
});

BrisaIDB.action('UserSetting:all', 'user_settings', 'iter', function(obj) { return true });
BrisaIDB.action('UserSetting:update', 'user_settings', 'update', function(obj) { return obj.data});
BrisaIDB.action('UserSetting:create', 'user_settings', 'create', function(obj) { return obj });

BrisaIDB.action('Entry:add_tags', 'entries', 'custom', function(act, args, resolve, reject) {
  var tx, store;
  this.dbP.then(function(db) {
    tx = db.transaction(act.store, 'readwrite');
    store = tx.objectStore(act.store);
    return store.get(args.id);
  }).then(function(r) {
    if (r.tags == undefined) r.tags = [];
    if (typeof args.tags == 'string')
      r.tags.push(args.tags);
    else
      for (var tag in args.tags) { r.tags.push(args.tags[tag]) }

    store.put(r).then(function() {resolve({data:r})} );
  });
});

BrisaIDB.action('Entry:remove_tags', 'entries', 'custom', function(act, args, resolve, reject) {
  var tx, store;
  this.dbP.then(function(db) {
    tx = db.transaction(act.store, 'readwrite');
    store = tx.objectStore(act.store);
    return store.get(args.id);
  }).then(function(r) {
    if (r.tags == undefined) r.tags = [];
    if (typeof args.tags == 'string')
      args.tags = [args.tags];

    for (var tag in args.tags) {
      var idx = r.tags.indexOf(args.tags[tag]);
      if (idx != -1) r.tags.splice(idx, 1);
    }

    store.put(r).then(function() {resolve({data:r})} );
  });
});

BrisaIDB.action('Entry:edit_class', 'entries', 'custom', function(act, args, resolve, reject) {
  var tx, store;
  this.dbP.then(function(db) {
    tx = db.transaction(act.store, 'readwrite');
    store = tx.objectStore(act.store);
    return store.get(args.id);
  }).then(function(r) {
    if (r.classes == undefined) r.classes = [];
    if (r.classes.indexOf(args.class_name) == -1) r.classes.push(args.class_name);
    r.metadata[args.class_name] = (args.cfg == undefined) ? {} : args.cfg;
    store.put(r).then(function() {resolve({data:r})} );
  });
});

BrisaIDB.action('Entry:create', 'entries', 'create', function(obj) {
  if (obj.data.metadata == undefined) obj.data.metadata = {};
  if (!obj.data.group_id) obj.data.group_id = null;
  obj.data.owner_id = 1;
  obj.data.creator_id = 1;
  obj.data.created_at = new Date();
  return obj.data;
});
BrisaIDB.action('Entry:update', 'entries', 'update', function(args) {
  return args.data;
});
BrisaIDB.action('Entry:destroy', 'entries', 'destroy', function(args) {
  return args.id;
});
BrisaIDB.action('Entry:search', 'entries', 'iter', function(obj, args) {
  var tags = args.tags, classes = args.classes;
  if (obj.group_id != args.group_id) return false;
  if (tags == null) {
  } else if (tags.length == 0) {
    if (obj.tags.length != 0) return false;
  } else {
    for (var i in tags) {
      if ((obj.tags || []).indexOf(tags[i]) == -1) return false;
    }
  }

  if (classes == null) {
  } else if (classes.length == 0) {
    if (obj.classes.length != 0) return false;
  } else {
    for (var i in classes) {
      if ((obj.classes || []).indexOf(classes[i]) == -1) return false;
    }
  }

  return true;
});
