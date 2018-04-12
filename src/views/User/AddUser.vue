<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Add</strong> User
          </div>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="company">User Name</label>
                <b-form-input
                type="text"
                v-model="addForm.usr_name"
                :state="!$v.addForm.usr_name.$invalid"
                placeholder="Enter your User Name"
                />
                <b-form-valid-feedback>
                      Input is valid.
                </b-form-valid-feedback>
                <b-form-invalid-feedback>
                      Please provide a required input.
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="company">Email</label>
                <b-form-input
                type="text"
                :state="!$v.addForm.usr_email.$invalid"
                v-model="addForm.usr_email"
                placeholder="Enter your Email"
                />
                <b-form-valid-feedback>
                      Input is valid.
                </b-form-valid-feedback>
                <b-form-invalid-feedback>
                        Please provide a required input.
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <label for="product_category">User Role</label>
              <b-form-select
              id="product_category"
              v-model="addForm.usr_role"
              :options="role_option"
              size="md" />
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="vat">Password</label>
                <b-form-input
                type="password"
                  v-model="addForm.usr_password"
                placeholder="Please Insert Password">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="vat">Confirm Password</label>
                <b-form-input
                type="password"
                v-model="addForm.rpassword"
                placeholder="Please Insert Password">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <label for="product_category">Activte</label>
              <b-form-select
              id="product_category"
              v-model="addForm.usr_status"
              :options="[
                    {text: 'On',value: '1'},
                    {text: 'Off',value: '0'}
                  ]"
              size="md" />
            </b-col>
          </b-row>
          <div class="form-group form-actions pull-right">
            <b-button type="submit" size="md" v-on:click="onSubmit" :disabled="$v.addForm.usr_name.$invalid" variant="primary"><i class="fa fa-dot-circle-o"></i> Submit</b-button>
            <b-button type="reset" size="md" v-on:click="reset" variant="danger"><i class="fa fa-ban"></i> Reset</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-modal title="Submit Successfuly" class="modal-info" v-model="infoModal"  @ok="gotoUsertable" ok-variant="info">
      Successfully Submit.
    </b-modal>
  </div>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'
import * as firebase from 'firebase'
import moment from 'moment'
var md5 = require('js-md5')
export default {
  name: 'forms',
  data () {
    return {
      addForm: {
        usr_name: '',
        usr_email: '',
        usr_role: '',
        usr_status: '',
        usr_password: '',
        rpassword: '',
        created_at: ''
      },
      role_option: [
        { value: 1, text: 'Supper' },
        { value: 2, text: 'Normal' },
        { value: 3, text: 'Low' }
      ],
      infoModal: false,
      selected: [] // Must be an array reference!
    }
  },
  validations: {
    addForm: {
      usr_name: {
        required,
        minLength: minLength(5)
      },
      usr_email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(5)
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.addForm.usr_password !== this.addForm.rpassword) {
        this.$msg('No Match Password!')
        return
      }
      if (!this.addForm.usr_email) {
        this.$msg('Please Insert Correct Email Address!')
      } else {
        firebase.database().ref('/users/' + md5(this.addForm.usr_email)).once('value').then((snapshot) => {
          if (!snapshot.val()) {
            this.addForm.created_at = moment().format('MMMM Do YYYY, h:mm:ss a')
            this.addForm.usr_password = md5(this.addForm.usr_password)
            firebase.database().ref('users/' + md5(this.addForm.usr_email)).set(this.addForm)
            this.$msg('Successfully Submit!')
            this.infoModal = true
          } else {
            this.$msg('Email Dupulication!')
          }
        })
      }
    },
    gotoUsertable () {
      this.infoModal = false
      this.$router.push({ path: '/user' })
    },
    reset () {
      for (const key in this.addForm) {
        this.addForm[key] = ''
      }
    }
  }
}
</script>
