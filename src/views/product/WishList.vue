<template>
  <b-card>
    <div slot="header">
       Wish List
    </div>
    <b-button variant="primary" class="add_button float-right" v-on:click="onAddModal"><i class="fa fa-plus"></i></b-button>
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :busy.sync="isBusy"  responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">

      <template slot="action" slot-scope="data">
        <b-button variant="primary" v-on:click="onEditModel(data.item.action)"><i class="fa fa-edit"></i></b-button>
        <b-button variant="danger" v-on:click="onDeleteModal(data.item.action)"><i class="fa fa-trash"></i></b-button>
      </template>
    </b-table>
    <nav>
      <b-pagination :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
    </nav>
    <b-modal title="Wish List Edit" class="modal-info" v-model="iseditmodal" @ok="editSubmit" ok-variant="primary">
      <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-shopping-bag"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="editForm.wash_name" placeholder="Wash List Name"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group label="Category Descrition">
         <b-form-textarea  v-model="editForm.wash_description" id="textarea1"
                     placeholder="Enter Descrition"
                     :rows="3"
                     :max-rows="6">
         </b-form-textarea>
      </b-form-group>
    </b-modal>

    <b-modal title="Add Wash List" class="modal-info" v-model="isaddmodal" @ok="addSubmit" ok-variant="primary">
     <b-form-group>
          <b-input-group>
              <b-input-group-prepend>
                  <b-input-group-text>
                      <i class="fa fa-shopping-bag"></i>
                  </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input type="text" v-model="addForm.wash_name" placeholder="Wash List Name"></b-form-input>
          </b-input-group>
      </b-form-group>
      <b-form-group label="Category Descrition">
         <b-form-textarea id="textarea1"
                     v-model="addForm.wash_description"
                     placeholder="Enter something"
                     :rows="3"
                     :max-rows="6">
         </b-form-textarea>
      </b-form-group>
    </b-modal>

    <b-modal title="Info" class="modal-info" v-model="deleteModal" @ok="deleteSubmit">
      are you sure delete this Wish List?
    </b-modal>
  </b-card>
</template>
<script>
  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */

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
        deleteUid: '',
        editForm: {
          wash_name: '',
          wash_description: '',
          _uid: '',
          created_at: ''
        },
        addForm: {
          wash_name: '',
          wash_description: '',
          _uid: ' ',
          created_at: ' '
        },
        isaddmodal: false,
        active: [
          { value: 1, text: 'On' },
          { value: 2, text: 'Off' }
        ],
        iseditmodal: false,
        isBusy: false,
        fields: [
          {key: 'name'},
          {key: 'description'},
          {key: 'registered'},
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
          : status === '2' ? 'inactive'
            : status === 'active' ? 'primary'
              : status === 'inactive' ? 'danger' : 'inactive'
      },
      deleteSubmit () {
        var updates = {}
        updates['/wishlists/' + this.deleteUid] = null
        firebase.database().ref().update(updates)
        this.deleteModal = false
        this.myProvider()
      },
      onDeleteModal (uid) {
        this.deleteUid = uid
        this.deleteModal = true
      },
      editSubmit () {
        var updates = {}
        updates['/wishlists/' + this.editForm._uid] = this.editForm
        firebase.database().ref().update(updates)
        this.iseditmodal = false
        this.myProvider()
        this.$msg('Edit Wash List Successfuly!')
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
        var ref = firebase.database().ref()
        var pushref = ref.child('wishlists')
        this.addForm.created_at = moment().format('YYYY mm dd, h:mm:ss a')
        pushref.push(this.addForm)
        this.isaddmodal = true
        this.$msg('Add Wash List Successfuly!')
        for (const key in this.addForm) {
          this.addForm[key] = ''
        }
        this.myProvider()
      },
      onEditModel (uid) {
        firebase.database().ref('/wishlists/' + uid).once('value').then((snapshot) => {
          console.log(snapshot.val())
          this.editForm = snapshot.val()
          this.editForm._uid = uid
          this.iseditmodal = true
        })
      },
      myProvider () {
        firebase.database().ref('/wishlists/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var user = snapshot.val()[key]
            allusers.push({name: user.wash_name, registered: user.created_at, description: user.wash_description, action: (key)})
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

