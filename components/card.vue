<template>
  <div class="card bg-transparent" style="position: relative;">
    <div :class="bg_class" :style="bg_color + 'xborder-radius: 3px; position: absolute; top: 0;bottom: 0; width: 100%; ' + opacity_str">
      <slot name="background"></slot>
    </div>
    <div style="position: relative;">
    <slot></slot>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: ['bg_class', 'opacity', 'color'],
    data: function() {
      var op = this.opacity != undefined ? this.opacity: '0.95';
      return {
        opacity_str: "filter: opacity(" + op + ");",
        xbg_color: "background-color: " + (this.color || '#ffffff') + "; ",
      };
    },
    computed: {
      bg_color: function() {
        if (this.color === null) return '';
        return 'background-color: ' + (this.color || '#ffffff') + ' !important; ';
      },
    },
    watch: {
      opacity: function() {
        this.opacity_str = "filter: opacity(" + this.opacity + ")";
      },
    }
  });

</script>
