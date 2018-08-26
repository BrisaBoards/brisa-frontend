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
    <component style="height: 100%; min-height: 50px;" :is="wrapper || 'div'" v-if="do_edit" class="d-flex">
      <div class="flex-grow-1" style="height: 100%;">
      <input ref="editor" v-if="val_type == 'int' || val_type == 'string'" v-model="edit_val"
          @keyup="checkKeyCode" style="height: 100%;" class="form-control xform-control-sm bg-light">
      <div v-else-if="val_type == 'text' || val_type=='markdown'">
        <textarea ref="editor" @keyup.esc="CancelEdit()" @input="resizeTextarea"
            class="form-control bg-light" style="overflow-y: hidden" v-model="edit_val" rows="3"></textarea>
      </div>
      <div v-else-if="val_type == 'enum'">
        <select v-model="edit_val" @change="DoneEditing()" ref="editor" class="form-control bg-light">
          <option :value="opt[0]" v-for="opt in enum_list">{{opt[1]}}</option>
        </select>
        <button class="btn btn-sm btn-danger" @click="CancelEdit()">Cancel</button>
      </div>
      <div v-else>
        <input ref="editor" v-model="edit_val" @keyup="checkKeyCode" class="form-control form-control-sm bg-light">
        <small>Need handler for {{val_type}}</small>
      </div>
      </div>
      <div>
        <button @click="DoneEditing" style="width: 100%; margin-bottom: 10px;" class="btn btn-sm btn-primary"><i class="fa fa-check"></i></button>
        <br/>
        <button @click="CancelEdit" style="width: 100%;" class="btn btn-sm btn-warning"><i class="fa fa-times"></i></button>
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
        Brisa.sizeTextarea(this.$refs.editor, 40, 650);
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
