// Brisa javascript client library, Version Brisa0.
// Auto-generated on 2019-02-20

var BrisaAPI = {
  _include: {}
};

BrisaAPI.HandleResult = function(result, d_type, is_array, o_self) {
  if (is_array) {
    var results = [];
    for (var i in result.data) {
      results.push(d_type ? new d_type(result.data[i]) : result.data);
    }
    return results;
  } else if (o_self != undefined) {
    o_self.data = result.data;
    return o_self;
  } else {
    return (d_type != null ? new d_type(result.data) : result);
  }
};

BrisaAPI.Request = function(action, args) {
  send_args = {};
  for (var i in BrisaAPI._include) { send_args[i] = BrisaAPI._include[i] };
  for (var i in args) { send_args[i] = args[i] };
  if (BrisaAPI._api_path)
    return new Promise(function(resolve, reject) {
      fetch(
        BrisaAPI._api_path + '/' + action,
        { method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(send_args) }
        ).then(function(r) {
          var json_result = {};
          r.json().then(function(json) {
            if (r.ok) resolve(json); else reject({statusCode: r.statusCode, json: json});
          }).catch(function(err) {
            if (r.ok) resolve({}); else reject({statusCode: r.statusCode, json: {}});
          });
        }).catch(function(err) {
          reject({statusCode: 0, json: {}, error: err});
        });
    });
  else
    return BrisaAPI._brisa_idb.dispatch(action, send_args);
};

BrisaAPI.SendRequest = function(action, args, ret_type, is_array, o_self) {
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request(action, args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r, ret_type, is_array, o_self));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry = function(state) { this.data = state;};

BrisaAPI.Entry.find = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Entry:find', args, BrisaAPI.Entry, false);
};

BrisaAPI.Entry.updates = function(since) {
  var args = { since: since };
  return BrisaAPI.SendRequest('Entry:updates', args, null, false);
};

BrisaAPI.Entry.search = function(tags, classes, group_id) {
  var args = { tags: tags, classes: classes, group_id: group_id };
  return BrisaAPI.SendRequest('Entry:search', args, BrisaAPI.Entry, true);
};

BrisaAPI.Entry.create = function(data) {
  var args = { data: data };
  return BrisaAPI.SendRequest('Entry:create', args, BrisaAPI.Entry, false);
};

BrisaAPI.Entry.update = function(id, data) {
  var args = { id: id, data: data };
  return BrisaAPI.SendRequest('Entry:update', args, BrisaAPI.Entry, false);
};

BrisaAPI.Entry.assign = function(id, uid, assign, ctx, is_role) {
  var args = { id: id, uid: uid, assign: assign, ctx: ctx, is_role: is_role };
  return BrisaAPI.SendRequest('Entry:assign', args, null, false);
};

BrisaAPI.Entry.watch = function(id, watch) {
  var args = { id: id, watch: watch };
  return BrisaAPI.SendRequest('Entry:watch', args, null, false);
};

BrisaAPI.Entry.add_tags = function(id, tags) {
  var args = { id: id, tags: tags };
  return BrisaAPI.SendRequest('Entry:add_tags', args, BrisaAPI.Entry, false);
};

BrisaAPI.Entry.remove_tags = function(id, tags) {
  var args = { id: id, tags: tags };
  return BrisaAPI.SendRequest('Entry:remove_tags', args, BrisaAPI.Entry, false);
};

BrisaAPI.Entry.edit_class = function(id, class_name, cfg) {
  var args = { id: id, class_name: class_name, cfg: cfg };
  return BrisaAPI.SendRequest('Entry:edit_class', args, BrisaAPI.Entry, false);
};

BrisaAPI.Entry.destroy = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Entry:destroy', args, null, false);
};


BrisaAPI.User = function(state) { this.data = state;};

BrisaAPI.User.status = function(renew) {
  var args = { renew: renew };
  return BrisaAPI.SendRequest('User:status', args, null, false);
};

BrisaAPI.User.update_account = function(alias) {
  var args = { alias: alias };
  return BrisaAPI.SendRequest('User:update_account', args, null, false);
};

BrisaAPI.User.find = function(uid) {
  var args = { uid: uid };
  return BrisaAPI.SendRequest('User:find', args, BrisaAPI.User, false);
};

BrisaAPI.User.change_pass = function(password, new_password) {
  var args = { password: password, new_password: new_password };
  return BrisaAPI.SendRequest('User:change_pass', args, null, false);
};

BrisaAPI.User.login = function(email, password) {
  var args = { email: email, password: password };
  return BrisaAPI.SendRequest('User:login', args, BrisaAPI.User, false);
};

BrisaAPI.User.groups = function() {
  var args = {  };
  return BrisaAPI.SendRequest('User:groups', args, BrisaAPI.Group, true);
};

BrisaAPI.User.logout = function() {
  var args = {  };
  return BrisaAPI.SendRequest('User:logout', args, null, false);
};


BrisaAPI.Model = function(state) { this.data = state;};

BrisaAPI.Model.all = function(group_id) {
  var args = { group_id: group_id };
  return BrisaAPI.SendRequest('Model:all', args, BrisaAPI.Model, true);
};

BrisaAPI.Model.create = function(data) {
  var args = { data: data };
  return BrisaAPI.SendRequest('Model:create', args, BrisaAPI.Model, false);
};

BrisaAPI.Model.update = function(id, data) {
  var args = { id: id, data: data };
  return BrisaAPI.SendRequest('Model:update', args, BrisaAPI.Model, false);
};


BrisaAPI.UserSetting = function(state) { this.data = state;};

BrisaAPI.UserSetting.all = function() {
  var args = {  };
  return BrisaAPI.SendRequest('UserSetting:all', args, BrisaAPI.UserSetting, true);
};

BrisaAPI.UserSetting.create = function(name, setting) {
  var args = { name: name, setting: setting };
  return BrisaAPI.SendRequest('UserSetting:create', args, BrisaAPI.UserSetting, false);
};

BrisaAPI.UserSetting.update = function(id, data) {
  var args = { id: id, data: data };
  return BrisaAPI.SendRequest('UserSetting:update', args, BrisaAPI.UserSetting, false);
};

BrisaAPI.UserSetting.destroy = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('UserSetting:destroy', args, null, false);
};


BrisaAPI.Group = function(state) { this.data = state;};

BrisaAPI.Group.create = function(name) {
  var args = { name: name };
  return BrisaAPI.SendRequest('Group:create', args, BrisaAPI.Group, false);
};

BrisaAPI.Group.find = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Group:find', args, BrisaAPI.Group, false);
};

BrisaAPI.Group.add_share = function(id, email, access) {
  var args = { id: id, email: email, access: access };
  return BrisaAPI.SendRequest('Group:add_share', args, BrisaAPI.Group, false);
};

BrisaAPI.Group.remove_share = function(id, email) {
  var args = { id: id, email: email };
  return BrisaAPI.SendRequest('Group:remove_share', args, null, false);
};

BrisaAPI.Group.shares = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Group:shares', args, null, false);
};

BrisaAPI.Group.setting = function(id, name, value) {
  var args = { id: id, name: name, value: value };
  return BrisaAPI.SendRequest('Group:setting', args, null, false);
};


BrisaAPI.Role = function(state) { this.data = state;};

BrisaAPI.Role.create = function(name, password) {
  var args = { name: name, password: password };
  return BrisaAPI.SendRequest('Role:create', args, BrisaAPI.Role, false);
};

BrisaAPI.Role.all = function() {
  var args = {  };
  return BrisaAPI.SendRequest('Role:all', args, BrisaAPI.Role, true);
};

BrisaAPI.Role.destroy = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Role:destroy', args, null, false);
};

BrisaAPI.Role.token = function(id, password, exp) {
  var args = { id: id, password: password, exp: exp };
  return BrisaAPI.SendRequest('Role:token', args, null, false);
};


BrisaAPI.Comment = function(state) { this.data = state;};

BrisaAPI.Comment.all = function(entry_id) {
  var args = { entry_id: entry_id };
  return BrisaAPI.SendRequest('Comment:all', args, BrisaAPI.Comment, true);
};

BrisaAPI.Comment.find = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Comment:find', args, BrisaAPI.Comment, false);
};

BrisaAPI.Comment.create = function(data) {
  var args = { data: data };
  return BrisaAPI.SendRequest('Comment:create', args, BrisaAPI.Comment, false);
};

BrisaAPI.Comment.destroy = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Comment:destroy', args, BrisaAPI.Comment, false);
};

BrisaAPI.Comment.update = function(id, data) {
  var args = { id: id, data: data };
  return BrisaAPI.SendRequest('Comment:update', args, BrisaAPI.Comment, false);
};


BrisaAPI.Notification = function(state) { this.data = state;};

BrisaAPI.Notification.all = function() {
  var args = {  };
  return BrisaAPI.SendRequest('Notification:all', args, BrisaAPI.Notification, true);
};

BrisaAPI.Notification.find = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Notification:find', args, BrisaAPI.Notification, false);
};

BrisaAPI.Notification.mark_read = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Notification:mark_read', args, null, false);
};

BrisaAPI.Notification.destroy = function(id) {
  var args = { id: id };
  return BrisaAPI.SendRequest('Notification:destroy', args, BrisaAPI.Notification, false);
};



BrisaAPI.Entry.prototype.id = function() { return this.data.id }

BrisaAPI.Entry.prototype.title = function(new_val) {
  if (new_val !== undefined) this.data['title'] = new_val;
  return this.data['title'];
};

BrisaAPI.Entry.prototype.group_id = function(new_val) {
  if (new_val !== undefined) this.data['group_id'] = new_val;
  return this.data['group_id'];
};

BrisaAPI.Entry.prototype.owner_uid = function(new_val) {
  if (new_val !== undefined) this.data['owner_uid'] = new_val;
  return this.data['owner_uid'];
};

BrisaAPI.Entry.prototype.creator_uid = function(new_val) {
  if (new_val !== undefined) this.data['creator_uid'] = new_val;
  return this.data['creator_uid'];
};

BrisaAPI.Entry.prototype.description = function(new_val) {
  if (new_val !== undefined) this.data['description'] = new_val;
  return this.data['description'];
};

BrisaAPI.Entry.prototype.metadata = function(new_val) {
  if (new_val !== undefined) this.data['metadata'] = new_val;
  return this.data['metadata'];
};

BrisaAPI.Entry.prototype.tags = function(new_val) {
  if (new_val !== undefined) this.data['tags'] = new_val;
  return this.data['tags'];
};

BrisaAPI.Entry.prototype.classes = function(new_val) {
  if (new_val !== undefined) this.data['classes'] = new_val;
  return this.data['classes'];
};

BrisaAPI.Entry.prototype.created_at = function(new_val) {
  if (new_val !== undefined) this.data['created_at'] = new_val;
  return this.data['created_at'];
};

BrisaAPI.Entry.prototype.updated_at = function(new_val) {
  if (new_val !== undefined) this.data['updated_at'] = new_val;
  return this.data['updated_at'];
};

BrisaAPI.Entry.prototype.comment_count = function(new_val) {
  if (new_val !== undefined) this.data['comment_count'] = new_val;
  return this.data['comment_count'];
};

BrisaAPI.Entry.prototype.find = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Entry:find', args, null, false, this);
};

BrisaAPI.Entry.prototype.update = function() {
  var args = { id: this.data.id, data: this.data }
  return BrisaAPI.SendRequest('Entry:update', args, null, false, this);
};

BrisaAPI.Entry.prototype.assign = function(uid, assign, ctx, is_role) {
  var args = { id: this.data.id, uid: uid, assign: assign, ctx: ctx, is_role: is_role }
  return BrisaAPI.SendRequest('Entry:assign', args, null, false);
};

BrisaAPI.Entry.prototype.watch = function(watch) {
  var args = { id: this.data.id, watch: watch }
  return BrisaAPI.SendRequest('Entry:watch', args, null, false);
};

BrisaAPI.Entry.prototype.add_tags = function(tags) {
  var args = { id: this.data.id, tags: tags }
  return BrisaAPI.SendRequest('Entry:add_tags', args, null, false, this);
};

BrisaAPI.Entry.prototype.remove_tags = function(tags) {
  var args = { id: this.data.id, tags: tags }
  return BrisaAPI.SendRequest('Entry:remove_tags', args, null, false, this);
};

BrisaAPI.Entry.prototype.edit_class = function(class_name, cfg) {
  var args = { id: this.data.id, class_name: class_name, cfg: cfg }
  return BrisaAPI.SendRequest('Entry:edit_class', args, null, false, this);
};

BrisaAPI.Entry.prototype.destroy = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Entry:destroy', args, null, false);
};


BrisaAPI.User.prototype.id = function() { return this.data.id }

BrisaAPI.User.prototype.alias = function(new_val) {
  if (new_val !== undefined) this.data['alias'] = new_val;
  return this.data['alias'];
};

BrisaAPI.User.prototype.admin = function(new_val) {
  if (new_val !== undefined) this.data['admin'] = new_val;
  return this.data['admin'];
};


BrisaAPI.Model.prototype.id = function() { return this.data.id }

BrisaAPI.Model.prototype.owner_uid = function(new_val) {
  if (new_val !== undefined) this.data['owner_uid'] = new_val;
  return this.data['owner_uid'];
};

BrisaAPI.Model.prototype.group_id = function(new_val) {
  if (new_val !== undefined) this.data['group_id'] = new_val;
  return this.data['group_id'];
};

BrisaAPI.Model.prototype.unique_id = function(new_val) {
  if (new_val !== undefined) this.data['unique_id'] = new_val;
  return this.data['unique_id'];
};

BrisaAPI.Model.prototype.title = function(new_val) {
  if (new_val !== undefined) this.data['title'] = new_val;
  return this.data['title'];
};

BrisaAPI.Model.prototype.config = function(new_val) {
  if (new_val !== undefined) this.data['config'] = new_val;
  return this.data['config'];
};

BrisaAPI.Model.prototype.update = function() {
  var args = { id: this.data.id, data: this.data }
  return BrisaAPI.SendRequest('Model:update', args, null, false, this);
};


BrisaAPI.UserSetting.prototype.id = function() { return this.data.id }

BrisaAPI.UserSetting.prototype.user_id = function(new_val) {
  if (new_val !== undefined) this.data['user_id'] = new_val;
  return this.data['user_id'];
};

BrisaAPI.UserSetting.prototype.name = function(new_val) {
  if (new_val !== undefined) this.data['name'] = new_val;
  return this.data['name'];
};

BrisaAPI.UserSetting.prototype.setting = function(new_val) {
  if (new_val !== undefined) this.data['setting'] = new_val;
  return this.data['setting'];
};

BrisaAPI.UserSetting.prototype.update = function() {
  var args = { id: this.data.id, data: this.data }
  return BrisaAPI.SendRequest('UserSetting:update', args, null, false, this);
};

BrisaAPI.UserSetting.prototype.destroy = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('UserSetting:destroy', args, null, false);
};


BrisaAPI.Group.prototype.id = function() { return this.data.id }

BrisaAPI.Group.prototype.name = function(new_val) {
  if (new_val !== undefined) this.data['name'] = new_val;
  return this.data['name'];
};

BrisaAPI.Group.prototype.id = function(new_val) {
  if (new_val !== undefined) this.data['id'] = new_val;
  return this.data['id'];
};

BrisaAPI.Group.prototype.settings = function(new_val) {
  if (new_val !== undefined) this.data['settings'] = new_val;
  return this.data['settings'];
};

BrisaAPI.Group.prototype.owner_uid = function(new_val) {
  if (new_val !== undefined) this.data['owner_uid'] = new_val;
  return this.data['owner_uid'];
};

BrisaAPI.Group.prototype.access = function(new_val) {
  if (new_val !== undefined) this.data['access'] = new_val;
  return this.data['access'];
};

BrisaAPI.Group.prototype.find = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Group:find', args, null, false, this);
};

BrisaAPI.Group.prototype.add_share = function(email, access) {
  var args = { id: this.data.id, email: email, access: access }
  return BrisaAPI.SendRequest('Group:add_share', args, null, false, this);
};

BrisaAPI.Group.prototype.remove_share = function(email) {
  var args = { id: this.data.id, email: email }
  return BrisaAPI.SendRequest('Group:remove_share', args, null, false);
};

BrisaAPI.Group.prototype.shares = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Group:shares', args, null, false);
};

BrisaAPI.Group.prototype.setting = function(name, value) {
  var args = { id: this.data.id, name: name, value: value }
  return BrisaAPI.SendRequest('Group:setting', args, null, false);
};


BrisaAPI.Role.prototype.id = function() { return this.data.id }

BrisaAPI.Role.prototype.name = function(new_val) {
  if (new_val !== undefined) this.data['name'] = new_val;
  return this.data['name'];
};

BrisaAPI.Role.prototype.destroy = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Role:destroy', args, null, false);
};

BrisaAPI.Role.prototype.token = function(password, exp) {
  var args = { id: this.data.id, password: password, exp: exp }
  return BrisaAPI.SendRequest('Role:token', args, null, false);
};


BrisaAPI.Comment.prototype.id = function() { return this.data.id }

BrisaAPI.Comment.prototype.user_uid = function(new_val) {
  if (new_val !== undefined) this.data['user_uid'] = new_val;
  return this.data['user_uid'];
};

BrisaAPI.Comment.prototype.comment = function(new_val) {
  if (new_val !== undefined) this.data['comment'] = new_val;
  return this.data['comment'];
};

BrisaAPI.Comment.prototype.metadata = function(new_val) {
  if (new_val !== undefined) this.data['metadata'] = new_val;
  return this.data['metadata'];
};

BrisaAPI.Comment.prototype.reply_to = function(new_val) {
  if (new_val !== undefined) this.data['reply_to'] = new_val;
  return this.data['reply_to'];
};

BrisaAPI.Comment.prototype.destroy = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Comment:destroy', args, BrisaAPI.Comment, false);
};

BrisaAPI.Comment.prototype.update = function() {
  var args = { id: this.data.id, data: this.data }
  return BrisaAPI.SendRequest('Comment:update', args, null, false, this);
};


BrisaAPI.Notification.prototype.id = function() { return this.data.id }

BrisaAPI.Notification.prototype.user_id = function(new_val) {
  if (new_val !== undefined) this.data['user_id'] = new_val;
  return this.data['user_id'];
};

BrisaAPI.Notification.prototype.parent = function(new_val) {
  if (new_val !== undefined) this.data['parent'] = new_val;
  return this.data['parent'];
};

BrisaAPI.Notification.prototype.ctx = function(new_val) {
  if (new_val !== undefined) this.data['ctx'] = new_val;
  return this.data['ctx'];
};

BrisaAPI.Notification.prototype.messages = function(new_val) {
  if (new_val !== undefined) this.data['messages'] = new_val;
  return this.data['messages'];
};

BrisaAPI.Notification.prototype.read = function(new_val) {
  if (new_val !== undefined) this.data['read'] = new_val;
  return this.data['read'];
};

BrisaAPI.Notification.prototype.find = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Notification:find', args, null, false, this);
};

BrisaAPI.Notification.prototype.mark_read = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Notification:mark_read', args, null, false);
};

BrisaAPI.Notification.prototype.destroy = function() {
  var args = { id: this.data.id }
  return BrisaAPI.SendRequest('Notification:destroy', args, BrisaAPI.Notification, false);
};



