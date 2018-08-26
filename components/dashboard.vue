<template>
  <div class="container-fluid">
    <div class="row" style="padding-top: 10px;">
      <div class="col-xs-12 col-md-6">
        <br/>

        <brisa-card :opacity="0.7">
          <div class="col-12" v-if="true">
            <brisa-badge-list add_style="padding-top: 5px; margin-right: 5px; border-radius: 0px 0px 5px 5px;" highlight="info" @sel_change="SelectLabel" :labels="user_labels.data.setting.concat(['All', 'Untagged'])" :selected.sync="sel_label">
            </brisa-badge-list>
            <span style="padding: 5px;"></span>
            <brisa-badge-list add_style="padding-top: 5px; margin-right: 5px; border-radius: 0px 0px 5px 5px;"
              highlight="primary" @sel_change="SelectModel" :selected.sync="sel_model" :labels="(models || []).map(function(m) { return m.title() })">
            </brisa-badge-list>
          </div>
  
          <div v-if="entry.data" :key="entry.data.id" style="" class="col-12 xcol-sm-6 xcol-md-4 xcol-lg-3"
              v-for="(entry, idx) in view.entries">
            <brisa-entry-card-horiz @delete="OnDelete(entry, idx)" :opacity="0.85" :select="selectEntry" style="margin-bottom: 2px;" :selected.sync="sel_entry" :hide_desc="false" :entry="entry">
            </brisa-entry-card-horiz>
          </div>
          <br/>
        </brisa-card>
      </div>
      <div class="col-xs-12 col-md-6">
        <h4>Quick Access</h4>
      </div>
    </div>
    <br/>
  </div>

</template>
<script>
  import Vue from 'vue'
//  import DbCard from './brisa-card.vue'
  export default {
    props: [
      'Brisa', 'view'
    ],
    data: function() {
      return {
        showPopper: {},
        show_links: null,
        sel_entry: null,
        sel_label: null,
        sel_model: null,
        user_labels: {data: {setting: []}},
        models: Brisa.models || [],
        search: {},
      }
    },
    methods: {
      OnDelete: function(entry, idx) {
        entry.destroy().then(function(r) {
          this.view.entries.splice(idx, 1);
        }.bind(this));
      },
      selectEntry: function(entry) {
        var idx = entry.data.id;
        var old_entry = this.sel_entry;
        this.sel_entry = this.sel_entry == idx ? null : idx;
      },
      showLinks: function(idx) {
        this.show_links = idx;
      },
      fmtText: function(str) {
        return Brisa.formatText(str);
      },
      SelectLabel: function(idx, label) {
        var tags = null;
        this.sel_label = idx;
        if (label == 'All') {
          this.search.tags = null;
        } else if (label == 'Untagged') {
          this.search.tags = []
        } else {
          this.search.tags = [label];
        }
        this.UpdateSearch();

      },
      UpdateSearch: function() {
        this.view.ctx.tags = this.search.tags || [];
        this.view.ctx.classes = this.search.classes || [];
        BrisaAPI.Entry.search(null, this.search.tags, this.search.classes).then(function(r) {
          this.view.entries = r;
        }.bind(this));        
      },
      SelectModel: function(idx, label) {
        this.sel_model = this.sel_model == idx ? -1 : idx;
        if (this.sel_model != -1) {
          this.search.classes = [this.models[this.sel_model].data.unique_id];
        } else {
          this.search.classes = null;
        }
        this.UpdateSearch();
      },
      selectEntryx: function(idx) {
        var old_entry = this.sel_entry;
        this.sel_entry = this.sel_entry == idx ? null : idx;
        Vue.set(this.showPopper, idx, !this.showPopper[idx]);
        this.showPopper[old_entry] = false;
      },
      showLinks: function(idx) {
        this.show_links = idx;
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
      InitTags: function() {
        if (this.view) {
          this.new_entry_tags = this.view.ctx.tags.join(", ");
        } else {
          this.new_entry_tags = '';
        }
      },
    },
    created: function() {
      this.Brisa.Labels().then(function(r) {
        this.user_labels = r;
        this.SelectLabel(0, this.user_labels.data.setting[0]);
        this.InitTags();
      }.bind(this));
    },
  };

</script>
