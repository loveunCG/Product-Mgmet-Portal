<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Add</strong> User
          </div>
          <b-form-group
            label="Enter your name"
            label-for="basicName"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
            id="basicName"
            type="text"
            placeholder="Enter your name"
            :state="!$v.addForm.usr_name.$invalid"
            aria-describedby="input1LiveFeedback"
            v-model="addForm.usr_name"
            ></b-form-input>
           <b-form-valid-feedback>
                Input is valid.
           </b-form-valid-feedback>
           <b-form-invalid-feedback>
                Please provide a required input.
           </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            label="Email Input"
            label-for="basicEmail"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
            id="basicEmail"
            type="email"
            :state="!$v.addForm.usr_email.$invalid"
            v-model="addForm.usr_email"
            aria-describedby="input1LiveFeedback"
            placeholder="Enter your email"></b-form-input>
          </b-form-group>
          <b-form-valid-feedback>
                Input is valid.
          </b-form-valid-feedback>
          <b-form-invalid-feedback>
                  Please provide a required input.
          </b-form-invalid-feedback>
          <b-form-group
            label="Password Input"
            label-for="basicPassword"
            :label-cols="3"
            :horizontal="true">
            <b-form-input
            id="basicPassword"
            type="password"
            placeholder="Enter your password"
            :state="!$v.addForm.password.$invalid"
            v-model="addForm.password"
            aria-describedby="input1LiveFeedback"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Roles"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicSelect"
              v-model="addForm.usr_role"
              :plain="true"
              :options="role_option"
              value="Please select">
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Activte"
            label-for="basicRadios"
            :label-cols="3"
            :horizontal="true">
            <b-form-radio-group
            v-model="addForm.usr_status"
            id="basicRadios"
              :plain="true"
              :options="[
                {text: 'On',value: '1'},
                {text: 'Off',value: '2'}
              ]"
              checked="2"
              stacked>
            </b-form-radio-group>
          </b-form-group>
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

export default {
  name: 'forms',
  data () {
    return {
      addForm: {
        usr_name: '',
        usr_email: '',
        usr_role: '',
        usr_status: '',
        usr_password: ''
      },
      role_option: [
        { value: 1, text: 'supper' },
        { value: 2, text: 'normal' },
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
    click () {
      // do nothing
    },
    onSubmit () {
      var ref = firebase.database().ref()
      var pushref = ref.child('users')
      if (!this.addForm.usr_email) {
      } else {
        pushref.push({
          usr_name: this.addForm.usr_name,
          usr_email: this.addForm.usr_email,
          usr_role: this.addForm.usr_role,
          usr_status: this.addForm.usr_status,
          usr_password: this.addForm.usr_password,
          created_at: moment().format('MMMM Do YYYY, h:mm:ss a')
        })
        this.infoModal = true
      }
    },
    gotoUsertable () {
      this.infoModal = false
      this.$router.push({ path: '/user' })
    },
    reset () {

    }
  }
}
</script>
