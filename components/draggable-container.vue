<template>
  <div :data-cont-id="cont_id">
  <slot></slot>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: ['cont_id'],
    data: function() {
      return {
      };
    },
  });
</script>
