<template>
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.5);">
      <div class="m-5 p-5">
        <div class="card p-4" style="xmin-width: 300px; max-width: 500px;">
          
          <div v-if="Brisa.user.logged_in == false">
            <h2><img src="favicon.ico" class="float-left mr-3" style="display: inline-block; width: auto; height: 25px;">Log In</h2>
            <br/>
            <h4>E-Mail Address:</h4>
            <input ref="email" @keypress.enter="$refs.password.focus()" type="text" name="email" class="form-control bg-light" v-model="email">
            <h4>Password:</h4>
            <input @keypress.enter="DoLogin" type="password" name="password" ref="password" class="form-control bg-light" v-model="password">
            <button @click="DoLogin" class="btn btn-lg btn-primary">Log In</button>
            <div v-if="message" class="p-3 text-danger">{{message}}</div>
          </div>
          <div v-else>
            <h2><img src="favicon.ico" class="float-left mr-3" style="display: inline-block; width: auto; height: 25px;">One Moment...</h2>
            <br/>
            <p></p>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    data: function() {
      return { Brisa: Brisa, email: '', password: '', message: ''}
    },
    methods: {
      DoLogin: function() {
        BrisaAPI.User.login(this.email, this.password).then((r) => {
          Brisa.Login(r.data);
        }).catch((e) => {
          this.message = e.responseJSON.error ? e.responseJSON.error : 'Login failure';
        });
      }
    },
    mounted: function() {
      //this.$refs.email.focus();
    }
  }  
</script>
