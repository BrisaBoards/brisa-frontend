<template>
  <div>
    <slot></slot>

    <div ref="popup" v-if="show" style="z-index: 100; position: absolute;" :style="width_s + (show ? '' : 'display: none;') + wrap_style">
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
      return {width: 400 };
    },
    methods: {
      setWidth: function(show_val) {
        this.$nextTick(function() {
          if (show_val) {
            var cont = Brisa.content;
            var offset = cont ? $(cont).offset().left : 0;
            this.width = window.innerWidth - offset - 18;
            $(this.$refs.popup).offset({left: offset });
          }
        }.bind(this));
      }
    },
    computed: {
      width_s: function() {
        return 'width: ' + this.width + 'px;';
      }
    },
    mounted: function() {
      this.setWidth(true);
    },
    watch: {
      show: function(show_val) {
        this.setWidth(show_val);
      },
    },
  });

</script>
