<template>
  <div class="w-100 no-sb-y" style="z-index: 5000; position: relative; overflow-y: scroll; height: 100%;">
    <div class="w-100" style="position: relative; min-height: 100%;">
    <div class="bg-light" style="z-index: -1; opacity: 0.95;  position: absolute; top:0; width: 100%; bottom: 0;"></div>
    <div key="sb-group" v-if="group && expanded" class="m-3">
      <div @click="group = null" style="cursor: pointer; font-size: 150%;" class="p-2 float-right text-info"><i class="fa fa-times"></i></div>
      <h3>Group: {{ group.data.name }}</h3>
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

    <div v-else key="sb" class="w-100 no-sb-y m-0 p-0" style="height: 100%; xoverflow-y: auto;">
      <div v-if="!expanded" class="pt-2 pb-2" style="width: 100%; text-align: center;">
        <img style="width: 50%; height: auto;" src="favicon.ico">
      </div>
    <div :key="'group_' + group_idx" class="bg-transparent mt-1 w-100" style="xoverflow-x: hidden;" :class="expanded ? 'p-1 pl-1 pr-1' : 'p-0'"
        v-for="(group, group_idx) in Brisa.groups">
      <div v-if="expanded" @click="GroupSettings(group)" style="cursor: pointer;" class="xtext-light float-right p-1">
        <i class="fa fa-cog" style="opacity: 0.5"></i>
      </div>
      <div key="grp-cont" class="mb-0 mt-2" style="text-align: left; white-space: nowrap; xoverflow: hidden;">
      <h4 :style="expanded ? '' : 'font-size: 100%;'" @click="OpenDash(group.data.id)" style="cursor: pointer;"
          :class="Brisa.current_view && Brisa.current_view.component == 'brisa-dashboard' && Brisa.current_view.group_id == group.data.id ? 'bg-primary text-light' : 'text-info'"
          class="xtext-info text-of m-0 p-1 pt-2 pb-2 noselect">
        {{group.data.name}}
      </h4>
      </div>
      <div :key="idx + view.unique_id" @mouseover="onHover(view.unique_id, true)" @mouseout="onHover(view.unique_id, false)" @click="Brisa.current_view = view; $emit('toggle-menu')"
          :class="'p-1 w-100 ' + (Brisa.current_view == view ? 'bg-primary text-light' : '')"
          style="position: relative; cursor: pointer" :style="expanded ? '' : 'text-align: center;'"
          v-if="view && view.component != 'brisa-dashboard'"
          v-for="(view, idx) in Brisa.group_views[group.data.id]">
        <transition name="fade-fast">
        <div @click.stop v-if="!expanded && hover_view == view.unique_id"
            style="white-space: nowrap; text-align: left; cursor: default; z-index: 10000; bottom: 100%; right: 0; xleft: 89%; position: absolute;
              max-width: 200px; overflow: hidden; transform: translateY(50%);"
            class="border p-0 rounded xborder-secondary bg-light text-dark">
          <button @click="CloseView(group.data.id, idx)" class="btn m-0 btn-sm btn-outline-danger p-1">
            <i class="fa fa-times" style="opacity: 0.6"></i>
          </button>
          <button v-if="false" @click="" class="btn m-0 btn-sm p-2 pt-0 pb-0 btn-outline-success"><i class="fa fa-thumbtack"></i></button>
        </div>
        </transition>
        <div class="" :style="expanded ? '' : ''" style="display: inline-block; width: 100%; overflow: hidden;">
          <div class="float-right" v-if="expanded">
            <button @click.stop="CloseView(group.data.id, idx)" style="font-size: 75%; border: 0px; box-shadow: 0 0 0"
                class="btn btn-xs p-1 m-0 btn-outline-danger">
            <i class="fa fa-times" style="opacity: 0.5"></i></button>
          </div>
          <span>
            <i v-if="view.component == 'brisa-dashboard'" class="fa fa-th"></i>
            <i :class="'fa ' + Brisa.ui_classes[view.component].icon" v-if="Brisa.ui_classes[view.component]"></i>
          </span>
          <br key="small_sep" v-if="!expanded" />
          <span :style="expanded ? '' : 'font-size: 80%'" style="white-space: nowrap; text-overflow: ellipsis;">{{view.title}}</span>
        </div>
      </div>
    </div>

    <div v-if="expanded" style="width: 100%;">
    <div v-if="new_group" class="p-2">
      <input ref="new_group" class="form-control bg-light p-2" placeholder="Group Name">
      <button @click="CreateGroup" class="mt-1 btn btn-sm btn-primary w-100">Create</button>
      <button @click="new_group = false" class="mt-1 btn btn-sm btn-secondary text-danger w-100">Cancel</button>
      <div v-if="group_error" style="font-size: 125%;" class="text-danger">
        Error creating group: {{group_error}}
      </div>
    </div>
    
    <button @click="new_group = true" class="btn btn-sm btn-link w-100"><i class="fa fa-plus"></i> &nbsp;New Group</button>
    <button @click="Brisa.toggleFullScreen" class="btn btn-sm btn-link w-100"><i class="fa fa-arrows-alt"></i> Fullscreen</button>
    <button @click="Brisa.logout" class="btn btn-link btn-sm w-100"><i class="fa fa-user"></i>&nbsp; Log Out {{ Brisa.user.alias }}</button>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['expanded'],
    data: function() {
      return {
        Brisa: Brisa,
        new_group: false,
        hover_view: null,
        group_error: null,
        group: null,
        add_share_err: null,
      };
    },
    methods: {
      onHover: function(uid, is_active) {
        if (is_active == false && this.hover_view == uid) {
          this.hover_view = null;
        } else if (is_active) {
          this.hover_view = uid;
        }
        //console.log("Hover", this.hover_view, uid, is_active);
      },
      CloseView: function(group_id, idx) {
        var view = Brisa.group_views[group_id].splice(idx, 1)[0];
        if (Brisa.current_view == view) Brisa.current_view = null;
        if (Brisa.group_views[group_id].length == 0) delete Brisa.group_views[group_id];
        this.$forceUpdate();
      },
      AddShare: function() {
        var access_email = this.$refs.access_email.value;
        var access_type = this.$refs.access_type.value;
        this.add_share_err = null;
        this.group.add_share(access_email, access_type).then(function(r) {
        }.bind(this)).catch(function(err) {
          window.serr = err;
          this.add_share_err = "Error adding access: " + (err.json ? err.json.error : 'Server Error');
        }.bind(this));
      },
      GroupSettings: function(group) {
        this.group = group;
      },
      OpenDash: function(group_id) {
        for (var view of Brisa.group_views[group_id] || []) {
          if (view.component == 'brisa-dashboard') {
            Brisa.current_view = view;
            this.$emit('toggle-menu');
            return;
          }
        }
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
