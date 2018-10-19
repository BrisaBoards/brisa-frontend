// Brisa javascript client library, Version Brisa0.
// Auto-generated on 2018-10-18

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
    return $.ajax({
      type: 'POST', url: BrisaAPI._api_path + '/' + action,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(send_args),
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
  return BrisaAPI.SendRequest('Entry:update', args, null, false);
};

BrisaAPI.Entry.add_tags = function(id, tags) {
  var args = { id: id, tags: tags };
  return BrisaAPI.SendRequest('Entry:add_tags', args, null, false);
};

BrisaAPI.Entry.remove_tags = function(id, tags) {
  var args = { id: id, tags: tags };
  return BrisaAPI.SendRequest('Entry:remove_tags', args, null, false);
};

BrisaAPI.Entry.edit_class = function(id, class_name, cfg) {
  var args = { id: id, class_name: class_name, cfg: cfg };
  return BrisaAPI.SendRequest('Entry:edit_class', args, null, false);
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
  return BrisaAPI.SendRequest('Model:update', args, null, false);
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
  return BrisaAPI.SendRequest('UserSetting:update', args, null, false);
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

BrisaAPI.Group.add_share = function(id, email, access) {
  var args = { id: id, email: email, access: access };
  return BrisaAPI.SendRequest('Group:add_share', args, null, false);
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



BrisaAPI.Entry.prototype.id = function() { return this.data,id }

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

BrisaAPI.Entry.prototype.update = function() {
  var args = { id: this.data.id, data: this.data }
  return BrisaAPI.SendRequest('Entry:update', args, null, false, this);
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


BrisaAPI.User.prototype.id = function() { return this.data,id }

BrisaAPI.User.prototype.alias = function(new_val) {
  if (new_val !== undefined) this.data['alias'] = new_val;
  return this.data['alias'];
};

BrisaAPI.User.prototype.admin = function(new_val) {
  if (new_val !== undefined) this.data['admin'] = new_val;
  return this.data['admin'];
};


BrisaAPI.Model.prototype.id = function() { return this.data,id }

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


BrisaAPI.UserSetting.prototype.id = function() { return this.data,id }

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


BrisaAPI.Group.prototype.id = function() { return this.data,id }

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



