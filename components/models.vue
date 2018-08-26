<template>
  <div>
    <h4 class="card-title">Models</h4>
  
    <div style="padding: 5px">
    <button @click="selectModel(idx)" class="btn btn-sm btn-info" v-for="(model, idx) in models" style="margin-right: 10px;">
      {{model.title()}}
    </button>
    </div>
    
    <br/>
    <div :key="sel_model.unique_id()" class="card" v-if="sel_model">
      <div class="card-body">
        <h3 class="card-title">{{sel_model.title()}} <span style="font-size: 40%; font-family: monospace">{{sel_model.unique_id()}}</span></h3>
        
        <h4>Fields</h4>
        <div class="container-fluid">

          <table class="table table-hover">
          <tbody>
          <!-- <draggable v-model="sel_model.config().fields" :options="{xhandle: '.drag-handle'}" @update="UpdateFields()"> -->
          <tr :key="field.unique_id" v-for="(field,idx) in sel_model.config().fields">
            <td><span style="font-weight: bold">
                <brisa-inline-editor name="Title" :updated="UpdatedAttr" :update_ref="[idx, 'title']" val_type="string" :value="field.title"></brisa-inline-editor>
              </span>
            </td>
            <td>
              <brisa-inline-editor name="Field Type" :updated="UpdatedAttr" :update_ref="[idx, 'field_type']" 
                :enum_list="Brisa.field_type_arr" val_type="enum"
                :disp_value.sync="Brisa.field_types[field.field_type]" :keyed_value="field.field_type"></brisa-inline-editor>
            </td>
            <td style="font-family: monospace">{{field.id}}</td>
          </tr>
          <!-- </draggable> -->
          </tbody>
          </table>
        </div>
        
        <h4>Add Field</h4>
        <input v-model="new_field_title" class="form-control form-control-sm" placeholder="Field Title">
        <select v-model="new_field_type" class="form-control form-control-sm">
          <option :value="null">Select field type</option>
          <option v-for="(ft, key) in Brisa.field_types" :value="key">{{ft}}</option>
        </select>
        <button @click="AddField()" class="btn btn-sm btn-primary">Add Field</button>
      </div>
    </div>
    
    <br/>
    <h3>New Model</h3>
    <input v-model="new_model_title" class="form-control form-control-sm" placeholder="Model Title">
    <button @click="AddModel()" class="btn btn-sm btn-info">Add</button>
  </div>

</template>
<script>
  import Vue from 'vue'
  export default Vue.extend({
    props: [
      'model',
    ],
    data: function() {
      return {
        models: Brisa.models,
        sel_model: null,
        new_model_title: '',
        new_field_title: '', new_field_type: null,
        Brisa: Brisa,
      };
    },
    methods: {
      selectModel: function(idx) {
        var m = this.models[idx];
        this.sel_model = this.sel_model == m ? null : m;
      },
      AddModel: function() {
        BrisaAPI.Model.create({unique_id: Brisa.unique_id(8, this.new_model_title), title: this.new_model_title, config: {fields:[]}}).then(function(r) {
          this.models.push(r);
          this.new_model_title = '';
        }.bind(this));
      },
      AddField: function() {
        var f = {id: Brisa.unique_id(8, this.new_field_title), title: this.new_field_title,
            field_type: this.new_field_type, opts: {} };
        this.sel_model.config().fields.push(f);
        this.sel_model.update();
      },
      UpdatedAttr: function(new_val, ref) {
        this.sel_model.config().fields[ref[0]][ref[1]] = new_val;
        this.sel_model.update();
      },
      UpdateFields: function() {
        
      },
    },
  });

</script>
