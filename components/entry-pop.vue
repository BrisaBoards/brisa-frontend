<template>
  <brisa-card opacity="0.98" :style="'max-width: 100vw; xwidth: 100vw; xz-index: ' + (zindex ? zindex: 100)">

    <div class="card-body" @click.stop="noop">

      <div class="d-flex">
        <div class="flex-grow-1" style="flex-grow: 1;">
          <brisa-inline-editor name="Title" :updated="UpdatedAttr" update_ref="title" val_type="string" :value="entry.title()" wrapper="h4"></brisa-inline-editor>
        </div>
        <div style="align-self: center">
          <span v-for="tag in entry.tags()" class="border-primary bg-light text-primary" style="font-size: 90%; border-radius: 8px; padding: 3px; margin: 1px;">
            {{tag}} <a @click="RemoveTag(tag)"> &nbsp;<span class="fas fa-window-close xtext-danger"></span></a>
          </span>
          <span>
            <input @keypress.enter="AddTag()" ref="new_tag" class="form-control form-control-sm" placeholder="Add tag" style="display: inline-block; width: 125px;">
          </span>
        </div>
        <div>
          <button class="btn btn-sm xbtn-round-sm btn-outline-danger" href="#" @click.prevent="confirm_delete = true">
            <i class="fa fa-1x fa-trash-alt"></i>
          </button>
          <button class="btn btn-sm xbtn-round-sm btn-outline-info" href="#" @click.prevent="$emit('on-close')">
            <i class="fa fa-1x fa-times"></i>
          </button>
        </div>
      </div>

      <div v-if="confirm_delete" class="alert alert-danger">
        <h3>Are you sure you want to delete this card?</h3>
        <p>
          Note: If the card includes a Kanban, Sheet, etc, the items within will 
          <strong>not</strong> be deleted.
        </p>
        <button @click="confirm_delete = false" class="btn btn-info">Cancel</button>
        <button @click="$emit('delete')" class="btn btn-warning">Yes, Delete</button>
      </div>

      <brisa-inline-editor name="Description" :updated="UpdatedAttr" update_ref="description" val_type="text" :value="entry.description()" wrapper="div"></brisa-inline-editor>
      <br/>
    
      <ul class="nav nav-tabs">
        <li :class="'nav-item '"
           v-if="class_list().indexOf(uitype.cls) != -1" v-for="uitype in Brisa.ui_classes">
          <a :class="'nav-link show text-info ' + (sel_tab && sel_tab.type =='ui' && sel_tab.uit == uitype ? 'active' : '')" href="#"
            @click.prevent="sel_tab={type: 'ui', uit: uitype, md: entry.metadata()[uitype.cls]}">
            {{uitype.name}}</a>
        </li>
        <li class="nav-item" v-for="(cls,idx) in classes()" v-if="cls">
          <a :class="'nav-link show ' + (sel_tab && sel_tab.type =='model' && sel_tab.cls == cls ? 'active' : '')"
              @click.prevent="sel_tab={type: 'model', cls: cls, md: entry.metadata()[cls.unique_id()]}"
              href="#">{{cls.title()}}</a>
        </li>
        <li class="nav-item dropdown">
          <a ref="add_btn" class="nav-link xdropdown-toggle xtext-info" data-toggle="dropdown" href="#" role="button">
            <i class="fa fa-plus text-primary"></i>
          </a>
          <div ref="add_menu" class="dropdown-menu">
            <a href="#" @click.prevent="AddModel(model.unique_id())" class="dropdown-item"
                v-if="class_list().indexOf(model.unique_id()) == -1" v-for="model in Brisa.models">
              {{model.title()}}
            </a>
            <a href="#" @click.prevent="SelectBoard(cls.cls, cls.name)" class="dropdown-item text-info"
                v-if="class_list().indexOf(cls.cls) == -1"
                v-for="cls in Brisa.ui_classes">
              <i :class="'fas ' + cls.icon"></i> {{cls.name}}
            </a>
          </div>
        </li>
      </ul>

      <div v-if="show_board != null" class="card">
        <div class="card-body">
        <h3>Add {{show_board.label}}</h3>
        <div>Tags:
        <input v-model="new_board_tags" class="form-control form-control-sm" placeholder="Tags (comma separated)"></div>
        <div>Classes:
          <div v-for="model in Brisa.models">
            <label>
            <input v-model="new_board_classes" :value="model.unique_id()" type="checkbox"> {{model.title()}}
            </label>
          </div>
        </div>
        <button @click="AddBoard" class="btn btn-lg btn-info">Create</button>
        <button @click="show_board = null" class="btn btn-lg btn-warning">Cancel</button>
        </div>
      </div>

      <div v-if="sel_tab && sel_tab.type == 'ui'">
        <h5>{{sel_tab.uit.name}}</h5>
        Tags: {{(sel_tab.md.tags || []).join(", ")}}
        <br/><button @click="Brisa.OpenView(entry, sel_tab.uit)" class="btn btn-sm btn-outline-info">Open</button>
      </div>

      <div v-if="sel_tab && sel_tab.type == 'model'">
        <h5>{{sel_tab.cls.title()}}</h5>
        <div v-for="field in sel_tab.cls.config().fields">
          <small style="font-weight: bold">{{field.title}}</small>
          <brisa-inline-editor :name="field.title" :updated="UpdatedAttr" :update_ref="{cls: sel_tab.cls.unique_id(), field: field.id}"
              :val_type="field.field_type" :value="(sel_tab.md || {})[field.id]" wrapper="div">
          </brisa-inline-editor>
        </div>
      </div>
    </div>
  </brisa-card>
</template>

<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'entry', 'zindex'
    ],
    data: function() {
      return {Brisa: Brisa, show_board: null,
        new_board_tags: '', new_board_classes: [],
        sel_tab: null, confirm_delete: false,
      };
    },
    methods: {
      fmtText: function(str) {
        return Brisa.formatText(str);
      },
      DoDelete: function() {
        this.entry.destroy().then(function(r) {
          this.$emit('deleted');
        }.bind(this));
      },
      UpdatedAttr: function(new_value, up_ref) {
        if (up_ref.cls) {
          if (this.entry.data.metadata[up_ref.cls] === undefined)
            this.entry.data.metadata[up_ref.cls] = {};
          this.entry.data.metadata[up_ref.cls][up_ref.field] = new_value;
          this.entry.update();
        } else {
          this.entry[up_ref](new_value);
          this.entry.update();
        }
      },
      AddTag: function() {
        this.entry.add_tags(this.$refs.new_tag.value);
        this.$refs.new_tag.value = '';
      },
      RemoveTag: function(tag) {
        this.entry.remove_tags(tag);
      },
      AddModel: function(model) {
        this.entry.edit_class(model, {}).then(function(r) {
          this.$refs.add_menu.classList.value="dropdown-menu";
        }.bind(this));
      },
      SelectBoard: function(btype, label) {
        this.new_board_tags = this.entry.title() + ' ' + label;
        this.new_board_classes = [];
        this.show_board = {type: btype, label: label};
        this.$refs.add_menu.classList.value="dropdown-menu";
      },
      AddBoard: function() {
        var tags = this.new_board_tags.split(",").map(function(tag) { return tag.trim() });
        if (tags.length == 1 && tags[0] == '') tags = [];
        if (this.new_board_classes.length == 0) this.new_board_classes = null;
        if (tags.length == 0) tags = null;
        this.entry.edit_class(this.show_board.type, {classes: this.new_board_classes, tags: tags});
        this.show_board = null;
      },
      classes: function() {
        return (this.entry.classes() || []).map(function(cls) {
          return this.Brisa.GetModel(cls);
        }.bind(this));
      },
      class_list: function() {
        return this.entry.classes() || [];
      },
      noop: function() { },
    },
    mounted: function() {
      $(this.$refs.add_btn).dropdown();
    },
    computed: {
      entryTags: function() {
        return (this.entry.tags() || []).join(", ");
      },
    },
  });

</script>
