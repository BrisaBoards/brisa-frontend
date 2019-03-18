<template>
  <brisa-card opacity="0.98" bg_class="bg-light" :color="null" class="mb-1 mr-1 xnofocus" :style="'max-width: 100vw; xwidth: 100vw; xz-index: ' + (zindex ? zindex: 100)">

    <div v-if="!hide_icons" class="float-right">
      <button class="btn btn-lg btn-outline-danger" style="border-radius: 0px;" @click.stop="confirm_delete = true">
        <i class="fa fa-1x fa-trash-alt"></i>
      </button>
      <button class="btn btn-lg btn-outline-primary ml-1" style="border-radius: 0px;" @click.stop="$emit('on-close')">
        <i class="fa fa-1x fa-times"></i>
      </button>
    </div>

    <div class="card-body" @click.stop>

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

      <div class="row ml-0 mr-0 mb-2  p-2" style="background-color: rgba(200,225,255,0.3);">
        <div class="col-12 col-lg-4 xtext-muted">
          <div>
            <small><span v-if="entry_info.creator">By {{entry_info.creator}}</span> <span v-if="entry_info.stamp">on {{entry_info.stamp}}</span></small>
            <button @click="ToggleWatch" class="btn btn-xs btn-link">{{entry.data.watchers.indexOf(Brisa.user.uid) != -1 ? "Stop Watching" : "Watch this card" }}</button>
          </div>
          <div>
            <button @click="expand_assign = !expand_assign" class="btn btn-xs btn-link">
              <span v-if="entry.data.assignees.length == 0">Unassigned</span>
              <span v-else>Assigned: <span v-for="uid in entry.data.assignees" class="xbg-light ml-1 mr-1">{{ucache[uid] || uid}} </span></span>
            </button>
            <div v-if="expand_assign">
            <div @click="Assign(u.uid, entry.data.assignees.indexOf(u.uid) != -1 ? false : true, idx)" v-for="(u,idx) in assign_list"
              :class="entry.data.assignees.indexOf(u.uid) != -1 ? 'bg-primary text-light' : 'bg-light text-dark'"
              style="cursor: pointer; font-size: 75%; display: inline-block" class="mr-1 p-2">
              {{u.user}}
            </div>
            </div>
            <div>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="tags" class="col-12 col-lg-4 " style="display: inline-block; border-radius: 20px;">
          <div class="p-2 rounded bg-light" @click="tag_popup = !tag_popup" style="cursor: pointer; display: inline-block">
            <small>Labels</small><br/>
          <span v-if="tag.selected" v-for="tag in tags.labels" class="m-1 border-primary bg-light text-primary"
              style="padding: 2px; border-radius: 8px;">
            <small>{{tag.tag}}</small>
          </span>
          </div>

          <div v-if="tag_popup" class="bg-light rounded border p-2" style="min-width: 200px; border: 1px solid #888; position: absolute;">
            <div style="font-size: 80%; font-weight: bold" class="text-muted mb-1">Labels</div>
            <div @click="tag.selected ? RemoveTag(tag.tag) : AddTag(tag.tag)" v-for="tag in tags.labels" :class="tag.selected ? 'bg-primary text-light' : 'bg-light text-primary'"
                class="m-1 pl-2" style="padding: 3px; cursor: pointer; border-radius: 8px;">
              <small>{{tag.tag}}</small>
            </div>

            <div style="font-size: 80%; font-weight: bold;" class="text-muted mt-2 mb-1">Other Tags</div>
            <div v-for="tag in tags.tags" class="border-primary bg-primary text-light m-1 pl-1 pr-1" style="border-radius: 8px;">
              <small>{{tag}}<a @click="RemoveTag(tag)" style="border-radius: 5px;"> &nbsp;<span class="fas fa-times-circle xtext-danger"></span></a></small>
            </div>
            <div>
              <input @keypress.enter="AddTag()" ref="new_tag" class="form-control form-control-sm" placeholder="Add tag" style="display: inline-block; width: 125px;">
            </div>
          </div>
        </div>

      </div>

      <div class="p-1" style="background-color: rgba(0,0,0,0.02);">
      <brisa-inline-editor name="Description" :updated="UpdatedAttr" update_ref="description" val_type="text" :value="entry.data.description" wrapper="div"></brisa-inline-editor>
      </div>

      <div>
        <div v-if="class_list().indexOf(uitype.cls) != -1" v-for="uitype in Brisa.ui_classes" class="m-2 mt-3" style="display: inline-block">
          <button @click="Brisa.OpenCtx(entry, uitype.cls)" class="btn btn-sm btn-outline-primary">Open {{uitype.name}}</button>
        </div>
      </div>

      <div v-for="(cls,idx) in classes()" v-if="cls">
        <div class="mt-4">
          <h4>{{cls.title()}}</h4>

          <div class="row m-2" v-for="field in cls.config().fields">
            <div class="col-12 col-md-3 col-lg-2 p-2">{{field.title}}</div>
            <div class="col-12 col-md-9 col-lg-10 p-2 rounded" style="background-color: #f4f4f4; xheight: 100%;">
              <brisa-inline-editor :name="field.title" :updated="UpdatedAttr" :update_ref="{cls: cls.unique_id(), field: field.id}"
                :val_type="field.field_type" :value="(entry.data.metadata[cls.unique_id()] || {})[field.id]" wrapper="div">
              </brisa-inline-editor>
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

      <div @click.stop v-if="show_expand" class="border border-secondary p-3 xborder-top-0 ml-2 mr-2 mb-0" style="border-radius: 10px 10px 0px 0px">
        <transition name="fade-fast">
          <div v-if="show_board == null">
            <div class="row " style="font-size: 115%">
              <div class="col-12 col-md-12">
                <h3 class="mb-3">How would you like to expand this card?</h3>
                <button @click.prevent="SelectBoard(cls.cls, cls.name)" style="min-width: 120px; xdisplay: block;" class="btn btn-outline-info btn-lg xw-100 p-2 mt-1 mr-2"
                    v-if="class_list().indexOf(cls.cls) == -1"
                    v-for="cls in Brisa.ui_classes">
                  <i style="font-size: 250%;" :class="'fas xfa-2x ' + cls.icon"></i><br/>{{cls.name}}
                </button>
                <button @click.prevent="AddModel(model.unique_id())" style="min-width: 120px;" class="btn btn-outline-primary btn-lg p-2 mt-1 mr-2"
                    v-if="class_list().indexOf(model.unique_id()) == -1" v-for="model in models">
                  <i style="font-size: 250%;" :class="'far xfa-2x fa-list-alt'"></i><br/>
                  {{model.title()}}
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <h3>Add {{show_board.label}}</h3>
            <div v-if="show_board.opts">
            <div>
              Tags:
              <input v-model="new_board_tags" class="form-control form-control-sm" placeholder="Tags (comma separated)">
              <small>You can use your own tag (or tags). Make sure it's unique. Or you can enter
                a label (eg Important) to mirror that label within the board.</small>
            </div>
            <div class="mt-3">Models:
              <br/><small>Any models you select will automatically be applied to cards created within this board.</small>
              <div v-for="model in models">
                <label>
                <input v-model="new_board_classes" :value="model.unique_id()" type="checkbox"> {{model.title()}}
                </label>
              </div>
            </div>
            </div>
            <div v-else>
              <button @click="show_board.opts = true" class="btn btn-sm btn-link">Advanced...</button>
            </div>
            <button @click="AddBoard" class="btn btn-lg btn-outline-primary">Create</button>
            <button @click="show_board = null" class="btn btn-lg btn-outline-secondary text-dark">Cancel</button>
          </div>
        </transition>
      </div>

    <div @click.stop class="card-footer clearfix mt-0">
      <div style="display: inline-block">

      <button @click="show_expand = !show_expand" class="btn btn-xs btn-link"><i class="fa fa-plus"></i> &nbsp;Expand Card</button>
      </div>
      <div style="display: inline-block;" class="float-right">
        <button @click="Brisa.OpenCtx(entry)" class="btn btn-link btn-xs"><i class="fa fa-external-link-alt"></i></button>
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
      'entry', 'zindex', 'api_ctx', 'hide_icons'
    ],
    data: function() {
      var m = Brisa.group_models[this.entry.group_id() || null];
      return {Brisa: Brisa, show_board: null,
        expand_assign: false, assign_list: [], ucache: {},
        assigned_str: '',
        entry_info: {stamp: null, creator: null},
        new_board_tags: '', new_board_classes: [],
        sel_tab: null, confirm_delete: false,
        models: m, show_expand: false,
        show_code: false,
        comments: null,
        add_comment: false,
        tags: null, tag_popup: false,
      };
    },
    methods: {
      ToggleWatch: function() {
        var idx = this.entry.data.watchers.indexOf(Brisa.user.uid);
        var watching = idx != -1;
        this.entry.watch(!watching).then(function(r) {
          if (watching)
            this.entry.data.watchers.splice(idx, 1);
          else
            this.entry.data.watchers.push(Brisa.user.uid);
        }.bind(this));
      },
      Assign: function(uid, val, idx) {
        this.entry.assign(uid, val, this.api_ctx).then(function(r) {
          if (val)
            this.entry.data.assignees.push(uid);
          else {
            var user_idx = this.entry.data.assignees.indexOf(uid);
            if (user_idx != -1) this.entry.data.assignees.splice(user_idx, 1);
          }
          console.log("Assign", this.entry.data.assignees, uid, val, idx);
        }.bind(this));
      },
      OpenComment: function() {
        this.add_comment = true;
        this.$nextTick(function() { this.$refs.new_comment.focus() }.bind(this));
      },
      AddComment: function() {
        BrisaAPI.Comment.create({ctx: this.api_ctx, entry_id: this.entry.data.id, comment: this.$refs.new_comment.value}).then(function(r) {
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
      AddTag: function(new_tag) {
        var p;
        if (new_tag) {
          p = this.entry.add_tags(new_tag);
        } else {
          p = this.entry.add_tags(this.$refs.new_tag.value);
          this.$refs.new_tag.value = '';
        }
        p.then(() => { this.UpdateTags() });
      },
      RemoveTag: function(tag) {
        this.entry.remove_tags(tag).then(() => { this.UpdateTags() });
      },
      AddModel: function(model) {
        this.entry.edit_class(model, {}).then(function(r) {
          this.show_expand = false;
        }.bind(this));
      },
      SelectBoard: function(btype, label) {
        this.new_board_tags = this.entry.data.id + '-' + label;
        this.new_board_classes = [];
        this.show_board = {type: btype, label: label, opts: false};
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
      UpdateTags: function() {
        Brisa.SortTags(this.entry).then((r) => { this.tags = r; });
      },
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
      this.entry_info.stamp = (new Date(this.entry.data.created_at)).toLocaleDateString();
      this.UpdateTags();
      if (this.entry.data.group_id) {
        for (var g of Brisa.groups) {
          if (g.data.id == this.entry.data.group_id) this.assign_list = g.data.access;
        }
      } else {
        this.assign_list = [{uid: Brisa.user.uid, user: Brisa.user.alias}];
      }
      for (var u of this.assign_list) {
        this.ucache[u.uid] = null;
        let uid = u.uid;
        Brisa.cache.get('User', uid, false).then(function(r) { this.ucache[uid] = r.data.alias; }.bind(this));
      }
      Brisa.cache.get('User', this.entry.data.creator_uid, false).then(function(r) {
        this.entry_info.creator = r.data.alias;
      }.bind(this));
    },
  });

</script>
