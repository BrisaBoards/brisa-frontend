<template>
  <brisa-card :color="color" :opacity.sync="cur_opacity" :xstyle="'margin-top: ' + (margin || '10px')">
    <div @click="onClick" style="padding: 12px; cursor: pointer;" @mouseover="hovering = true" @mouseout="hovering = false" :class="wrapper || 'xcard-body'">
      <brisa-popup
          :show="is_selected"
          wrap_style="cursor: default; width: 98vw; padding-left: 10px; padding-right: 10px;">
        <brisa-entry-pop @delete="$emit('delete')" v-if="selected" slot="popup" :entry="entry" @on-close="onClick"></brisa-entry-pop>

        <div class="d-flex" style="cursor: pointer;">
          <slot name="title">
            <div class="flex-grow-1 noselect" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
              <span style="font-size: 115%;" class="card-title text-info">{{entry.data.title}}</span>
              &nbsp; {{entry.description()}}
            </div>
          </slot>
          <div style="white-space: nowrap;">
            <button v-for="uit in Brisa.ui_types" @click.stop="Brisa.OpenView(entry, uit)" v-if="entry.metadata()[uit.cls]" class="btn btn-round-xs btn-outline-primary mr-1"><i :class="'fa ' + uit.icon"></i></button>
          </div>
        </div>
      </brisa-popup>
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
      cur_opacity: function() {
        if (this.hovering || this.is_selected)
          return 0.95;
        return this.opacity;
      },
    },
  });

</script>
