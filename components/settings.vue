<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
    ],
    data: function() {
      return {sel_tab: 'acct', theme: null,
        Brisa: Brisa, BrisaAPI: BrisaAPI,
        drag: false,
        current_pass: '', new_pass1: '', new_pass2: '',
        pass_changed: false, pass_error: null,
        new_label: '',
        labels: [],
        label_set: {data:[]},
        del_data: false,
      };
    },
    methods: {
      ChangePass: function() {
        if (this.new_pass1 != this.new_pass2) {
          this.pass_error = 'New passwords do not match.';
        } else {
          BrisaAPI.User.change_pass(this.current_pass, this.new_pass1).then(function(r) {
            this.pass_changed = true;
            this.current_pass = '';
            this.new_pass1 = '';
            this.new_pass2 = '';
            this.pass_error = null;
          }.bind(this)).catch(function(err) {
            this.pass_error = 'Error updating password: ' + (err.json || {}).error;
          }.bind(this));
        }
      },
      AddLabel: function() {
        this.label_set.data.setting.push(this.new_label);
        this.label_set.update().then(function(r) {
          this.new_label = '';
        }.bind(this));
      },
      RemLabel: function(idx) {
        this.label_set.data.setting.splice(idx, 1);
        this.label_set.update()
      },
      UpdateLabels: function() { this.label_set.update(); },
      SaveTheme: function() { Brisa.theme.update(); },
      SaveWB: function() {
        var wb = this.Brisa.current_view.parent;
        wb.metadata().style = {
          color: this.$refs.wb_color.value,
          opacity: this.$refs.wb_opacity.value,
          paper: this.$refs.wb_paper.value,
          grid: this.$refs.wb_grid.value,
          card_bg: this.$refs.wb_card_bg.value,
        };
        wb.update();
      },
      HandleAccountReset: function() {
        idb.delete(BrisaAPI._brisa_idb.db_name);
        setTimeout(() => { location.reload() }, 1000);
      },
    },
    created: function() {
      Brisa.Labels().then(function(r) { this.label_set = r; this.labels = r.data.setting }.bind(this));
      this.theme = Brisa.theme;
    },
  });
</script>
<template>
    <brisa-card style="width: 100%;" :opacity="0.95">
      <div class="card-body m-3" style="padding: 10px;">
        <div>
          <button @click="$emit('close')" class="float-right btn btn-lg btn-link text-info"><i class="fa fa-times"></i></button>
        <h4 class="card-title">Settings</h4>
        </div>
        <div class="nav nav-tabs">
          <li class="nav-item">
            <a @click.prevent="sel_tab = Brisa.current_view.component" :class="'nav-link' + (sel_tab == Brisa.current_view.component ? ' active' : '')" href="#">
              {{Brisa.current_view.title}}
            </a>
          </li>
          <li class="nav-item">
            <a @click.prevent="sel_tab = 'acct'" :class="'nav-link' + (sel_tab == 'acct' ? ' active' : '')" href="#">Account</a>
          </li>
          <li class="nav-item">
            <a @click.prevent="sel_tab = 'labels'" :class="'nav-link' + (sel_tab == 'labels' ? ' active' : '')" href="#">Labels</a>
          </li>
          <li class="nav-item">
            <a @click.prevent="sel_tab = 'models'" :class="'nav-link' + (sel_tab == 'models' ? ' active' : '')" href="#">Models</a>
          </li>
          <li class="nav-item" v-if="BrisaAPI._brisa_idb">
            <a @click.prevent="sel_tab = 'del_data'" :class="'nav-link' + (sel_tab == 'del_data' ? ' active' : '')" href="#">Account Reset</a>
          </li>
        </div>
        <br/>
        <div v-if="sel_tab == 'brisa-whiteboard'">
          <h3>Whiteboard Config</h3>
          <select class="form-control" ref="wb_color" v-model="Brisa.current_view.parent.data.metadata.style.color" placeholder="Color">
            <option value="0,0,0">Black</option>
            <option value="255,255,255">White</option>
            <option value="255,0,0">Red</option>
            <option value="0,255,0">Green</option>
            <option value="0,0,255">Blue</option>
          </select>
          <select class="form-control" ref="wb_card_bg" v-model="Brisa.current_view.parent.data.metadata.style.card_bg" placeholder="Card Color">
            <option value="white">White</option>
            <option value="#fffff0">Yellow</option>
            <option value="#fff0f0">Red</option>
            <option value="#f0fff0">Green</option>
            <option value="#f0f8ff">Blue</option>
          </select>
          <input class="form-control" ref="wb_opacity" v-model="Brisa.current_view.parent.data.metadata.style.opacity" placeholder="Opacity">
          <input class="form-control" ref="wb_grid" v-model="Brisa.current_view.parent.data.metadata.style.grid" placeholder="Grid">
          <select class="form-control" ref="wb_paper" v-model="Brisa.current_view.parent.data.metadata.style.paper" placeholder="Paper">
            <option value="">None</option>
            <option value="lined-paper.png">Lined Paper</option>
            <option value="graphpaper.png">Graph Paper - Big</option>
            <option value="graphpaper2.png">Graph Paper - Small</option>
          </select>
          <button @click="SaveWB()" class="btn btn-sm btn-info">Save</button>
        </div>
        <div v-if="sel_tab == 'acct'">
          <h3 class="card-title">Background</h3>
          
          <select class="form-control form-control-sm" @change="SaveTheme" v-model="theme.data.setting">
            <option>Select Background Style</option>
            <option :value="{image: img.url}" v-for="img in Brisa.background_opts.images">{{img.title}}</option>
            <option :value="{bg_class: cls}" v-for="cls in Brisa.background_opts.classes">{{cls}}</option>
            <option :value="{color: color[1]}" v-for="color in Brisa.background_opts.colors">{{color[0]}}</option>
          </select>

          <div v-if="false">
          <h3 class="mt-5">Alias</h3>
          <input v-model="Brisa.user.alias" class="form-control" />
          <button class="btn btn-outline-primary btn-sm mt-2">Update Alias</button>
          </div>

          <h3 class="mt-5">Change Password</h3>
          <h4>Current Password</h4>
          <input type="password" v-model="current_pass" placeholder="Current Password" class="form-control form-control-sm" />
          <h5>New Password</h5>
          <input type="password" v-model="new_pass1" placeholder="New Password" class="form-control form-control-sm" />
          <input type="password" v-model="new_pass2" placeholder="Re-enter Password" class="form-control form-control-sm" />
          <button @click="ChangePass" class="btn btn-outline-primary btn-sm mt-2">Change Password</button>
          <div class="text-danger" v-if="pass_error">{{pass_error}}</div>
          <div class="text-success" @click="pass_changed=false" v-if="pass_changed">Your password has been updated.</div>
        </div>
        <div v-if="sel_tab == 'labels'">
          <h4 class="card-title">Labels</h4>
  
          <draggable v-model="label_set.data.setting" :options="{handle: '.drag-handle'}" @update="UpdateLabels()" @start="drag=true" @end="drag=false">
            <div v-for="(element,idx) in label_set.data.setting" :key="element.id" class="" style="padding: 10px; font-size: 125%; ">
              <span class="drag-handle p-2" style="color: #707070; cursor: pointer;">
              <i  style="color: #a0a0a0" class="fa fa-bars"></i>
              </span>
              <span class="m-1">{{element}}</span>
              <button @click="RemLabel(idx)" class="btn btn-sm btn-outline-danger m-1"><i class="fa fa-times"></i></button>
            </div>
          </draggable>
  
          <input v-model="new_label" class="form-control" placeholder="Add a label">
          <button @click="AddLabel" class="btn btn-sm btn-primary">Add</button>
        </div>
        <div v-if="sel_tab == 'models'">
          <brisa-models></brisa-models>
        </div>
        <div v-if="sel_tab == 'del_data'">
          <h4 class="card-title">Delete My Data</h4>
          <p class="text-danger mb-2">This will delete all of the data saved in your browser.
            You can use it to get a fresh start, or make sure nothing is retained.</p>

          <label><input type="checkbox" class="" v-model="del_data"> Click here to confirm that you would like all data erased.</label>
          <br/>
          <button @click="HandleAccountReset" class="btn btn-sm btn-danger" v-if="del_data">Ok, Delete</button>
        </div>
      </div>
    </brisa-card>

</template>
