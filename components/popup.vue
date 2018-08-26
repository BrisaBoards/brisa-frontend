<template>
  <div>
    <slot></slot>

    <div ref="popup" :style="' z-index: 100; position: absolute; ' + (show ? '' : 'display: none;') + wrap_style">
      <slot name="popup"></slot>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'show', 'wrap_style'
    ],
    data: function() {
      return {width: 400};
    },
    watch: {
      show: function(show_val) {
        this.$nextTick(function() {
          if (show_val) {
            this.width = window.innerWidth;
            $(this.$refs.popup).offset({left: 0});
          }
        }.bind(this));
      },
    },
  });

</script>
