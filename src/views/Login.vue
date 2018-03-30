<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h1>FirseBase Admin</h1>
                <p class="text-muted">Sign In to your account</p>
                 <b-alert variant="warning"
                     dismissible
                     :max="10"
                     :value="0"
                     :show="this.$store.getters.loading"
                     @dismissed="showDismissibleAlert = false">
                  {{this.$store.getters.error?this.$store.getters.error.message:''}}
                </b-alert>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <input type="text" v-model="loginForm.email" class="form-control" placeholder="Username">
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                  <input type="password" v-model="loginForm.password" class="form-control" placeholder="Password">
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" v-on:click="onSubmit" class="px-4">Login</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showDismissibleAlert: this.$store.getters.loading,
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('signUserIn', this.loginForm)
    }
  }
}
</script>
