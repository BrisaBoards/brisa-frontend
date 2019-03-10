<template>
  <div style="overflow-y: auto;">
  <brisa-entry-pop :hide_icons="true" :entry="view.parent" style="width: 100%; xoverflow-y: auto;">
  </brisa-entry-pop>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'view'
    ],
    data: function() {
      return {};
    },
    methods: {
    },
    computed: {
    },
    mounted: function() {
    },
  });

</script>
