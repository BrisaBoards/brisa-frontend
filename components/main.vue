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
      SidebarClicked: function() {
        if (this.show_menu && Brisa.settings.size == 'sm') this.show_menu = false;
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
  <component :show_sidebar="show_menu" :is="Brisa.settings.size == 'sm' ? 'layout-sm' : 'layout-lg'">
    <transition name="fade" slot="content">
    <brisa-login v-if="!Brisa.user.logged_in"></brisa-login>
    </transition>

    <transition name="fade" slot="background">
      <div :key="background.style" :class="'background-block ' + background.classes" :style="background.style"></div>
    </transition>

    <brisa-header slot="header" v-show="Brisa.user.logged_in" :Brisa="Brisa" ref="header" @toggle_settings="show_settings = !show_settings">
      <template slot="left_bar">
        <div :key="Brisa.current_view ? Brisa.current_view.title : ''" class="m-2" style="xborder: 1px dotted rgba(0,0,0,0.15); position: relative; border-radius: 10px; overflow: hidden">
          <div class="bg-secondary" style="z-index: -1; opacity: 0.1; position: absolute; width: 100%; height: 100%"></div>
          <a :key="'menu_clk' + show_menu" @click.prevent="show_menu = !show_menu" class="noselect pl-4 pr-4 text-light" style="padding-top: 2px; padding-bottom: 2px; cursor: pointer; display: inline-block; text-decoration: none; font-size: 1.25em;">
            <i v-if="show_menu" class="fa fa-chevron-left mr-3"></i>
            <i v-else class="fa fa-chevron-right mr-3"></i>
            {{(Brisa.current_view || {}).group_name}}
            {{ Brisa.current_view ? '-' : '' }}
            {{(Brisa.current_view || {}).title}}
          </a>
        </div>
      </template>
      
      <span slot="right_bar">
      </span>
    </brisa-header>

    <transition name="fade-fast" mode="out-in">
      <div v-if="false && show_settings" class="container-fluid" :style="height + '; background-color: rgba(50,50,50,0.5); z-index: 2000; top:0; bottom: 0;position: absolute;'">
      </div>
    </transition>

    <transition name="fade" slot="sidebar">
      <Sidebar :expanded="show_menu" v-if="true || show_menu" @toggle-menu="SidebarClicked"></Sidebar>
    </transition>

    <transition v-if="Brisa.user.logged_in" name="fade-fast" mode="out-in" slot="content">

      <brisa-settings @close="show_settings = false;" v-if="show_settings"></brisa-settings>
      <keep-alive :max="3" v-else>
      <component :key="view.unique_id"  style="flex-grow: 1;" :is="view.component"
          :Brisa="Brisa" :view="view" v-if="!show_settings && view && view.component">
      </component>
      </keep-alive>
    </transition>

  </component>
</template>

