var BrisaAPI = {
  _include: {},
};

BrisaAPI.HandleResult = function(result, d_type, is_array, o_self) {
  var obj = BrisaAPI[d_type];
  if (is_array) {
    var results = [];
    for (var i in result.data) {
      results.push(new obj(result.data[i]));
    }
    return results;
  } else if (o_self != undefined) {
    o_self.data = result.data;
    return o_self;
  } else {
    return (d_type != null ? new obj(result.data) : result);
  }
};

BrisaAPI.Request = function(action, args) {
  send_args = {action: action};
  for (var i in BrisaAPI._include) { send_args[i] = BrisaAPI._include[i] };
  for (var i in args) { send_args[i] = args[i] };
  if (BrisaAPI._api_path)
    return $.ajax({
      type: 'POST', url: BrisaAPI._api_path,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(send_args),
    });
  else
    return BrisaAPI._brisa_idb.dispatch(action, send_args);
};

BrisaAPI.Entry = function(state) { this.data = state;};

BrisaAPI.Entry.prototype.title = function(val) {
  if (val !== undefined) this.data['title'] = val;
  return this.data['title'];
};

BrisaAPI.Entry.prototype.description = function(val) {
  if (val !== undefined) this.data['description'] = val;
  return this.data['description'];
};

BrisaAPI.Entry.prototype.metadata = function(val) {
  if (val !== undefined) this.data['metadata'] = val;
  return this.data['metadata'];
};

BrisaAPI.Entry.prototype.tags = function(val) {
  if (val !== undefined) this.data['tags'] = val;
  return this.data['tags'];
};

BrisaAPI.Entry.prototype.classes = function(val) {
  if (val !== undefined) this.data['classes'] = val;
  return this.data['classes'];
};

BrisaAPI.Entry.prototype.created_at = function(val) {
  if (val !== undefined) this.data['created_at'] = val;
  return this.data['created_at'];
};

BrisaAPI.Entry.prototype.updated_at = function(val) {
  if (val !== undefined) this.data['updated_at'] = val;
  return this.data['updated_at'];
};

BrisaAPI.Entry.create = function(data) {
  var args = {
    data: data,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.create", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Entry",
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.find = function(id) {
  var args = {
    id: id,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.find", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Entry",
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.search = function(search_string, tags, classes) {
  var args = {
    search_string: search_string,
    tags: tags,
    classes: classes,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.search", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Entry",
          true));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.update = function(id, data) {
  var args = {
    id: id,
    data: data,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.update", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.prototype.update = function() {
  var args = {
    id: this.data.id,
    data: this.data,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.update", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false, this));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};
BrisaAPI.Entry.add_tags = function(id, tags) {
  var args = {
    id: id,
    tags: tags,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.add_tags", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.prototype.add_tags = function(tags) {
  var args = {
    id: this.data.id,
    tags: tags,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.add_tags", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false, this));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};
BrisaAPI.Entry.remove_tags = function(id, tags) {
  var args = {
    id: id,
    tags: tags,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.remove_tags", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.prototype.remove_tags = function(tags) {
  var args = {
    id: this.data.id,
    tags: tags,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.remove_tags", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false, this));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};
BrisaAPI.Entry.destroy = function(id) {
  var args = {
    id: id,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.destroy", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.prototype.destroy = function() {
  var args = {
    id: this.data.id,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.destroy", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false, null));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};
BrisaAPI.Entry.edit_class = function(id, class_name, cfg) {
  var args = {
    id: id,
    class_name: class_name,
    cfg: cfg,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.edit_class", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Entry.prototype.edit_class = function(class_name, cfg) {
  var args = {
    id: this.data.id,
    class_name: class_name,
    cfg: cfg,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Entry.edit_class", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false, this));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};

BrisaAPI.Model = function(state) { this.data = state;};

BrisaAPI.Model.prototype.unique_id = function(val) {
  if (val !== undefined) this.data['unique_id'] = val;
  return this.data['unique_id'];
};

BrisaAPI.Model.prototype.title = function(val) {
  if (val !== undefined) this.data['title'] = val;
  return this.data['title'];
};

BrisaAPI.Model.prototype.config = function(val) {
  if (val !== undefined) this.data['config'] = val;
  return this.data['config'];
};

BrisaAPI.Model.find = function(id) {
  var args = {
    id: id,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Model.find", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Model",
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Model.all = function() {
  var args = {
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Model.all", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Model",
          true));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Model.create = function(data) {
  var args = {
    data: data,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Model.create", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Model",
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Model.update = function(id, data) {
  var args = {
    id: id,
    data: data,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Model.update", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Model",
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.Model.prototype.update = function() {
  var args = {
    id: this.data.id,
    data: this.data,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("Model.update", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "Model",
          false, this));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};

BrisaAPI.UserSetting = function(state) { this.data = state;};

BrisaAPI.UserSetting.prototype.user_id = function(val) {
  if (val !== undefined) this.data['user_id'] = val;
  return this.data['user_id'];
};

BrisaAPI.UserSetting.prototype.name = function(val) {
  if (val !== undefined) this.data['name'] = val;
  return this.data['name'];
};

BrisaAPI.UserSetting.prototype.setting = function(val) {
  if (val !== undefined) this.data['setting'] = val;
  return this.data['setting'];
};

BrisaAPI.UserSetting.all = function() {
  var args = {
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("UserSetting.all", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "UserSetting",
          true));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.UserSetting.create = function(name, setting) {
  var args = {
    name: name,
    setting: setting,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("UserSetting.create", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "UserSetting",
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.UserSetting.update = function(id, name, data) {
  var args = {
    id: id,
    name: name,
    data: data,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("UserSetting.update", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "UserSetting",
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.UserSetting.prototype.update = function(name) {
  var args = {
    id: this.data.id,
    name: name,
    data: this.data,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("UserSetting.update", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          "UserSetting",
          false, this));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};
BrisaAPI.UserSetting.destroy = function(id) {
  var args = {
    id: id,
  };
  
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("UserSetting.destroy", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false));
    }).catch(function(r) {
      reject(r);
    });
  });
};

BrisaAPI.UserSetting.prototype.destroy = function() {
  var args = {
    id: this.data.id,
  };
  return new Promise(function(resolve, reject) {
    BrisaAPI.Request("UserSetting.destroy", args).then(function(r) {
      resolve(BrisaAPI.HandleResult(r,
          null,
          false, this));
    }.bind(this)).catch(function(r) {
      reject(r);
    }.bind(this));
  }.bind(this));
};


