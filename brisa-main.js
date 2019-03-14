import Vue from 'vue';
import brisa_main_component from './components/main.vue';
import BrisaMessager from './lib/messager.js';
import BrisaCache from './lib/cache.js';

export default function() {
  var Brisa = new function() { return {}; };
  Brisa.brisa_first_run = false;
  Brisa.views = [];
  Brisa.group_views = {};
  // Real-time handlers
  Brisa.ActionCable = require('actioncable');
  Brisa.EventBus = new Vue();
  Brisa.notify = {
    update: function() {
      var new_cnt = 0;
      for (var msg of Brisa.notify.messages) {
        if (!msg.data.is_read) new_cnt++;
      }
      Brisa.notify.unread_count = new_cnt;
    },
    unread_count: 0,
    messages: [],
  };
  Brisa.cable = null;
  Brisa.cache = new BrisaCache();
  Brisa.cache.Register('Entry', {
    key: function(entry_id) { return entry_id },
    lookup: function(entry_id) { return BrisaAPI.Entry.find(entry_id) },
  });
  Brisa.cache.Register('Comments', {
    key: function(entry_id) { return entry_id },
    lookup: function(entry_id) { return BrisaAPI.Comment.all(entry_id) },
  });
  Brisa.cache.Register('User', {
    key: function(uid) { return uid },
    lookup: function(uid) { return BrisaAPI.User.find(uid) },
  });
  Brisa.cache.Register('Comment', {
    key: function(comment_id) { return comment_id },
    lookup: function(cmt) { return BrisaAPI.Comment.find(cmt) },
  });
  Brisa.messager = new BrisaMessager(Brisa.cache, Brisa.views);

  if (process.env.BACKEND) {
    console.log("Setting backend path", process.env.BACKEND);
    BrisaAPI._api_path = process.env.BACKEND;
  } else {
    console.log("Initialize IDB backend");
    BrisaAPI._brisa_idb = new BrisaIDB('organizer-demo');
  }
  Brisa.results = [];
  Brisa.login_error = null;
  Brisa.user = {
    logged_in: null,
    uid: 1,
    name: "",
    real_id: 1,
    shares: [],
  };
  Brisa.toggleFullScreen = function() {
    if (document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    } else {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }
  Brisa.logout = function() {
    if (Brisa.cable) Brisa.cable.disconnect();
    Brisa.views = [];
    Brisa.group_views = {};
    localStorage.removeItem('brisa-token');
    Brisa.user.logged_in = false;
  };
  Brisa.wsPing = function() {
    if (Brisa.cable_mon_ping) Brisa.cable_mon_ping();
    Brisa.last_ws_ping = new Date();
  };
  Brisa.wsOpen = function() {
    var last_ping = Brisa.last_ws_ping;
    if (Brisa.cable_mon_open) Brisa.cable_mon_open();
    if (last_ping == undefined) {
      return
    }
    var since = (last_ping.getTime() / 1000).toFixed();
    BrisaAPI.Entry.updates(since).then(function(r) {
      for (var i of r.data) {
        Brisa.onMessage(i)
      }
    });
  };
  Brisa.onMessage = function(data) {
    data.stamp = (new Date()).getTime();
    if (data.m == 'sid') {
      BrisaAPI._include.sid = data.sid;
      return;
    } else if (data.m == 'ent') {
      Brisa.messager.onMessage(data);
    } else if (data.m == 'cmt') {
      Brisa.messager.onMessage(data);
    } else if (data.m == 'notify') {
      if (data.a == 'new') {
        BrisaAPI.Notification.find(data.id).then(function(r) {
          Brisa.notify.messages.unshift(r);
          Brisa.notify.update();
        });
      } else if (data.a == 'up') {
        for (var midx in Brisa.notify.messages) {
          var msg = Brisa.notify.messages[midx];
          if (msg.data.id == data.id) {
            Brisa.notify.messages.unshift(Brisa.notify.messages.splice(midx, 1)[0]);
            msg.find();
          }
        }
        Brisa.notify.update();
      } else if (data.a == 'destroy') {
        for (var i in Brisa.notify.messages) {
          var msg = Brisa.notify.messages[i];
          if (msg.data.id == data.id) { Brisa.notify.messages.splice(i,1); break; }
        }
        Brisa.notify.update();
      }
    }
  };
  Brisa.socketURL = function() {
    var full_path = BrisaAPI._api_path;
    if (full_path.startsWith('/')) {
      full_path = document.documentURI + full_path.replace(/^\//, '');
    }
    full_path = full_path + '/updates?auth_token=' + BrisaAPI._include.auth_token;
    return full_path.replace(/^http/, 'ws');
  };
  Brisa.startSocket = function() {
    if (!BrisaAPI._api_path) return;
    Brisa.last_ws_ping = undefined;
    if (Brisa.cable) Brisa.cable.disconnect();
    Brisa.cable = Brisa.ActionCable.createConsumer(Brisa.socketURL());
    var mon = Brisa.cable.connection.monitor;
    Brisa.cable_mon_ping = mon.recordPing.bind(mon);
    Brisa.cable_mon_open = mon.recordConnect.bind(mon);
    mon.recordPing = Brisa.wsPing ;
    mon.recordConnect = Brisa.wsOpen;
    Brisa.cable.subscriptions.create({channel: 'UserChannel'}, {received: Brisa.onMessage });
  };

  Brisa.Login = function(user, auth_token) {
    if (auth_token) {
      localStorage.setItem('brisa-token', auth_token);
      BrisaAPI._include.auth_token = auth_token;
    }
    Brisa.startSocket();
    Brisa.LoadModels(null);
    BrisaAPI.Notification.all().then(function(r) {
      Brisa.notify.messages = r;
      Brisa.notify.update();
    });
    BrisaAPI.User.groups().then(function(r) {
      Vue.set(Brisa, 'groups', [{data:{id: null, name: 'Personal'}}].concat(r));
      for (let group of Brisa.groups) {
        if (group.data.id != null) Brisa.LoadModels(group.data.id);
      }
    }).catch(function(r) {
      Vue.set(Brisa, 'groups', [{data:{id: null, name: 'Personal'}}]);
    });
    BrisaAPI.UserSetting.all().then(function(r) {
      for (var i in r) {
        var s = r[i];
        Brisa.settings[s.name()] = s;
      }
      Brisa.Theme().then(function(t) {
        Vue.set(Brisa, 'theme', t);
      }.bind(this));
      Brisa.user = user;
    }.bind(this));
    if (Brisa.views.length == 0)
      Brisa.AddView('Dashboard', 'brisa-dashboard', {tags: [], classes: []}, null, []);
  };

  Brisa.CreateEntry = function(entry) {
    return BrisaAPI.Entry.create(entry);
  };
  Brisa.models = [];
  Brisa.settings = {size: 'lg', main_top: 48, header_height: 48, height: window.innerHeight};
  Brisa.group_settings = {};
  Brisa.current_view = null;
  Brisa.CurrentViewIdx = function() {
    for (var i in Brisa.views) {
      if (Brisa.views[i] == Brisa.current_view) return i;
    }
  };
  Brisa.CloseView = function(idx) {
    if (Brisa.views[idx]) {
      var view_idx = Brisa.CurrentViewIdx();
      var rem = Brisa.views.splice(idx,1);
      if (Brisa.current_view == rem[0]) Brisa.current_view = Brisa.views[view_idx-1];
    } else { console.log("No view", idx); }
  };
  Brisa.AddView = function(title, component, ctx, parent, entries, group_id) {
    var group_id = parent ? parent.data.group_id : group_id;
    if (group_id == undefined) group_id = null;
    var group = Brisa.Group(group_id);
    var view = {
      title: title,
      id: (parent || {data: {id: 'dash' + group_id}}).data.id + '_' + component,
      unique_id: Brisa.unique_id(4),
      component: component,
      ctx: ctx,
      group_id: group_id,
      group_name: group ? group.data.name : 'Personal',
      parent: parent,
      entries: entries,
    };
    this.views.push(view);
    if (this.group_views[group_id] === undefined) this.group_views[group_id] = [];
    this.group_views[group_id].push(view);
    Brisa.LoadModels(group_id).then(function(r) {
      Brisa.current_view = view;
    }).catch(function(r) { Brisa.current_view = view; });
    return view;
  };
  Brisa.OpenCard = function(entry) {
    var view = this.AddView(entry.title(), 'brisa-entry-view', {tags: [], classes: []}, entry, []);
    view.ctx_str = entry.data.id;
  };
  Brisa.OpenView = function(parent, uitype) {
    var md = parent.data.metadata;
    var group_id = parent.data.group_id;
    var cls_md = md[uitype.cls];
    BrisaAPI.Entry.search(cls_md.tags, cls_md.classes, group_id).then(function(r) {
      var view = this.AddView(parent.title(), uitype.cmp,
          {tags: cls_md.tags || [], classes: cls_md.classes || []},
          parent, r);
      view.ctx_str = parent.data.id + ':' + uitype.cls;
    }.bind(this));    
  };
  Brisa.OpenCtx = function(entry, board) {
    var uitype = null;
    var ctx = board ? entry.data.id + ':' + board : entry.data.id;
    for (var uit of Brisa.ui_types) { if (uit.cls == board) uitype = uit; }
      for (var view of (Brisa.group_views[entry.group_id()] || [])) {
        if (view.ctx_str == ctx) {
          Brisa.current_view = view;
          return;
        }
      }
      if (uitype) {
        Brisa.OpenView(entry, uitype);
      } else {
        Brisa.OpenCard(entry);
      }
  };

  Brisa.ui_classes = {
    'brisa-kanban': {cmp: 'brisa-kanban', name: 'Kanban', cls: '_kanban', method: 'OpenKanban', icon: 'fa-columns'},
    'brisa-whiteboard': {cmp: 'brisa-whiteboard', name: 'Whiteboard', cls: '_whiteboard', method: 'OpenWhiteboard', icon: 'fa-chalkboard'},
    'brisa-sheet': {cmp: 'brisa-sheet', name: 'Sheet', cls: '_sheet', method: 'OpenSheet', icon: 'fa-table'},
  };
  Brisa.ui_types = [
    Brisa.ui_classes['brisa-kanban'], Brisa.ui_classes['brisa-whiteboard'], Brisa.ui_classes['brisa-sheet'],
  ];
  Brisa.field_types = {
    string: 'Text, single line',
    text: 'Text, multi-line',
    markdown: 'Markdown Text, for simple formatting',
    html: 'HTML, for a visual text editor',
    int: 'Integer',
    decimal: 'Decimal, for non-whole numbers',
    datetime: 'Date + Time',
    listgroup: 'List Group, to create lists with more info within'
  };
  Brisa.field_type_arr = [];
  for (var i in Brisa.field_types) Brisa.field_type_arr.push([i, Brisa.field_types[i]]);

  Brisa.sizeTextarea = function(ref, min, max) {
    //ref.style.height = "1px";

    var new_h = ref.scrollHeight > max ? max : ref.scrollHeight;
    new_h = new_h < min ? min : new_h;
    ref.style.height = (new_h + 0) + "px";
    ref.style['overflow-y'] = new_h >= max ? 'scroll' : 'hidden';
  };

  Brisa.uid_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');
  Brisa.unique_id = function(length, name) {
    if (length === undefined || length === null) length = 8;
    var ret = '', chars = this.uid_chars;
    for (var i = 0; i < length; i++) ret += chars[((Math.random() * chars.length) | 0)];
    if (name) ret += "-" + name.toLowerCase().replace(/[^a-z]/g, '_').slice(0, 7).replace(/_*$/, '');
    return ret;
  }
  Brisa.model = function(uid) {
    for (var i in Brisa.models) {
      if (Brisa.models[i].unique_id() == uid) return Brisa.models[i];
    }
  };
  Brisa.Group = function(group_id) {
    for (var i in Brisa.groups) {
      if (Brisa.groups[i].data.id == group_id) {
        return Brisa.groups[i];
        break;
      }
    }
    return undefined;
  };
  Brisa.GroupSetting = function(group_id, name, defaults) {
    var group = Brisa.Group(group_id);
    if (!group) return undefined;
    if (!group.data.settings[name]) {
      group.setting(name, defaults);
      return defaults;
    }
    return group.data.settings[name];
  };
  Brisa.GetSetting = function(name, defaults) {
    return new Promise(function(resolve, reject) {
      if (this.settings[name]) {
        resolve(Brisa.settings[name]);
      } else {
        BrisaAPI.UserSetting.create(name, defaults).then(function(r) {
          this.settings[r.name()] = r;
          resolve(r);
        }.bind(this)).catch(function(r) { reject(r) });
      }
    }.bind(this));
  };
  Brisa.Labels = function(group_id) {
    if (!group_id) return this.GetSetting('labels', ['Important']);
    return new Promise(function(resolve, rej) {
      resolve({data: {setting: Brisa.GroupSetting(group_id, 'labels', ['Important']) }});
    });
  };
  Brisa.SortTags = function(entry) {
    var result = {labels: [], tags: [], group: null};
    return new Promise((res,rej) => {
      Brisa.Labels(entry.data.group_id).then(function(group_tags) {
        var labels = [];
        result.group = group_tags;
        for (var t of group_tags.data.setting) {
          result.labels.push({label: t, tag: t, selected: false});
          labels.push(t);
        }
        for (var t of entry.data.tags) {
          var lbl_idx = labels.indexOf(t);
          if (lbl_idx != -1) result.labels[lbl_idx].selected = true;
          else result.tags.push(t);
        }
        res(result);
      });
    });
  };
  Brisa.Theme = function() { return this.GetSetting('theme', {image: 'backgrounds/breeze2.jpg'}); };
  Brisa.background_opts = {
    classes: "primary,secondary,dark,light,info,success,danger,warning".split(","),
    colors: "White:white,Light Grey:#f0f0f0,Black:black,Red:#fcc,Green:#cfc,Blue:#ccf".split(",").
        map((v) => v.split(':')),
    images: [
      {url: 'backgrounds/breeze2.jpg', title: 'Brisa Watercolor'},
      {url: 'backgrounds/breeze.jpg', title: 'Brisa'},
      {url: 'backgrounds/bg-blue-grey.jpg', title: 'Blue Gradient'},
      {url: 'backgrounds/aonang.jpg', title: 'Ao Nang Islands'},
      {url: 'backgrounds/phiphi.jpg', title: 'Phi Phi, Thailand'},
    ]
  },
  Brisa.bg_style = function() {
    var setting = this.theme && this.theme.data ? this.theme.data.setting : {bg_class: 'primary'};
    if (!setting) setting = {bg_class: 'primary'};
    if (setting.bg_class) {
      return {style: '', classes: 'bg-' + setting.bg_class};
    } else if (setting.color) {
      return {style: "background-color: " + setting.color, classes: ''};
    } else if(setting.image) {
      return {style: 'background-image: url(' + setting.image + ')', classes: ''}
    }
    return {style: '', classes: ''};
  };

  Brisa.entityMap = {
    '&': '&amp;','<': '&lt;','>': '&gt;','"': '&quot;',"'": '&#39;','/': '&#x2F;','`': '&#x60;','=': '&#x3D;'
  };
  Brisa.escapeHtml = function(string) {
    if (string == null) string = '';
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return Brisa.entityMap[s];
    });
  };
  Brisa.group_models = {};
  Brisa.group_model_map = {}
  Brisa.LoadModels = function(group_id) {
    if (Brisa.group_models[group_id]) {
      return new Promise(function(res) {
        res(Brisa.group_models[group_id]);
      });
    }
    return BrisaAPI.Model.all(group_id).then(function(r) {
      Brisa.group_models[group_id] = r;
      var map = {};
      Brisa.group_model_map[group_id] = map;
      for (var i in r) {
        map[r[i].unique_id()] = r[i];
      }
      return r;
    }).catch(function(r) {
      console.log("Model list error", r);
    });
  };
  Brisa.formatText = function(text) {
    return Brisa.escapeHtml(text)
        .replace(/https?:&#x2F;&#x2F;[^\s]+/g, function(t) {
          return '<a target="_blank" href="' + t + '">' + t + '</a>'; 
        }).replace(/\n/g, "<br/>");
  };
  Brisa.GetModel = function(m) {
    for (var i in Brisa.models) {
      if (Brisa.models[i].unique_id() == m) return Brisa.models[i];
    }
  };

  // Token refresh: 30m * 60s * 1000ms
  Brisa.token_refresh_interval = 30 * 60 * 1000;
  Brisa.onResize = function() {
    Brisa.settings.height = window.innerHeight;
    Vue.set(Brisa.settings, 'width', window.innerWidth);
    if (Brisa.settings.size == 'sm') return;
    if (Brisa.settings.width >= 768) {
      Vue.set(Brisa.settings, 'size', 'lg');
    } else {
      Vue.set(Brisa.settings, 'size', 'sm');
    }
  };
  $(window).on('resize', function(r) { Brisa.onResize() });
  $(document).ready(function() {
    Brisa.onResize();
    BrisaAPI._include.auth_token = localStorage.getItem('brisa-token');
    Brisa.theme = {data: {setting: { image: 'backgrounds/breeze.jpg'}}};
    Brisa.models = [];
    Brisa.app = new Vue({el: '#brisa-container',
      components: {'brisa-main': brisa_main_component},
      data: {Brisa: Brisa, view: Brisa.current_view},
      render: function(h) { return h(brisa_main_component, { props: {Brisa: Brisa, view: Brisa.current_view} }) },
    });

    BrisaAPI.User.status().then(function(r) {
      if (r.data.logged_in) {
        Brisa.Login(r.data);
      } else {
        Brisa.user = r.data;
      }
    }).catch(function(err) {
      Brisa.login_error = err.json.error || 'Unable to check login status';
    });

    setInterval(function() {
      if (!Brisa.user.logged_in) return;
      BrisaAPI.User.status(true).then(function(r) {
        if (!r.data.logged_in) {
          Brisa.user = r.data;
        } else {
          BrisaAPI._include.auth_token = r.data.auth_token;
          localStorage.setItem('brisa-token', r.data.auth_token);
        }
      });
    }, Brisa.token_refresh_interval);
  });
  return Brisa;
}
