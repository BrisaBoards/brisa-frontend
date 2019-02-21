<template>
  <brisa-entry-pop :hide_icons="true" :entry="view.parent">
  </brisa-entry-pop>

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
