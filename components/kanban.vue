<template>
  <div ref="kanban-main" class="" :style="'height: 100%; width: 100%; position: absolute; vertical-align: top; white-space: nowrap;'">
    <div style="margin-top: 10px; position: fixed; right: 25px; z-index: 5;" class="float-right">
      <div class="bg-light p-1" style="border-radius: 5px; vertical-align: top;">
        <brisa-stats @select="(id) => { /*console.log('sel', id);*/ selected_entry = id }" style="display: inline-block; vertical-align: top;" :groups="GetStatsGroups" :group_id="this.view.group_id"></brisa-stats>
        <brisa-filter style="display: inline-block; vertical-align: top;" @update="UpdateFilter" :group_id="this.view.group_id"></brisa-filter>
      </div>
    </div>
    <div class="mb-3" v-for="(lane, lane_idx) in lanes()">
      <div>
        <div class="mt-2 pl-3 p-2" style="border-radius: 0 20px 20px 0; display: inline-block; background-color: rgba(255,255,255,0.90)">
          <brisa-inline-editor name="Lane Title" :update_ref="lane" :updated="UpdateLaneName" :value="lane.title" val_type="string"
              class="m-0 text-dark mr-1" style="font-size: 115%;" wrapper="span">
          </brisa-inline-editor>
        </div>
      </div>

      <draggable :key="'drag_group'" group="drag_groups" handle=".group-mv-target" draggable=".drag-group" ref="draggable-group"
          @end="UpdateGroups" v-model="lane.groups" style="display: inline-block; padding-right: 25px;"
          >
        <brisa-card :key="group.unique_id" class="ml-2 mt-3 drag-group" :opacity="0.85" color="white"
            style="position: relative; white-space: normal; vertical-align: top; width: 300px; border: 0; display: inline-block"
            v-for="(group,idx) in lane.groups">
          <div class="text-dark p-2 mb-1">
            <i key="drag" class="fa fa-bars group-mv-target pt-2 float-right text-dark" style="font-size: 120%; opacity: 0.4"></i>
            <brisa-inline-editor name="Title" :update_ref="group" :updated="UpdateGroupName" :value="group.title" val_type="string"
                class="m-0 p-2 rounded" wrapper="span" style="background-color: rgba(255,255,255,0.3);">
              <span style="font-size: 125%;">{{group.title}}</span>
            </brisa-inline-editor>
          </div>
  
          <div key="empty-group" v-if="sorted_groups[group.unique_id].length == 0" class="">
            <button key="del" @click="RemoveGroup(lane, idx, group.unique_id)" class="float-right m-3 btn btn-outline-warning btn-sm">
              Remove
            </button>
          </div>
          <draggable :key="'drag' + group.unique_id" ref="draggable" style="padding-bottom: 30px;"
              :handle="Brisa.settings.size == 'sm' ? '.kbmove-target' : '.kblist-target'" @add="UpdateEntry"
              @end="UpdateGroups" v-model="sorted_groups[group.unique_id]"
              tag="brisa-drag-cont" :component-data="{on: {}, props: {'cont_id': group.unique_id}}"
              group="kb-cards">
            <div :key="ent + '_' + idx" class="kblist-target m-0 mt-1" :data-group="group.unique_id" :data-ent="ent" style="position: relative;"
                v-if="entry_dict[ent] && (selected_entry == ent || filter_dict[ent])"
                v-for="(ent, idx) in sorted_groups[group.unique_id]">
              <brisa-entry-card :api_ctx="entry.id() + '-_kanban'" class="kanban-card" @delete="OnDelete(entry_dict[ent], idx, group.unique_id)"
                  wrapper="card-body-sm" :highlight="my_view.highlight == ent"
                  :select="onSelect" margin="1px" :selected.sync="selected_entry" :hide_desc="true" :entry="entry_dict[ent]">
                <span slot="title">
                  <span v-if="Brisa.settings.size == 'sm'" style="opacity: 0.5"><i class="fa fa-bars kbmove-target"></i> </span>
                  {{entry_dict[ent] ? entry_dict[ent].title() : 'No title for ' + ent}}
                </span>
              </brisa-entry-card>
            </div>
          </draggable>
          
          <div>
          <button @click="ShowAddCard(group.unique_id)" v-if="!show_add[group.unique_id]" class="btn btn-sm btn-secondary text-primary" style="width: 100%;"><i class="fa fa-plus"></i> Add</button>
          <input :ref="'add-input-' + group.unique_id" style="font-size: 100%; padding: 20px;" @keyup.esc="ShowAddCard(group.unique_id, true)"
              @keyup.enter="AddCard(group.unique_id)" v-if="show_add[group.unique_id]"
              class="form-control form-control-sm bg-light" v-model="show_add[group.unique_id].title" placeholder="Title">
          </div>
        </brisa-card>
      </draggable>

      <brisa-card slot="footer" key="new" :opacity="0.7" class="ml-2 mt-3" style="vertical-align: top; display: inline-block">
        <div style="padding: 10px; text-align: center;">
          <a @click.prevent="ShowAddGroup(lane.unique_id)" href="#" v-if="add_group != lane.unique_id">
            <i class="fa fa-plus"></i> <small>Column</small>
          </a>
          <div v-else>
          <input :ref="'new_group_' + lane.unique_id" class="form-control form-control-sm"
            v-model="new_group" @keydown.esc="add_group=false" @keypress.enter="AddGroup(lane_idx)">
          <button class="btn btn-warning btn-sm" @click="add_group = false" style="width: 100%">Cancel</button>
          </div>
        </div>
      </brisa-card>
    </div>

    <div class="mt-5 p-2" style="border-radius: 0 20px 20px 0; display: inline-block; background-color: rgba(255,255,255,0.90)">
    <div v-if="!show_new_lane" class="" style="display: inline-block">
      <button @click="show_new_lane = true" class="btn btn-sm btn-link"><i class="fa fa-plus"></i> Add Lane</button>
    </div>
    <div v-else="show_new_lane" class="" style="display: inline-block">
      <input v-model="new_lane" @keydown.esc="show_new_lane = false" class="form-control form-control-sm bg-light" style="display: inline-block; max-width: 150px;">
      <button @click="AddLane" class="btn btn-sm btn-link"><i class="fa fa-plus"></i> &nbsp;Add Lane</button>
    </div>
    </div>
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
        show_filters: false,
        my_view: this.view,
        pid: p.data.id,
        entry: p,
        add_group: false, new_group: '',
        show_add: {},
        entry_dict: {},
        filter_dict: {},
        selected_entry: null,
        sorted_groups: null,
        win_height: Brisa.settings.height,
        win_width: window.innerWidth,
        show_new_lane: false, new_lane: '',
      };
    },
    methods: {
      RemoveGroup: function(lane, group_idx, group_id) {
        lane.groups.splice(group_idx, 1);
        this.entry.update();
      },
      UpdateLaneName: function(new_val, lane) {
        lane.title = new_val;
        this.entry.update().then(function(r) {
        }.bind(this));
      },
      UpdateGroupName: function(new_val, group) {
        group.title = new_val;
        this.entry.update().then(function(r) {
        }.bind(this));
      },
      AddLane: function() {
        var kanban = this.entry.data.metadata._kanban;
        var new_lane = {unique_id: Brisa.unique_id(), title: this.new_lane, groups: []};
        if (this.kanban.lanes == undefined) this.$set(this.kanban, 'lanes', []);
        this.kanban.lanes.push(new_lane);
        this.new_lane = '';
        this.show_new_lane = false;
      },
      ShowAddGroup: function(lane_id) {
        this.add_group = lane_id;
        this.$nextTick(function() {
          this.$refs['new_group_' + lane_id][0].focus()
        }.bind(this));
      },
      OnDelete: function(entry, idx, gid) {
        entry.destroy().then(function(r) {
          delete this.entry_dict[entry.id];
          this.sorted_groups[gid].splice(idx, 1);
          var vidx = this.view.entries.indexOf(entry);
          if (vidx != -1) this.view.entries.splice(vidx, 1);
          for (var i in this.$refs.draggable) {
            var d = this.$refs.draggable[i];
            d._sortable.option('disabled', false);
          }
        }.bind(this));
      },
      AddGroup: function(lane_idx) {
        var kanban = this.entry.data.metadata._kanban;
        var new_group = {unique_id: Brisa.unique_id(), title: this.new_group};
        this.kanban.lanes[lane_idx].groups.push(new_group);
        this.kanban.sorted[new_group.unique_id] = [];
        this.entry.update().then(() => { this.$set(this, 'sorted_groups', this.entry.data.metadata._kanban.sorted) });
        this.new_group = '';
        this.add_group = false;
        //if (kanban.groups.length == 1) {
        //  this.InitGroups();
        //}
      },
      ShowAddCard: function(group, hideit) {
        this.$set(this.show_add, group, hideit ? false : {title: ''});
        if (!hideit)
          this.$nextTick(function() {this.$refs['add-input-' + group][0].focus()}.bind(this));
      },
      AddCard: function(group) {
        var copts = {title: this.show_add[group].title, group_id: this.view.group_id, tags: this.view.ctx.tags, classes: this.view.ctx.classes};
        copts.metadata = {_kanbans: { }};
        copts.metadata._kanbans[this.entry.data.id] = {group: group};
        BrisaAPI.Entry.create(copts).then(function(r) {
          this.$set(this.show_add, group, false);
          this.entry_dict[r.data.id] = r;
          this.view.entries.push(r);
          if (this.sorted_groups[group].indexOf(r.data.id) == -1)
            this.sorted_groups[group].push(r.data.id);
          //this.entry.metadata()._kanban.sorted[group].push(r.data.id);
          this.$set(this, 'sorted_groups', this.entry.data.metadata._kanban.sorted);
          this.$set(this.filter_dict, r.data.id, true);
          this.$forceUpdate();
        }.bind(this));
      },
      sorted_group: function(group) {
        return this.entry.metadata()._kanban.sorted[group];
      },
      UpdateGroups: function(a,b,c) {
        this.entry.update();
        this.$forceUpdate();
      },
      UpdateEntry: function(a,b) {
        var ent = this.entry_dict[a.item.dataset.ent];
        var md = ent.data.metadata;
        var group = a.to.dataset['contId'];
        if (!md._kanbans) md._kanbans = {};
        if (!md._kanbans[this.pid]) md._kanbans[this.pid] = {};
        md._kanbans[this.pid].group = group;
        ent.update();
      },
      onSelect: function(entry) {
        this.selected_entry = this.selected_entry == entry.data.id ? false : entry.data.id;
        if (this.view.highlight == entry.data.id) this.view.highlight = null;
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
      GetStatsGroups: function() {
        return Brisa.stats.KanbanGroups(this.view.parent, this.view.entries);
      },
      UpdateFilter: function(new_filter) {
        this.filter = new_filter;
        Brisa.filter.init(this.view.entries, new_filter, this.filter_dict);
        this.$forceUpdate();
      },
      lanes: function() {
        return this.entry.metadata()._kanban.lanes;
      },
      RTUpdate: function(entry, event) {
        console.log("KB Update", entry.data.id, event);
        if ((entry.data || {}).id == this.view.parent.data.id) {
          console.log("Parent updated", entry);
          this.view.parent = entry;
          this.entry = this.view.parent;
          this.sorted_groups = this.entry.metadata()._kanban.sorted;
          return;
        } else if (entry) {
          this.$set(this.filter_dict, entry.data.id, Brisa.filter.filter_one(entry, this.filter));
        }
        if (event == 'add') {
          var to_group = entry.metadata()._kanbans[this.pid].group;
          this.view.entries.unshift(entry)
          this.entry_dict[entry.data.id] = entry;
          //this.$set(this, 'sorted_groups', this.view.parent.metadata()._kanban.sorted);
          if (this.sorted_groups[to_group].indexOf(entry.data.id) == -1)
            this.sorted_groups[to_group].push(entry.data.id);
          //this.InitGroups();
          this.$forceUpdate();
        } else if (event == 'destroy') {
          if (entry.index) this.view.entries.splice(entry.index, 1);
          delete this.entry_dict[entry.id];
          this.$forceUpdate();
        }
      },
    },
    beforeDestroy: function() {
      Brisa.messager.Unregister(this.view);
    },
    mounted: function() {
      Brisa.messager.Register(this.view, this.RTUpdate, this.RTUpdate, this.RTUpdate);
    },

    computed: {
      kb_group: function(group) {
        return this.entry.metadata()._kanban.sorted[group];
      },
      kanban: function() {
        return this.entry.data.metadata._kanban;
      },
    },
    created: function() {
      var kb = this.entry.data.metadata._kanban;
      var groups = [];
      var group_ids = [];
      if ((kb.lanes || []).length == 0) kb.lanes = [{title: 'Main', unique_id: Brisa.unique_id(), groups: []}];
      if (kb.groups) {
        console.log("Has groups", kb.groups);
        for (let group of kb.groups) {
          kb.lanes[0].groups.push(group);
        }
        delete kb.groups;
      }
      for (let lane of kb.lanes) {
        if (!lane.groups) lane.groups = [];
        for (let group of lane.groups) {
          groups.push(group);
          group_ids.push(group.unique_id);
        }
      }
      var init_g = (groups[0] || {}).unique_id;
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
          var gidx = group_ids.indexOf(g);
          if (gidx != -1) {
            if (kb.sorted[g].indexOf(ent.data.id) == -1) kb.sorted[g].push(ent.data.id);
          } else if (init_g) {
            md._kanbans[this.pid].group = init_g;
            kb.sorted[init_g].push(ent.data.id);
          }
        }
      }
      for (var i in groups) {
        var g = groups[i]
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
