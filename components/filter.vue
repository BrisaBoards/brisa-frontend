<template>
  <div>
    <div class="clearfix">
    <button @click="show_filters = !show_filters" :class="(show_filters ? 'btn-primary ' : 'btn-outline-primary ') + (left ? '' : 'float-right')" class="btn btn-round-sm nofocus"><i key="filter" class="fa fa-search"></i></button>
    </div>
    <div v-if="show_filters" class="p-2 mt-1 rounded border-secondary" style="max-width: 100%; width: 250px;">
      <label>Card Status</label>
      <select @change="SendUpdate" v-model="status" class="form-control form-control-sm">
        <option value="active">Active</option>
        <option value="archive">Archived</option>
        <option value="all">All</option>
      </select>
      <label class="mt-3">Labels</label>
      <div v-for="lbl in labels" @click="SetOpt('label', lbl)" class="p-1" style="border-radius: 3px; cursor: pointer;"
          :class="label == lbl ? 'bg-primary text-light' : 'text-primary'">{{lbl}}</div>

      <label class="mt-3">Assigned To</label>
      <div v-for="member in members" @click="SetOpt('assign', member.uid)" class="p-1" style="border-radius: 3px; cursor: pointer;"
          :class="assign == member.uid ? 'bg-primary text-light' : 'text-primary'">{{member.user}}</div>

      <button @click="ClearFilter" class="btn btn-outline-default btn-sm w-100 mt-3 nofocus">Clear All</button><br/>
      <button @click="show_filters = false" class="btn btn-outline-default btn-sm w-100 mt-1 nofocus">Done</button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: ['group_id', 'left'],
    data: function() {
      return {
        show_filters: false,
        status: 'active',
        label: null,
        assign: null,
        labels: [], members: [],
      };
    },
    methods: {
      SendUpdate: function() {
        this.$emit('update', {status: this.status, label: this.label, assign: this.assign});
      },
      ClearFilter: function() {
        this.label = null;
        this.assign = null;
        this.status = 'active';
        this.SendUpdate();
      },
      SetOpt: function(opt, val) {
        if (this[opt] == val) {
          this[opt] = null;
        } else {
          this[opt] = val;
        }
        this.SendUpdate();
      },
    },
    created: function() {
      Brisa.Labels(this.group_id).then((r) => { this.labels = r.data.setting });
      this.members = Brisa.Group(this.group_id).data.access || [{uid: Brisa.user.uid, user: Brisa.user.alias}];
      this.SendUpdate();
    },
  });
</script>
