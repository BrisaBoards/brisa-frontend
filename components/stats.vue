<template>
  <div>
    <div class="clearfix">
    <button tabindex="-1" @click="ToggleStats" :class="(show_stats? 'btn-primary ' : 'btn-outline-primary ') + (left ? '' : 'float-right')" class="btn btn-round-sm nofocus"><i key="filter" class="fa fa-chart-line"></i></button>
    </div>
    <div v-if="show_stats" class="float-right m-2">
      <button @click="RefreshStats" class="btn btn-round-sm btn-outline-info nofocus" tabindex="-1">
      <i class="fa fa-sync"></i>
      </button>
    </div>
    <div v-if="show_stats" class="p-0 mt-1 rounded border-secondary"
        style="white-space: normal; max-width: 100%; width: 350px;">
      <div :key="group.key" v-for="(group,idx) in group_list" :class="idx == 0 ? 'border-bottom border-secondary' : ''" class="mb-2 p-2">
        <span style="font-weight: bold">{{group.title}}</span>
        <div style="position: relative; text-align: center; overflow: hidden; white-space: nowrap; width: 100%; border: 2px solid #ddd; border-radius: 5px; height: 30px;">
          <div class="bg-success text-light h-100" style="position: absolute; left: 0" :style="'width: ' + stats[group.key].complete_p + '%'">{{stats[group.key].complete_p}}%</div>
          <div class="bg-light text-dark h-100" style="position: absolute; display: inline-block;" :style="'left: ' + stats[group.key].complete_p + '%' + '; width: ' + (stats[group.key].remain_p + 1) + '%'"></div>
        </div>
        <small>
          <span>Cards: <strong>{{stats[group.key].cnt}}</strong></span>
          <span v-if="stats[group.key].no_est.length" class="pl-2">
            <button @click="sel_est = (sel_est == group.key ? null : group.key)" class="btn btn-outline-info nofocus btn-sm">Not Estimated: <strong>{{stats[group.key].no_est.length}}</strong></button>
          </span>
        </small>
        <div v-if="sel_est == group.key">
          <div v-for="entry in stats[group.key].no_est">
            <button @click="$emit('select', entry.data.id)" class="btn btn-sm btn-outline-info w-100 nofocus text-left m-1">{{entry.data.title}}</button>
          </div>
        </div>
        <br/>
        <small>Hours Remaining: <strong>{{stats[group.key].remain / 60}}</strong></small>

      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: ['groups', 'left'],
    data: function() {
      return {
        show_stats: false,
        group_list: null,
        stats: null,
        sel_est: null,
      };
    },
    methods: {
      RefreshStats: function() {
        this.group_list = this.groups();
        this.stats = Brisa.stats.Generate(this.group_list);
      },
      ToggleStats: function() {
        this.show_stats = !this.show_stats;
        if (this.group_list == null) this.RefreshStats();
      },
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
