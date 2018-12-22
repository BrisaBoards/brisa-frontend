<template>
  <div ref="main" class="" :style="'height: 100%; width: 100%; background-color: ' + this.bg_color + '; rgba(0,0,0,0.2); overflow: auto; position: absolute;'">
    <add-card :onSubmit="AddEntry" style="height: 45px; z-index: 1000; position: absolute; left: 15px; top: 15px;"></add-card>
    <div v-if="paper" :style="'position: absolute; background-image: url(' + this.paper + '); opacity: 0.7; width: 100%; top: 0px; height: 100%; right: 0px;'"></div>
    <div :key="entry.data.id" :data-entryid="idx" :ref="'card' + entry.data.id" @mousedown="StartMove" @touchstart="StartMove"
        class="mb-1 mr-2" v-if="entry.data.id != pid" v-for="(entry, idx) in view.entries"
        :style="EntryPos(entry.data.id) + ' width: 200px; position: absolute;'">
      <brisa-entry-card @delete="OnDelete(entry, idx)" :color.sync="card_bg" :entry="entry" :select="onSelect" :selected.sync="selected_entry">
      </brisa-entry-card>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import AddCard from './add-card.vue'
  export default Vue.extend({
    props: [
      'Brisa', 'view'
    ],
    components: {'add-card': AddCard},
    data: function() {
      var p = this.view.parent;
      return {
        expand_add: false,
        pid: p.data.id,
        entry: p,
        add_group: false, new_group: '',
        show_add: {},
        entry_dict: {},
        selected_entry: null,
        win_height: Brisa.settings.height,
        win_width: window.innerWidth,
        move: {},
      };
    },
    methods: {
      AddEntry: function(title) {
        var data = {group_id: this.view.group_id, title: title, description: '', tags: this.view.ctx.tags, classes: this.view.ctx.classes};

        Brisa.CreateEntry(data).then(function(r) {
          for (var i in this.view.entries) { if (this.view.entries[i].data.id == r.data.id) return; }
          this.view.entries.push(r);
        }.bind(this));
      },
      OnDelete: function(entry, idx) {
        entry.destroy().then(function(r) {
          if (this.view.entries[idx].data.id == entry.data.id)
            this.view.entries.splice(idx, 1);
        }.bind(this));
      },
      onSelect: function(entry, ignore_move) {
        if (this.move && !ignore_move) return;
        this.selected_entry = this.selected_entry == entry.data.id ? null : entry.data.id;
      },
      StartMove: function(e) {
        if (this.selected_entry != null) return;
        e.preventDefault();
        var p = e.target || e.srcElement;
        var entry;
        while (p.dataset.entryid == undefined)
          p = p.parentElement;
        var offset = e.clientX !== undefined ? e : e.touches[0];
        entry = this.view.entries[p.dataset.entryid];
        this.move = {grid: this.entry.metadata().style.grid || 10, entry: entry, ref: p, initX: p.style.left, initY: p.style.top, x: p.offsetLeft - offset.clientX, y: p.offsetTop - offset.clientY};
        document.addEventListener('touchmove', this.onMove);
        document.addEventListener('touchend', this.onMoveDone);
        document.addEventListener('mousemove', this.onMove);
        document.addEventListener('mouseup', this.onMoveDone);
      },
      onMove: function(event) {
        event.preventDefault();
        var offset = event.clientX !== undefined ? event : event.touches[0];
        var grid = this.move.grid;
        var new_x = offset.clientX + this.move.x;
        var new_y = offset.clientY + this.move.y;
        new_x = (new_x / grid).toFixed() * grid;
        new_y = (new_y / grid).toFixed() * grid;
        if (this.move.ref.style.left != new_x + 'px' || this.move.ref.style.top != new_y + 'px')
          this.move.did_move = true;
        this.move.ref.style.left = new_x + 'px';
        this.move.ref.style.top  = new_y + 'px';        
      },
      onMoveDone: function(e) {
        e.preventDefault();
        if (!this.move.did_move) { //(this.move.initX == this.move.ref.style.left && this.move.initY == this.move.ref.style.top) {
          //this.onSelect(this.move.entry, true);
          if (e.type == 'touchend') this.onSelect(this.move.entry, true);
          this.move = null;
        } else {
          this.SaveEntryPosition(this.move.entry, this.move.ref);
        }
        document.removeEventListener("touchmove", this.onMove);
        document.removeEventListener("touchend", this.onMoveDone);
        document.removeEventListener("mousemove", this.onMove);
        document.removeEventListener("mouseup", this.onMoveDone);
      },
      SaveEntryPosition: function(entry, ref) {
        var md = this.entry.metadata()._whiteboard;
        if (md.positions == undefined) md.positions = {};
        md.positions[entry.data.id] = { x: ref.style.left, y: ref.style.top};
        this.entry.update();
      },
      EntryPos: function(entry_id) {
        var md = this.entry.metadata()._whiteboard;
        if (md.positions && md.positions[entry_id]) {
          return "left: " + md.positions[entry_id].x + "; top: " + md.positions[entry_id].y + ";";
        } else {
          return "left: 55px; top: 55px;";
        }
      },
      RTUpdate: function(entry, event) {
        if (event == 'add') {
          for (var i in this.view.entries) { if (this.view.entries[i].data.id == entry.data.id) return; }
          this.view.entries.unshift(entry)
        } else if (event == 'destroy') {
          if (entry.index && this.view.entries[entry.index].data.id == entry.id) this.view.entries.splice(entry.index, 1);
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
      bg_color: function() {
        var md = this.entry.metadata();
        return 'rgba(' + md.style.color + ',' + md.style.opacity + ')';
      },
      paper: function() {
        var md = this.entry.metadata();
        if (md.style.paper) {
          return 'backgrounds/' + md.style.paper;
        } else {
          return null;
        }
      },
      card_bg: function() {
        var md = this.entry.metadata();
        return md.style.card_bg;
      },
    },
    created: function() {
      var md = this.entry.metadata();
      if (md.style == undefined) {
        md.style = {card_bg: '#fffffa', color: '0,0,0', opacity: 0.0, paper: '', grid: 10};
      }
    },
  });

</script>
