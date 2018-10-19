<template>
  <div class="input-group" style="width: auto; height: 45px;">
    <button @click="ToggleInput" class="btn btn-round btn-primary input-group-prepend" :style="expand_add ? 'border-radius: 20px 0 0 20px;' : ''"
        style="margin: 0; height: 100%;">
      <i class="fa fa-plus"></i>
    </button>
    <input @keydown.enter="Submit" @keydown.esc="ToggleInput" v-if="expand_add" ref="title" class="form-control bg-light text-dark" style="padding: 5px; margin: 0; height: 100%; display: inline-block; xborder-radius: 0 8px 8px 0; flex: none; width: 225px;">
    <button @click="Submit" v-if="expand_add" class="btn p-2 btn-secondary text-primary rounded-0" style="width: 35px; height: 100%;"><i class="fa fa-check"></i></button>
    <button @click="ToggleInput" v-if="expand_add" class="btn p-2 btn-secondary text-danger" style="border-radius: 0 20px 20px 0; width: 35px; height: 100%;"><i class="fa fa-times"></i></button>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'Brisa', 'onSubmit'
    ],
    data: function() {
      return {expand_add: false};
    },
    methods: {
      ToggleInput: function() {
        this.expand_add = !this.expand_add;
        if (this.expand_add) this.$nextTick(() => { this.$refs.title.focus() });
      },
      Submit: function() {
        this.expand_add = false;
        this.onSubmit(this.$refs.title.value);
      }
    },
  });
</script>
