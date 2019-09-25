<template>
  <div class="mt-2" :class="section.uid ? 'ml-3' : ''">
    <div class="simple-shadow bg-light hover-hider clearfix text-dark m-1 p-2"
        style="position: relative; display: inline-block; border-radius: 2px;">
      <div style="display: flex;">
      <brisa-inline-editor name="Section Title" :update_ref="section" :updated="onUpdateTitle"
          :value="section.title" val_type="string"
          class="m-0 xtext-dark mr-1" style="font-size: 115%;" wrapper="span"
          v-if="section.uid"
      >
      </brisa-inline-editor>
      <span v-else class="m-0 text-dark mr-1" style="font-size: 115%">{{parent.data.title}}</span>
      <div class="xbg-light xfloat-right" xstyle="position: absolute; right: 5px; top: 5px">
        <div class="bg-light hover-show p-1" style="border-radius: 8px; overflow: hidden;">
        <button @xclick="add_section = !add_section" class="btn btn-outline-danger mr-1"
            v-if="section.uid">
          <i class="fa fa-trash"></i>
        </button>
        <button @click="add_section = !add_section" class="btn btn-outline-primary">
          <i class="fa fa-plus"></i>&nbsp; Section
        </button>
        </div>
      </div>
      </div>
      <div v-if="add_section" class="p-2">
        <h4>New Section Title:</h4>
        <form @submit.prevent="do_add">
          <input v-model="new_title" class="form-control form-control-sm" />
          <button class="btn btn-primary">Add</button>
        </form>
      </div>
    </div>

    <div class="xbg-light p-2 ml-3 m-1 hover-hider" v-if="section.uid" style="border-radius: 3px;">
      <draggable class="pb-2" group="entries" v-model="ents" @change="onDragEnd">
      <div v-for="ent_id in ents">
        <div v-if="entries[ent_id]">
          <brisa-entry-card-horiz class="xkanban-card mb-1" @xdelete="OnDelete(entry, idx)" :opacity="0.95" :select="onSelect"
              :selected="sel_entry" :hide_desc="false" :entry="entries[ent_id]"
              v-if="card_view == 'compact'">
          </brisa-entry-card-horiz>
          <brisa-entry-card class="xkanban-card" @xdelete="OnDelete(entry, idx)" :opacity="0.95" :select="onSelect"
              :selected="sel_entry" :hide_desc="false" :entry="entries[ent_id]" :full_desc="true"
              v-else-if="card_view == 'normal'">
          </brisa-entry-card>
          <brisa-entry-pop v-else :hide_icons="true" :entry="entries[ent_id]" style="width: 100%; xoverflow-y: auto;">
          </brisa-entry-pop>

        </div>
      </div>
      </draggable>

      <div class="xhover-hider mt-2 mb-2 clearfix" v-if="section.uid">
        <div class="hover-show hover-op50" xstyle="opacity: 0.5">
          <brisa-add-card :on-submit="AddCard" xheight="30px" class="xfloat-right"></brisa-add-card>
        </div>
      </div>
    </div>


    <brisa-outline-section @select="onSelect" @modified="onModify" :key="idx"
        :section="sec" :level="level + 1" :view="view" :parent="parent" :entries="entries"
        :sel_entry="sel_entry" :card_view="card_view"
        v-for="sec,idx in section.sections">
    </brisa-outline-section>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'section', 'card_view', 'level', 'view', 'parent', 'entries', 'sel_entry'
    ],
    data: function() {
      return {
        show_add: false,
        new_card: '',
        add_section: false,
        new_title: '',
        uid: this.section.uid,
        ents: null,
      };
    },
    computed: {
    },
    watch: {
      parent: function(a,b) {
        this.ents = this.get_entries();
      },
    },
    methods: {
      onDragEnd: function(v) {
        let is_end = v.removed !== undefined || v.moved !== undefined;
        //console.log("DE", this.section, v, is_end);
        this.onModify({order: this.uid, section: this.ents, end: is_end});
        return true;
      },
      get_entries: function() {
        return this.parent.data.metadata._outline.sections[this.uid];
      },
      onUpdateTitle: function(val) {
        console.log(val);
        this.section.title = val;
        this.onModify({generic: 'title'});
      },
      onSelect: function(entry) {
        this.$emit('select', entry);
      },
      sections: function() {
        return this.parent.data.metadata._outline.sections;
      },
      sec_entries: function() {
        let s = this.sections()[this.uid];
        return s;
      },
      AddCard: function(val) {
        console.log("Add to", this.section, val, this.new_card);
        var new_card = {title: val, group_id: this.view.group_id, tags: this.view.ctx.tags, classes: this.view.ctx.classes};
        BrisaAPI.Entry.create(new_card).then((entry) => {
          //this.sec_entries().push(entry.data.id);
          this.show_add = false;
          this.onModify({add_entry: this.uid, entry: entry});
        });
      },
      do_add: function() {
        let new_sec = {
          title: this.new_title,
          sections: [],
          uid: Brisa.unique_id(4, this.new_title.slice(0,8)),
        };
        this.onModify({add_section: new_sec, section: this.section});
        //this.section.sections.push();
        this.new_title = '';
        this.add_section = false;
      },
      onModify: function(val) {
        this.$emit('modified', val);
      },
    },
    created: function() {
      this.ents = this.get_entries();
    },
  });

</script>
