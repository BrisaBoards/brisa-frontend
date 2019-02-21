<template>
  <div style="height: 100%; width: 100%;">
  <slot name="background"></slot>
  <div style="flex: 1; height: 100%; align-items: stretch; display: flex; flex-direction: row">
    <div style="z-index: 2; box-shadow: 2px 2px 10px #888; xoverflow: hidden;" :style="'width: ' + (show_sidebar ? 200 : 80) + 'px'" :xstyle="'flex: 0 0 ' + (show_sidebar ? 250 : 80) + 'px'">
      <slot name="sidebar"></slot>
    </div>
    <div style="display: flex; flex: 1; flex-direction: column;">
      <div style="z-index: 2;">
        <slot name="header"></slot>
      </div>
      <div ref="content" style="z-index: 1; flex: 1; position: relative; overflow: auto; display: flex;">
        <slot name="content"></slot>
      </div>
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
