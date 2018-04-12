<template>
  <b-card>
    <div slot="header">
       Company Table
    </div>
    <b-button variant="primary" class="add_button float-right" v-on:click="onAddModal"><i class="fa fa-plus"></i></b-button>
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :busy.sync="isBusy"  responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
      <template slot="status" slot-scope="data">
        <b-badge :variant="getBadge(data.item.status)">{{data.item.status}}</b-badge>
      </template>
      <template slot="action" slot-scope="data">
        <b-button variant="success" v-on:click="onEditModel(data.item.action)"><i class="fa fa-edit"></i></b-button>
        <b-button variant="danger" v-on:click="onDeleteModal(data.item.action)"><i class="fa fa-trash"></i></b-button>
      </template>
    </b-table>
    <nav>
      <b-pagination :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
    </nav>
    <b-modal title="Company Edit" class="modal-info" v-model="iseditmodal" @ok="editSubmit" ok-variant="primary">
      <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-bank"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="editForm.company_name" placeholder="Company Name"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-phone"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="editForm.company_phone" placeholder="Phone"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-location-arrow"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="editForm.company_address" placeholder="Address"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group label="IsActive">
          <b-form-radio-group id="radios2" v-model="editForm.is_active" name="radioSubComponent">
              <b-form-radio value="0">On</b-form-radio>
              <b-form-radio value="1">Off</b-form-radio>
          </b-form-radio-group>
      </b-form-group>
    </b-modal>

    <b-modal title="Add Company" class="modal-info" v-model="isaddmodal" @ok="addSubmit" ok-variant="primary">
      <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-bank"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="addForm.company_name" placeholder="Company Name"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-phone"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="addForm.company_phone" placeholder="Phone"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-location-arrow"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="addForm.company_address" placeholder="Address"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group label="IsActive">
          <b-form-radio-group id="radios2" v-model="addForm.is_active" name="radioSubComponent">
              <b-form-radio value="0">On</b-form-radio>
              <b-form-radio value="1">Off</b-form-radio>
          </b-form-radio-group>
      </b-form-group>
    </b-modal>

    <b-modal title="Info" class="modal-info" v-model="deleteModal" @ok="deleteSubmit">
      are you sure delete this Company?
    </b-modal>
  </b-card>
</template>
<script>
  import * as firebase from 'firebase'
  import moment from 'moment'
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
        deleteComapanyId: '',
        editForm: {
          company_name: '',
          company_phone: '',
          company_address: '',
          is_active: '',
          _uid: '',
          created_at: ''
        },
        addForm: {
          company_name: '',
          company_phone: '',
          company_address: '',
          is_active: ' ',
          _uid: ' ',
          created_at: ' '
        },
        isaddmodal: false,
        active: [
          { value: 2, text: 'On' },
          { value: 1, text: 'Off' }
        ],
        iseditmodal: false,
        isBusy: false,
        fields: [
          {key: 'name'},
          {key: 'phone'},
          {key: 'registered'},
          {key: 'address'},
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
        return status === '1' ? 'active' : 'inactive'
      },
      deleteSubmit () {
        var updates = {}
        updates['/companys/' + this.deleteComapanyId] = null
        firebase.database().ref().update(updates)
        this.deleteModal = false
        this.myProvider()
      },
      onDeleteModal (uid) {
        this.deleteComapanyId = uid
        this.deleteModal = true
      },
      editSubmit () {
        var updates = {}
        updates['/companys/' + this.editForm.company_uid] = this.editForm
        firebase.database().ref().update(updates)
        this.iseditmodal = false
        this.myProvider()
        this.$msg('Edit Comapny Successfuly!')
      },
      addSubmit () {
        let isValidation = true
        for (const key in this.addForm) {
          if (this.addForm.hasOwnProperty(key)) {
            if (this.addForm[key] === '' && key !== 'created_at' && key !== '_uid') {
              isValidation = false
            }
          }
        }
        if (!isValidation) {
          this.$msg('Please insert full data!')
          return
        }
        var addData = {}
        var ref = firebase.database().ref()
        var pushref = ref.child('companys')
        this.addForm.created_at = moment().format('YYYY mm dd, h:mm:ss a')
        addData = this.addForm
        pushref.push(addData)
        this.isaddmodal = true
        this.$msg('Add Comapny Successfuly!')
        for (const key in this.addForm) {
          this.addForm[key] = ''
        }
        this.myProvider()
      },
      onEditModel (uid) {
        firebase.database().ref('/companys/' + uid).once('value').then((snapshot) => {
          console.log(snapshot.val())
          this.editForm.company_name = snapshot.val().company_name
          this.editForm.company_phone = snapshot.val().company_phone
          this.editForm.company_address = snapshot.val().company_address
          this.editForm.is_active = snapshot.val().is_active
          this.editForm.created_at = snapshot.val().created_at
          this.editForm.company_uid = uid
          this.iseditmodal = true
        })
      },
      myProvider () {
        firebase.database().ref('/companys/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var user = snapshot.val()[key]
            allusers.push({name: user.company_name, registered: user.created_at, phone: user.company_phone, status: this.getBadge(user.is_active), address: user.company_address, action: (key)})
          }
          this.items = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getRowCount (items) {
        return items.length
      },
      onAddModal () {
        this.isaddmodal = true
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

