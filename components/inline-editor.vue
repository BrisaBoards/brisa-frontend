<template>
  <div :style="'height: 100%; ' + (noOverflow ? 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' : '')">
    <div style="width: 100%;" class="" @click.stop="StartEdit()" v-if="!do_edit">
      <component :is="wrapper || 'span'">
        <span v-if="new_val == '' || new_val == null" class="text-muted">
          Add {{name}}
        </span>
        <span v-else-if="val_type == 'int' || val_type == 'text' || val_type == 'markdown'" v-html="noOverflow ? new_val : fmtText(new_val)"
          :style="noOverflow ? 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' : 'white-space: pre-wrap'">
        </span>
        <span v-else-if="val_type == 'string' || val_type == 'enum'">{{disp_value || new_val}}</span>
        <span v-else>
          Need handler for {{val_type}}.<br/>
          {{new_val}}
        </span>
      </component>
    </div>
    <component style="height: 100%; min-height: 50px;" :is="wrapper || 'div'" v-if="do_edit" class="xd-flex">
      <div class="flex-grow-1" style="height: 100%; position: relative;">
      <input ref="editor" v-if="val_type == 'int' || val_type == 'string'" @keydown.tab.prevent="$refs.done.focus()" v-model="edit_val"
          @keyup="checkKeyCode" style="xheight: 2em;" class="form-control pt-1 pb-1 border border-secondary xform-control-sm bg-light">
      <div v-else-if="val_type == 'text' || val_type=='markdown'">
        <textarea ref="editor" @keydown.tab.prevent="$refs.done.focus()" @keyup.esc="CancelEdit()" @input="resizeTextarea"
            class="form-control border border-secondary bg-light" style="min-height: 50px;" v-model="edit_val"></textarea>
      </div>
      <div v-else-if="val_type == 'enum'">
        <select v-model="edit_val" @keydown.tab.prevent="$refs.done.focus()" @change="DoneEditing()" ref="editor" class="form-control bg-light">
          <option :value="opt[0]" v-for="opt in enum_list">{{opt[1]}}</option>
        </select>
      </div>
      <div v-else>
        <input ref="editor" v-model="edit_val" @keydown.tab.prevent="$refs.done.focus()" @keyup="checkKeyCode" class="form-control form-control-sm bg-light">
        <small>Need handler for {{val_type}}</small>
      </div>
      </div>
      <div class="bg-secondary p-2 border border-dark rounded" style="z-index: 5; position: absolute; transform: translateX(15%);">
        <button @click="DoneEditing" ref="done" style="margin-bottom: 0px;" class="btn btn-sm btn-outline-success mr-2"><i class="fa fa-check"></i></button>
        <button @click="CancelEdit" style="" class="btn btn-sm btn-outline-danger"><i class="fa fa-times"></i></button>
      </div>
    </component>
  </div>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'val_type', 'disp_value', 'value', 'wrapper', 'update_ref', 'updated', 'name', 'enum_list',
      'keyed_value', "noOverflow", 'isOpen'
    ],
    data: function() {
      var val = this.disp_value || this.value;
      return {do_edit: this.isOpen, edit_val: this.keyed_value || val, new_val: val};
    },
    methods: {
      fmtText: function(str) {
        return Brisa.formatText(str);
      },
      checkKeyCode: function(code) {
        if (code.key == 'Enter') {
          this.DoneEditing();
        } else if (code.key == 'Escape') {
          this.CancelEdit();
        }
      },
      CancelEdit: function() {
        this.edit_val = this.new_val;
        this.do_edit = false;
        this.$emit('done-editing');
      },
      DoneEditing: function() {
        this.new_val = this.edit_val;
        this.do_edit = false;
        this.updated(this.new_val, this.update_ref);
        this.$emit('done-editing');
      },
      StartEdit: function() {
        this.do_edit = true;
        this.$nextTick(function() {this.$refs.editor.focus()}.bind(this));
        if (this.val_type == 'text' || this.val_type == 'markdown')
          this.$nextTick(function() { this.resizeTextarea() }.bind(this));
      },
      resizeTextarea: function() {
        Brisa.sizeTextarea(this.$refs.editor, 75, 650);
      },
    },
    mounted: function() {
      if (this.do_edit) {
        this.$nextTick(function() {
          //this.$refs.editor.focus()
          this.StartEdit();
        }.bind(this));
      }
    },
  });

</script>
