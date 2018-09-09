import Vue from 'vue';
import brisa_main_component from './components/main.vue';
export default function() {
  var Brisa = new function() { return {}; };

  Brisa.brisa_first_run = false;
  if (process.env.BACKEND) {
    console.log("Setting backend path", process.env.BACKEND);
    BrisaAPI._api_path = process.env.BACKEND;
  } else {
    console.log("Initialize IDB backend");
    BrisaAPI._brisa_idb = new BrisaIDB('organizer-demo');
  }
  //Vue.component('brisa-main', brisa_main_component);
  Brisa.results = [];
  Brisa.user = {
    logged_in: null,
    uid: 1,
    name: "",
    real_id: 1,
    shares: [],
  };
  Brisa.Login = function(user) {
    localStorage.setItem('brisa-token', user.auth_token);
    BrisaAPI._include.auth_token = user.auth_token;
    BrisaAPI.Model.all().then(function(r) {
      Vue.set(Brisa, 'models', r);
    }.bind(this));
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
  Brisa.models = [];
  Brisa.settings = {main_top: 48, header_height: 48, height: window.innerHeight};
  $(window).on('resize', function(r) { Brisa.settings.height = window.innerHeight });
  Brisa.views = [];
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
      console.log("CloseView", view_idx, idx, Brisa.current_view, rem[0]);
      if (Brisa.current_view == rem[0]) Brisa.current_view = Brisa.views[view_idx-1];
    } else { console.log("No view", idx); }
  };
  Brisa.AddView = function(title, component, ctx, parent, entries) {
    var view = {
      title: title,
      id: (parent || {data: {id: 'dash'}}).data.id + '_' + component,
      unique_id: Brisa.unique_id(4),
      component: component,
      ctx: ctx,
      parent: parent,
      entries: entries,
    };
    this.views.push(view);
    Brisa.current_view = view;
    return view;
  };
  Brisa.OpenView = function(parent, uitype) {
    var md = parent.data.metadata;
    var cls_md = md[uitype.cls];
    BrisaAPI.Entry.search(cls_md.tags, cls_md.classes).then(function(r) {
      var view = this.AddView(parent.title(), uitype.cmp,
          {tags: cls_md.tags || [], classes: cls_md.classes || []},
          parent, r);
    }.bind(this));    
  };
  Brisa.OpenKanban = function(parent) {
    var md = parent.data.metadata;
    BrisaAPI.Entry.search(md._kanban.tags, md._kanban.classes).then(function(r) {
      var view = this.AddView(parent.title(), 'brisa-kanban',
          {tags: md._kanban.tags || [], classes: md._kanban.classes || []},
          parent, r);
    }.bind(this));
  };
  Brisa.OpenWhiteboard = function(parent) {
    var md = parent.data.metadata;
    BrisaAPI.Entry.search(md._whiteboard.tags, md._whiteboard.classes).then(function(r) {
      var view = this.AddView(parent.title(), 'brisa-whiteboard',
          {tags: md._whiteboard.tags || [], classes: md._whiteboard.classes || []},
          parent, r);
    }.bind(this));
  };
  Brisa.OpenSheet = function(parent) {
    var md = parent.data.metadata;
    BrisaAPI.Entry.search(md._sheet.tags, md._sheet.classes).then(function(r) {
      var view = this.AddView(parent.title(), 'brisa-sheet',
          {tags: md._sheet.tags || [], classes: md._sheet.classes || []},
          parent, r);
    }.bind(this));
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
  Brisa.Labels = function() { return this.GetSetting('labels', ['Important']); };
  Brisa.Theme = function() { return this.GetSetting('theme', {image: 'backgrounds/breeze.jpg'}); };
  Brisa.background_opts = {
    classes: "primary,secondary,dark,light,info,success,danger,warning".split(","),
    colors: "red,green,blue".split(","),
    images: [
      {url: 'backgrounds/breeze.jpg', title: 'Breeze'},
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
  
  $(document).ready(function() {
    BrisaAPI._include.auth_token = localStorage.getItem('brisa-token');
    Brisa.theme = {data: {setting: { image: 'backgrounds/breeze.jpg'}}};
    Brisa.models = [];
    Brisa.settings = {};
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
