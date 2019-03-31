<template>
  <div @click="onSelect" style="cursor: pointer;">
    <div :class="note.data.is_read ? 'xcard-header text-muted border-secondary' : 'border-primary card-header'"
        class="p-1 border mb-2" style="border-width: 0 0 0 5px !important;">
      <div class="clearfix" :style="note.data.is_read ? '' : 'font-weight: bold;'">
        <div class="float-right">
          <button @click.stop="onDelete" class="btn btn-sm btn-outline-warning"><i class="fa fa-trash"></i></button>
        </div>
        <div :class="!note.data.is_read ? 'text-primary' : ''">
        <div v-if="entry"><span>{{entry.data.title}}</span></div>
        <div v-else-if="note.data.parent=='system'"><span>Brisa Notification</span></div>
        <div v-else>{{note.data.parent}}</div>
        </div>
      </div>
      <div v-for="m in note.messages()">
        <h4 v-if="m.title">{{m.title}}</h4>
        <small>{{m.msg}} <span v-if="m.assignee && users[m.assignee]">to {{users[m.assignee].data.alias}}</span></small>
        <br/>
        <div v-if="m.link_url" class="clearfix">
          <a @click.stop :href="m.link_url" class="btn btn-outline-info btn-sm m-1" target="_blank">{{m.link_title}} &nbsp;<i class="fa fa-external-link-alt"></i></a>
        </div>
        <small v-if="users[m.by]">by {{users[m.by].data.alias}}</small>
      </div>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'note'
    ],
    data: function() {
      return {entry_id: null, entry: null, users: {}};
    },
    methods: {
      onDelete: function() {
        this.note.destroy().then(function(r) {
          this.$emit('deleted');
        }.bind(this));
      },
      onSelect: function() {
        if (!this.note.data.is_read) {
          this.note.mark_read().then(function(r) {
            this.note.data.is_read = true;
            Brisa.notify.update();
          }.bind(this));
        }

        var ctx = this.getCtx();
        if (ctx) {
          Brisa.cache.get('Entry', ctx[0], false).then(function(r) {
            Brisa.OpenCtx(r, ctx[1], this.entry_id);
          }.bind(this));
          this.$emit('selected');
        } else if (this.entry) {
          Brisa.OpenCtx(this.entry);
          this.$emit('selected');
        }
      },
      getCtx: function() {
        if (!this.note.data.ctx) return null;
        var match;
        if (match = this.note.data.ctx.match(/^(\d+)-(.*)$/)) {
          return [match[1], match[2]];
        }

        return null;
      },
      cache_user: function(uid) {
        Brisa.cache.get('User', uid, false).then(function(r) {
          Vue.set(this.users, uid, r);
        }.bind(this));
      }
    },
    created: function() {
      var ent_id;
      if (ent_id = this.note.data.parent.match(/entry:(\d+)/)) {
        this.entry_id = ent_id[1];
        Brisa.cache.get('Entry', ent_id[1], false).then(function(ent) {
          this.entry = ent;
        }.bind(this));
      }
      for (let i of this.note.data.messages) {
        if (i.by) this.cache_user(i.by);
        if (i.assignee) this.cache_user(i.assignee);
      }
    },
    mounted: function() {
    },
    watch: {
    },
  });

</script>
