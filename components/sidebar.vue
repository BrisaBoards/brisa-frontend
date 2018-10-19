<template>
  <div class="text-light" style="z-index: 5000; position: absolute; bottom: 0px; top: 0; width: 375px; max-width: 90%;">
    <div class="bg-dark" style="border-radius: 0px 10px 0px 0px; z-index: -1; opacity: 0.97; position: absolute; width: 100%; height: 100%;"></div>
    <div class="ml-3 m-2">
      <a @click.prevent="$emit('toggle-menu')" href="#" class="text-light" style="text-decoration: none; font-size: 150%;">
        <i class="fa fa-bars"></i>&nbsp; {{(Brisa.current_view || {}).group_name}}
        -
        {{Brisa.current_view.title}}
      </a>
    </div>
    <div v-if="group" class="m-3">
      <div @click="group = null" style="cursor: pointer; font-size: 150%;" class="p-2 float-right text-info"><i class="fa fa-times"></i></div>
      <h3>Group: {{group.name()}}</h3>
      <div>
        <h4>Access</h4>
        <div v-for="share in group.data.access">
          {{share.user}} - {{share.access}}
        </div>

        <br/>
        <div v-if="add_share_err" class="text-warning">
          {{add_share_err}}
        </div>
        <input class="form-control form-control-sm bg-light p-2 m-1" ref="access_email" placeholder="E-Mail Address">
        <select ref="access_type" class="form-control bg-light m-1 form-control-sm">
          <option value="view">View Only</option>
          <option value="edit">Edit</option>
          <option value="admin">Admin</option>
        </select>
        <button @click="AddShare" class="btn btn-primary w-100">Add</button>
      </div>
    </div>
    <div v-else>
    <button @click="Brisa.toggleFullScreen" class="btn btn-sm btn-outline-secondary ml-1"><i class="fa fa-arrows-alt"></i> Fullscreen</button>
    <div class="bg-transparent text-white m-0 p-2 pl-3 pr-3" v-for="group in Brisa.groups">
      <div @click="GroupSettings(group)" v-if="" style="cursor: pointer;" class="text-light float-right p-1"><i class="fa fa-cog"></i></div>
      <h4 v-if="!Brisa.group_views[group.data.id]" @click="OpenDash(group.data.id)" style="cursor: pointer;" class="text-light noselect">{{group.data.name}}</h4>
      <h4 v-else class="text-light">{{group.data.name}}</h4>
      <div @click="Brisa.current_view = view; $emit('toggle-menu')" :class="'p-2 text-light ' + (Brisa.current_view == view ? 'bg-info' : '')"
          style="border-radius: 20px; cursor: pointer;" v-for="view in Brisa.group_views[group.data.id]">
        <i v-if="view.component == 'brisa-dashboard'" class="fa fa-th"></i>
        <i :class="'fa ' + Brisa.ui_classes[view.component].icon" v-if="Brisa.ui_classes[view.component]"></i>
        &nbsp; {{view.title}}
      </div>
    </div>
    <button v-if="!new_group" @click="new_group = true" class="btn btn-link text-primary w-100"><i class="fa fa-plus"></i> &nbsp;New Group</button>
    <div v-else class="p-2">
      <input ref="new_group" class="form-control bg-light p-2" placeholder="Group Name">
      <button @click="CreateGroup" class="btn btn-sm btn-primary w-100">Create</button>
      <button @click="new_group = false" class="btn btn-sm btn-secondary text-danger w-100">Cancel</button>
      <div v-if="group_error" style="font-size: 125%;" class="text-danger">
        Error creating group: {{group_error}}
      </div>
    </div>
    <button class="btn btn-link text-light w-100 mt-2">Log Out, Andrew &nbsp;<i class="fa fa-user"></i></button>
    </div>
  </div>
</template>

<script>
  export default {
    props: [],
    data: function() {
      return {
        Brisa: Brisa,
        new_group: false,
        group_error: null,
        group: null,
        add_share_err: null,
      };
    },
    methods: {
      AddShare: function() {
        var access_email = this.$refs.access_email.value;
        var access_type = this.$refs.access_type.value;
        this.add_share_err = null;
        this.group.add_share(access_email, access_type).then(function(r) {
        }.bind(this)).catch(function(err) {
          window.serr = err;
          this.add_share_err = "Error adding access: " + (err.responseJSON ? err.responseJSON.error : 'Server Error');
        }.bind(this));
      },
      GroupSettings: function(group) {
        this.group = group;
      },
      OpenDash: function(group_id) {
        Brisa.AddView('Dashboard', 'brisa-dashboard', {tags: [], classes: []}, null, [], group_id);
        this.$emit('toggle-menu');
      },
      CreateGroup: function() {
        var group_name = this.$refs.new_group.value;
        console.log("New group", group_name);
        BrisaAPI.Group.create(group_name).then(function(g) {
          this.group_error = null; this.new_group = false;
          Brisa.groups.push(g);
        }.bind(this)).catch(function(err) {
          this.group_error = err.statusText;
        }.bind(this));
      },
    },
  };
</script>
