<template>
  <b-card>
    <div slot="header">
       Company Table
    </div>
    <b-button variant="primary" class="add_button float-right" v-on:click="onAddModal"><i class="fa fa-plus"></i>&nbsp;Add</b-button>
    <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :busy.sync="isBusy" :fixed="fixed" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
      <template slot="status" slot-scope="data">
        <b-badge :variant="getBadge(data.item.status)">{{data.item.status}}</b-badge>
      </template>
      <template slot="action" slot-scope="data">
        <b-button variant="success" v-on:click="onEditModel(data.item.action)"><i class="fa fa-edit"></i>&nbsp;Edit</b-button>
        <b-button variant="danger" v-on:click="onDeleteOPenModal(data.item.action)"><i class="fa fa-trash"></i>&nbsp;Delete</b-button>
      </template>
      <template slot="product_price" slot-scope="data">
        <b-button variant="success" class="md-12" v-on:click="onViewModel(data.item.action)"><i class="fa fa-eye"></i>&nbsp;view</b-button>
      </template>
    </b-table>
    <nav>
      <b-pagination :total-rows="getRowCount(items)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
    </nav>

    <b-modal title="Product Edit" class="modal-info" size="lg" v-model="iseditmodal" @ok="editSubmit" ok-variant="primary">
          <div slot="header">
            <strong>Product </strong> <small></small>
          </div>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="company">Product Name</label>
                <b-form-input
                type="text"
                v-model="editForm.product_name"
                id="company"
                placeholder="Enter your Product name"
                />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="company">Barcode</label>
                <b-form-input
                type="text"
                v-model="editForm.barcode"
                id="company"
                placeholder="Enter your Product name"
                />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="vat">Product size</label>
                <b-form-input
                type="number" id="vat"
                v-model="editForm.product_size"
                placeholder="0">
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="unit">Product unit</label>
                <b-form-input type="text"
                id="unit"
                v-model="editForm.product_unit"
                placeholder="Enter your unit"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="postal-code">items per box</label>
                <b-form-input
                type="text"
                id="postal-code"
                placeholder="Please insert items per box"
                v-model="editForm.items_of_box"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <label for="product_category">product category</label>
              <b-form-select
              id="product_category"
              v-model="editForm.product_category"
              :options="category"
              size="md" />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
               <label for="product_category">company</label>
              <b-form-select id="product_category" v-model="editForm.company" :options="company" size="md" />
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group
                label="photo"
                label-for="fileInputMulti">
                   <b-form-file v-model="editForm.photo" placeholder="Choose a file..."></b-form-file>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <b-form-group>
                <b-button variant="primary" v-on:click="addPriceModel" class="pull-right">Add Price</b-button>
              </b-form-group>
            </b-col>
            <b-col sm="8">
              <b-list-group >
                <b-list-group-item
                v-for="(rprice, index) in price_data"
                >
                  Price value: {{rprice.price}}&nbsp;&nbsp;
                  City: {{rprice.city.city_name}}&nbsp;&nbsp;
                  Store: {{rprice.store.store_name}}&nbsp;&nbsp;
                 <b-button
                 variant="danger"
                 v-on:click="onDeleteModal(index)"
                 class="pull-right"><i class="fa fa-trash"></i></b-button>
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
    </b-modal>
    <b-modal title="Price Info" v-model="isviewModal" @ok="isviewModal = false">
      <b-list-group>
          <b-list-group-item v-for="(rprice, index) in view_price_data">
              Price value: {{rprice.price}}&nbsp;&nbsp;
              City: {{rprice.city.city_name}}&nbsp;&nbsp;
              Store: {{rprice.store.store_name}}&nbsp;&nbsp;
          </b-list-group-item>
      </b-list-group>
    </b-modal>
    <b-modal title="Add Price" class="modal-success" v-model="isAddPriceModal" @ok="addPriceSubmit" ok-variant="success">
           <b-row>
            <b-col sm="4">
              <b-form-group>
                <label for="name">Price</label>
                <b-form-input type="text"
                id="name"
                v-model="price.price"
                placeholder="Enter Price"/>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group >
                <label for="month1">City</label>
                <b-form-select id="month1"
                  :plain="true"
                  v-model="price.city"
                  :options="city">
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group>
                <label for="year1">Store</label>
                <b-form-select id="year1"
                  :plain="true"
                  v-model="price.store"
                  :options="store">
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
      </b-modal>

    <b-modal title="Info" class="modal-info" v-model="isdeleteModal" @ok="deleteSubmit">
      are you sure delete this Product?
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
        isviewModal: false,
        deleteComapanyId: '',
        view_price_data: [],
        editForm: {
          product_name: '',
          product_size: '',
          barcode: '',
          photo: [],
          product_unit: '',
          product_category: {},
          product_price: [],
          items_of_box: '',
          is_active: '',
          _uid: '',
          company: {}
        },
        addForm: {
          product_name: '',
          product_size: '',
          photo: [],
          product_unit: '',
          product_category: {},
          product_price: [],
          items_of_box: '',
          is_active: '',
          _uid: '',
          company: {}
        },
        isdeleteModal: false,
        isSubmit: false,
        city: [],
        price_data: [],
        price: {
          price: '',
          store: {},
          city: {}
        },
        store: [],
        company: [],
        delete_uid: '',
        isAddPriceModal: false,
        category: [],
        isaddmodal: false,
        iseditmodal: false,
        isBusy: false,
        fields: [
          {key: 'product_name', text: 'Product Name'},
          {key: 'barcode'},
          {key: 'product_size', text: 'Product Size'},
          {key: 'items_of_box', text: 'Item Number'},
          {key: 'created_at', text: 'Created Time'},
          {key: 'product_category', text: 'Created Time'},
          {key: 'product_unit', text: 'Product Unit'},
          {key: 'company', text: 'Producted Company'},
          {key: 'product_price'},
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
        updates['/products/' + this.delete_uid] = null
        firebase.database().ref().update(updates)
        this.isdeleteModal = false
        this.myProvider()
      },
      editSubmit () {
        var updates = {}
        this.editForm.product_price = this.price_data
        updates['/products/' + this.editForm._uid] = this.editForm
        firebase.database().ref().update(updates)
        this.iseditmodal = false
        this.myProvider()
        this.$msg('Edit Comapny Successfuly!')
      },
      addSubmit () {
        var ref = firebase.database().ref()
        var pushref = ref.child('companys')
        this.addForm.created_at = moment().format('YYYY mm dd, h:mm:ss a')
        pushref.push(this.addForm)
        this.isaddmodal = true
        this.$msg('Add Comapny Successfuly!')
        for (const key in this.addForm) {
          this.addForm[key] = ''
        }
        this.myProvider()
      },
      onEditModel (uid) {
        this.getcity()
        this.getcompany()
        this.getcategory()
        this.getstore()
        firebase.database().ref('/products/' + uid).once('value').then((snapshot) => {
          this.editForm = snapshot.val()
          this.editForm._uid = uid
          this.price_data = snapshot.val().product_price
          this.iseditmodal = true
        })
      },
      onViewModel (uid) {
        firebase.database().ref('/products/' + uid).once('value').then((snapshot) => {
          this.view_price_data = snapshot.val().product_price
          this.isviewModal = true
        })
      },
      onSubmit () {
        var ref = firebase.database().ref()
        var pushref = ref.child('products')
        this.addForm.created_at = moment().format('YYYY mm dd, h:mm:ss a')
        this.addForm.product_price = this.price_data
        pushref.push(this.addForm)
        this.isaddmodal = true
        this.$msg('Add city Successfuly!')
        for (const key in this.addForm) {
          this.addForm[key] = ''
        }
        this.price_data = []
      },
      reset () {

      },
      isSubmit () {
        for (const key in this.addForm) {
          if (this.addForm[key] === '') {
            return true
          } else {
            return true
          }
        }
        return true
      },
      onDeleteModal (index) {
        this.price_data.splice(index, 1)
      },
      getcompany () {
        firebase.database().ref('/companys/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.company_name })
          }
          this.company = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getcity () {
        firebase.database().ref('/citys/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.city_name })
          }
          this.city = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      getstore () {
        firebase.database().ref('/stores/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.store_name })
          }
          this.store = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      addPriceModel () {
        this.isAddPriceModal = true
      },
      onDeleteOPenModal (uid) {
        this.delete_uid = uid
        this.isdeleteModal = true
      },
      getcategory () {
        firebase.database().ref('/categorys/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var value = snapshot.val()[key]
            value._uid = key
            allusers.push({ value, text: value.category_name })
          }
          this.category = allusers
        }).catch(err => {
          console.log(err)
          return []
        })
      },
      addPriceSubmit () {
        if (this.price.price) {
          this.price_data.push(this.price)
        } else {
          this.$msg('Add Price Failed! Please Input full data')
        }
        this.iseditmodal = true
        this.price = {}
      },
      myProvider () {
        firebase.database().ref('/products/').once('value').then((snapshot) => {
          var allusers = []
          for (const key in snapshot.val()) {
            var user = snapshot.val()[key]
            user._uid = key
            user.action = key
            user.product_category = user.product_category.category_name
            user.company = user.company.company_name
            user.action = key
            allusers.push(user)
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
        this.$router.push('/product/add')
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

