<template>
  <brisa-card opacity="0.98" class="mb-1 mr-1" :style="'max-width: 100vw; xwidth: 100vw; xz-index: ' + (zindex ? zindex: 100)">

        <div class="float-right">
          <button class="btn btn-lg btn-outline-danger" style="border-radius: 0px;" @click.stop="confirm_delete = true">
            <i class="fa fa-1x fa-trash-alt"></i>
          </button>
          <button class="btn btn-lg btn-outline-primary ml-1" style="border-radius: 0px;" @click.stop="$emit('on-close')">
            <i class="fa fa-1x fa-times"></i>
          </button>
        </div>
    <div class="card-body" @click.stop="noop">

      <div class="d-flex clearfix">
        <div class="flex-grow-1" style="flex-grow: 1;">
          <brisa-inline-editor name="Title" :updated="UpdatedAttr" update_ref="title" val_type="string" :value="entry.title()" wrapper="h4"></brisa-inline-editor>
        </div>
      </div>
      <div v-if="confirm_delete" class="text-center bg-light rounded border p-2 text-danger" style="z-index: 1; position: absolute; max-width: 100%; width: 300px; right: 0px">
        <h3>Delete Card?</h3>
        <p>
          Note: If the card includes a Kanban, Sheet, etc, the items within will 
          <strong>not</strong> be deleted.
        </p>
        <button @click="confirm_delete = false" class="btn btn-outline-primary">Cancel</button>
        <button @click="$emit('delete')" class="btn btn-danger">Yes, Delete</button>
      </div>

      <div>
        <div class="m-0 mb-4 pl-3 pt-1 pb-1 border-primary" style="display: inline-block; background-color: rgba(200,225,255,0.7); border-radius: 20px;">
          <span v-for="tag in entry.tags()" class="border-primary bg-light text-primary" style="font-size: 90%; border-radius: 8px; padding: 3px; margin: 1px;">
            {{tag}} <a @click="RemoveTag(tag)"> &nbsp;<span class="fas fa-window-close xtext-danger"></span></a>
          </span>
          <span>
            <input @keypress.enter="AddTag()" ref="new_tag" class="form-control form-control-sm" placeholder="Add tag" style="display: inline-block; width: 125px;">
          </span>
        </div>
      </div>

      <div class="p-1" style="background-color: rgba(0,0,0,0.02);">
      <brisa-inline-editor name="Description" :updated="UpdatedAttr" update_ref="description" val_type="text" :value="entry.data.description" wrapper="div"></brisa-inline-editor>
      </div>

      <div>
        <div v-if="class_list().indexOf(uitype.cls) != -1" v-for="uitype in Brisa.ui_classes" class="m-2 mt-3" style="display: inline-block">
          <button @click="Brisa.OpenView(entry, uitype)" class="btn btn-sm btn-outline-primary">Open {{uitype.name}}</button>
        </div>
      </div>

      <div v-for="(cls,idx) in classes()" v-if="cls">
        <div class="mt-4">
          <h4>{{cls.title()}}</h4>
        <div class="row m-2" v-for="field in cls.config().fields">
          <div class="col-12 col-md-3 col-lg-2 p-2">{{field.title}}</div>
          <div class="col-12 col-md-9 col-lg-10 p-2 rounded" style="background-color: #f4f4f4; xheight: 100%;"><brisa-inline-editor :name="field.title" :updated="UpdatedAttr" :update_ref="{cls: cls.unique_id(), field: field.id}"
              :val_type="field.field_type" :value="(entry.data.metadata[cls.unique_id()] || {})[field.id]" wrapper="div">
          </brisa-inline-editor></div>
        </div>
      </div>
        </div>
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

      <div @click.stop class="card-body">
        <h4>Comments</h4>
        <div v-if="comments !== null">
          <div class="xtable-active mb- p-" v-for="comment in comments">
            <div class="mb-1 p-1 pl-2" v-html="Brisa.formatText(comment.comment())"></div>
            <div class="mb-3 p-1 pl-2 pr-2 table-active text-" style="border-radius: 8px; display: inline-block; font-size: 80%">by {{comment.data.user}} <span class="text-muted">on {{comment.stamp}}</span></div>
          </div>
        </div>

        <div v-if="!add_comment">
          <button @click="OpenComment" key="add_cmt" class="btn btn-link btn-sm">Add Comment</button>
          <transition name="fade">
          <div style="display: inline-block; position: absolute;" v-if="comments === null"><i class="fa fa-spinner fa-spin"></i></div>
          </transition>
        </div>
        <div v-else>
          <textarea ref="new_comment" class="form-control" rows="4"></textarea>
          <button @click="AddComment" class="mt-1 mr-1 btn btn-sm btn-outline-primary">Add</button>
          <button @click="add_comment = false" class="mt-1 btn btn-sm btn-outline-danger">Cancel</button>
        </div>
      </div>

    </div>

      <div @click.stop v-if="show_expand" class="border border-secondary p-3 border-top-0 ml-2 mr-2 mb-0" style="border-radius: 10px 10px 0px 0px">
        <transition name="fade-fast">
          <div v-if="show_board == null">
            <div class="row " style="font-size: 115%">
              <div class="col-12 col-md-6">
                <button href="#" @click.prevent="SelectBoard(cls.cls, cls.name)" style="display: block;" class="btn btn-secondary w-100 p-2 mt-1 text-info"
                    v-if="class_list().indexOf(cls.cls) == -1"
                    v-for="cls in Brisa.ui_classes">
                  <i :class="'fas ' + cls.icon"></i> {{cls.name}}
                </button>
              </div>
              <div class="col-12 col-md-6">
                <a href="#" @click.prevent="AddModel(model.unique_id())" style="display: block;" class="p-2 mt-1"
                    v-if="class_list().indexOf(model.unique_id()) == -1" v-for="model in models">
                  {{model.title()}}
                </a>
              </div>
            </div>
          </div>
          <div v-else>
            <h3>Add {{show_board.label}}</h3>
            <div>Tags:
            <input v-model="new_board_tags" class="form-control form-control-sm" placeholder="Tags (comma separated)"></div>
            <div>Classes:
              <div v-for="model in models">
                <label>
                <input v-model="new_board_classes" :value="model.unique_id()" type="checkbox"> {{model.title()}}
                </label>
              </div>
            </div>
            <button @click="AddBoard" class="btn btn-lg btn-primary">Create</button>
            <button @click="show_board = null" class="btn btn-lg btn-outline-warning">Cancel</button>
          </div>
        </transition>
      </div>

    <div @click.stop class="card-footer clearfix mt-0">
      <div style="display: inline-block">

      <button @click="show_expand = !show_expand" class="btn btn-xs btn-link"><i class="fa fa-plus"></i> &nbsp;Expand Card</button>
      </div>
      <div style="display: inline-block;" class="float-right">
        <textarea :value="JSON.stringify(entry.data, null, 2)" rows="10" v-if="show_code" style="border: 2px solid #ccc; border-radius: 2px; font-size: 100%; font-family: monospace; width: 400px; max-width: 90%; position: absolute; transform: translateY(-100%) translateX(-90%);">
          
        </textarea>
        <button @click="show_code = !show_code" class="btn btn-link btn-xs"><i class="fa fa-code"></i></button>
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
      var m = Brisa.group_models[this.entry.group_id() || null];
      return {Brisa: Brisa, show_board: null,
        new_board_tags: '', new_board_classes: [],
        sel_tab: null, confirm_delete: false,
        models: m, show_expand: false,
        show_code: false,
        comments: null,
        add_comment: false,
      };
    },
    methods: {
      OpenComment: function() {
        this.add_comment = true;
        this.$nextTick(function() { this.$refs.new_comment.focus() }.bind(this));
      },
      AddComment: function() {
        BrisaAPI.Comment.create({entry_id: this.entry.data.id, comment: this.$refs.new_comment.value}).then(function(r) {
          r.stamp = (new Date(r.data.created_at)).toLocaleString();
          this.comments.push(r);
          this.add_comment = false;
        }.bind(this));
      },
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
          this.show_expand = false;
        }.bind(this));
      },
      SelectBoard: function(btype, label) {
        this.new_board_tags = this.entry.data.id + '-' + label;
        this.new_board_classes = [];
        this.show_board = {type: btype, label: label};
      },
      AddBoard: function() {
        var tags = this.new_board_tags.split(",").map(function(tag) { return tag.trim() });
        if (tags.length == 1 && tags[0] == '') tags = [];
        if (this.new_board_classes.length == 0) this.new_board_classes = null;
        if (tags.length == 0) tags = null;
        this.entry.edit_class(this.show_board.type, {classes: this.new_board_classes, tags: tags});
        this.show_board = null;
        this.show_expand = false;
      },
      classes: function() {
        return (this.entry.classes() || []).map(function(cls) {
          var gm = Brisa.group_model_map[this.entry.data.group_id];
          return gm[cls];
        }.bind(this));
      },
      class_list: function() {
        return this.entry.classes() || [];
      },
      noop: function() { },
    },
    mounted: function() {
      $(this.$refs.add_btn).dropdown();
      Brisa.cache.get('Comments', this.entry.data.id).then(function(r) {
        for (let cmt of r) {
          cmt.stamp = (new Date(cmt.data.created_at)).toLocaleString();
        }
        this.comments = r;
      }.bind(this));
    },
    computed: {
      entryTags: function() {
        return (this.entry.tags() || []).join(", ");
      },
    },
    created: function() {
    },
  });

</script>
