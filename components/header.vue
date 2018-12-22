<template>
  <div>
  <div class="d-flex" style="background-color: rgba(0,0,0,0.2); " xstyle="left: 15px; right: 7px; z-index: 200; position: absolute">
    <div class="xfloat-left">
      <slot name="left_bar"></slot>
    </div>
    
    <div class="flex-grow-1"></div>

    <div class="m-2" style="white-space: nowrap;">
      <button v-if="false" @click="toggleFullScreen" class="btn btn-outline-primary text-light btn-round-sm" style="padding-left: 12px; padding-right: 12px;">
        <i class="fa fa-arrows-alt"></i>
      </button>
      <button @click="$emit('toggle_settings')" class="btn btn-outline-primary text-light btn-round-sm" style="padding-left: 12px; padding-right: 12px;">
        <i class="fa fa-ellipsis-v"></i>
      </button>
      &nbsp;
      <slot name="right_bar"></slot>

      <div v-if="false" class="rounded-circle bg-light" style="display: inline-block; height: 25px; width: 25px;">
        <img src="/favicon.ico" style="height: 100%; width: auto;">
      </div>
    </div>
  </div>

    <div v-if="Brisa.brisa_first_run" class="clearfix text-dark p-3 pl-5" style="background-color: rgba(255,255,255,1); border-radius: 0 0 20px 20px;">
      <div class="float-right" style="text-align: right;">
      </div>
        <h2>Welcome To Brisa!</h2>
        <p style="font-size: 1.2em">Hi! It looks like this is your first time using the Brisa Boards Demo.
        Would you like to import the tutorial cards to help you get started?</p>
        <p>At any time, you can clear your data by going to Account Reset in the settings in the upper right.
          The data in this demo is stored in your browser, not on Brisa servers.</p>
        <button @click="LoadDemo('./demo-pfw.json')" class="btn btn-primary btn-lg mb-1 xw-100">Yes, load the demo cards!</button>
        <button v-if="false" @click="LoadDemoData" class="btn btn-primary btn-lg mb-1 xw-100">Yes, load the demo cards!</button>
        <button @click="Brisa.brisa_first_run = false;" class="btn btn-secondary xw-100 btn-lg">No, I'll try from scratch.</button>
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
      LoadDemo: function(path) {
        $.get(path).then(function(r) {
          console.log("Load", r);
          for (var i=r.groups.length - 1; i>= 0; i--) {
            BrisaAPI._brisa_idb.raw_create('groups', r.groups[i]);
          }
          for (var i in r.models) {
            BrisaAPI._brisa_idb.raw_create('models', r.models[i]);
          }
          for (var i=r.entries.length - 1; i>= 0; i--) {
            var ent = r.entries[i]
            BrisaAPI._brisa_idb.raw_create('entries', ent);
            if (ent.group_id == null && ent.tags.indexOf('Important') != -1) {
              Brisa.current_view.entries.push(new BrisaAPI.Entry(ent));
            }
          }
          Brisa.Login({alias: 'Demo', id: 1, logged_in: true}, 'asdf');
          Brisa.brisa_first_run = false;
        }.bind(this));
      },
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
