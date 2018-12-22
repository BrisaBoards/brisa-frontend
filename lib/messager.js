// BrisaMessager allows views to register and receive external updates
// from websockets and periodic checks.

var BrisaMessager = function(cache, views) {
  this.active = {};
  this.views = views;
  this.cache = cache;

  this.Register = function(view, add, update, destroy) {
    var reg = {
      view: view, add: add, update: update, destroy: destroy
    };
    this.active[view.unique_id] = reg;
    if (view.updates == undefined) view.updates = [];
    for (var i in view.updates) {
      this.SendUpdate(view.unique_id, view.updates[i]);
    }
  };

  this.Unregister = function(view) {
    view.updates = [];
    delete this.active[view.unique_id];
  };

  this.SendUpdate = function(active, msg) {
    var view = active.view;
    var cb = (msg.a == 'update' ? 'update' : (msg.a == 'create' ? 'add' : 'destroy'));
    var receiver = false;
    var idx = this.EntryIndex(view.entries, msg.id);

    if (view.parent && view.parent.data.id == msg.id) {
      console.log("Parent updated", view, msg);
      this.cache.get('Entry', msg.id, msg.stamp).then(function(r) {
        view.parent = r;
        if (active[cb]) active[cb](r, cb);
      }.bind(this));
    } else if (idx != -1 || this.MatchCtx(view.ctx, msg.tags, msg.classes)) {
      receiver = true;
      if (cb == 'destroy') {
        if (active[cb]) active[cb]({id: msg.id, index: idx}, cb);
        return;
      }
      this.cache.get('Entry', msg.id, msg.stamp).then(function(r) {
        if (idx != -1) {
          view.entries[idx].data = r.data;
        }
        if (active[cb]) active[cb](r, cb, msg);
      }.bind(this));
    }
  };

  this.onMessage = function(message) {
    console.log("Received", message);
    for (var i in this.views) {
      var v = this.views[i];
      // Don't send updates to views outside of group.
      if (v.group_id !== undefined && v.group_id != message.gid)
        continue;

      if (this.active[v.unique_id]) {
        this.SendUpdate(this.active[v.unique_id], message);
      } else {
        if (v.updates == undefined) v.updates = [];
        v.updates.push(message);
      }
    }
  };

  this.MatchCtx = function(ctx, tags, classes) {
    for (var i in ctx.tags) {
      if (tags.indexOf(ctx.tags[i]) == -1) return false;
    }
    for (var i in ctx.classes) {
      if (classes.indexOf(ctx.classes[i]) == -1) return false;
    }
    return true;
  };

  this.EntryIndex = function(list, entry_id) {
    for (var i in list) {
      if (list[i].data.id == entry_id) return i;
    }
    return -1;
  };
};

export default BrisaMessager;
