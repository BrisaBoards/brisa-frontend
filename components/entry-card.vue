<template>
  <brisa-card bg_class="bg-light" :color="highlight ? 'rgba(215,235,255,0.90)' : color" :opacity="opacity"
    :style="'margin-top: ' + (margin || '10px')">
    <div @click="onClick" style="cursor: pointer;" @mouseover="hovering = true" @mouseout="hovering = false"
        :class="wrapper || 'card-body pl-3 pt-3 pr-3 pb-1'">

      <brisa-popup
        :show.sync="is_selected"
        wrap_style="cursor: default; padding-left: 10px; padding-right: 10px;"
        >
        <brisa-entry-pop :api_ctx="api_ctx" @delete="$emit('delete')" v-if="selected" slot="popup" :entry="entry" @on-close="onClick">
        </brisa-entry-pop>

        <div style="cursor: pointer;">
          <div :style="!hovering ? 'color: #e0e0e0;' : ''"  :class="'float-right clearfix ' + (hovering ? 'text-primary' : 'disabled')">
            <span class="fa fa-2x fa-caret-down"></span>
          </div>
          <slot name="title">
            <div :style="highlight ? 'font-weight: bold;' : ''" class="card-title text-info noselect">{{entry.data.title}}</div>
          </slot>
        </div>
      </brisa-popup>

      <div v-if="!hide_desc" class="card-bodyx text-muted entry-section"
          style="position: relative; cursor: pointer; overflow: hidden;'"
          :style="full_desc ? '' : 'max-height: 75px'">
        <p class="" v-html="fmtText(entry.description())"></p>
      </div>
    <div>
      <div key="archived" class="p-1 text-light bg-warning" style="border-radius: 5px; opacity: 0.75; display: inline-block" v-if="entry.data.archived">
        <i class="fa fa-archive"></i>
      </div>
      <div key="completed" class="p-1 text-light bg-success" style="border-radius: 5px; opacity: 0.75; display: inline-block" v-if="entry.data.completed_at">
        <i class="fa fa-check"></i>
      </div>
      <div key="assigned" class="p-1 text-info" style="height: 100%; opacity: 0.75; display: inline-block" v-if="entry.data.assignees.indexOf(Brisa.user.uid) != -1">
        <i class="fa fa-circle"></i>
      </div>
      <div key="due" class="p-1" style="line-height: 0.8rem; font-size: 85%; opacity: 0.75; display: inline-block" v-if="entry.data.due_at">
        <small>Due<br/>{{new Date(entry.data.due_at).toLocaleDateString()}}</small>
      </div>
      <button v-for="uit in Brisa.ui_types" @mousedown.stop @touchstart.stop @click.stop="Brisa.OpenCtx(entry, uit.cls)"
          v-if="entry.metadata()[uit.cls]" class="btn btn-round-xs btn-outline-primary mt-2 ml-1 mb-2"><i :class="'fa ' + uit.icon"></i> {{uit.name}}</button>
      <div class="p-1 noselect text-primary xfloat-right" style="display: inline-block; opacity: 0.75" v-if="entry.comment_count() > 0">
        <i class="far fa-comments"></i> {{entry.comment_count()}}
      </div>
    </div>
    </div>
  </brisa-card>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'entry', 'selected', 'hide_desc', 'select', 'margin',  'wrapper',
      'color', 'opacity', 'api_ctx', 'highlight', 'full_desc'
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
