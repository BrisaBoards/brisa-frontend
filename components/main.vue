<script>
  import Sidebar from './sidebar.vue';
  export default {
    props: [
      'Brisa', 'view'
    ],
    components: {'Sidebar': Sidebar},
    data: function() {
      return {
        entries: [],
        user_labels: {data: {setting: []}},
        sel_entry: null,
        show_settings: false,
        show_links: null,
        new_entry_title: '', new_entry_desc: '', new_entry_tags: '',
        showPopper: {},
        show_menu: false,
        show_search: false,
        sel_label: 0,
        sel_model: -1,
        models: this.Brisa.models,
        bg_style: {classes: '', style: ''},
        search: {},
        top: 0,
      };
    },
    methods: {
      OpenDash: function(group_id) {
        Brisa.AddView('Dashboard', 'brisa-dashboard', {tags: [], classes: []}, null, [], group_id);
        this.show_menu = false;
      },
      InitTags: function(focus) {
        if (this.view) {
          this.new_entry_tags = this.view.ctx.tags.join(", ");
        } else {
          this.new_entry_tags = '';
        }
        if (focus) this.$nextTick(() => this.$refs.title && this.$refs.title.focus());
      },
      CloseSettings: function() {
        this.show_settings = false;
        console.log("Close emit");
      },
      addEntry: function() {
        var tags = this.new_entry_tags.split(",").map(function(tag) { return tag.trim() });
        if (tags.length == 1 && tags[0] == '') tags = [];
        BrisaAPI.Entry.create({title: this.new_entry_title, tags: tags, description: this.new_entry_desc}).then(function(r) {
          var c_view = true;
          var ctx_tags = this.view ? (this.view.ctx || {tags: []}).tags : [];
          for (var i in ctx_tags) {
            var t = ctx_tags[i];
            if ((r.tags() || []).indexOf(t) == -1) c_view = false;
          }
          if (c_view) this.view.entries.push(r);
          this.new_entry_title = '';
          //this.new_entry_tags = '';
          this.new_entry_desc = '';
          this.InitTags();
          this.entries.push(r);
        }.bind(this));
      },
    },
    computed: {
      height: function() {
        var new_ht = this.Brisa.settings.height - this.top;
        return "height: " + new_ht + 'px';
      },
      background: function() {
        return Brisa.bg_style();
      },
    },
    watch: {
      view: function(v1, v2) {
        this.InitTags();
      },
    },
    mounted: function() {
      //Brisa.settings.main_top = this.$refs.main_win.offsetTop;
    },
    created: function() {
      //this.Brisa.AddView('Dashboard', 'brisa-dashboard', {tags: [], classes: []}, null, []);
    },
  };
</script>
<template>
  <div class="" style="height: 100%;">
    <transition name="fade">
      <div :key="background.style" :class="'background-block ' + background.classes" :style="background.style"></div>
    </transition>

    <div style="height: 100%; display: flex; flex: 1; align-items: stretch; flex-direction: column">
    <brisa-header v-show="Brisa.user.logged_in" :Brisa="Brisa" ref="header" @toggle_settings="show_settings = !show_settings">
      <template slot="left_bar">
        <div :key="Brisa.current_view ? Brisa.current_view.title : ''" class="dropdown xfloat-left">
          <a @click.prevent="show_menu = true" href="#" class="text-light p-1" style="text-decoration: none; font-size: 150%;">
            <i class="fa fa-bars"></i>&nbsp; {{(Brisa.current_view || {}).group_name}}
            -
            {{(Brisa.current_view || {}).title}}
          </a>
        </div>
      </template>
      
      <span slot="right_bar">
      </span>
    </brisa-header>

    <transition name="fade">
      <div v-if="show_settings" class="container-fluid" :style="height + '; background-color: rgba(50,50,50,0.5); z-index: 2000; top:0; bottom: 0;position: absolute;'">
        <div class="row" style="padding-top: 25px; padding-bottom: 25px;">
          <brisa-settings @close="show_settings=false"></brisa-settings>
        </div>
      </div>
    </transition>
    
    <transition name="fade">
      <Sidebar v-if="show_menu" @toggle-menu="show_menu = false"></Sidebar>
    </transition>

    <transition v-if="Brisa.user.logged_in" name="fade-fast" mode="out-in">
      <keep-alive>
      <component :key="view.unique_id"  style="flex-grow: 1;" :is="view.component"
          :Brisa="Brisa" :view="view" v-if="view && view.component">
      </component>
      </keep-alive>
    </transition>

    <transition name="fade">
    <brisa-login v-if="!Brisa.user.logged_in"></brisa-login>
    </transition>

  </div>
  </div>
</template>

