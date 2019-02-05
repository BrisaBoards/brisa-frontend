<template>
  <div style="height: 100%; width: 100%;">
  <slot name="background"></slot>

  <div style="position:absolute; overflow-y: auto; top:0; bottom: 0px; overflow-x: hidden;" :style="'width: ' + (show_sidebar ? '90%': '0px')">
    <slot name="sidebar"></slot>
  </div>
  <div style="display: flex; flex: 1; flex-direction: column; height: 100%;">
    <div>
      <slot name="header"></slot>
    </div>
    <div ref="content" style="position: relative; flex: 0; flex-grow: 1; display: flex; overflow: auto;">
      <slot name="content"></slot>
    </div>
  </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: ['show_sidebar'],
    data: function() {
      return {
      };
    },
    mounted: function() {
      Brisa.content = this.$refs.content;
    },
  });
</script>
