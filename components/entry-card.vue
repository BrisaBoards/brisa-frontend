<template>
  <brisa-card :color="color" :opacity="opacity" :style="'margin-top: ' + (margin || '10px')">
    <div @click="onClick" style="cursor: pointer;" @mouseover="hovering = true" @mouseout="hovering = false"
        :class="wrapper || 'card-body pl-3 pt-3 pr-3 pb-1'">

      <brisa-popup
        :show.sync="is_selected"
        wrap_style="cursor: default; width: 98vw; padding-left: 10px; padding-right: 10px;"
        >
        <brisa-entry-pop @delete="$emit('delete')" v-if="selected" slot="popup" :entry="entry" @on-close="onClick"></brisa-entry-pop>

        <div style="cursor: pointer;">
          <div :style="!hovering ? 'color: #e0e0e0;' : ''"  :class="'float-right clearfix ' + (hovering ? 'text-primary' : 'disabled')">
            <span class="fa fa-2x fa-caret-down"></span>
          </div>
          <slot name="title">
            <div class="card-title text-info noselect" >{{entry.data.title}}</div>
          </slot>
        </div>
      </brisa-popup>

      <div v-if="!hide_desc" class="card-bodyx text-muted entry-section" style="position: relative; max-height: 75px; cursor: pointer; overflow: hidden;'">
        <p class="" v-html="fmtText(entry.description())"></p>
      </div>
    </div>
    <div>
      <button v-for="uit in Brisa.ui_types" @mousedown.stop @touchstart.stop @click.stop="Brisa.OpenView(entry, uit)"
          v-if="entry.metadata()[uit.cls]" class="btn btn-round-xs btn-outline-primary ml-2 mb-2"><i :class="'fa ' + uit.icon"></i> {{uit.name}}</button>
    </div>
  </brisa-card>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'entry', 'selected', 'hide_desc', 'select', 'margin',  'wrapper',
      'color', 'opacity'
    ],
    data: function() {
      return {Brisa: Brisa, hovering: false};
    },
    methods: {
      fmtText: function(str) {
        return Brisa.formatText(str);
      },
      onClick: function() {
        this.select(this.entry);
      },
      noop: function() { },
    },
    computed: {
      is_selected: function() {
        return this.selected == this.entry.data.id;
      },
    },
  });

</script>
