<template>
  <div ref="main" class="" class="d-flex xjustify-content-center"
      :style="'height: 100%; xbackground-color: rgba(0,0,0,0.2); padding: 0px; width: 100%; xoverflow: scroll; overflow-x: scroll; position: relative;'">
    <div style="padding-bottom: 2px;"></div>

    <table class="table table-striped table-hover sheet-table" style="width: auto; background-color: rgba(255,255,255,0.93)">
      <thead class="xthead-light" style="font-weight: normal">
        <tr v-if="models.length > 0">
          <th colspan="3"></th>
          <th style="text-align: center;" :colspan="model_dict[model].config().fields.length" v-for="model in models">
            <div class="sheet-cell-cont" style="width: 200px;">{{model_dict[model].title()}}</div>
            
          </th>
        </tr>
        <tr>
        <th style="width: 50px;"></th>
        <th style="width: 50px;">
          <div class="sheet-cell-cont" style="width: 200px;">Title</div>
        </th>
        <th style="width: 100px">
          <div class="sheet-cell-cont" style="width: 200px;">Description</div>
        </th>
        <template v-for="(model,idx) in models">
          <th v-for="(field,idx) in (model_dict[model].config() || {fields: []}).fields">
            <div class="sheet-cell-cont" style="width: 200px;">{{field.title}}</div>
          </th>
        </template>
        </tr>
      </thead>

      <draggable element="tbody" @end="UpdateOrder" v-model="entries"
        :options="{handle: '.sheet-handle'}">
        <tr :key="entry + '_' + idx"
          v-if="entry_dict[entry] != undefined && entry_dict[entry].data.id != pid" v-for="(entry, idx) in entries"
          style="padding: 0px; margin: 0px;">
          <td style="height: 100%;">
            <div class="xsheet-cell-cont" style="padding: 3px; height: 100%;">
              <span class="sheet-handle"><span class="fa fa-arrows-alt-v" style="cursor: pointer;"></span></span>
              &nbsp;
              <button @click="onToggle(idx)"
                  :class="'btn btn-sheet ' + (select_idx == idx ? 'btn-primary' : 'btn-outline-primary')"
                  style="height: 100%; xborder-radius: 50px; xpadding: 3px;">
                &nbsp;{{idx+1}}&nbsp;
              </button>
              <brisa-popup
                  :key="idx"
                  v-if="select_idx == idx"
                  :show="true"
                  wrap_style="cursor: default; width: 98vw; padding-left: 10px; padding-right: 10px;"
                  >
                <brisa-entry-pop @delete="OnDelete(entry_dict[entry], idx)" v-if="selected[idx]" slot="popup" :entry="entry_dict[entry]" @on-close="onToggle(idx)"></brisa-entry-pop>
        
                <slot name="title">
                </slot>
              </brisa-popup>  
            </div>
          </td>
          <td style="height: 100%;">
            <div v-if="!open_cells[idx + '_title']" @click="$set(open_cells, idx + '_title', true)" style="width: 200px">
              <div class="d-flex sheet-cell-cont" style="max-width: 100%;">
                <div class="flex-grow-1 xsheet-cell-cont">
                  {{entry_dict[entry].title()}}
                </div>
                <div class="">
                  <button v-for="uit in Brisa.ui_types" @touchstart.stop @mousedown.stop @click="Brisa.OpenView(entry_dict[entry], uit)" v-if="entry_dict[entry].metadata()[uit.cls]" class="btn btn-round-xs btn-outline-primary mr-1 xtext-primary"><i :class="'fa ' + uit.icon"></i></button>
                </div>
              </div>
            </div>
            <brisa-inline-editor v-else :isOpen="true" @done-editing="$set(open_cells, idx + '_title', false)" name="Title" :updated="UpdatedAttr" :update_ref="[entry_dict[entry], 'title']" val_type="string" :value="entry_dict[entry].title()"></brisa-inline-editor>
          </td>
          <td style="height: 100%;">
            <div v-if="!open_cells[idx + '_desc']" @click="$set(open_cells, idx + '_desc', true)" class="sheet-cell-cont" style="width: 200px">
              {{entry_dict[entry].description()}}
            </div>
            <brisa-inline-editor v-else :isOpen="true" @done-editing="$set(open_cells, idx + '_desc', false)" name="Description" :updated="UpdatedAttr" val_type="text" :update_ref="[entry_dict[entry], 'description']" :value="entry_dict[entry].description()"></brisa-inline-editor>
          </td>
          <template v-for="(model,m_idx) in models">
            <td v-if="entry_dict[entry].classes().indexOf(model) == -1" style="height: 100%; text-align: center" :colspan="(model_dict[model].config() || {fields: []}).fields.length">
              <div @click="AddModel(entry_dict[entry], model)" class="sheet-cell-cont text-info">
                Add
              </div>
            </td>
            <td v-else v-for="(field,f_idx) in (model_dict[model].config() || {fields: []}).fields" style="height: 100%">
              <div v-if="!open_cells[idx + ':' + model + ':' + field.id]"
                  @click="$set(open_cells, idx + ':' + model + ':' + field.id, true)" class="sheet-cell-cont" style="width: 200px">
                {{((entry_dict[entry].metadata()[model] || {})[field.id]) || ''}}
              </div>
              <brisa-inline-editor v-else :isOpen="true" @done-editing="$set(open_cells, idx + ':' + model + ':' + field.id, false)" name="field.name" :updated="UpdatedAttr"
                :val_type="field.field_type" :update_ref="{ent: entry_dict[entry], cls: model, field: field.id}" :value="(entry_dict[entry].metadata()[model] || {})[field.id]">
              </brisa-inline-editor>
            </td>
          </template>
        </tr>
        <tr slot="footer">
          <td></td>
          <td colspan="0">
            <div class="text-primary" @click="new_entry = ''; add_entry = true" style="cursor: pointer; padding: 0px; width: 100%;">
              <div v-if="!add_entry" style="padding: 5px;"><i class="fa fa-plus"></i> Add</div>
              <input class="form-control form-control-sm" autofocus="true" v-model="new_entry" v-else="add_entry" placeholder="New"
                xstyle="padding: 5px;" @keydown.esc="add_entry=false" @keypress.enter="AddEntry">
            </div>
          </td>
        </tr>
      </draggable>
    </table>
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
        selected_entry: null,
        entries: [],
        entry_dict: {},
        models: [],
        model_dict: {},
        select_idx: null,
        selected: {},
        add_entry: false,
        new_entry: '',
        open_cells: {},
      };
    },
    methods: {
      OnDelete: function(entry, idx) {
        entry.destroy().then(function(r) {
          delete this.entry_dict[entry];
          this.entries.splice(idx, 1);
        }.bind(this));
      },
      onSelect: function(entry) {
        this.selected_entry = this.selected_entry == entry.data.id ? null : entry.data.id;
      },
      AddModel: function(entry, model) {
        console.log("Add Model", entry, model);
        entry.classes().push(model);
        entry.metadata()[model] = {};
      },
      UpdatedAttr: function(new_value, up_ref) {
        if (up_ref.cls) {
          if (up_ref.ent.data.metadata[up_ref.cls] == undefined) {
            up_ref.ent.data.metadata[up_ref.cls] = {};
            up_ref.ent.data.metadata[up_ref.cls][up_ref.field] = new_value;
            up_ref.ent.update();
          } else {
            up_ref.ent.data.metadata[up_ref.cls][up_ref.field] = new_value;
            up_ref.ent.update();
          }
        } else {
          var ent = up_ref[0];
          ent.data[up_ref[1]] = new_value;
          up_ref[0].update();
        }
      },
      onToggle: function(v) {
        if (this.select_idx == v) {
          this.selected[this.select_idx] = false;
          this.select_idx = null;
        } else {
          this.selected[this.select_idx] = false;
          this.select_idx = v;
          Vue.set(this.selected, v, true);
        }
      },
      AddEntry: function() {
        var copts = {title: this.new_entry, tags: this.view.ctx.tags || [], classes: this.view.ctx.classes || []};
        BrisaAPI.Entry.create(copts).then(function(r) {
          this.new_entry = '';
          this.view.entries.push(r);
          this.entry_dict[r.data.id] = r;
          this.entries.push(r.data.id);
        }.bind(this));
      },
      UpdateOrder: function() {
        this.entry.metadata()._sheet.entries = this.entries;
        this.entry.update();
      },
    },
    created: function() {
      var md = this.entry.metadata();
      if (!md._sheet.entries) md._sheet.entries = [];
      if (!md._sheet.models) md._sheet.models = [];
      this.entries = md._sheet.entries;
      //this.models = md._sheet.models;
      for (var i in md._sheet.classes) {
        var cls = md._sheet.classes[i];
        if (!cls.match(/^_/) && this.models.indexOf(cls) == -1) {
          var model = Brisa.model(cls);
          if (model) {
            this.model_dict[cls] = model;
            this.models.push(cls);
          }
        }
      }
      for (var i in this.view.entries) {
        this.selected[i] = false;
        var ent = this.view.entries[i];
        this.entry_dict[ent.data.id] = ent;
        if (this.entries.indexOf(ent.data.id) == -1)
          this.entries.push(ent.data.id);
        for (var m in ent.classes()) {
          var m = ent.classes()[m];
          if (m.match(/^_/)) continue;
          if (this.models.indexOf(m) == -1) {
            this.models.push(m);
          }
          if (!this.model_dict[m]) {
            this.model_dict[m] = Brisa.model(m);
          }
        }
      }
      console.log("Models", this.models, this.model_dict);
    },
  });

</script>
