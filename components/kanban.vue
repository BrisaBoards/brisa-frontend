<template>
  <div ref="kanban-main" class="" :style="'height: 100%; overflow-x: auto; vertical-align: top; white-space: nowrap;'">
    <br/>

      <brisa-card :key="group.unique_id" :opacity="0.7" color="white" style="position: relative; white-space: normal; vertical-align: top; width: 275px; display: inline-block; margin-left: 10px;"
          v-for="(group,idx) in kanban.groups">
        <div class="card-header text-dark" style="padding: 5px;">
          <h4 style="margin: 0px; padding: 0px;">{{group.title}}</h4>
        </div>

        <draggable :key="'drag' + group.unique_id" ref="draggable" style="padding-bottom: 20px;" @add="UpdateEntry"
            @end="UpdateGroups" v-model="sorted_groups[group.unique_id]"
            :data-kbgroup="group.unique_id" :options="{dataIdAttr: group.unique_id, group: 'kbgroup', handle: '.kblist-target'}">
          <div :key="ent + '_' + idx" class="kblist-target" :data-ent="ent" style="position: relative; padding: 5px 5px 0px 5px;"
              v-if="entry_dict[ent]" v-for="(ent, idx) in sorted_groups[group.unique_id]">
            <brisa-entry-card @delete="OnDelete(entry_dict[ent], idx, group.unique_id)" wrapper="card-body-sm" :select="onSelect" margin="1px" :selected.sync="selected_entry" :hide_desc="true" :entry="entry_dict[ent]">
              <span style="font-size: 115%" slot="title">{{entry_dict[ent] ? entry_dict[ent].title() : 'No title for ' + ent}}</span>
            </brisa-entry-card>
          </div>
        </draggable>
        
        
        <button @click="ShowAddCard(group.unique_id)" v-if="!show_add[group.unique_id]" class="btn btn-sm btn-secondary text-primary" style="width: 100%;"><i class="fa fa-plus"></i> Add</button>
        <input :ref="'add-input-' + group.unique_id" style="padding: 20px;" @keyup.esc="ShowAddCard(group.unique_id, true)" @keyup.enter="AddCard(group.unique_id)" v-if="show_add[group.unique_id]"
            class="form-control form-control-sm bg-light" v-model="show_add[group.unique_id].title" placeholder="Title">
      </brisa-card>
      
      <brisa-card key="new" :opacity="0.7" style="margin: 7px; vertical-align: top; display: inline-block">
        <div style="padding: 10px; text-align: center;">
          <a @click.prevent="ShowAddGroup" href="#" v-if="!add_group">
            <i class="fa fa-plus"></i>
          </a>
          <div v-else>
          <input ref="new_group_in" class="form-control form-control-sm"
            v-model="new_group" @keydown.esc="add_group=false" @keypress.enter="AddGroup">
          <button class="btn btn-warning btn-sm" @click="add_group = false" style="width: 100%">Cancel</button>
          </div>
        </div>
      </brisa-card>

  </div>
</template>


<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'Brisa', 'view'
    ],
    data: function() {
      var p = this.view.parent;
      return {
        pid: p.data.id,
        entry: p,
        add_group: false, new_group: '',
        show_add: {},
        entry_dict: {},
        selected_entry: null,
        sorted_groups: null,
        win_height: Brisa.settings.height,
        win_width: window.innerWidth,
      };
    },
    methods: {
      ShowAddGroup: function() {
        this.add_group = true;
        this.$nextTick(function() {this.$refs.new_group_in.focus()}.bind(this));
      },
      OnDelete: function(entry, idx, gid) {
        entry.destroy().then(function(r) {
          delete this.entry_dict[entry.id];
          this.sorted_groups[gid].splice(idx, 1);
          var vidx = this.view.entries.indexOf(entry);
          if (vidx != -1) this.view.entries.splice(vidx, 1);
        }.bind(this));
      },
      AddGroup: function() {
        var kanban = this.entry.data.metadata._kanban;
        var new_group = {unique_id: Brisa.unique_id(), title: this.new_group};
        if (this.kanban.groups == undefined) this.$set(this.kanban, 'groups',  []);
        this.kanban.groups.push(new_group);
        this.kanban.sorted[new_group.unique_id] = [];
        //this.$set(this.sorted_groups, new_group.unique_id, kanban.sorted[new_group.unique_id]);
        this.entry.update().then(() => { this.$set(this, 'sorted_groups', this.entry.data.metadata._kanban.sorted) });
        this.new_group = '';
        this.add_group = false;
        if (this.kanban.groups.length == 1) {
          this.InitGroups();
        }
      },
      ShowAddCard: function(group, hideit) {
        this.$set(this.show_add, group, hideit ? false : {title: ''});
        if (!hideit)
          this.$nextTick(function() {this.$refs['add-input-' + group][0].focus()}.bind(this));
      },
      AddCard: function(group) {
        var copts = {title: this.show_add[group].title, tags: this.view.ctx.tags, classes: this.view.ctx.classes};
        copts.metadata = {_kanbans: { }};
        copts.metadata._kanbans[this.entry.data.id] = {group: group};
        BrisaAPI.Entry.create(copts).then(function(r) {
          this.$set(this.show_add, group, false);
          this.entry_dict[r.data.id] = r;
          this.view.entries.push(r);
          this.entry.metadata()._kanban.sorted[group].push(r.data.id);
        }.bind(this));
      },
      sorted_group: function(group) {
        return this.entry.metadata()._kanban.sorted[group];
      },
      UpdateGroups: function(a,b,c) {
        //this.$set(this.entry.data.metadata._kanban, 'sorted', this.entry.data.metadata._kanban.sorted);
        this.entry.update();
        this.$forceUpdate();
      },
      UpdateEntry: function(a,b) {
        var ent = this.entry_dict[a.item.dataset.ent];
        var md = ent.data.metadata;
        var group = a.target.dataset.kbgroup;
        if (!md._kanbans) md._kanbans = {};
        if (!md._kanbans[this.pid]) md._kanbans[this.pid] = {};
        md._kanbans[this.pid].group = group;
        ent.update();
      },
      onSelect: function(entry) {
        this.selected_entry = this.selected_entry == entry.data.id ? false : entry.data.id;
        var disabled = this.selected_entry ? true : false;
        for (var i in this.$refs.draggable) {
          var d = this.$refs.draggable[i];
          d._sortable.option('disabled', disabled);
        }
      },

      InitGroups: function() {
        var kb = this.entry.data.metadata._kanban;
        if (!kb.groups) kb.groups = [];
        var group_map = kb.groups.map((g) => { return g.unique_id });
        var init_g = (kb.groups[0] || {}).unique_id;
        if (kb.sorted === undefined) kb.sorted = {};
        this.$set(this, 'sorted_groups', kb.sorted);
        for (var i in this.view.entries) {
          var ent = this.view.entries[i];
          this.entry_dict[ent.data.id] = ent;
          var md = ent.metadata();
          if (!md._kanbans) md._kanbans = {};
          if (!md._kanbans[this.pid]) md._kanbans[this.pid] = {};
          var g = (md._kanbans[this.pid] || {}).group;
          if (!g) {
            if (init_g) {
              md._kanbans[this.pid].group = init_g;
              if (kb.sorted[init_g].indexOf(ent.data.id) == -1) kb.sorted[init_g].push(ent.data.id);
            }
          } else {
            var gidx = group_map.indexOf(g);
            if (gidx != -1) {
              if (kb.sorted[g].indexOf(ent.data.id) == -1) kb.sorted[g].push(ent.data.id);
            } else if (init_g) {
              md._kanbans[this.pid].group = init_g;
              kb.sorted[init_g].push(ent.data.id);
            }
          }
        }
        for (var i in kb.groups) {
          var g = kb.groups[i]
          if (kb.sorted[g.unique_id] === undefined) kb.sorted[g.unique_id] = [];
          for (var ent_idx in kb.sorted[g.unique_id]) {
            var ent = kb.sorted[g.unique_id][ent_idx];
            if (this.entry_dict[ent] && this.entry_dict[ent].metadata()._kanbans[this.pid].group != g.unique_id)
              kb.sorted[g.unique_id].splice(ent_idx, 1);
          }
        }
      },
    },
    computed: {
      kanban: function() {
        return this.entry.data.metadata._kanban;
      },
    },
    created: function() {
      var kb = this.entry.data.metadata._kanban;
      if (!kb.groups) kb.groups = [];
      var group_map = kb.groups.map((g) => { return g.unique_id });
      var init_g = (kb.groups[0] || {}).unique_id;
      if (kb.sorted === undefined) kb.sorted = {};
      this.$set(this, 'sorted_groups', kb.sorted);
      for (var i in this.view.entries) {
        var ent = this.view.entries[i];
        this.entry_dict[ent.data.id] = ent;
        var md = ent.metadata();
        if (!md._kanbans) md._kanbans = {};
        if (!md._kanbans[this.pid]) md._kanbans[this.pid] = {};
        var g = (md._kanbans[this.pid] || {}).group;
        if (!g) {
          if (init_g) {
            md._kanbans[this.pid].group = init_g;
            if (kb.sorted[init_g].indexOf(ent.data.id) == -1) kb.sorted[init_g].push(ent.data.id);
          }
        } else {
          var gidx = group_map.indexOf(g);
          if (gidx != -1) {
            if (kb.sorted[g].indexOf(ent.data.id) == -1) kb.sorted[g].push(ent.data.id);
          } else if (init_g) {
            md._kanbans[this.pid].group = init_g;
            kb.sorted[init_g].push(ent.data.id);
          }
        }
      }
      for (var i in kb.groups) {
        var g = kb.groups[i]
        if (kb.sorted[g.unique_id] === undefined) kb.sorted[g.unique_id] = [];
        for (var ent_idx in kb.sorted[g.unique_id]) {
          var ent = kb.sorted[g.unique_id][ent_idx];
          if (this.entry_dict[ent] && this.entry_dict[ent].metadata()._kanbans[this.pid].group != g.unique_id)
            kb.sorted[g.unique_id].splice(ent_idx, 1);
        }
      }
    },
  });

</script>
