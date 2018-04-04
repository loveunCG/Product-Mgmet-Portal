<template>
  <b-card>
    <div slot="header">
       User Table
    </div>
    <router-link to="/user/addUser"><b-button variant="primary" class="add_button float-right" v-on:click="this.$router.push('/user/addUser')">Add</b-button></router-link>


    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :busy.sync="isBusy"  responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
      <template slot="status" slot-scope="data">
        <b-badge :variant="getBadge(data.item.status)">{{data.item.status}}</b-badge>
      </template>
      <template slot="action" slot-scope="data">
        <b-button variant="success" v-on:click="onEditModel(data.item.action)"><i class="fa fa-map-marker"></i>&nbsp;Edit</b-button>
        <b-button variant="danger" v-on:click="onDeleteModal(data.item.action)"><i class="fa fa-map-marker"></i>&nbsp;Delete</b-button>
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
          <b-form-select v-model="editForm.usr_role" :options="role_option" class="mb-3" />
    </b-modal>
    <b-modal title="Modal title" class="modal-warning" v-model="deleteModal" @ok="deleteSubmit" ok-variant="warning">
      are you sure delete this user data?
    </b-modal>
  </b-card>
</template>
<script>
  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */

  import * as firebase from 'firebase'

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
        default: false
      },
      small: {
        type: Boolean,
        default: false
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
          usr_uid: '',
          created_at: '',
          usr_password: ''
        },
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
        return status === '1' ? 'active'
          : status === '0' ? 'inactive'
            : status === 'Pending' ? 'warning'
              : status === 'Banned' ? 'danger' : 'primary'
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
        updates['/users/' + this.editForm.usr_uid] = this.editForm
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
          this.editForm.usr_uid = uid
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

