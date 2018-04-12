<template>
  <b-card>
    <div slot="header">
       User Table
    </div>
    <router-link to="/user/addUser"><b-button variant="primary" class="add_button float-right" v-on:click="this.$router.push('/user/addUser')">Add</b-button></router-link>
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :busy.sync="isBusy"  responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
      <template slot="role" slot-scope="data">
        <b-badge>{{getRole(data.item.role)}}</b-badge>
      </template>
      <template slot="status" slot-scope="data">
        <b-badge variant="success">{{data.item.status}}</b-badge>
      </template>
      <template slot="action" slot-scope="data">
        <b-button variant="success" v-on:click="onEditModel(data.item.action)"><i class="fa fa-edit"></i></b-button>
        <b-button variant="danger" v-on:click="onresetPasswd(data.item.action)"><i class="fa fa-key"></i></b-button>
        <b-button variant="danger" v-on:click="onDeleteModal(data.item.action)"><i class="fa fa-trash"></i></b-button>
      </template>
    </b-table>
    <nav>
      <b-pagination :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
    </nav>
    <b-modal title="User Edit" class="modal-info" v-model="iseditmodal" @ok="editSubmit" ok-variant="primary">
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text><i class="fa fa-user"></i></b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="editForm.usr_name" placeholder="Username"></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-group>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text><i class="fa fa-envelope"></i></b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="email" v-model="editForm.usr_email" placeholder="Email"></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-form-group label="User status">
            <b-form-radio-group id="radios2" v-model="editForm.usr_status" name="radioSubComponent">
              <b-form-radio value="0">On</b-form-radio>
              <b-form-radio value="1">Off</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group label="User Role">
            <b-form-select v-model="editForm.usr_role" :options="role_option" class="mb-3" />
          </b-form-group>
    </b-modal>
    <b-modal title="INFO" class="modal-info" v-model="deleteModal" @ok="deleteSubmit" ok-variant="info">
      Are you sure delete this user?
    </b-modal>
    <b-modal title="INFO" class="modal-info" v-model="resetPasswdModel" @ok="resetPasswdSubmit" ok-variant="info">
      <b-form-group>
        <b-input-group>
          <b-input-group-prepend>
            <b-input-group-text><i class="fa fa-key"></i></b-input-group-text>
          </b-input-group-prepend>
          <b-form-input type="password" v-model="resetPasswd.password" placeholder="password"></b-form-input>
        </b-input-group>
      </b-form-group>
      <b-form-group>
        <b-input-group>
          <b-input-group-prepend>
            <b-input-group-text><i class="fa fa-key"></i></b-input-group-text>
          </b-input-group-prepend>
          <b-form-input type="password" v-model="resetPasswd.rpassword" placeholder="confirm"></b-form-input>
        </b-input-group>
      </b-form-group>
    </b-modal>
  </b-card>
</template>
<script>
  import * as firebase from 'firebase'
  var md5 = require('js-md5')
  export default {
    name: 'c-table',
    props: {
      caption: {
        type: String,
        default: 'Table'
      },
      hover: {
        type: Boolean,
        default: false
      },
      striped: {
        type: Boolean,
        default: false
      },
      bordered: {
        type: Boolean,
        default: true
      },
      small: {
        type: Boolean,
        default: true
      },
      fixed: {
        type: Boolean,
        default: false
      }
    },
    data: () => {
      return {
        items: [],
        deleteModal: false,
        deleteUserId: '',
        editForm: {
          usr_name: '',
          usr_email: '',
          usr_role: '',
          usr_status: '',
          _uid: '',
          created_at: '',
          usr_password: ''
        },
        resetPasswd: {
          password: '',
          rpassword: ''
        },
        resetPasswdModel: false,
        role_option: [
          { value: 1, text: 'supper' },
          { value: 2, text: 'normal' },
          { value: 3, text: 'Low' }
        ],
        iseditmodal: false,
        isBusy: false,
        fields: [
          {key: 'username'},
          {key: 'email'},
          {key: 'registered'},
          {key: 'role'},
          {key: 'status'},
          {key: 'action'}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: 0
      }
    },
    methods: {
      getBadge (status) {
        return status === '0' ? 'active' : 'inactive'
      },
      getRole (status) {
        if (status === 1) {
          return 'Supper'
        } else if (status === 2) {
          return 'Normal'
        } else {
          return 'Low'
        }
      },
      resetPasswdSubmit () {
        if (this.resetPasswd.password === this.resetPasswd.rpassword && this.resetPasswd.password !== '') {
          this.editForm.usr_password = md5(this.resetPasswd.password)
          var updates = {}
          updates['/users/' + this.editForm._uid] = this.editForm
          firebase.database().ref().update(updates)
          this.$msg('Reset Password Successfuly!')
        } else {
          this.$msg('Please Insert Correct Password!')
        }
      },
      onresetPasswd (_uid) {
        firebase.database().ref('/users/' + _uid).once('value').then((snapshot) => {
          this.editForm = snapshot.val()
          this.editForm._uid = _uid
          this.resetPasswdModel = true
        })
      },
      deleteSubmit () {
        var updates = {}
        updates['/users/' + this.deleteUserId] = null
        firebase.database().ref().update(updates)
        this.deleteModal = false
        this.myProvider()
      },
      onDeleteModal (uid) {
        this.deleteUserId = uid
        this.deleteModal = true
      },
      editSubmit () {
        var updates = {}
        updates['/users/' + this.editForm._uid] = this.editForm
        firebase.database().ref().update(updates)
        this.iseditmodal = false
        this.myProvider()
      },
      onEditModel (uid) {
        firebase.database().ref('/users/' + uid).once('value').then((snapshot) => {
          console.log(snapshot.val())
          this.editForm.usr_name = snapshot.val().usr_name
          this.editForm.usr_email = snapshot.val().usr_email
          this.editForm.usr_role = snapshot.val().usr_role
          this.editForm.usr_status = snapshot.val().usr_status
          this.editForm.usr_password = snapshot.val().usr_password
          this.editForm.created_at = snapshot.val().created_at
          this.editForm._uid = uid
          this.iseditmodal = true
        })
      },
      myProvider () {
        firebase.database().ref('/users/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var user = snapshot.val()[key]
            allusers.push({username: user.usr_name, registered: user.created_at, role: user.usr_role, status: this.getBadge(user.usr_status), email: user.usr_email, action: (key)})
          }
          this.items = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getRowCount (items) {
        return items.length
      }
    },
    mounted () {
      this.myProvider()
    }
  }
</script>

<style>
.add_button {
		margin-bottom: 15px;
}

</style>

