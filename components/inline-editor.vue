<template>
  <div :style="(allInline ? '' : 'height: 100%; ') + (noOverflow ? 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' : '')">
    <small v-if="show_title">{{name}}</small>
    <div :style="disabled ? '' : 'cursor: pointer'" style="width: 100%;" class="" @click.stop="StartEdit()" v-if="!do_edit">
      <slot>
      <component :is="wrapper || 'span'">
        <span v-if="value == '' || value == null" class="text-muted">
          Add<span v-if="!show_title"> {{name}}</span>
        </span>
        <span v-else-if="val_type == 'datetime'">
          {{new Date(value).toLocaleString()}}
        </span>
        <span v-else-if="val_type == 'timer'">
          {{showEstimate(value)}}
        </span>
        <span v-else-if="val_type == 'int' || val_type == 'text' || val_type == 'markdown'"
          v-html="noOverflow ? value : fmtText(value)"
          :style="noOverflow ? 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' : 'white-space: pre-wrap'">
        </span>
        <span v-else-if="val_type == 'string' || val_type == 'enum'">{{value}}</span>
        <span v-else>
          Need handler for {{val_type}}.<br/>
          {{value}}
        </span>
      </component>
      </slot>
    </div>
    <component style="height: 100%; min-height: 50px;" :is="wrapper || 'div'" v-if="do_edit" class="xd-flex">
      <div class="flex-grow-1" style="height: 100%; position: relative;">
        <div class="p-2 rounded text-light" style="background-color: rgba(255,75,75,0.7); position: absolute; transform: translateY(-75%);"
            v-if="value_changed && !is_updating">
          Warning: {{name}} changed since editing!
        </div>
      <input ref="editor" v-if="val_type == 'int' || val_type == 'string' || val_type == 'datetime' || val_type == 'timer'"
          @keydown.tab.prevent="$refs.done.focus()" v-model="edit_val"
          @keyup="checkKeyCode" style="height: auto;" class="form-control p-1 border border-secondary bg-light">
      <div v-else-if="val_type == 'text' || val_type=='markdown'">
        <textarea ref="editor" @keydown.tab.prevent="$refs.done.focus()" @keyup.esc="CancelEdit()" @input="resizeTextarea"
            class="form-control border border-secondary p-2 bg-light" style="min-height: 50px;" v-model="edit_val"></textarea>
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
      <div style="position: relative;">
      <div class="bg-secondary p-2 border border-secondary rounded" :style="allInline ? 'position: relative' : 'position: absolute'" style="z-index: 5; left: 20px; display: inline-block;">
        <div v-if="error" class="text-danger">{{error}}</div>
        <button @click="DoneEditing(false)" ref="done" style="margin-bottom: 0px;" class="btn btn-sm btn-outline-success mr-2"><i class="fa fa-check"></i></button>
        <button @click="CancelEdit" style="" class="btn btn-sm btn-outline-warning mr-2"><i class="fa fa-times"></i></button>
        <button @click="SetToNow" v-if="val_type == 'datetime'" style="" class="btn btn-sm btn-outline-info"><i key="t" class="far fa-calendar-check"></i></button>
        <button @click="confirm_delete = true" v-if="show_delete" style="" class="btn btn-sm btn-outline-danger"><i key="t" class="far fa-trash-alt"></i></button>

        <div v-if="confirm_delete" class="m-1">
          Delete {{name}}?<br/>
          <button @click="confirm_delete = false" class="btn btn-sm btn-outline-success">No</i></button>
          <button @click="DoneEditing(true)" class="btn btn-sm btn-outline-danger">Delete</i></button>
        </div>
      </div>
      </div>
    </component>
  </div>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'val_type', 'disp_value', 'value', 'wrapper', 'update_ref', 'updated', 'name', 'enum_list',
      'keyed_value', "noOverflow", 'isOpen', 'show_title', 'disabled', 'show_delete',
      'allInline',
    ],
    data: function() {
      return {error: null, value_changed: false, do_edit: this.isOpen, edit_val: this.keyed_value || this.value,
          est_regex: /^(([0-9]*)h)? *(([0-9]*)m?)?$/, is_updating: false, confirm_delete: false};
    },
    methods: {
      SetToNow: function() {
        this.edit_val = new Date().toLocaleString();
        this.$refs.editor.focus();
      },
      showEstimate: function(est_mins) {
        if (est_mins == null || est_mins == 0) return '';
        let hours = Number.parseInt(est_mins / 60);
        let mins = est_mins - 60 * hours;
        return (hours == 0 ? '' : hours + "h ") + mins + "m";
      },
      parseEstimate: function(estimate_string) {
        if (estimate_string == '') return 0;
        var parsed = this.est_regex.exec(estimate_string);
        if (parsed) {
          return (parsed[2] || 0) * 60 + (Number.parseInt(parsed[4]) || 0);
        }

        return null;
      },
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
        this.do_edit = false;
        this.$emit('done-editing');
      },
      DoneEditing: function(deleted) {
        var value = null;
        if (deleted) {
          value = null;
          console.log("Delete selected");
        } else if (this.val_type == 'datetime') {
          if (this.edit_val == '') {
            value = null;
          } else {
            var date = Brisa.datetime.parse(this.edit_val);
            if (date == null || isNaN(date)) {
              this.error = "Invalid Date"; return;
            }
            value = date.toISOString();
          }
        } else if (this.val_type == 'timer') {
          value = this.parseEstimate(this.edit_val);
          if (value == null) { this.error = "Invalid time value. Example: 5h 4m"; return }
          if (value == 0) value = null;
        } else {
          value = this.edit_val;
        }
        var promise = this.updated(value, this.update_ref);
        this.error = null;
        if (promise) {
          this.is_updating = true;
          promise.then((err) => {
            this.do_edit = false;
            this.$emit('done-editing');
            this.is_updated = false;
          }).catch((err) => {
            this.error = err.json && err.json.error ? err.json.error : 'Unknown error updating.';
            this.$emit('edit-error', {ref: this.update_ref, err: err});
            this.is_updated = false;
          });
        } else {
          this.do_edit = false;
          this.$emit('done-editing');
        }
      },
      StartEdit: function() {
        if (this.disabled) return;
        this.value_changed = false;
        this.do_edit = true;
        if (this.val_type == 'datetime') {
          this.edit_val = this.value == '' || this.value == null ? '' : new Date(Date.parse(this.value)).toLocaleString();
        } else if (this.val_type == 'timer') {
          this.edit_val = this.showEstimate(this.value);
        } else {
          this.edit_val = this.keyed_value || this.value;
        }
        this.$nextTick(function() {this.$refs.editor.focus()}.bind(this));
        if (this.val_type == 'text' || this.val_type == 'markdown')
          this.$nextTick(function() { this.resizeTextarea() }.bind(this));
      },
      resizeTextarea: function() {
        Brisa.sizeTextarea(this.$refs.editor, 75, 650);
      },
    },
    watch: {
      value: function(newValue, oldValue) {
        if (this.do_edit) {
          this.value_changed = true;
        }
      },
    },
    mounted: function() {
      this.error = null;
      if (this.do_edit) {
        this.$nextTick(function() {
          //this.$refs.editor.focus()
          this.StartEdit();
        }.bind(this));
      }
    },
  });

</script>
