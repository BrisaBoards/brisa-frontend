<script>
  export default {
    props: [
      'Brisa', 'view'
    ],
    data: function() {
      return {
        entries: [],
        user_labels: {data: {setting: []}},
        sel_entry: null,
        show_settings: false,
        show_links: null,
        new_entry_title: '', new_entry_desc: '', new_entry_tags: '',
        showPopper: {},
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
        return this.Brisa.bg_style();
      },
    },
    watch: {
      view: function(v1, v2) {
        this.InitTags();
      },
    },
    mounted: function() {
      Brisa.settings.main_top = this.$refs.main_win.offsetTop;
    },
    created: function() {
      this.Brisa.AddView('Dashboard', 'brisa-dashboard', {tags: [], classes: []}, null, []);
    },
  };
</script>
<template>
  <div class="" style="height: 100%;">
    <transition name="fade">
      <div :key="background.style" :class="'background-block ' + background.classes" :style="background.style"></div>
    </transition>

    <div style="height: 100%; display: flex; flex: 1; align-items: stretch; flex-direction: column">
    <brisa-header :Brisa="Brisa" ref="header" @toggle_settings="show_settings = !show_settings">
      <template slot="left_bar">
        <div :key="Brisa.current_view ? Brisa.current_view.title : ''" class="dropdown xfloat-left">
          <button @click="InitTags(true)" class="btn btn-sm btn-primary btn-dropdown btn-round-sm" style="opacity: 0.95;" type="button" id="addEntryDrop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-plus" style="font-size: 1.5em"></i>
          </button>
          <div class="dropdown-menu" @click.stop="" style="min-width: 350px; border-radius: 10px;" aria-labelledby="addEntryDrop">
            <div class="p-4">
              <h5>New Entry</h5>
              <div class="form-group">
                <input ref="title" v-model="new_entry_title" type="email" class="form-control" id="new-entry-title" placeholder="Title">
              </div>
              <div class="form-group">
                <textarea v-model="new_entry_desc" type="email" class="form-control" id="new-entry-desc" placeholder="Description" rows="4"></textarea>
              </div>
              <div class="form-group">
                <input class="form-control" v-model="new_entry_tags" placeholder="Tags (eg Tag1, Tag 2, Tag3)">
              </div>
              <div class="form-group">
                <button @click.prevent="addEntry()" class="btn btn-info" type="submit">Add</button>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <span slot="right_bar">
      </span>
    </brisa-header>

    <transition name="fade">
      <div v-if="show_settings" class="container-fluid" :style="height + '; background-color: rgba(50,50,50,0.75); z-index: 2000; position: absolute;'">
        <div class="row" style="padding-top: 25px; padding-bottom: 25px;">
          <brisa-settings @close="show_settings=false"></brisa-settings>
        </div>
      </div>
    </transition>
    
    <div v-show="false" ref="main_win" style="border: 1px solid red; flex-grow: 1;">
    </div>
      <transition name="fade-fast" mode="out-in">
      <keep-alive>
      <component :key="view.unique_id"  style="flex-grow: 1;" :is="view.component"
          :Brisa="Brisa" :view="view" v-if="view && view.component">
      </component>
      </keep-alive>
      </transition>

  </div>
  </div>
</template>

