<template>
  <div style="display: inline;">
    <slot></slot>
    <div :key="idx + lbl" style="display: inline-block" v-for="(lbl, idx) in labels">
    <slot :name="lbl.slot" v-if="lbl.slot"></slot>
    <div v-else @click="SelectLabel(idx)" :class="'noselect p-1 ' + (selected == idx ? hlight : 'text-light')"
        :style="'z-index: 0; overflow: hidden; position: relative; display: inline-block; border-radius: 5px; cursor: pointer; xpadding: 7px;' + add_style">
      <div :class="'bg-' + highlight" style="z-index: -1; filter: opacity(0.6); position: absolute; left: 0; right: 0; bottom: 0; top: 0" v-if="selected != idx"></div>
      <i :class="'fa ' + lbl.fa" v-if="lbl.fa"></i>
      <span v-else-if="lbl.label">{{lbl.label}}</span>
      <span v-else>{{lbl}}</span>
    </div>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'labels',
      'selected',
      'highlight',
      'add_style',
    ],
    data: function() {
      return {hlight: 'badge-info'};
    },
    methods: {
      SelectLabel: function(idx) {
        this.$emit('sel_change', idx, this.labels[idx]);
      },
    },
    created: function() {
      if (this.highlight) this.hlight = 'badge-' + this.highlight;
    },
  });

</script>
