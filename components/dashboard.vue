<template>
  <div class="d-flex" style="width: 100%; height: 100%; overflow: auto;">
    <div class="container-fluid">
    <div class="row" style="padding-top: 0px;">
      <div class="col-12">
        <brisa-badge-list add_style="padding-top: 5px; margin-right: 5px; border-radius: 0px 0px 5px 5px;" highlight="info"
          @sel_change="SelectLabel"
          :labels="user_labels.data.setting.concat([{sel: 'more', fa: 'fa-ellipsis-h'}, 'All', 'Untagged'])" :selected.sync="sel_label">
        </brisa-badge-list>
        <span style="padding: 5px;"></span>
        <brisa-badge-list add_style="padding-top: 5px; margin-right: 5px; border-radius: 0px 0px 5px 5px;"
          highlight="primary" @sel_change="SelectModel" :selected="sel_model" :labels="(models || []).map(function(m) { return m.title() })">
        </brisa-badge-list>
      </div>
      <div key="settings" class="col-12 p-3 bg-light text-dark" v-if="show_settings">
        <h3>Labels</h3>
        <draggable v-model="user_labels.data.setting" @change="SaveLabels">
        <div class="mr-2 inline-block text-center p-1" style="border-left: 2px solid rgba(126,126,126,0.5); display: inline-block"
            v-for="(label,idx) in user_labels.data.setting">
          <brisa-inline-editor class="m-2" name="Label" :update_ref="idx" :value="label" :updated="EditLabel" val_type="string">
          </brisa-inline-editor>
          <button @click="DeleteLabel(idx)" class="btn btn-sm btn-outline-warning float-left"><i class="fa fa-times"></i></button>
        </div>
        </draggable>
        <div class="m-2">
          <brisa-inline-editor style="display:inline-block" name="Label" :updated="AddLabel" val_type="string">
          </brisa-inline-editor>
        </div>
      </div> 
      <div class="col-12 col-lg-6">
        <div class="col-12 pl-3 p-1 pb-2">
          <add-card :onSubmit="AddEntry" ></add-card>
        </div>
        <div v-if="entry.data" :key="entry.data.id" style="" class="mb-1 col-12"
            v-for="(entry, idx) in view.entries">
          <brisa-entry-card-horiz class="kanban-card" @delete="OnDelete(entry, idx)" :opacity="0.95" :select="selectEntry"
              :selected="sel_entry" :hide_desc="false" :entry="entry">
          </brisa-entry-card-horiz>
        </div>
        <br/>
      </div>
    </div>
    <br/>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import AddCard from './add-card.vue'
  export default {
    props: [
      'Brisa', 'view'
    ],
    components: {'add-card': AddCard},
    data: function() {
      return {
        group_id: this.view.group_id,
        showPopper: {},
        show_links: null,
        show_settings: false,
        sel_entry: null,
        sel_label: null,
        sel_model: null,
        user_labels: {data: {setting: []}},
        models: Brisa.group_models[this.view.group_id || null],
        search: {},
      }
    },
    methods: {
      SaveLabels: function() {
        if (this.group_id)
          Brisa.Group(this.group_id).setting('labels', this.user_labels.data.setting);
        else
          this.user_labels.update();
      },
      DeleteLabel: function(idx) {
        this.user_labels.data.setting.splice(idx,1);
        this.$forceUpdate();
        this.SaveLabels();
      },
      EditLabel: function(val, idx) {
        this.user_labels.data.setting[idx] = val;
        this.$forceUpdate();
        this.SaveLabels();
        console.log(val, idx, this.user_labels.data.setting);
      },
      AddLabel: function(new_label) {
        this.user_labels.data.setting.push(new_label);
        this.SaveLabels();
      },
      OnDelete: function(entry, idx) {
        entry.destroy().then(function(r) {
          var ent = this.view.entries.splice(idx, 1)[0];
          // Race: Live updates sometimes return and remove from array before.
          if (ent.data.id != r.data.id)
            this.view.entries.splice(idx, 0, ent);
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
        if (label.sel == 'more') {
          this.show_settings = !this.show_settings;
          return;
        }
        var tags = null;
        this.sel_label = idx;
        this.sel_model = -1;
        this.search.classes = null;
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
        BrisaAPI.Entry.search(this.search.tags, this.search.classes, this.group_id).then(function(r) {
          this.view.entries = r;
        }.bind(this));        
      },
      SelectModel: function(idx, label) {
        this.sel_model = this.sel_model == idx ? -1 : idx;
        if (this.sel_model != -1) {
          this.search.tags = null;
          this.sel_label = -1;
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
      AddEntry: function(title) {
        var entry = {group_id: this.group_id, title: title, description: '', tags: this.view.ctx.tags, classes: this.view.ctx.classes};
        Brisa.CreateEntry(entry).then(function(r) {
          //if (this.CheckEntry(this.view.entries, r.data.id) != -1) return;
          //this.view.entries.unshift(r);
          if (!BrisaAPI._api_path) this.view.entries.unshift(r);
        }.bind(this));
      },
      InitTags: function() {
        if (this.view) {
          this.new_entry_tags = this.view.ctx.tags.join(", ");
        } else {
          this.new_entry_tags = '';
        }
      },
      RTUpdate: function(entry, event) {
        console.log("RTUpdate", entry, event);
        if (event == 'add') {
          this.view.entries.unshift(entry)
        } else if (event == 'destroy') {
          if (entry.index) this.view.entries.splice(entry.index, 1);
        }
      },
    },
    beforeDestroy: function() {
      Brisa.messager.Unregister(this.view);
    },
    mounted: function() {
      Brisa.messager.Register(this.view, this.RTUpdate, this.RTUpdate, this.RTUpdate);
    },
    created: function() {
      Brisa.Labels(this.group_id).then(function(r) {
        this.user_labels = r;
        this.SelectLabel(0, this.user_labels.data.setting[0]);
      }.bind(this));
      return;
      if (this.group_id) {
        this.user_labels = {data: {setting: Brisa.GroupSetting(this.group_id, 'labels', ['Important'])}};
        this.SelectLabel(0, this.user_labels.data.setting[0]);
        this.InitTags();
      } else {
        this.Brisa.Labels(this.group_id).then(function(r) {
          this.user_labels = r;
          this.SelectLabel(0, this.user_labels.data.setting[0]);
          this.InitTags();
        }.bind(this));
      }
    },
  };

</script>
