<template>
  <div>
  <div class="d-flex" style="background-color: rgba(0,0,0,0.2); padding-left: 15px; padding-right: 7px; padding-top: 10px; padding-bottom: 5px;" xstyle="left: 15px; right: 7px; z-index: 200; position: absolute">
    <div class="xfloat-left">
      <slot name="left_bar"></slot>
    </div>
    
    <div class="flex-grow-1"></div>
    <div v-if="false" class="xfloat-left flex-grow-1 text-light" style="padding: 5px; xwhite-space: nowrap; xoverflow: hidden;">
      <div :key="l_view.id + '-' + idx" class="text-light" v-for="(l_view, idx) in Brisa.views" style="display: inline-block">
        &nbsp;&nbsp;<span class="text-info" v-if="idx != 0">/</span>&nbsp;&nbsp;

        <span v-if="l_view != Brisa.current_view" @click.prevent="SetView(l_view)"
            class="noselect text-light header-label-inactive">
          <i :class="'fa ' + Brisa.ui_classes[l_view.component].icon" v-if="Brisa.ui_classes[l_view.component]"></i>
          <i v-if="l_view.component == 'brisa-dashboard'" class="fa fa-th"></i>

          {{l_view.title}}
          <span v-if="idx != 0" @click.stop="CloseView(idx)" class="btn dash-close btn-outline-danger"><i class="fa fa-times"></i></span>
        </span>
        <span v-else class="noselect text-light header-label-active">
          <i :class="'fa ' + Brisa.ui_classes[l_view.component].icon" v-if="Brisa.ui_classes[l_view.component]"></i>
          <i v-if="l_view.component == 'brisa-dashboard'" class="fa fa-th"></i>
          {{l_view.title}}
          <span v-if="idx != 0" @click.stop="CloseView(idx)" class="btn dash-close btn-outline-danger"><i class="fa fa-times"></i></span>
        </span>
      </div>
    </div>

    <div style="white-space: nowrap;">
      <button v-if="false" @click="toggleFullScreen" class="btn btn-outline-primary text-light btn-round-sm" style="padding-left: 12px; padding-right: 12px;">
        <i class="fa fa-arrows-alt"></i>
      </button>
      <button @click="$emit('toggle_settings')" class="btn btn-outline-primary text-light btn-round-sm" style="padding-left: 12px; padding-right: 12px;">
        Settings &nbsp;<i class="fa fa-ellipsis-v"></i>
      </button>
      &nbsp;
      <slot name="right_bar"></slot>

      <button v-if="false" class="btn btn-round-sm btn-outline-primary text-light">
        {{Brisa.user.alias}} &nbsp;<i class="fa fa-user"></i>
      </button>
      <div v-if="false" class="rounded-circle bg-light" style="display: inline-block; height: 25px; width: 25px;">
        <img src="/favicon.ico" style="height: 100%; width: auto;">
      </div>
    </div>
  </div>

    <div v-if="Brisa.brisa_first_run" class="clearfix alert alert-success">
      <div class="float-right">
        <button @click="LoadDemoData" class="btn btn-primary btn-lg">Yes!</button>
        <button @click="Brisa.brisa_first_run = false;" class="btn btn-warning btn-lg">No, thanks.</button>
      </div>
        <h3>Say Hello To Brisa!</h3>
        <p>Hi! It looks like this is your first time using Brisa Boards.
        Would you like to import the tutorial cards to help you get started?</p>
        <p>At any time, you can clear your data by going to Account Reset in the settings in the upper right.</p>
    </div>

  </div>

</template>
<script>
  import Vue from 'vue'
  export default {
    data: function() {
      return {view: Brisa.current_view, Brisa: Brisa};
    },
    methods: {
      LoadDemoData: function() {
        Brisa.brisa_first_run = false;
        var s = document.createElement('script');
        s.src = './demo-data.js';
        document.body.appendChild(s);
      },
      CloseView: function(idx) {
        this.Brisa.CloseView(idx);
      },
      SetView: function(view) {
        this.Brisa.current_view = view;
      },
      toggleFullScreen: function() {
        if (document.webkitFullscreenElement) {
          document.webkitExitFullscreen();
        } else {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
    },
  };

</script>
