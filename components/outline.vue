<template>
  <div ref="outline-main" class="" style="display: flex; flex-direction: column; height: 100%; width: 100%; position: absolute; vertical-align: top;">
    <div class="bg-light p-1 pl-3 clearfix">
      <div class="float-right">
        {{orphans.length}} orphans
      </div>
      <button @click="card_view = 'compact'" class="btn btn-sm" :class="card_view == 'compact' ? 'btn-primary' : 'btn-outline-primary'">Compact</button>
      <button @click="card_view = 'normal'" class="btn btn-sm" :class="card_view == 'normal' ? 'btn-primary' : 'btn-outline-primary'">Normal</button>
      <button @click="card_view = 'full'" class="btn btn-sm" :class="card_view == 'full' ? 'btn-primary' : 'btn-outline-primary'">Full</button>
      <!-- / Filters / Etc -->
    </div>
    <div class="p-2" style="flex-grow: 1; background-color: rgba(255,255,255,0.0); height: 100%; overflow-y: auto;">
      <brisa-outline-section @select="onSelect" @modified="onModify"
          :section="outline.root" :parent="view.parent" :view="view"
          :entries="filter_dict" :level="0" :sel_entry="sel_entry"
          :card_view="card_view"
      >
      </brisa-outline-section>
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
      var ent_dict = {};
      return {
        show_filters: false,
        card_view: 'normal',
        my_view: this.view,
        pid: p.data.id,
        entry: p,
        entry_dict: ent_dict,
        filter_dict: ent_dict,
        sel_entry: null,
        orphans: [],
      };
    },
    methods: {
      onSelect: function(entry) {
        console.log("Select!", entry.data.id);
        var idx = entry.data.id;
        var old_entry = this.sel_entry;
        this.sel_entry = this.sel_entry == idx ? null : idx;
      },
      onModify: function(val) {
        if (val == undefined) return;
        if (val.add_section) {
          val.section.sections.push(val.add_section);
          this.outline.sections[val.add_section.uid] = [];
          //this.entry.partial(['set', 'metadata._outline', this.outline]);
        } else if (val.add_entry) {
          this.outline.sections[val.add_entry].push(val.entry.data.id);
          this.entry_dict[val.entry.data.id] = val.entry;
        } else if (val.order) {
          //console.log("Section changed", val);
          this.outline.sections[val.order] = val.section;
          if (!val.end) return;
        } else if (val.generic) {
          console.log("Generic update", val);
        } else {
          console.log("Unknown update", val);
          return;
        }
        this.entry.update();
        //this.view.parent = this.entry;
      },
      RTUpdate: function(entry, event) {
        console.log("Outline Update", entry.data.id, event);
        if ((entry.data || {}).id == this.view.parent.data.id) {
          console.log("Parent updated", entry);
          this.view.parent = entry;
          this.entry = this.view.parent;
          return;
        } else if (entry) {
          //this.$set(this.filter_dict, entry.data.id, Brisa.filter.filter_one(entry, this.filter));
          this.entry_dict[entry.data.id] = entry;
        }
        if (event == 'add') {
          var to_group = entry.metadata()._kanbans[this.pid].group;
          this.view.entries.unshift(entry)
          this.entry_dict[entry.data.id] = entry;
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
      outline: function() {
        return this.entry.data.metadata._outline;
      }
    },
    created: function() {
      let md = this.entry.data.metadata;
      let outline = md._outline;

      if (outline.root === undefined) {
        outline.root = {title: null, sections: [], uid: null};
        outline.sections = {};
      }

      for (var i of this.view.entries) {
        this.entry_dict[i.data.id] = i;

        let is_orphan = true;
        for (let k in outline.sections) {
          let sec = outline.sections[k];
          if (sec.indexOf(i.data.id) != -1) is_orphan = false;
        }
        if (is_orphan) this.orphans.push(i);
      }
    },
  });

</script>
