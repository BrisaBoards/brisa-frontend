<template>
  <div>
  <div class="d-flex" style="background-color: rgba(0,0,0,0.2); " xstyle="left: 15px; right: 7px; z-index: 200; position: absolute">
    <div class="xfloat-left">
      <slot name="left_bar"></slot>
    </div>
    
    <div class="flex-grow-1"></div>

    <div class="m-2" style="white-space: nowrap;">
      <div style="display: inline-block; position: relative;">
      <button @click="show_notify = !show_notify" style="position: relative; padding-left: 12px; padding-right: 12px;" class="btn btn-outline-primary btn-round-sm text-light nofocus">
        <i class="fa fa-user"></i>
        <div v-if="Brisa.ws_connected == false" class="text-light pl-1 pr-1" :class="Brisa.ws_connected ? 'bg-success' : 'bg-danger'"
            style="border-radius: 10px; padding: 2px; position: absolute; left: 0; right: 0px; bottom: 0px; height: 4px;">
        </div>
        <div v-if="Brisa.notify.unread_count > 0" class="bg-info text-light pl-1 pr-1" style="text-align: center; font-weight: bold; font-size: 80%; border-radius: 10px; padding: 2px; position: absolute; right: 0px; top: 0px;">
          {{ Brisa.notify.unread_count }}
        </div>
      </button>
      <div v-show="show_notify" class="xrounded border border-primary bg-light text-dark" style="z-index: 10; overflow: hidden; white-space: normal; width: 350px; max-width: 100vw; border-radius: 5px; position: absolute; right: 0;">
        <div v-if="Brisa.ws_connected == false" class="text-center border rounded border-danger text-danger p-1 m-1">
          <strong>Unable to connect to Brisa.</strong>
        </div>
        <div class="p-1 clearfix">
          <div class="float-right">
          <button key="logout" @click="show_notify = false; Brisa.logout()" class="btn xbtn-sm btn-outline-primary p-1 pl-2 pr-2"><i class="fa fa-sign-out-alt"></i></button>
          <button @click="$emit('toggle_settings'); show_notify = false;" class="btn xbtn-sm btn-outline-primary p-1 pl-2 pr-2"><i class="fa fa-sliders-h"></i></button>
          </div>
          <small>Hello, {{Brisa.user.alias}}!</small>
        </div>
        <div style="max-height: 75vh; overflow-y: auto;">
        <div class="w-100 card-header pt-4 pb-4" key="no-notify" v-if="Brisa.notify.messages.length == 0">
          No notifications.
        </div>
        <brisa-notification @selected="show_notify = false;" :key="note.data.id" :note="note" v-for="note,idx in Brisa.notify.messages"></brisa-notification>
        </div>
      </div>
      </div>
      &nbsp;
      <slot name="right_bar"></slot>

      <div v-if="false" class="rounded-circle bg-light" style="display: inline-block; height: 25px; width: 25px;">
        <img src="/favicon.ico" style="height: 100%; width: auto;">
      </div>
    </div>
  </div>
  <div v-if="Brisa.update.updated" style="width: 500px; max-width: 100%; position: absolute; left: 50%; transform: translateX(-50%);" class="text-light text-center">
    <div class="p-3 m-2" style="border-radius: 10px; font-size: 115%; background-color: rgba(0,0,0,0.6); display: inline-block; text-align: center;">
      <strong>Brisa Updated!</strong><br/>
      <small>{{Brisa.update.message}}</small>
      <small v-if="Brisa.update.required"><br/>This update is required. Please save your changes and reload as soon as possible.</small>
      <div class="mt-2">
      <button @click="DoReload" class="btn btn-sm btn-primary">Reload Now</button>
      <button @click="Brisa.update.updated = false" v-if="!Brisa.update.required" class="btn btn-sm ml-3 btn-warning">Dismiss</button>
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
      return {view: Brisa.current_view, Brisa: Brisa, show_notify: false};
    },
    methods: {
      DoReload: function() {
        location.reload();
      },
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
            ent.assignees = [];
            ent.watchers = [];
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
