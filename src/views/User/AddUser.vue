<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col offset-md="2" md="8">
        <b-card>
          <div slot="header">
            <strong>Add</strong> User
          </div>
          <b-row>
            <b-col sm="6">
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
            <b-col sm="6">
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
            <b-col sm="8">
              <b-form-group
                label="User Role"
                label-for="basicInlineCheckboxes"
                :label-cols="3"
                :horizontal="true">
                <b-form-checkbox-group id="basicInlineCheckboxes"
                v-model="addForm.usr_role"
                :plain="true"
                 v-on:change="onChangeSelect"
                :checked="addForm.usr_role">
                  <b-form-checkbox :plain="true" value="adduser">Add User</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="edituser">Edit User</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="deleteuser">Remove User</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="changeuser">Reset Password</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="usertable">User Table</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="product_table">Product Table</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="add_product">Add Product</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="city">City</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="company">Company</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="package">Package</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="category">Category</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="unit">Unit</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="store">Store</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="compare">Compare</b-form-checkbox>
                  <b-form-checkbox :plain="true" value="wishlist">Wish List</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
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
    onChangeSelect () {
      console.log(this.addForm.usr_role)
    },
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
